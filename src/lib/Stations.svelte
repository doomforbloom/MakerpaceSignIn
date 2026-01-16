<script>
  import { Radio, Button, Alert } from "flowbite-svelte";
  import { ChevronLeftOutline } from "flowbite-svelte-icons";
  import { global } from "./Global.svelte";
  import { tablesDB } from "./AW.svelte";
  import { fade } from "svelte/transition";

  let stations = [
    { name: "3D Printing", value: "3DPrinting" },
    { name: "Laser Cutting", value: "LaserCutting" },
    { name: "Woodshop", value: "Woodshop" },
    { name: "Sewing & Crafts", value: "SewingAndCrafts" },
    { name: "CNC Milling", value: "CNCMilling" },
    { name: "Electronics", value: "Electronics" },
    { name: "Computers", value: "Computers" },
    { name: "Other", value: "Other" },
  ];

  // to change diplay of button
  let submitting = $state(false);

  let anError = $state(false);
  let errorMessage = $state("");

  async function logIn() {
    try {
      submitting = true;

      // make sure station is chosen
      if (!global.userRowInfo.CurrentStation) {
        errorMessage = "Please choose a station.";
        anError = true;
        setTimeout(() => (anError = false), 3000);
        submitting = false;
        return;
      }

      // update user info
      await tablesDB.updateRow({
        databaseId: "makerspace_database",
        tableId: "user_info",
        rowId: String(global.userRowInfo.id),
        data: {
          Name: global.userRowInfo.Name,
          Email: global.userRowInfo.Email,
          EPCCRelationship: global.userRowInfo.EPCCRelationship,
          IsActive: true,
          Trainings: global.userRowInfo.Trainings,
          CurrentStation: global.userRowInfo.CurrentStation,
          InitialTimeStamp: Date.now(),
          teacher: global.userRowInfo.teacher,
          Class: false,
        },
      });

      submitting = false;
      location.reload();
    } catch (error) {
      anError = true;
      errorMessage = error;
      setTimeout(() => {
        anError = false;
      }, 3000);
    }
  }
</script>

<main>
  <div>
    {#if anError}
      <div transition:fade>
        <Alert class="flex flex-col gap-5 p-10" color="red">
          <span class="font-bold text-6xl">Danger alert!</span>
          <p class="text-4xl">{errorMessage}</p>
        </Alert>
      </div>
    {/if}
  </div>
  <div
    class="grid grid-cols-2 gap-6 gap-y-10 border-6 rounded-md border-white border-solid p-12 justify-center"
  >
    <div class="flex flex-row w-full col-span-2 gap-2 justify-between">
      <ChevronLeftOutline
        class="size-20"
        onclick={() => {
          global.display = "welcome-back";
        }}
      />
      <h2 class="text-6xl font-semibold justify-self-center">
        Which area will you be working in today?
      </h2>
    </div>
    {#each stations as station}
      <div
        class="w-full h-full rounded-sm border-2 border-gray-200 dark:border-gray-700"
      >
        <Radio
          name={station.name}
          value={station.value}
          bind:group={global.userRowInfo.CurrentStation}
          classes={{ label: "p-10 text-white text-2xl" }}>{station.name}</Radio
        >
      </div>
    {/each}
    <Button
      class="py-10 col-span-2 text-4xl"
      loading={submitting}
      onclick={logIn}>Submit</Button
    >
  </div>
</main>
