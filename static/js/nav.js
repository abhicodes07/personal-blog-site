// Mobile hamburger menu toggle
const menuBtn    = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  const icon = menuBtn.querySelector(".material-symbols-outlined");
  icon.textContent = mobileMenu.classList.contains("hidden") ? "menu" : "close";
});
