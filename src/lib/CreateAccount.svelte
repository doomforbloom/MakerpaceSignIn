<script>
  import { Alert, Button, Helper, Input, Label, Radio } from "flowbite-svelte";
  import { ChevronLeftOutline } from "flowbite-svelte-icons";
  import { global } from "./Global.svelte";
  import { tablesDB } from "./AW.svelte";
  import { fade } from "svelte/transition";
  
  // boolean to display toast and error message string
  let anError = $state(false);
  let errorMessage = $state("");

  // for button loading animation and disable
  let submitting = $state(false);

  async function createAccount() {
    submitting = true;
    try {
      validateData();
      
      await tablesDB.createRow({
        databaseId: "makerspace_database",
        tableId: "user_info",
        rowId: String(global.userRowInfo.id),
        data: {
          Name: global.userRowInfo.Name,
          Email: global.userRowInfo.Email,
          EPCCRelationship: global.userRowInfo.EPCCRelationship,
        },
      });

      global.display = "stations";
      global.accountSuccessfullyCreated = true;

      setTimeout(() => {
        global.accountSuccessfullyCreated = false;
      }, 3000);
    } catch (error) {

      console.log(error);
      
      errorMessage = error.message;
      anError = true;
      setTimeout(() => {
        anError = false;
      }, 3000);
    } finally {
      submitting = false;
    }
  }

  function validateData() {
    // name validation
    if (!global.userRowInfo.Name || typeof name !== "string" || global.userRowInfo.Name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters.");
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!global.userRowInfo.Email || !emailRegex.test(global.userRowInfo.Email)) {
      throw new Error("Invalid Email Format.");
    }

    if (!global.userRowInfo.EPCCRelationship) {
      throw new Error("Please choose your relationshop with EPCC");
    }

    // id and phone validation
    const phoneRegex = /^[0-9]{7,15}$/; // 7–15 digits
    const idRegex = /^[0-9]{3,20}$/; // simple ID rule

    if (!global.userRowInfo.id || (!phoneRegex.test(global.userRowInfo.id) && !idRegex.test(global.userRowInfo.id))) {
      throw new Error("Must be a valid ID or Phone Number");
    }
  }
</script>

<main class="flex flex-col gap-8">
  {#if anError}
    <div transition:fade>
      <Alert class="flex flex-col gap-5 p-10" color="red">
        <span class="font-bold text-6xl">Danger alert!</span>
        <p class="text-4xl">{errorMessage}</p>
      </Alert>
    </div>
  {/if}
  <div
    class="flex flex-col gap-10 w-4xl border-6 rounded-md border-white border-solid p-15"
  >
    <div class="flex flex-row justify-between items-center">
      <ChevronLeftOutline
        class="size-25"
        onclick={() => {
          global.display = "welcome-back";
        }}
      />
      <h2 class="text-6xl font-bold">Create Account</h2>
    </div>
    <div class="flex flex-col gap-4">
      <Label class="flex flex-col gap-4">
        <div class="text-white text-4xl">Full Name</div>
        <Input
          class="p-5 placeholder:text-xl placeholder:text-grey-500 placeholder:opacity-50"
          type="text"
          placeholder="James McGill"
          size="lg"
          bind:value={global.userRowInfo.Name}
        />
      </Label>
      <Label class="flex flex-col gap-4">
        <div class="text-white text-4xl">EPCC ID Number</div>
        <Input
          class="p-5 placeholder:text-xl placeholder:text-grey-500 placeholder:opacity-50"
          type="text"
          placeholder="12345678"
          size="lg"
          bind:value={global.userRowInfo.id}
        />
        <Helper class="text-white -mt-1 text-xl"
          >If you don't have an ID, please put your phone number</Helper
        >
      </Label>
      <Label class="flex flex-col gap-4 text-4xl">
        <div class="text-white">Email</div>
        <Input
          class="p-5 placeholder:text-xl placeholder:text-grey-500 placeholder:opacity-50"
          type="email"
          placeholder="john@appleseed.com"
          size="lg"
          bind:value={global.userRowInfo.Email}
        />
      </Label>
    </div>
    <div class="flex flex-col justify-start gap-3">
      <Radio
        name="Student"
        value="Student"
        bind:group={global.userRowInfo.EPCCRelationship}
        classes={{
          label:
            "flex flex-row gap-3 w-full p-9 text-3xl text-white rounded-sm border-2 border-gray-200 dark:border-gray-700",
        }}>Student</Radio
      >
      <Radio
        name="Faculty / Staff"
        value="Faculty / Staff"
        bind:group={global.userRowInfo.EPCCRelationship}
        classes={{
          label:
            "flex flex-row gap-3 w-full p-9 text-3xl text-white rounded-sm border-2 border-gray-200 dark:border-gray-700",
        }}>Faculty / Staff</Radio
      >
      <Radio
        name="Public"
        value="Public"
        bind:group={global.userRowInfo.EPCCRelationship}
        classes={{
          label:
            "flex flex-row gap-3 w-full p-9 text-3xl text-white rounded-sm border-2 border-gray-200 dark:border-gray-700",
        }}>Public</Radio
      >
    </div>
    <Button
      class="py-10 text-4xl font-bold"
      loading={submitting}
      onclick={createAccount}>Submit</Button
    >
  </div>
</main>
