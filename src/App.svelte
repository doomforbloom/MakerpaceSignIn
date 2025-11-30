<script>
  import { onMount } from "svelte";
  import "./app.css";
  import CreateAccount from "./lib/CreateAccount.svelte";
  import { global } from "./lib/Global.svelte";
  import Landing from "./lib/Landing.svelte";
  import Stations from "./lib/Stations.svelte";

  // if page crashes or anything always go back to landing page
  onMount(() => {
    if (!global.display) {
      global.display = "landing";
    }
  });
</script>

<main>
  {#if global.display == "landing"}
    <Landing />
  {:else if global.display == "create-account"}
    <CreateAccount />
  {:else if global.display == "stations"}
    <Stations />
  {/if}
</main>
