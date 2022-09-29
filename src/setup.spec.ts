before(() => {
  if (process.argv?.includes("--watch") || process.argv?.includes("-w")) {
    console.log("\x1Bc");
  }
});
