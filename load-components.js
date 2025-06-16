
// load-components.js
async function loadComponent(selector, file) {
  const el = document.querySelector(selector);
  if (el) {
    const res = await fetch(file);
    const html = await res.text();
    el.innerHTML = html;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadComponent("#status-bar", "../components/status-bar.html");
  loadComponent("#nav-bar", "../components/nav-bar.html");
  if (window.lucide) lucide.createIcons();
});
