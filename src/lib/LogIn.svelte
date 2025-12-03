<script>
    import {
        Label,
        Input,
        Button,
        Dropdown,
        DropdownItem,
        ToastContainer,
        Toast,
    } from "flowbite-svelte";
    import {
        ChevronDownOutline,
        HomeOutline,
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
    ];

    // info to be sent to db
    let selectedTeacher = $state("Select teacher");
    let epccIdOrPhoneNumber = $state("");

    // used to close dropdown
    let teacherDropdownIsOpen = $state(false);
    let classOrPersonalDropdown = $state(false);

    // project will be for class or personal. class = true personal = false
    let forClass = $state(true);

    let anError = $state(false);
    let errorMessage = $state("");
    let submitting = $state(false);

    async function getUserInfo() {
        try {
            submitting = true;
            // validate data locally (no weird inputs)
            validateData();

            // validate dad thru appwrite to make sure user exists
            const result = await tablesDB.getRow({
                databaseId: "makerspace_database",
                tableId: "user_info",
                rowId: epccIdOrPhoneNumber,
            });

            global.userRowInfo = result;

            if (!forClass) {
                global.teacherWhoAssignedStation = "Personal"
            } else {
                global.teacherWhoAssignedStation = selectedTeacher;
            }

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
            throw new Error(
                "Please choose a teacher or choose personal project",
            );
        }
    }
</script>

<main
    class="flex flex-col justify-start gap-6 border-2 rounded-md border-white border-solid p-8 w-120"
>
    <div>
        {#if anError}
            <div transition:fade>
                <ToastContainer>
                    <Toast>{errorMessage}</Toast>
                </ToastContainer>
            </div>
        {/if}
        {#if global.accountSuccessfullyCreated}
            <div transition:fade>
                <ToastContainer color="green">
                    <Toast color="green" class=""
                        ><span class="font-bold text-green-500">Success!</span>
                        <p class="text-green-500">
                            Account created successfully!
                        </p></Toast
                    >
                </ToastContainer>
            </div>
        {/if}
    </div>
    <h1 class="font-bold text-4xl">Welcome Back!</h1>
    <div class="">
        <Label for="IDorPhoneNumber" class="mb-2 block text-white"
            >ID or Phone #</Label
        >
        <Input
            class="placeholder:text-grey-500 placeholder:opacity-50 placeholder:font-medium"
            id="IDorPhoneNumber"
            placeholder="Saul Goodman"
            bind:value={epccIdOrPhoneNumber}
        />
    </div>
    <div class="flex flex-row w-full justify-between">
        <Button class="flex flex-row gap-2 bg-gray-100 text-gray-500 w-40">
            {#if forClass}
                <SchoolOutline class="shrink-0 h-6 w-6" />
                <span>Class</span>
                <ChevronDownOutline class="h-6 w-6" />
            {:else}
                <HomeOutline class="shrink-0 h-6 w-6" />
                <span>Personal</span>
                <ChevronDownOutline class="h-6 w-6" />
            {/if}
        </Button>
        <Dropdown simple bind:isOpen={classOrPersonalDropdown}>
            <DropdownItem
                class="flex flex-row gap-2 items-center w-full"
                onclick={() => {
                    forClass = true;
                    classOrPersonalDropdown = !classOrPersonalDropdown;
                }}
            >
                <SchoolOutline class="shrink-0 h-6 w-6" />
                <span>Class Project</span>
            </DropdownItem>
            <DropdownItem
                class="flex flex-row gap-2 items-center w-full"
                onclick={() => {
                    forClass = false;
                    classOrPersonalDropdown = !classOrPersonalDropdown;
                }}
            >
                <HomeOutline class="shrink-0 h-6 w-6" />
                <span>Personal Project</span>
            </DropdownItem>
        </Dropdown>

        <Button
            class="flex flex-row gap-2 bg-gray-100 text-gray-500 h-14 w-55"
            disabled={!forClass}
        >
            {#if forClass}
                <SchoolOutline class="shrink-0 h-6 w-6" />
                <span>{selectedTeacher}</span>
                <ChevronDownOutline class="h-6 w-6" />
            {:else}
                <HomeOutline class="shrink-0 h-6 w-6" />
                <span>N/A</span>
                <ChevronDownOutline class="h-6 w-6" />
            {/if}
        </Button>
        <Dropdown simple bind:isOpen={teacherDropdownIsOpen}>
            {#each teachers as teacher, i}
                <DropdownItem
                    class="flex flex-row gap-2 items-center w-full"
                    onclick={() => {
                        selectedTeacher = teachers[i].value;
                        teacherDropdownIsOpen = !teacherDropdownIsOpen;
                    }}
                >
                    <span>{teacher.value}</span>
                </DropdownItem>
            {/each}
        </Dropdown>
    </div>
    <div class="flex flex-row justify-evenly gap-4">
        <Button class="py-4 w-full" loading={submitting} onclick={getUserInfo}
            >Submit</Button
        >
        <Button
            outline
            class="py-4 w-full"
            onclick={() => {
                global.display = "create-account";
            }}>New here? Click me!</Button
        >
    </div>
</main>
