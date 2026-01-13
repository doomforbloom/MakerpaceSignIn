<script>
  import {
    Label,
    Input,
    Button,
    Dropdown,
    DropdownItem,
    ToastContainer,
    Toast,
    Checkbox,
    Modal,
    ButtonGroup,
  } from "flowbite-svelte";
  import {
    ChevronDownOutline,
    ChevronLeftOutline,
    HomeOutline,
    SchoolOutline,
  } from "flowbite-svelte-icons";
  import { global } from "./Global.svelte";
  import { tablesDB } from "./AW.svelte";
  import { fade } from "svelte/transition";

  // show only id field at first
  let idHandler = "noDataInInput";

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
  let epccIdOrPhoneNumber = $state("");

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
        rowId: epccIdOrPhoneNumber,
      });

      global.userRowInfo = userInfo;

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
      !epccIdOrPhoneNumber ||
      (!phoneRegex.test(epccIdOrPhoneNumber) &&
        !idRegex.test(epccIdOrPhoneNumber))
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
</script>

<main
  class="flex flex-col justify-start gap-6 border-6 rounded-md border-white border-solid p-8 w-fit"
>
  <div>
    {#if anError}
      <div transition:fade>
        <ToastContainer>
          <Toast>{errorMessage}</Toast>
        </ToastContainer>
      </div>
    {/if}
  </div>
  <h1 class="text-6xl font-bold">Welcome Back!</h1>
  <div class="flex flex-col gap-4">
    <Label for="IDorPhoneNumber" class="text-white"
      ><div class="text-white text-4xl">ID or Phone #</div></Label
    >
    <Input
      autocomplete="off"
      class="p-5 placeholder:font-semibold placeholder:text-xl placeholder:text-grey-500 placeholder:opacity-50"
      id="IDorPhoneNumber"
      placeholder="12345678"
      size="lg"
      bind:value={epccIdOrPhoneNumber}
    />
  </div>
  {#if idHandler == "noDataInInput"}
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
    <Checkbox class="text-2xl p-4"bind:checked={liabilityChecked}>
      <p class="text-lg white ms-2">I have read and accepted the</p>
      <!-- svelte-ignore a11y_invalid_attribute -->
      <a
        rel="noopener noreferrer"
        href="#"
        onclick={() => {
          liabilityModal =true;
        }}
        class="text-lg primary-600 dark:text-primary-500 ms-1 hover:underline"
        >EPCC Liability Form</a
      >
      .
    </Checkbox>
    <script lang="ts">
      import { Button, Modal, P } from "flowbite-svelte";
      let defaultModal = $state(false);
    </script>
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
      <Button class="text-2xl py-6 w-full" loading={submitting} onclick={getUserInfo}
        >Submit</Button
      >
    </div>
  {/if}
</main>
