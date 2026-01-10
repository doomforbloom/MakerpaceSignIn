<script>
    import { Radio, Button, Toast, ToastContainer } from "flowbite-svelte";
    import { ChevronLeftOutline } from "flowbite-svelte-icons";
    import { global } from "./Global.svelte";
    import { tablesDB } from "./AW.svelte";
    import { fade } from "svelte/transition";

    let stationChosen = $state("");

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
            if (!stationChosen) {
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
                rowId: global.userRowInfo.$id,
                data: {
                    IsActive: true,
                    InitialTimeStamp: Date.now(),
                    CurrentStation: stationChosen,
                },
            });

            submitting = false;
            global.display = "home";
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
                <ToastContainer>
                    <Toast>{errorMessage}</Toast>
                </ToastContainer>
            </div>
        {/if}
    </div>
    <div
        class="grid grid-cols-2 gap-6 gap-y-10 border-2 rounded-md border-white border-solid p-8 justify-center"
    >
        <div class="flex flex-row w-full col-span-2 gap-2 justify-between">
            <ChevronLeftOutline
                class="size-15"
                onclick={() => {
                    global.display = "home";
                }}
            />
            <h2 class="text-6xl font-semibold justify-self-center">
                Which area will you be working in today?
            </h2>
        </div>
        {#each stations as station}
            <div
                class="w-100 h-full rounded-sm border border-gray-200 dark:border-gray-700"
            >
                <Radio
                    name={station.name}
                    value={station.value}
                    bind:group={stationChosen}
                    classes={{ label: "w-100 p-10 text-white text-2xl" }}
                    >{station.name}</Radio
                >
            </div>
        {/each}
        <Button
            class="w-full py-10 col-span-2 text-4xl"
            loading={submitting}
            onclick={logIn}>Submit</Button
        >
    </div>
</main>
