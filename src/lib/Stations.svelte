<script>
    import { Radio, Button, Toast, ToastContainer } from "flowbite-svelte";
    import { ChevronLeftOutline } from "flowbite-svelte-icons";
    import { global } from "./Global.svelte";
    import { tablesDB } from "./AW.svelte";
    import { fade } from "svelte/transition";
    import { Query } from "appwrite";

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

            // update makerspace stations
            // get current array
            const teacherArrayResponse = await tablesDB.getRow({
                databaseId: "makerspace_database",
                tableId: "makerspace_info",
                rowId: stationChosen,
                queries: [Query.select(["TeacherAssigned"])],
            });

            // take array and add new teacher
            let teacherArray = teacherArrayResponse.TeacherAssigned || [];

            // if teacher is already there don't finish up the function and leave it
            if (teacherArray.includes(global.teacherWhoAssignedStation)) {
                submitting = false;
                global.display = "landing";
                return;
            } else {
                teacherArray.push(global.teacherWhoAssignedStation);
            }

            // update array and send back
            await tablesDB.updateRow({
                databaseId: "makerspace_database",
                tableId: "makerspace_info",
                rowId: stationChosen,
                data: {
                    TeacherAssigned: teacherArray,
                },
            });

            submitting = false;
            global.display = "landing";
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
        class="grid grid-cols-2 gap-6 border-2 rounded-md border-white border-solid p-8 justify-items-center"
    >
        <div
            class="flex flex-row col-span-2 gap-2 justify-between items-center"
        >
            <ChevronLeftOutline
                class="shrink-0 h-11 w-11 pt-0.5"
                onclick={() => {
                    global.display = "landing";
                }}
            />
            <h2 class="text-2xl font-semibold">
                Which area will you be working in today?
            </h2>
        </div>
        {#each stations as station}
            <div
                class="w-50 rounded-sm border border-gray-200 dark:border-gray-700"
            >
                <Radio
                    name={station.name}
                    value={station.value}
                    bind:group={stationChosen}
                    classes={{ label: "w-full p-4 text-white" }}
                    >{station.name}</Radio
                >
            </div>
        {/each}
        <Button
            class="w-80 py-5 col-span-2"
            loading={submitting}
            onclick={logIn}>Submit</Button
        >
    </div>
</main>
