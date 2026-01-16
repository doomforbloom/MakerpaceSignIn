<script>
  import {
    Label,
    Input,
    Button,
    Dropdown,
    DropdownItem,
    Checkbox,
    Modal,
    ButtonGroup,
    Alert,
  } from "flowbite-svelte";
  import {
    ChevronDownOutline,
    HomeOutline,
    RefreshOutline,
    SchoolOutline,
  } from "flowbite-svelte-icons";
  import { global } from "./Global.svelte";
  import { tablesDB } from "./AW.svelte";
  import { fade } from "svelte/transition";

  // add teachers
  let teachers = [
    { value: "Myers" },
    { value: "Ibarra" },
    { value: "Cuvelier" },
    { value: "Munoz" },
    { value: "Roozbeh" },
    { value: "Olienka Fernandez" },
    { value: "Londie" },
    { value: "Chavez" },
  ];

  // info to be sent to db
  let selectedTeacher = $state("Select teacher");

  // used to close dropdown
  let teacherDropdownIsOpen = $state(false);
  let classOrPersonalDropdown = $state(false);

  // project will be for class or personal. class = true personal = false
  let forClass = $state(true);

  // liability variables
  let liabilityChecked = $state(false);
  let liabilityModal = $state(false);
  let liabilityPage = $state("adult-english");

  let anError = $state(false);
  let errorMessage = $state("");
  let submitting = $state(false);

  async function getUserInfo() {
    try {
      submitting = true;
      // validate data locally (no weird inputs)
      validateData();

      // validate dad thru appwrite to make sure user exists
      const userInfo = await tablesDB.getRow({
        databaseId: "makerspace_database",
        tableId: "user_info",
        rowId: global.userRowInfo.id,
      });

      if (!forClass) {
        selectedTeacher = "Personal";
      }

      // add teacher, class or personal and liability
      await tablesDB.updateRow({
        databaseId: "makerspace_database",
        tableId: "user_info",
        rowId: userInfo.$id,
        data: {
          teacher: selectedTeacher,
          Class: forClass,
          Trainings: [liabilityChecked],
        },
      });

      global.display = "stations";
      submitting = false;
    } catch (error) {
      if (error.message.includes("Row with the requested ID")) {
        errorMessage = "Account with given ID was not found";
      } else {
        errorMessage = error.message || String(error);
      }
      anError = true;
      setTimeout(() => {
        anError = false;
      }, 3000);
    } finally {
      submitting = false;
    }
  }

  function validateData() {
    // id and phone validation
    const phoneRegex = /^[0-9]{7,15}$/;
    const idRegex = /^[A-Za-z0-9]{3,20}$/;
    if (
      !global.userRowInfo.id ||
      (!phoneRegex.test(global.userRowInfo.id) &&
        !idRegex.test(global.userRowInfo.id))
    ) {
      throw new Error("Must be a valid ID or Phone Number");
    }

    // personal or class project w teacher validation
    if (selectedTeacher == "Select teacher" && forClass) {
      throw new Error("Please choose a teacher or choose personal project");
    }

    if (!liabilityChecked) {
      throw new Error(
        "Please read and agree with EPCC's liability form before continuing"
      );
    }
  }

  let idSubmission = $state(false);
  async function checkIDInDB() {
    idSubmission = true;
    try {
      const userInfo = await tablesDB.getRow({
        databaseId: "makerspace_database",
        tableId: "user_info",
        rowId: global.userRowInfo.id,
      });
        global.userRowInfo.Name = userInfo.Name;
        global.userRowInfo.Email = userInfo.Email;
        global.userRowInfo.EPCCRelationship = userInfo.EPCCRelationship;
        global.userRowInfo.IsActive = userInfo.IsActive;
        global.userRowInfo.Trainings = userInfo.Trainings;
        global.userRowInfo.CurrentStation = userInfo.CurrentStation;
        global.userRowInfo.InitialTimeStamp = userInfo.InitialTimeStamp;
        global.userRowInfo.teacher = userInfo.teacher;
        global.userRowInfo.Class = userInfo.Class;

      global.idExists = true;

      global.display = "log-in-out";

    } catch (error) {
      global.display = "create-account";
    } finally {
      idSubmission = false;
    }
  }
</script>

{#if anError}
  <div transition:fade>
    <Alert class="flex flex-col gap-5 p-10" color="red">
      <span class="font-bold text-6xl">Danger alert!</span>
      <p class="text-4xl">{errorMessage}</p>
    </Alert>
  </div>
{/if}
<main
  class="flex flex-col justify-start gap-6 border-6 rounded-md border-white border-solid p-10 w-full"
>
  <div class="flex flex-row justify-between items-center">
    <RefreshOutline
      onclick={() => {
        location.reload();
      }}
      class="size-15"
    />
    <h1 class="text-6xl font-bold">Welcome Back!</h1>
  </div>
  <div class="flex flex-col gap-4">
    <Label for="IDorPhoneNumber" class="text-white"
      ><div class="text-white text-4xl">ID or Phone #</div></Label
    >
    <Input
      inputmode="numeric"
      type="number"
      autocomplete="off"
      class="p-8 placeholder:font-semibold placeholder:text-2xl placeholder:text-grey-900 placeholder:opacity-70 font-semibold text-2xl"
      id="IDorPhoneNumber"
      placeholder="12345678"
      onkeydown={(e) => {
        if(e.key === "Enter") {
          idSubmission = true;
          checkIDInDB();
        }
      }}

      bind:value={global.userRowInfo.id}
    />
    {#if !global.idExists || global.userRowInfo.id == ""}
      <Button
        onclick={checkIDInDB}
        class="flex flex-row gap-5 text-white text-2xl py-10 px-25"
        loading={idSubmission}>Submit</Button
      >
    {/if}
  </div>
  {#if global.idExists && global.userRowInfo.id != ""}
    <div class="flex flex-row w-full justify-between">
      <Button
        class="flex flex-row gap-5 bg-gray-100 text-gray-500 size-9/20 py-10 px-35"
      >
        {#if forClass}
          <SchoolOutline class="size-15" />
          <span class="text-3xl font-bold">Class</span>
          <ChevronDownOutline class="size-14" />
        {:else}
          <HomeOutline class="size-15" />
          <span class="text-3xl font-bold">Personal</span>
          <ChevronDownOutline class="size-14" />
        {/if}
      </Button>
      <Dropdown simple bind:isOpen={classOrPersonalDropdown}>
        <DropdownItem
          class="flex flex-row items-center gap-5 bg-gray-100 text-gray-500 size-full py-8 px-20"
          onclick={() => {
            forClass = true;
            classOrPersonalDropdown = !classOrPersonalDropdown;
          }}
        >
          <SchoolOutline class="size-15" />
          <span class="text-3xl font-bold">Class Project</span>
        </DropdownItem>
        <DropdownItem
          class="flex flex-row items-center gap-5 bg-gray-100 text-gray-500 size-full py-8 px-20"
          onclick={() => {
            forClass = false;
            classOrPersonalDropdown = !classOrPersonalDropdown;
          }}
        >
          <HomeOutline class="size-15" />
          <span class="text-3xl font-bold">Personal Project</span>
        </DropdownItem>
      </Dropdown>

      <Button
        class="flex flex-row gap-5 bg-gray-100 text-gray-500 size-9/20 py-10 px-35"
        disabled={!forClass}
      >
        {#if forClass}
          <SchoolOutline class="size-15" />
          <span class="text-3xl font-bold">{selectedTeacher}</span>
          <ChevronDownOutline class="size-14" />
        {:else}
          <HomeOutline class="size-15" />
          <span class="text-3xl font-bold">N/A</span>
          <ChevronDownOutline class="size-14" />
        {/if}
      </Button>
      <Dropdown simple bind:isOpen={teacherDropdownIsOpen}>
        {#each teachers as teacher, i}
          <DropdownItem
            class="flex flex-row items-center gap-5 bg-gray-100 text-gray-500 size-full py-8 px-20"
            onclick={() => {
              selectedTeacher = teachers[i].value;
              teacherDropdownIsOpen = !teacherDropdownIsOpen;
            }}
          >
            <span class="text-3xl font-bold">{teacher.value}</span>
          </DropdownItem>
        {/each}
      </Dropdown>
    </div>
    <Checkbox class="text-2xl p-4" bind:checked={liabilityChecked}>
      <p class="text-lg text-white ms-2">I have read and accepted the</p>
      <!-- svelte-ignore a11y_invalid_attribute -->
      <a
        rel="noopener noreferrer"
        href="#"
        onclick={() => {
          liabilityModal = true;
        }}
        class="text-lg text-emerald-500 dark:text-primary-500 ms-1 hover:underline"
        >EPCC Liability Form</a
      >
      .
    </Checkbox>
    <Modal
      title="EPCC Liability Forms"
      form
      bind:open={liabilityModal}
      onaction={({ action }) => alert(`Handle "${action}"`)}
    >
      <div class="flex flex-col items-center">
        {#if liabilityPage == "adult-english"}
          <iframe
            title=""
            src="src\assets\AdultEnglishLiabilityForm.pdf"
            width="100%"
            height="600px"
            style="border: none;"
          ></iframe>
        {:else if liabilityPage == "adult-spanish"}
          <iframe
            title=""
            src="src\assets\AdultSpanishLiabilityForm.pdf"
            width="100%"
            height="600px"
            style="border: none;"
          ></iframe>
        {:else if liabilityPage == "child-english"}
          <iframe
            title=""
            src="src\assets\ChildEnglishLiabilityForm.pdf"
            width="100%"
            height="600px"
            style="border: none;"
          ></iframe>
        {:else if liabilityPage == "child-spanish"}
          <iframe
            title=""
            src="src\assets\ChildSpanishLiabilityForm.pdf"
            width="100%"
            height="600px"
            style="border: none;"
          ></iframe>
        {/if}
        <ButtonGroup class="*:ring-primary-700!">
          <Button
            onclick={() => {
              liabilityPage = "adult-english";
            }}>Adult English</Button
          >
          <Button
            onclick={() => {
              liabilityPage = "adult-spanish";
            }}>Adult Spanish</Button
          >
          <Button
            onclick={() => {
              liabilityPage = "child-english";
            }}>Child English</Button
          >
          <Button
            onclick={() => {
              liabilityPage = "child-spanish";
            }}>Child Spanish</Button
          >
        </ButtonGroup>
      </div>
    </Modal>
    <div class="flex flex-row justify-evenly gap-4">
      <Button
        class="text-2xl py-6 w-full"
        loading={submitting}
        onclick={getUserInfo}>Submit</Button
      >
    </div>
  {/if}
</main>
