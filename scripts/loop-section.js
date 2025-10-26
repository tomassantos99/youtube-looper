(() => {
  function createDraggableRangeOverlay() {
    const existing = document.getElementById("yt-range-overlay");
    if (existing) return existing;

    const progressBar = document.querySelector(".ytp-progress-bar");
    if (!progressBar) return null;

    const overlay = document.createElement("div");
    overlay.id = "yt-range-overlay";
    Object.assign(overlay.style, {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "0",
      display: "none",
    });

    const range = document.createElement("div");
    Object.assign(range.style, {
      position: "absolute",
      top: "0",
      height: "100%",
      background: "rgba(255,0,0,0.2)",
      pointerEvents: "none",
    });
    overlay.appendChild(range);

    const makeHandle = () => {
      const h = document.createElement("div");
      Object.assign(h.style, {
        position: "absolute",
        bottom: "0",
        width: "2px",
        height: "20px",
        background: "#fff",
        borderRadius: "2px",
        cursor: "ew-resize",
        pointerEvents: "auto",
        transition: "background 0.2s",
      });

      const dot = document.createElement("div");
      const dotSize = 6;
      Object.assign(dot.style, {
        position: "absolute",
        top: `-${dotSize}px`,
        left: "50%",
        transform: "translateX(-50%)",
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        background: "#fff",
        borderRadius: "50%",
        transition: "background 0.2s",
      });

      h.appendChild(dot);
      h.addEventListener("mouseenter", () => (h.style.background = "#f00"));
      h.addEventListener("mouseleave", () => (h.style.background = "#fff"));
      dot.addEventListener("mouseenter", () => (dot.style.background = "#f00"));
      dot.addEventListener("mouseleave", () => (dot.style.background = "#fff"));

      return h;
    };

    const startHandle = makeHandle();
    const endHandle = makeHandle();
    overlay.appendChild(startHandle);
    overlay.appendChild(endHandle);

    progressBar.style.position = "relative";
    progressBar.appendChild(overlay);
    progressBar.insertBefore(overlay, progressBar.firstChild);

    let startPercent = 20;
    let endPercent = 60;
    let activeHandle = null;

    function updatePositions() {
      range.style.left = startPercent + "%";
      range.style.width = endPercent - startPercent + "%";
      startHandle.style.left = `calc(${startPercent}% - 3px)`;
      endHandle.style.left = `calc(${endPercent}% - 3px)`;
    }

    updatePositions();

    function onMouseDown(e) {
      e.preventDefault();
      activeHandle = e.currentTarget;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
      if (!activeHandle) return;
      const rect = progressBar.getBoundingClientRect();
      const percent = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));

      if (activeHandle === startHandle) {
        startPercent = Math.min(percent, endPercent - 1);
      } else if (activeHandle === endHandle) {
        endPercent = Math.max(percent, startPercent + 1);
      }
      updatePositions();
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      if (activeHandle === endHandle) {
        const video = document.querySelector("video");
        if (video) {
          const startTime = (startPercent / 100) * video.duration;
          video.currentTime = startTime;
        }
      }

      activeHandle = null;
    }

    startHandle.addEventListener("mousedown", onMouseDown);
    endHandle.addEventListener("mousedown", onMouseDown);

    const video = document.querySelector("video");
    if (video) {
      video.addEventListener("timeupdate", () => {
        if (!overlay.style.display || overlay.style.display === "none") return;
        const { duration, currentTime } = video;
        const startTime = (startPercent / 100) * duration;
        const endTime = (endPercent / 100) * duration;

        if (currentTime >= endTime) {
          video.currentTime = startTime;
          video.play();
        }
      });
    }

    return {
      overlay,
      getRange: () => ({ startPercent, endPercent }),
      showRange: () => (overlay.style.display = "block"),
      hideRange: () => (overlay.style.display = "none"),
      removeRange: () => overlay.remove(),
      rangeVisible: () => overlay.style.display !== "none",
    };
  }

  window.createDraggableRangeOverlay = createDraggableRangeOverlay;
})();
