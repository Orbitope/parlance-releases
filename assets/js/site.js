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

  // Releases list. Fetched client-side from the GitHub API so a new release
  // appears without rebuilding the site — the alternative, baking the list in
  // at build time, would leave this page stale between deploys. Static content
  // around it stands on its own if the request fails.
  var releasesEl = document.getElementById("release-list");
  if (releasesEl && window.fetch) {
    var repo = releasesEl.getAttribute("data-releases-repo");
    var limit = parseInt(releasesEl.getAttribute("data-releases-limit") || "10", 10);
    var status = releasesEl.querySelector(".releases-status");
    // Labels describe what the build actually targets: the macOS dmg is
    // arm64-only and the Windows installer is x64 (electron-builder config).
    var PLATFORMS = [
      { label: "macOS (Apple Silicon)", test: /\.dmg$/i },
      { label: "Windows (x64)", test: /\.exe$/i },
      { label: "Linux (AppImage)", test: /\.AppImage$/i },
      { label: "Linux (.deb)", test: /\.deb$/i },
    ];

    fetch("https://api.github.com/repos/" + repo + "/releases?per_page=" + limit)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (releases) {
        releases = releases.filter(function (r) { return !r.draft; }).slice(0, limit);
        if (!releases.length) {
          status.innerHTML =
            "Couldn't find any releases. " +
            '<a href="https://github.com/' + repo + '/releases">Check GitHub →</a>';
          return;
        }
        releasesEl.innerHTML = releases.map(function (rel) {
          var assets = (rel.assets || []).filter(function (a) {
            return !/\.sha256$/i.test(a.name);
          });
          var links = PLATFORMS.map(function (p) {
            var a = assets.find(function (x) { return p.test.test(x.name); });
            return a
              ? '<a class="release-dl" href="' + a.browser_download_url + '">' + p.label + "</a>"
              : '<span class="release-dl is-missing">' + p.label + "</span>";
          }).join("");
          var when = rel.published_at ? new Date(rel.published_at).toISOString().slice(0, 10) : "";
          return (
            '<div class="release">' +
            '<div class="release-head">' +
            '<h3>' + (rel.name || rel.tag_name) + "</h3>" +
            '<span class="release-date">' + when + (rel.prerelease ? " · pre-release" : "") + "</span>" +
            "</div>" +
            '<div class="release-links">' + links + "</div>" +
            '<p class="release-notes-link"><a href="' + rel.html_url + '">Release notes and checksums →</a></p>' +
            "</div>"
          );
        }).join("");
      })
      .catch(function () {
        status.innerHTML =
          'Couldn\'t load the release list. ' +
          '<a href="https://github.com/' + repo + '/releases">View releases on GitHub →</a>';
      });
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
