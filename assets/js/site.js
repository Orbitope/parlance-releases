// Progressive enhancement only — the site is fully usable without JS.
(function () {
  // Mobile header nav.
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Mobile docs-sidebar disclosure.
  var sidebar = document.getElementById("sidebar");
  if (sidebar) {
    var btn = document.createElement("button");
    btn.className = "sidebar-toggle";
    btn.textContent = "Docs navigation ▾";
    btn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
    sidebar.parentNode.insertBefore(btn, sidebar);
  }

  // Copy buttons on code blocks.
  document.querySelectorAll(".main pre").forEach(function (pre) {
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var code = pre.querySelector("code");
      navigator.clipboard.writeText(code ? code.innerText : pre.innerText).then(function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1200);
      });
    });
    pre.appendChild(btn);
  });
})();
