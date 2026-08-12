/* 4TH MAN — SPA router + anime.js orchestration */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = (ms) => (reduced ? 0 : ms);

  const gate = $("#gate"), shell = $("#shell"), view = $("#view");
  const titleEl = $("#view-title"), phaseTag = $("#phase-tag");
  const forge = $("#forge-line"), marker = $("#nav-marker");
  let streak = 23, habitsDone = 3, restTimer = null;

  /* ---------- dark / light theme ---------- */
  const applyTheme = (light) => {
    document.documentElement.classList.toggle("light", light);
    $$(".theme-ic").forEach((i) => (i.textContent = light ? "dark_mode" : "light_mode"));
    try { localStorage.setItem("fm-theme", light ? "light" : "dark"); } catch (e) {}
  };
  const toggleTheme = (btn) => {
    applyTheme(!document.documentElement.classList.contains("light"));
    if (btn) anime({ targets: btn, rotate: "+=180", duration: D(400), easing: "easeOutQuart" });
    moveMarker();
  };
  applyTheme((function () { try { return localStorage.getItem("fm-theme") === "light"; } catch (e) { return false; } })());
  const tt = $("#theme-toggle"), gt = $("#gate-theme");
  if (tt) tt.addEventListener("click", () => toggleTheme(tt));
  if (gt) gt.addEventListener("click", () => toggleTheme(gt));

  /* ---------- gate entrance ---------- */
  anime.timeline({ easing: "easeOutQuart" })
    .add({ targets: "#g1", opacity: [0, 1], translateY: [14, 0], duration: D(500) })
    .add({ targets: "#g2", opacity: [0, 1], translateY: [22, 0], duration: D(650) }, "-=300")
    .add({ targets: "#g3", opacity: [0, 1], translateY: [14, 0], duration: D(500) }, "-=400")
    .add({ targets: "#g4", opacity: [0, 1], translateX: [24, 0], duration: D(600) }, "-=450");

  $("#enter-btn").addEventListener("click", enterApp);
  function enterApp() {
    anime({
      targets: gate, opacity: [1, 0], translateY: [0, -28], duration: D(450),
      easing: "easeInQuad",
      complete: () => {
        gate.classList.add("hidden");
        shell.classList.remove("hidden");
        if (!location.hash || location.hash === "#/") location.hash = "#/today";
        else render();
      },
    });
  }

  /* ---------- router ---------- */
  const routeOf = () => {
    const parts = (location.hash.replace(/^#\//, "") || "today").split("/");
    return { key: parts[0] || "today", param: parts.slice(1).join("/") || "" };
  };

  window.addEventListener("hashchange", () => {
    if (shell.classList.contains("hidden")) { gate.classList.add("hidden"); shell.classList.remove("hidden"); }
    render();
  });

  function render() {
    const { key, param } = routeOf();
    const v = VIEWS[key] || VIEWS.today;

    // forge line pulse — the ember heat crossing the top on every navigation
    anime.remove(forge);
    forge.style.width = "0%"; forge.style.opacity = 1;
    anime.timeline()
      .add({ targets: forge, width: "70%", duration: D(260), easing: "easeOutQuad" })
      .add({ targets: forge, width: "100%", duration: D(220), easing: "easeOutQuart" })
      .add({ targets: forge, opacity: 0, duration: D(350), delay: 120, easing: "linear" });

    // exit old content fast, then mount
    const mount = () => {
      view.innerHTML = typeof v.html === "function" ? v.html(param) : v.html;
      titleEl.textContent = typeof v.title === "function" ? v.title(param) : v.title;
      phaseTag.classList.toggle("hidden", !v.phase2);
      window.scrollTo(0, 0);
      if (reduced) $$("video", view).forEach((vd) => { vd.removeAttribute("autoplay"); vd.pause(); });
      animateIn();
      wire(key, param);
      moveMarker();
    };
    if (view.childElementCount && !reduced) {
      anime({ targets: view, opacity: [1, 0], translateY: [0, -10], duration: 160, easing: "easeInQuad",
        complete: () => { view.style.opacity = 1; view.style.transform = "none"; mount(); } });
    } else mount();
  }

  /* ---------- entrance choreography ---------- */
  function animateIn() {
    anime({ targets: $$(".v-stagger", view), opacity: [0, 1], translateY: [16, 0],
      duration: D(480), delay: anime.stagger(D(42)), easing: "easeOutQuart" });

    $$(".count", view).forEach((el) => {
      const to = parseFloat(el.dataset.to || "0");
      const o = { n: 0 };
      anime({ targets: o, n: to, duration: D(900), easing: "easeOutQuint", delay: D(200),
        update: () => { el.textContent = Math.round(o.n).toLocaleString("en-US"); } });
    });

    $$(".bar-fill", view).forEach((el) =>
      anime({ targets: el, width: [0, el.dataset.w], duration: D(800), delay: D(300), easing: "easeOutQuart" }));

    $$(".ring-fg", view).forEach((el) => {
      const C = 163.4, pct = parseFloat(el.dataset.pct || 0);
      anime({ targets: el, strokeDashoffset: [C, C * (1 - pct / 100)], duration: D(900), delay: D(250), easing: "easeOutQuart" });
    });

    $$(".vol-bar", view).forEach((el, i) =>
      anime({ targets: el, height: [0, el.dataset.h + "%"], duration: D(700), delay: D(300 + i * 60), easing: "easeOutQuart" }));

    $$(".dot", view).length &&
      anime({ targets: $$(".dot", view), opacity: [0, 1], scale: [0.6, 1],
        duration: D(300), delay: anime.stagger(D(12)), easing: "easeOutQuad" });

    $$(".msg", view).length &&
      anime({ targets: $$(".msg", view), opacity: [0, 1], translateY: [10, 0],
        duration: D(360), delay: anime.stagger(D(90), { start: D(200) }), easing: "easeOutQuart" });
  }

  /* ---------- sidebar marker ---------- */
  function moveMarker() {
    let { key } = routeOf();
    if (key === "program" || key === "session" || key === "logbook") key = "programs";
    if (key === "recipe") key = "recipes";
    $$(".nav-item").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#/" + key));
    const active = $(".nav-item.active");
    if (!active) { marker.style.height = "0"; return; }
    const nav = $("#nav");
    const top = active.getBoundingClientRect().top - nav.getBoundingClientRect().top + nav.scrollTop;
    anime({ targets: marker, top, height: active.offsetHeight, duration: D(350), easing: "easeOutQuart" });
  }

  /* ---------- per-view interactions ---------- */
  function wire(key, param) {
    if (key === "program") {
      const prog = PROGRAMS[param] || PROGRAMS.foundations;
      $$(".wk-tab", view).forEach((tab) => tab.addEventListener("click", () => {
        const w = parseInt(tab.dataset.w);
        $$(".wk-tab", view).forEach((t) => {
          const on = t === tab;
          t.querySelector("span").className =
            "w-9 h-9 rounded-full flex items-center justify-center font-mono text-sm border " +
            (on ? "border-ember text-ember" : "border-whisper text-ash");
          t.querySelectorAll("span")[1].className = "h-0.5 w-9 rounded " + (on ? "bg-ember" : "bg-transparent");
        });
        // unique week content: name, description, focus video
        const wd = prog.weekly[w - 1];
        if (wd) {
          $("#wk-name").textContent = wd.name;
          $("#wk-desc").textContent = wd.desc;
          const vid = $("#wk-video");
          if (vid && vid.getAttribute("src") !== wd.vid) {
            vid.setAttribute("poster", wd.poster);
            vid.setAttribute("src", wd.vid);
            if (!reduced) vid.play().catch(() => {});
          }
          const chip = $("#wk-player .dur-chip");
          if (chip) chip.textContent = "WEEK " + w + " FOCUS · 0:05";
          anime({ targets: ["#wk-name", "#wk-desc", "#wk-player"], opacity: [0, 1], translateY: [10, 0],
            duration: D(360), delay: anime.stagger(D(60)), easing: "easeOutQuart" });
        }
        // progressive overload: session length creeps up week over week
        $$(".day-min", view).forEach((el) => {
          const base = parseInt(el.dataset.base);
          el.textContent = base + Math.round((w - 1) * base * 0.05);
        });
        anime({ targets: $$(".tl-card", view), opacity: [0, 1], translateY: [14, 0],
          duration: D(380), delay: anime.stagger(D(50)), easing: "easeOutQuart" });
      }));
    }

    if (key === "session") {
      $$(".ex-row", view).forEach((r) => r.addEventListener("click", () => {
        const tip = r.querySelector(".ex-tip"), chev = r.querySelector(".ex-chev");
        const vid = tip.querySelector("video");
        const opening = tip.classList.contains("hidden");
        tip.classList.toggle("hidden");
        // form videos decode only while their row is open (perf + interruptible)
        if (vid) { if (opening && !reduced) vid.play().catch(() => {}); else vid.pause(); }
        if (chev) anime({ targets: chev, rotate: opening ? 180 : 0, duration: D(250), easing: "easeOutQuart" });
        if (opening) anime({ targets: tip, opacity: [0, 1], translateY: [-6, 0], duration: D(260), easing: "easeOutQuart" });
      }));
    }

    if (key === "today") {
      $$(".habit-tile", view).forEach((t) => t.addEventListener("click", () => {
        const wasDone = t.classList.contains("done");
        t.classList.toggle("done");
        habitsDone += wasDone ? -1 : 1;
        $("#habit-done").textContent = habitsDone;
        anime({ targets: t, scale: [1, 0.94, 1], duration: D(320), easing: "easeOutQuad" });
        if (!wasDone) pulseStreak();
      }));
    }

    if (key === "workout") {
      const logNext = () => {
        const row = $(".set-row.pending", view);
        if (!row) return;
        row.classList.remove("pending");
        const btn = $(".set-check", row);
        btn.className = "set-check w-9 h-9 mx-auto rounded-lg flex items-center justify-center bg-ember text-furnace";
        anime({ targets: row, backgroundColor: ["rgba(201,155,74,0.18)", "rgba(201,155,74,0)"], duration: D(700), easing: "easeOutQuad",
          complete: () => { row.style.backgroundColor = ""; } });
        openRest();
        if (!$(".set-row.pending", view)) completeTraining();
      };
      $("#log-set").addEventListener("click", logNext);
      $$(".set-check", view).forEach((b) => b.addEventListener("click", logNext));
      $("#rest-btn").addEventListener("click", openRest);
      $("#rest-skip").addEventListener("click", closeRest);
    }

    if (key === "recipes") {
      const applyFilter = () => {
        const q = ($("#r-search").value || "").toLowerCase();
        const active = $(".r-filter.on") ? $(".r-filter.on").dataset.f : "All";
        let n = 0;
        $$(".r-card", view).forEach((c) => {
          const ok = (active === "All" || c.dataset.type === active) && (!q || c.dataset.name.includes(q));
          c.classList.toggle("hidden", !ok);
          if (ok) n++;
        });
        $("#r-count").textContent = n + " RESULTS";
      };
      $$(".r-filter", view).forEach((b, i) => {
        if (i === 0) b.classList.add("on");
        b.addEventListener("click", () => {
          $$(".r-filter", view).forEach((x) => { x.classList.remove("on");
            x.className = x.className.replace("border-ember text-ember", "border-whisper text-ash"); });
          b.classList.add("on");
          b.className = b.className.replace("border-whisper text-ash", "border-ember text-ember");
          applyFilter();
        });
      });
      $("#r-search").addEventListener("input", applyFilter);
    }

    if (key === "recipe") {
      const sv = $("#sv-count");
      const bump = (d) => {
        const v = Math.max(1, parseInt(sv.textContent) + d);
        sv.textContent = v;
        anime({ targets: sv, scale: [1, 1.15, 1], duration: D(220), easing: "easeOutQuad" });
      };
      $("#sv-minus").addEventListener("click", () => bump(-1));
      $("#sv-plus").addEventListener("click", () => bump(1));
      $("#add-list").addEventListener("click", (e) => flash(e.currentTarget, "ADDED TO SHOPPING LIST"));
      $("#mark-done").addEventListener("click", (e) => {
        const b = e.currentTarget;
        b.classList.toggle("bg-forged");
        b.classList.toggle("text-ember");
        anime({ targets: b, scale: [1, 0.98, 1], duration: D(220), easing: "easeOutQuad" });
      });
    }

    if (key === "messages") {
      const send = () => {
        const i = $("#msg-in"); if (!i.value.trim()) return;
        const t = $("#thread");
        const w = document.createElement("div");
        w.className = "max-w-md ml-auto";
        w.innerHTML = `<div class="bg-ember/15 border border-ember/25 rounded-xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed"></div>
                       <p class="font-mono text-[10px] text-ash mt-1 text-right">NOW</p>`;
        w.firstElementChild.textContent = i.value;
        t.appendChild(w); i.value = "";
        anime({ targets: w, opacity: [0, 1], translateY: [12, 0], duration: D(320), easing: "easeOutQuart" });
        t.scrollTop = t.scrollHeight;
      };
      $("#msg-send").addEventListener("click", send);
      $("#msg-in").addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
    }

    if (key === "partners") {
      $$(".slot", view).forEach((b) => b.addEventListener("click", () => {
        $$(".slot", view).forEach((x) => (x.className = "slot press rounded-lg py-2 font-mono text-xs bg-forged border border-whisper"));
        b.className = "slot press rounded-lg py-2 font-mono text-xs bg-ember text-furnace font-semibold";
        anime({ targets: b, scale: [1, 1.06, 1], duration: D(260), easing: "easeOutQuad" });
      }));
      $("#confirm-booking").addEventListener("click", (e) => flash(e.currentTarget, "Booked — Thu 2:30 PM"));
    }

    if (key === "gear") {
      $$(".size", view).forEach((b) => b.addEventListener("click", () => {
        $$(".size", b.parentElement).forEach((x) => (x.className = "size press border border-whisper text-ash rounded px-2 py-1 font-mono text-[11px]"));
        b.className = "size press border border-ember text-ember rounded px-2 py-1 font-mono text-[11px]";
      }));
      $$(".add-cart", view).forEach((b) => b.addEventListener("click", () => flash(b, "Added")));
    }

    if (key === "community") {
      $$(".pray-btn", view).forEach((b) => b.addEventListener("click", () => {
        const c = $("span", b); c.textContent = parseInt(c.textContent) + 1;
        b.classList.add("border-ember/50", "text-ember");
        anime({ targets: b, scale: [1, 1.05, 1], duration: D(260), easing: "easeOutQuad" });
      }));
    }
  }

  /* ---------- workout helpers ---------- */
  function openRest() {
    const s = $("#rest-sheet"); if (!s) return;
    s.classList.remove("hidden");
    anime({ targets: s, translateY: ["100%", "0%"], duration: D(420), easing: "easeOutQuart" });
    let t = 90;
    clearInterval(restTimer);
    const el = $("#rest-time");
    el.textContent = "1:30";
    restTimer = setInterval(() => {
      t -= 1;
      el.textContent = Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0");
      if (t <= 0) closeRest();
    }, 1000);
  }
  function closeRest() {
    const s = $("#rest-sheet"); if (!s) return;
    clearInterval(restTimer);
    anime({ targets: s, translateY: ["0%", "100%"], duration: D(300), easing: "easeInQuad",
      complete: () => s.classList.add("hidden") });
  }
  function completeTraining() {
    pulseStreak(true);
    flash($("#log-set"), "Session complete — Training habit checked");
  }

  /* ---------- shared micro-feedback ---------- */
  function pulseStreak(increment) {
    const el = $("#streak-count");
    if (increment) { streak += 1; el.textContent = streak; }
    anime({ targets: el.parentElement, scale: [1, 1.18, 1], duration: D(420), easing: "easeOutQuad" });
  }
  function flash(btn, text) {
    if (!btn || btn.dataset.busy) return;
    btn.dataset.busy = "1";
    const old = btn.textContent;
    btn.textContent = text;
    anime({ targets: btn, scale: [1, 0.97, 1], duration: D(240), easing: "easeOutQuad" });
    setTimeout(() => { btn.textContent = old; delete btn.dataset.busy; }, 1600);
  }

  /* ---------- sign out ---------- */
  $("#signout").addEventListener("click", () => {
    shell.classList.add("hidden");
    gate.classList.remove("hidden");
    gate.style.opacity = 0; gate.style.transform = "none";
    history.replaceState(null, "", location.pathname);
    anime({ targets: gate, opacity: [0, 1], duration: D(400), easing: "easeOutQuad" });
  });

  /* deep link straight into a view (skip gate) */
  if (location.hash && location.hash !== "#/") {
    gate.classList.add("hidden");
    shell.classList.remove("hidden");
    render();
  }
})();
