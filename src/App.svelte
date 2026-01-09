<script>
  import "./app.css";
  import { onMount } from "svelte";
  import { global } from "./lib/Global.svelte";
  import CreateAccount from "./lib/CreateAccount.svelte";
  import WelcomeBack from "./lib/WelcomeBack.svelte";
  import Stations from "./lib/Stations.svelte";

  // if page crashes or anything always go back to home page
  onMount(() => {
    if (!global.display) {
      global.display = "home";
    }
  });
</script>

<main>
  {#if global.display == "home"}
    <WelcomeBack />
  {:else if global.display == "create-account"}
    <CreateAccount />
  {:else if global.display == "stations"}
    <Stations />
  {/if}
</main>
