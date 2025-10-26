(async () => {
  await import(chrome.runtime.getURL("scripts/loop-button.js"));
  await import(chrome.runtime.getURL("scripts/loop-section.js"));

  window.addEventListener("yt-navigate-finish", initializeLoopButton);

  const { loopButton, setLoopButtonActive, setLoopButtonInactive } = await initializeLoopButton();
  const { showRange, hideRange, rangeVisible } = createDraggableRangeOverlay();

  loopButton.addEventListener("click", () => {
    if (rangeVisible()) {
      hideRange();
      setLoopButtonInactive();
    } else {
      showRange();
      setLoopButtonActive();
    }
  });
})();
