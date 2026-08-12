// Wires Stitch-exported nav labels to real demo routes so every screen links up.
(function () {
  var page = location.pathname.split("/").pop() || "index.html";
  var coachCtx = /^coach-|^program-builder/.test(page);

  var routes = {
    "today": "today.html",
    "dashboard": coachCtx ? "coach-dashboard.html" : "today.html",
    "programs": coachCtx ? "program-builder.html" : "programs.html",
    "program": coachCtx ? "program-builder.html" : "programs.html",
    "progress": "progress.html",
    "photos": "photos.html",
    "progress photos": "photos.html",
    "account": "subscription.html",
    "subscription": "subscription.html",
    "billing": "coach-billing.html",
    "weekly review": "weekly-review.html",
    "review": "weekly-review.html",
    "sign in": "today.html",
    "sign out": "signin.html",
    "log out": "signin.html",
    "clients": "coach-dashboard.html",
    "habits": "coach-dashboard.html",
    "messages": "messages.html",
    "community": "prayer-wall.html",
    "prayer wall": "prayer-wall.html",
    "nutrition": "nutrition.html",
    "faith & mind": "faith-mind.html",
    "faith and mind": "faith-mind.html",
    "blood panel": "blood-panel.html",
    "partners": "partner-network.html",
    "partner network": "partner-network.html",
    "store": "store.html",
    "gear": "store.html",
    "4th man gear": "store.html"
  };

  function wire() {
    var links = document.querySelectorAll("a, nav button, aside button, header button");
    links.forEach(function (el) {
      var label = (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      // strip leading icon ligature words from Material Symbols
      var parts = label.split(" ");
      var candidates = [label, parts.slice(1).join(" "), parts.slice(-2).join(" "), parts[parts.length - 1]];
      for (var i = 0; i < candidates.length; i++) {
        var c = candidates[i];
        if (c && routes[c]) {
          var href = routes[c];
          if (el.tagName === "A") {
            el.setAttribute("href", href);
          } else {
            el.addEventListener("click", function (e) { e.preventDefault(); location.href = href; });
            el.style.cursor = "pointer";
          }
          break;
        }
      }
    });

    // Floating index chip for demo navigation
    if (page !== "index.html") {
      var chip = document.createElement("a");
      chip.href = "index.html";
      chip.textContent = "ALL SCREENS";
      chip.style.cssText =
        "position:fixed;bottom:20px;right:20px;z-index:9999;" +
        "font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;" +
        "color:#c99b4a;background:rgba(12,12,14,.85);border:1px solid rgba(201,155,74,.45);" +
        "padding:8px 14px;border-radius:8px;text-decoration:none;backdrop-filter:blur(8px)";
      document.body.appendChild(chip);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
