<script>
    import { Listgroup, ListgroupItem } from "flowbite-svelte";
    import { tablesDB } from "./AW.svelte";
    import { Query } from "appwrite";

    let activeUsers = $state([]);
    let noUsersActive = $state(true);
    let deleting = $state(false);

    async function logOut(rowID) {
        deleting = true;
        try {
            // change user's active status to false
            await tablesDB.updateRow({
                databaseId: "makerspace_database",
                tableId: "user_info",
                rowId: rowID,
                data: { IsActive: false },
            });

            // get user info db object
            const userResponseDB = await tablesDB.getRow({
                databaseId: "makerspace_database",
                tableId: "user_info",
                rowId: rowID,
            });

            // do the math
            let initialTimeStamp = userResponseDB.InitialTimeStamp;
            let finalTime = (Date.now() - initialTimeStamp) / 1000; // seconds

            // get makerspace info db object
            let currentStation = userResponseDB.CurrentStation;
            const makerspaceResponseDB = await tablesDB.getRow({
                databaseId: "makerspace_database",
                tableId: "makerspace_info",
                rowId: currentStation,
            });

            // more math :3
            let sessionMinutes = finalTime / 60;
            let totalTime = makerspaceResponseDB.TimeSpentMinutes + sessionMinutes;

            await tablesDB.updateRow({
                databaseId: "makerspace_database",
                tableId: "makerspace_info",
                rowId: currentStation,
                data: { TimeSpentMinutes: totalTime },
            });
        } catch (error) {
            console.log(error);
        } finally {
            getActiveUsers();
            deleting = false;
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

        // store the name and id from the result and store it in an array as an object
        activeUsers = activeUsersResult.rows.map((row) => ({
            name: row.Name,
            rowId: row.$id,
        }));
    }

    getActiveUsers();

    setInterval(getActiveUsers, 10000);
</script>

<main>
    <div
        class="flex flex-row gap-9 border-2 rounded-md border-white border-solid p-8 w-fit justify-center"
    >
        <div>
            <h2 class="text-2xl font-medium">Active Users</h2>
            <p>Tap your name to log out</p>
        </div>
        <Listgroup active class="flex justify-center items-center w-50">
            {#if noUsersActive}
                <span class="font-bold">No users active!</span>
            {:else}
                {#each activeUsers as user}
                    <ListgroupItem
                        class="h-10 flex justify-evenly focus:outline-0"
                        onclick={() => {
                            logOut(user.rowId);
                        }}
                        >{user.name}
                    </ListgroupItem>
                {/each}
            {/if}
        </Listgroup>
    </div>
</main>
