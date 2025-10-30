(async () => {
  await import(chrome.runtime.getURL("scripts/utils.js"));
  await import(chrome.runtime.getURL("scripts/loop-button.js"));
  await import(chrome.runtime.getURL("scripts/loop-section.js"));

  window.addEventListener("yt-navigate-finish", async () => {
    try {
      const { loopButton, setLoopButtonActive, setLoopButtonInactive } = await initializeLoopButton();
      const { showRange, hideRange, rangeVisible } = await createDraggableRangeOverlay();

      loopButton.addEventListener("click", () => {
        if (rangeVisible()) {
          hideRange();
          setLoopButtonInactive();
        } else {
          showRange();
          setLoopButtonActive();
        }
      });
    } catch (error) {
      console.error("Error initializing loop button or range overlay:", error);
    }
  });
})();
