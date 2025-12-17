<script lang="ts">
    import { Indicator, Listgroup, ListgroupItem } from "flowbite-svelte";
    import { realtime, tablesDB } from "./AW.svelte";
    import { ID, Query } from "appwrite";

    let activeUsers = $state([]);
    let noUsersActive = $state(true);
    type TrainingColor = "green" | "cyan" | "yellow" | "red" | "orange";
    const trainingColors: { name: string; color: TrainingColor }[] = [
        { name: "Liability Form", color: "green" },
        { name: "General", color: "cyan" },
        { name: "Laser Cutter", color: "yellow" },
        { name: "Woodshop", color: "red" },
        { name: "CNC", color: "orange" },
    ];

    async function logOut(rowID) {
        try {
            // USER UPDATE change user's active status to false
            await tablesDB.updateRow({
                databaseId: "makerspace_database",
                tableId: "user_info",
                rowId: rowID,
                data: { IsActive: false },
            });

            // USER GET get user info db object
            const userResponseDB = await tablesDB.getRow({
                databaseId: "makerspace_database",
                tableId: "user_info",
                rowId: rowID,
            });

            // get user's info to archive in makerspace db
            let currentEmail = userResponseDB.Email;
            let currentId = userResponseDB.$id;
            let currentName = userResponseDB.Name;
            let currentStation = userResponseDB.CurrentStation;
            let currentProfessor = userResponseDB.teacher;
            let currentIsForClass = userResponseDB.Class;

            // times
            let currentLogInTime = userResponseDB.InitialTimeStamp;
            let currentLogOutTime = Date.now();
            let currentFinalTime = (Date.now() - currentLogInTime) / 1000; // seconds



            // MAKERSPACE CREATE update makerspace data
            const result = await tablesDB.createRow({
                databaseId: "makerspace_database",
                tableId: "makerspace_info",
                rowId: ID.unique(),
                data: {
                    Email: currentEmail,
                    IDorPhoneNumber: currentId,
                    Name: currentName,
                    LogInTime: currentLogInTime,
                    LogOutTime: currentLogOutTime,
                    TotalTime: currentFinalTime,
                    StationVisited: currentStation,
                    Professor: currentProfessor,
                    ForClass: currentIsForClass
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
            getActiveUsers();
        }
    }

    async function getActiveUsers() {
        const activeUsersResult = await tablesDB.listRows({
            databaseId: "makerspace_database",
            tableId: "user_info",
            queries: [Query.equal("IsActive", [true])],
        });

        if (activeUsersResult.rows.length === 0) {
            noUsersActive = true;
            return;
        } else {
            noUsersActive = false;
        }

        // store the name, id, and trainings from the result and store it in an array as an object
        activeUsers = activeUsersResult.rows.map((row) => ({
            name: row.Name,
            rowId: row.$id,
            trainings: row.Trainings.slice(),
        }));
    }

    getActiveUsers();

    // update if database changes
    realtime.subscribe('account', getActiveUsers)
</script>

<main>
    <div
        class="flex flex-row gap-9 border-2 rounded-md border-white border-solid p-8 w-fit justify-center"
    >
        <div class="flex flex-col gap-2">
            <h2 class="text-2xl font-medium">Active Users</h2>
            <p>Tap your name to log out</p>
            <hr />
            <h3 class="text-lg">Indicator legend:</h3>
            <ul class="flex flex-col gap-2">
                {#each trainingColors as trainingColor}
                    <li class="flex items-center">
                        <Indicator
                            size="sm"
                            color={trainingColor.color}
                            class="me-1.5"
                        ></Indicator>{trainingColor.name}
                    </li>
                {/each}
            </ul>
        </div>
        <Listgroup
            active
            class="flex justify-center items-center w-fit h-fit p-2"
        >
            {#if noUsersActive}
                <span class="font-bold p-2">No users active</span>
            {:else}
                {#each activeUsers as user}
                    <ListgroupItem
                        class="h-10 flex justify-evenly focus:outline-0"
                        onclick={() => {
                            logOut(user.rowId);
                        }}
                        ><span class="flex justify-start items-center gap-2">
                            <div class="flex flex-row items-center justify-center gap-2">
                                {#each trainingColors as trainingColor, i}
                                    {#if user.trainings[i] === true}
                                        <Indicator
                                            size="sm"
                                            color={trainingColor.color}
                                        />
                                    {/if}
                                {/each}
                            </div>
                            {user.name}
                        </span>
                    </ListgroupItem>
                {/each}
            {/if}
        </Listgroup>
    </div>
</main>
