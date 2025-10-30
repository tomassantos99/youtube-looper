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

  function waitForElementWithTimeout(selector, ms = 5000) {
    return Promise.race([window.waitForElement(selector), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout waiting for " + selector)), ms))]);
  }

  window.waitForElement = waitForElement;
  window.waitForElementWithTimeout = waitForElementWithTimeout;
})();
