<script>
  import { tablesDB } from "./AW.svelte";

  async function exportCSV() {
    // Fetch DB rows
    const dbResult = await tablesDB.listRows({
      databaseId: "makerspace_database",
      tableId: "makerspace_info",
    });

    if (!dbResult.rows.length) {
      alert("No data found.");
      return;
    }

    console.log(dbResult);

    //   const HeaderRowString = HeaderRowArray.join(",") + "\n";

    //   const ObjectToCSVrows = dbR.slice(1).map((x) => {
    //     let CSVrow = [
    //       x.logOrder,
    //       x.logEmailOrEpccID,
    //       x.logFullName,
    //       x.logNumberOfUsers,
    //       x.logStation,
    //       x.logSignInTime,
    //       x.logSignOutTime,
    //       x.logTotalTime,
    //       x.logArchived,
    //     ].join(",");

    //     return CSVrow;
    //   });

    //   const MERGEDCSVFILE = HeadderRowString + ObjectToCSVrows.join("\n");

    //   const blob = new Blob([MERGEDCSVFILE], {
    //     type: "text/csv;charset=utf-8;",
    //   });

    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement("a");npm run dev
    
    //   a.href = url;
    //   a.download = "Test.csv";
    //   a.style.display = "none";
    //   document.body.appendChild(a);
    //   a.click();

    //   // Cleanup
    //   document.body.removeChild(a);
    //   URL.revokeObjectURL(url);
    // }
  }
</script>

<main>
  <!-- <button
    class="px-4 py-2 bg-blue-600 text-white rounded"
    on:click={exportCSV}
  >
    Export Data
  </button> -->
</main>
