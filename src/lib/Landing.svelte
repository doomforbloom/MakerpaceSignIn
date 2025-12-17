<script>
  import { Button, Heading, Secondary, Toast, ToastContainer } from "flowbite-svelte";
  import { global } from "./Global.svelte";
  import ActiveUsers from "./ActiveUsers.svelte";
  import { fade } from "svelte/transition";
</script>

<main class="flex flex-col gap-3 justify-center items-center">
  {#if global.accountSuccessfullyCreated}
    <div transition:fade>
      <ToastContainer color="green">
        <Toast color="green" class=""
          ><span class="font-bold text-green-500">Success!</span>
          <p class="text-green-500">Account created successfully!</p></Toast
        >
      </ToastContainer>
    </div>
  {/if}
  <div
    class="flex flex-col gap-3 border-2 rounded-md border-white border-solid p-5 w-full"
  >
    <div class="py-2">
      <h1 class="font-bold text-4xl mb-2">New Log In Page</h1>
      <p>Choose one of the following:</p>
    </div>
    <div class="flex flex-row gap-2">
      <Button
        onclick={() => {
          global.display = "create-account";
        }}><Heading class="p-10 text-white">Register</Heading></Button
      >
      <Button
        color="alternative"
        onclick={() => {
          global.display = "log-in-out";
        }}><Secondary class="p-10 text-5xl text-white">Log In</Secondary></Button
      >
    </div>
  </div>
  <ActiveUsers />
</main>
