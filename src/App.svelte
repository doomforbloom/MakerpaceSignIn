<script>
  import "./app.css";
  import { onMount } from "svelte";
  import { global } from "./lib/Global.svelte";
  import CreateAccount from "./lib/CreateAccount.svelte";
  import WelcomeBack from "./lib/WelcomeBack.svelte";
  import Stations from "./lib/Stations.svelte";
  import LogInOut from "./lib/LogInOut.svelte";

  // if page crashes or anything always go back to home page
  onMount(() => {
    if (!global.display) {
      global.display = "welcome-back";
    }
  });
</script>

<main>
  {#if global.display == "welcome-back"}
    <WelcomeBack />
  {:else if global.display == "create-account"}
    <CreateAccount />
  {:else if global.display == "stations"}
    <Stations />
  {:else if global.display == "log-in-out"}
    <LogInOut />
  {/if}
</main>
