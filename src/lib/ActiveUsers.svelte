<script lang="ts">
  import { Indicator, Listgroup, ListgroupItem } from "flowbite-svelte";
  import { realtime, tablesDB } from "./AW.svelte";
  import { ID, Query } from "appwrite";

  let activeUsers = $state([]);
  let noUsersActive = $state(true);

  let loggingOut = $state(false);

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
      let currentFinalTime = (currentLogOutTime - currentLogInTime) / 1000; // seconds

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
          ForClass: currentIsForClass,
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
  realtime.subscribe("account", getActiveUsers);
</script>

<main>
  <div
    class="flex flex-row gap-9 border-6 rounded-md border-white border-solid p-8 w-fit justify-center"
  >
    <div class="flex flex-col justify-evenly gap-2">
      <h2 class="text-5xl font-medium">Active Users</h2>
      <p class="text-3xl">Tap your name to log out</p>
    </div>
    <Listgroup active class="flex justify-center items-center w-fit h-fit p-2">
      {#if noUsersActive}
        <ListgroupItem
          class="flex justify-evenly p-10 focus:outline-0"
          ><span class="flex justify-start items-center gap-2">
            <div class="flex flex-row items-center justify-center gap-2">
                <p class="text-4xl font-bold">No Users Active</p>
            </div>
          </span>
        </ListgroupItem>
      {:else}
        {#each activeUsers as user}
          <ListgroupItem
            class="flex justify-evenly p-10 focus:outline-0"
            onclick={() => {
              loggingOut = true;
              logOut(user.rowId).then(() => loggingOut = false)
            }}
            ><span class="flex justify-start items-center gap-6">
              <div class="flex flex-row items-center justify-center gap-2">
                {#each trainingColors as trainingColor, i}
                  {#if user.trainings[i] === true}
                    <Indicator class="inline" size="xl" color={trainingColor.color} />
                  {/if}
                {/each}
              </div>
              <p class="text-4xl">{user.name}
                {#if loggingOut}
                  Logging Out...
                {/if}
              </p>
            </span>
          </ListgroupItem>
        {/each}
      {/if}
    </Listgroup>
  </div>
</main>
