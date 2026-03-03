// ── MOBILE MENU ────────────────────────────────────
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    const icon = menuBtn.querySelector(".material-symbols-outlined");
    icon.textContent = mobileMenu.classList.contains("hidden")
      ? "menu"
      : "close";
  });
}

// ── CODE WINDOWS + COPY BUTTON ─────────────────────
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    hljs.highlightAll();

    document.querySelectorAll(".prose pre code").forEach((codeBlock) => {
      const pre = codeBlock.parentElement;

      let lang = "CODE";
      const match = codeBlock.className.match(/language-(\w+)/i);
      if (match) {
        lang = match[1].toUpperCase();
        if (lang === "PYTHON") lang = "Python";
        if (lang === "JAVASCRIPT" || lang === "JS") lang = "JavaScript";
        if (lang === "TYPESCRIPT" || lang === "TS") lang = "TypeScript";
      }

      const wrapper = document.createElement("div");
      wrapper.className =
        "my-10 code-window rounded-2xl overflow-hidden border border-ctp-surface0 shadow-2xl bg-ctp-base";

      wrapper.innerHTML = `
        <div class="flex items-center justify-between px-5 py-3 bg-ctp-crust border-b border-ctp-surface0">
          <span class="text-xs font-mono text-ctp-overlay1">${lang}</span>
          <div class="flex items-center gap-3">
            <button class="copy-btn flex items-center gap-1.5 text-xs font-mono text-ctp-overlay1 hover:text-ctp-green transition-colors duration-150 select-none">
              <span class="material-symbols-outlined copy-icon" style="font-size:15px;font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 20">content_copy</span>
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

      const btn = wrapper.querySelector(".copy-btn");
      const label = btn.querySelector(".copy-label");
      const icon = btn.querySelector(".copy-icon");

      btn.addEventListener("click", async () => {
        const code = wrapper.querySelector("pre code").innerText;
        try {
          await navigator.clipboard.writeText(code);
          icon.textContent = "check";
          icon.style.fontVariationSettings =
            "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20";
          label.textContent = "copied!";
          btn.style.color = "#a6e3a1";
          setTimeout(() => {
            icon.textContent = "content_copy";
            icon.style.fontVariationSettings =
              "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 20";
            label.textContent = "copy";
            btn.style.color = "";
          }, 2000);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = code;
          ta.style.cssText = "position:fixed;opacity:0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          label.textContent = "copied!";
          setTimeout(() => {
            label.textContent = "copy";
          }, 2000);
        }
      });
    });
  }, 10);
});
