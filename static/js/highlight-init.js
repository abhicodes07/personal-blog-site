// Syntax highlighting + macOS-style code window headers with copy button
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    hljs.highlightAll();

    document.querySelectorAll(".prose pre code").forEach((codeBlock) => {
      const pre = codeBlock.parentElement;

      // Detect language label
      let lang = "CODE";
      const match = codeBlock.className.match(/language-(\w+)/i);
      if (match) {
        const raw = match[1].toUpperCase();
        const labels = {
          PYTHON: "Python",
          JAVASCRIPT: "JavaScript",
          JS: "JavaScript",
          TYPESCRIPT: "TypeScript",
          TS: "TypeScript",
        };
        lang = labels[raw] ?? raw;
      }

      // Build wrapper
      const wrapper = document.createElement("div");
      wrapper.className =
        "my-10 code-window rounded-2xl overflow-hidden border border-ctp-surface0 shadow-2xl bg-ctp-base";

      wrapper.innerHTML = `
        <div class="flex items-center justify-between px-5 py-3 bg-ctp-crust border-b border-ctp-surface0">
          <span class="text-xs font-mono text-ctp-overlay1">${lang}</span>
          <div class="flex items-center gap-3">
            <button class="copy-btn flex items-center gap-1.5 text-xs font-mono text-ctp-overlay1 hover:text-ctp-green transition-colors duration-150 select-none">
              <span class="material-symbols-outlined copy-icon"
                style="font-size:15px;font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 20">
                content_copy
              </span>
              <span class="copy-label">copy</span>
            </button>
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-ctp-red"></div>
              <div class="w-3 h-3 rounded-full bg-ctp-yellow"></div>
              <div class="w-3 h-3 rounded-full bg-ctp-green"></div>
            </div>
          </div>
        </div>`;

      wrapper.appendChild(pre.cloneNode(true));
      pre.parentNode.replaceChild(wrapper, pre);

      // Copy button logic
      const btn   = wrapper.querySelector(".copy-btn");
      const label = btn.querySelector(".copy-label");
      const icon  = btn.querySelector(".copy-icon");

      const resetBtn = () => {
        icon.textContent = "content_copy";
        icon.style.fontVariationSettings = "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 20";
        label.textContent = "copy";
        btn.style.color = "";
      };

      btn.addEventListener("click", async () => {
        const code = wrapper.querySelector("pre code").innerText;
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          // Fallback for older browsers
          const ta = Object.assign(document.createElement("textarea"), {
            value: code,
            style: "position:fixed;opacity:0",
          });
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        icon.textContent = "check";
        icon.style.fontVariationSettings = "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20";
        label.textContent = "copied!";
        btn.style.color = "#a6e3a1";
        setTimeout(resetBtn, 2000);
      });
    });
  }, 10);
});
