<script>
  import "./app.css";
  import { onMount } from "svelte";
  import { global } from "./lib/Global.svelte";
  import CreateAccount from "./lib/CreateAccount.svelte";
  import Home from "./lib/WelcomeBack.svelte";
  import Stations from "./lib/Stations.svelte";
  import Landing from "./lib/Landing.svelte";

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
  {:else if global.display == "home"}
    <Home />
  {:else if global.display == "log-in-out"}
    <Home />
  {/if}
</main>
