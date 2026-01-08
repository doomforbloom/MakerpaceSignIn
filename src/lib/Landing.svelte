<script>
  import {
    Button,
    Heading,
    Secondary,
    Toast,
    ToastContainer,
  } from "flowbite-svelte";
  import { global } from "./Global.svelte";
  import ActiveUsers from "./ActiveUsers.svelte";
  import { fade } from "svelte/transition";
</script>

<main class="flex flex-col gap-10 justify-center items-center">
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
    class="flex flex-col gap-10 border-6 rounded-md border-white border-solid p-10 w-full"
  >
    <h1 class="font-bold text-7xl mb-2">Sign In Page</h1>
    <div class="flex flex-row gap-8">
      <Button
        onclick={() => {
          global.display = "create-account";
        }}><Heading class="p-10 text-white">Register</Heading></Button
      >
      <Button
      class="border-5"
        color="alternative"
        onclick={() => {
          global.display = "log-in-out";
        }}
        ><Secondary class="p-10 text-5xl text-white">Log In</Secondary></Button
      >
    </div>
  </div>
  <ActiveUsers />
</main>
