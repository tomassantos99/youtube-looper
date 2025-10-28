(() => {
  async function waitForElement(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  async function createLoopSvg() {
    const svgUrl = chrome.runtime.getURL("images/loop.svg");
    const svg = await fetch(svgUrl);
    const svgText = await svg.text();

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    svgElement.setAttribute("width", "35%");
    svgElement.setAttribute("height", "35%");
    svgElement.style.fill = "currentColor";
    svgElement.style.display = "block";
    svgElement.style.margin = "auto";

    return svgElement;
  }

  async function createLoopButtonElement() {
    const loopButtonElement = document.createElement("div");
    loopButtonElement.id = "loop-button";
    loopButtonElement.classList.add("ytp-time-display", "notranslate");
    loopButtonElement.style.paddingLeft = "0";

    const span = document.createElement("span");
    span.classList.add("ytp-time-wrapper");
    span.style.padding = "0";

    const loopButton = document.createElement("button");
    loopButton.classList.add("ytp-button");

    const svgElement = await createLoopSvg();

    loopButton.appendChild(svgElement);
    span.appendChild(loopButton);
    loopButtonElement.appendChild(span);

    return { loopButtonElement, loopButton, svgElement };
  }

  async function initializeLoopButton() {
    document.getElementById("loop-button")?.remove();

    const videoControls = await waitForElement("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls");

    const { loopButtonElement, loopButton, svgElement } = await createLoopButtonElement();
    videoControls.appendChild(loopButtonElement);

    return {
      loopButton,
      setLoopButtonActive: () => (svgElement.style.fill = "red"),
      setLoopButtonInactive: () => (svgElement.style.fill = "currentColor"),
    };
  }

  window.initializeLoopButton = initializeLoopButton;
})();
