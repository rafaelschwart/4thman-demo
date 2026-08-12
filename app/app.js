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
  if (reduced) { const gv = $("#gate-photo video"); if (gv) { gv.removeAttribute("autoplay"); gv.pause(); } }
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
    const els = $$(".v-stagger", view);
    const fold = window.innerHeight + 80;
    const above = els.filter((el) => el.getBoundingClientRect().top < fold);
    const below = els.filter((el) => el.getBoundingClientRect().top >= fold);
    anime({ targets: above, opacity: [0, 1], translateY: [16, 0],
      duration: D(480), delay: anime.stagger(D(42)), easing: "easeOutQuart" });
    if (below.length) {
      if (reduced) { below.forEach((el) => (el.style.opacity = 1)); }
      else {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              anime({ targets: en.target, opacity: [0, 1], translateY: [18, 0], duration: 520, easing: "easeOutQuart" });
              io.unobserve(en.target);
            }
          });
        }, { rootMargin: "0px 0px -8% 0px" });
        below.forEach((el) => io.observe(el));
      }
    }

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

  /* ---------- walk-through steps (addressed to Cayman) ---------- */
  const WT_STEPS = [
    { eyebrow: "WELCOME", title: "Twelve years of coaching, one login",
      body: "Everything you already do over WhatsApp — the plans, the check-ins, the habit reminders, the payment chasing — lives in one system that carries your name, your pillars, and your standard. This tour walks you through it exactly the way a client will experience it.",
      cta: "Start at the sign-in", href: "#/today", media: { img: "assets/post-C9U3l8gOpmm.jpg" }, tryIt: "Spiritual strength. Mental fortitude. Physical fitness. Your words, on the front door." },
    { eyebrow: "THE DAILY SIX", title: "Your differentiator becomes measurable",
      body: "Hydration, Bible, Prayer, Meditation, Reading, Training — the six habits you teach, counted instead of remembered. A client opens the app on a Tuesday morning and knows exactly what to do; Training checks itself when the session ends, and you see everyone's streaks without asking for screenshots.",
      cta: "Open Today", href: "#/today", media: { img: "assets/gen-bench.png", vid: "assets/gen2-bench.mp4" }, tryIt: "Try it: tap a habit tile — the streak reacts instantly." },
    { eyebrow: "PROGRAMS", title: "Five programs, built like a year of coaching",
      body: "Foundations of Iron, The Fourth Man Protocol, Furnace Conditioning, Iron Sharpens Iron, Steward the Temple. Four-week blocks, each week with its own focus, description, and demonstration video. Build a program once — every client gets assigned it, nothing retyped by hand ever again.",
      cta: "Browse programs", href: "#/programs", media: { img: "assets/gen2-partner.png", vid: "assets/wk-deadlift.mp4" }, tryIt: "Open any program and tap the week tabs — every week is different." },
    { eyebrow: "GUIDED WORKOUT", title: "The app walks them through every rep",
      body: "Start a session and it leads exercise by exercise — a form video for each movement, the coaching cue in your voice, set logging, and rest countdowns between rounds. Finish the last exercise and the Training habit checks itself, the streak advances, and the next day is queued.",
      cta: "Start a guided session", href: "#/workout/foundations/1", media: { img: "assets/ex-goblet-squat.png", vid: "assets/ex-goblet-squat.mp4" }, tryIt: "Every one of the 83 exercises has its own video. All of it swaps for your footage in production." },
    { eyebrow: "LOGBOOK", title: "Every set, remembered",
      body: "Weights, reps, and completions are recorded per session, per exercise, per round — the receipts of the work. When a client says it's not working, the logbook says whether they worked. That conversation changes everything.",
      cta: "Open a logbook", href: "#/logbook/foundations/1", media: { img: "assets/ex-deadlift.png", vid: "assets/ex-barbell-row.mp4" }, tryIt: "Complete a session in the tour and come back — your numbers will be here." },
    { eyebrow: "PROGRESS", title: "Six months of work on one screen",
      body: "Personal records, weekly volume, consistency percentage, and the private photo timeline — the story that today lives buried in chat history. Visible progress is what makes a man renew in month four.",
      cta: "See Progress", href: "#/progress", media: { img: "assets/gen2-progress-4.png" }, tryIt: "Photos are private by default — visible only to the client and to you, encrypted at rest." },
    { eyebrow: "OVERVIEW & PLANNER", title: "Plan a client's whole year in one screen",
      body: "The week's schedule, the current block, and the rest of the year laid out in four-week blocks — strength, engine, strength, recovery. You review every plan; the system holds it. No more rebuilding the calendar every month.",
      cta: "Open Overview", href: "#/overview", media: { img: "assets/gen2-walk.png", vid: "assets/wk-incline.mp4" }, tryIt: "Tap an open month and assign a program — it sticks." },
    { eyebrow: "NUTRITION · PHASE 2", title: "Meals that match the training",
      body: "Macro targets from your plan, daily meal logging, hydration tied to the Daily Six, and a recipe library with dietary filters, method steps, and full nutrition tables. Phase two — shown here so you can see where this goes.",
      cta: "Open Nutrition", href: "#/nutrition", media: { img: "assets/food-salmon.png" }, tryIt: "Open a recipe: servings stepper, shopping list, the works." },
    { eyebrow: "COMMUNITY · PHASE 2", title: "A band of brothers, not a feed",
      body: "Amens instead of likes. A prayer wall instead of comments. Your pinned word at the top of the week. The WhatsApp group grows into a place with your standard on it — and the human conversation stays yours.",
      cta: "See the Community", href: "#/community", media: { img: "assets/gen2-community-3.png" }, tryIt: "Tap 'Pray for this' on the wall." },
    { eyebrow: "BLOOD PANEL · PHASE 2", title: "Track what the work does inside",
      body: "Clients upload their own lab PDFs; the dashboard turns them into trends — testosterone, lipids, inflammation, recovery — against optimal ranges. Nothing connects to a lab, nothing leaves the vault. Get tested anywhere, see the direction here.",
      cta: "Open the Blood Panel", href: "#/blood", media: { img: "assets/gen2-fast.png" }, tryIt: "Twelve markers, four categories, one honest picture." },
    { eyebrow: "THE COACH SIDE", title: "Who is slipping — before they cancel",
      body: "Your dashboard sorts slipping-first: compliance, last session, streaks, payment status. Today you learn a client drifted when he cancels; here you see it on day three and send one message. That is retention, and retention is the business.",
      cta: "Open the Coach dashboard", href: "#/coach", media: { img: "assets/gen2-community-2.png" }, tryIt: "Billing runs on Stripe on the web — $97 and $147 renew without you asking, and no app store takes 30%." },
    { eyebrow: "WHAT HAPPENS NEXT", title: "Four weeks from yes to live",
      body: "Everything you just toured is Phase 1 scope: one login, the Daily Six, programs, guided sessions, logbook, progress, photos, and Stripe subscriptions — live in four weeks. Phase 2 (community, nutrition, blood panel, partners, store) gets quoted when Phase 1 is live and earning. Confirm, send the brand kit and Stripe access, and week one begins.",
      cta: "Back to the beginning", href: "#/today", media: { img: "assets/logo.png", contain: true }, tryIt: "Your method. Your clients. Your platform." },
  ];

  /* ---------- per-view interactions ---------- */
  function wire(key, param) {
    if (key === "overview") {
      /* ---- month calendar ---- */
      const CAL = [
        { m: "AUG", y: 2026, mi: 7 }, { m: "SEP", y: 2026, mi: 8 }, { m: "OCT", y: 2026, mi: 9 },
        { m: "NOV", y: 2026, mi: 10 }, { m: "DEC", y: 2026, mi: 11 },
      ];
      const SHORT = (t) => t.replace("Strength & conditioning: ", "").replace("High-intensity cardio", "HIIT")
        .replace("Long walk + audio devotional", "Walk").replace(" and Mobility", "").slice(0, 14);
      const renderCal = (mKey) => {
        const mo = CAL.find((x) => x.m === mKey);
        const pid2 = mKey === "AUG" ? "foundations" : FMY.load()[mKey];
        const p2 = pid2 ? PROGRAMS[pid2] : null;
        const daysIn = new Date(mo.y, mo.mi + 1, 0).getDate();
        const startDow = (new Date(mo.y, mo.mi, 1).getDay() + 6) % 7; // Mon = 0
        const cells = [];
        for (let b = 0; b < startDow; b++) cells.push('<div></div>');
        for (let dt = 1; dt <= daysIn; dt++) {
          const dow = (startDow + dt - 1) % 7;
          const sess = p2 && dow < p2.days.length ? p2.days[dow] : null;
          const isToday = mKey === "AUG" && dt === 12;
          let state = "rest", link = "", label = sess ? SHORT(sess.t) : (dow === 6 ? "Sabbath" : "Rest");
          if (!p2) { state = "unplanned"; label = ""; }
          else if (sess) {
            if (mKey === "AUG") {
              const wkDay = dt - 9; // Aug 10 = week-3 day 1
              if (dt < 10) state = "done";
              else if (wkDay >= 1 && wkDay <= p2.days.length) {
                if (FMP.done("foundations").includes(wkDay)) state = "done";
                else if (wkDay === FMP.next("foundations")) state = "next";
                else state = "sched";
                link = "#/session/foundations/" + wkDay;
              } else state = "sched";
            } else state = "sched";
          }
          const base = "relative rounded-lg p-1.5 text-left overflow-hidden min-h-[58px] border ";
          const cls = state === "done" ? base + "bg-iron border-ember/40"
            : state === "next" ? base + "bg-iron border-ember"
            : state === "sched" ? base + "bg-iron border-whisper"
            : state === "unplanned" ? base + "border-whisper opacity-40"
            : base + "border-whisper opacity-50";
          const inner = `
            <p class="font-mono text-[10px] ${isToday ? "text-ember font-bold" : "text-ash"} text-right">${dt}${isToday ? " ·" : ""}</p>
            ${label ? `<p class="text-[10px] leading-tight mt-0.5 ${state === "rest" ? "text-ash" : ""}">${label}</p>` : ""}
            ${state === "done" ? '<span class="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-ember"></span>' : ""}
            ${state === "next" ? '<span class="absolute bottom-1 left-1.5 font-mono text-[8px] tracking-widest text-ember">NEXT</span>' : ""}`;
          cells.push(link
            ? `<a href="${link}" class="${cls} hover:bg-forged block">${inner}</a>`
            : `<div class="${cls}">${inner}</div>`);
        }
        $("#cal-grid").innerHTML = cells.join("") + (p2 ? "" :
          `<div class="col-span-7 -mt-1 border border-dashed rounded-lg p-4 text-center text-sm text-ash" style="border-color:var(--c-whisper)">No block planned for ${mKey} yet — assign one in the year planner below.</div>`);
        anime({ targets: "#cal-grid > *", opacity: [0, 1], duration: D(240), delay: anime.stagger(D(6)), easing: "easeOutQuad" });
      };
      $$(".cal-tab", view).forEach((t) => t.addEventListener("click", () => {
        $$(".cal-tab", view).forEach((x) => x.className = x.className.replace("border-ember text-ember", "border-whisper text-ash"));
        t.className = t.className.replace("border-whisper text-ash", "border-ember text-ember");
        renderCal(t.dataset.m);
      }));
      renderCal("AUG");

      let activeMonth = null;
      const openPicker = (m) => {
        activeMonth = m;
        $("#yr-picker-month").textContent = m;
        const pk = $("#yr-picker");
        pk.classList.remove("hidden");
        anime({ targets: pk, opacity: [0, 1], translateY: [-8, 0], duration: D(260), easing: "easeOutQuart" });
        pk.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
      };
      const summary = () => {
        const plan = FMY.load();
        const n = Object.keys(plan).length;
        const wks = 4 + Object.values(plan).reduce((a, id) => a + (PROGRAMS[id] ? PROGRAMS[id].weeks : 0), 0);
        $("#yr-summary").textContent = (n + 1) + " BLOCKS PLANNED · " + wks + " WEEKS";
      };
      $$(".yr-slot", view).forEach((b) => b.addEventListener("click", () => openPicker(b.dataset.m)));
      $$(".yr-pick", view).forEach((b) => b.addEventListener("click", () => {
        if (!activeMonth) return;
        FMY.set(activeMonth, b.dataset.pick || null);
        const slot = $('.yr-slot[data-m="' + activeMonth + '"]', view);
        const pid2 = b.dataset.pick, pp = pid2 ? PROGRAMS[pid2] : null;
        slot.innerHTML = pp ? `
        <div class="h-20 overflow-hidden relative"><img src="${pp.cover}" alt="" class="ig-img"/>
          <span class="absolute top-2 left-2 font-mono text-[9px] tracking-widest text-bone rounded px-1.5 py-0.5" style="background:rgba(12,12,14,.72)">${activeMonth}</span></div>
        <div class="p-3"><p class="text-xs font-semibold leading-snug mb-1">${pp.name}</p><p class="font-mono text-[10px] text-ash">${pp.weeks} WEEKS · ${pp.tag}</p></div>` : `
        <div class="h-20 flex items-center justify-center relative">
          <span class="absolute top-2 left-2 font-mono text-[9px] tracking-widest text-ash rounded px-1.5 py-0.5 bg-forged">${activeMonth}</span>
          <span class="material-symbols-outlined text-ash">add</span>
        </div>
        <div class="p-3"><p class="text-xs text-ash">Plan this block</p></div>`;
        anime({ targets: slot, scale: [0.96, 1], opacity: [0.6, 1], duration: D(300), easing: "easeOutQuart" });
        $("#yr-picker").classList.add("hidden");
        activeMonth = null;
        summary();
      }));
      summary();
    }

    if (key === "walkthrough") {
      let i = 0;
      const dots = $("#wt-dots");
      dots.innerHTML = WT_STEPS.map((_, n) => `<button class="wt-dot w-2 h-2 rounded-full bg-forged" data-n="${n}" aria-label="Step ${n + 1}"></button>`).join("");
      const renderWT = () => {
        const st = WT_STEPS[i];
        $("#wt-count").textContent = "STEP " + (i + 1) + " OF " + WT_STEPS.length;
        anime({ targets: "#wt-bar", width: ((i + 1) / WT_STEPS.length * 100) + "%", duration: D(300), easing: "easeOutQuart" });
        $("#wt-media").innerHTML = st.media.vid
          ? `<video src="${st.media.vid}" poster="${st.media.img}" autoplay loop muted playsinline class="ig-img"></video>`
          : `<img src="${st.media.img}" alt="" class="${st.media.contain ? "" : "kenburns "}ig-img" style="${st.media.contain ? "object-fit:contain;padding:3rem;background:#0c0c0e" : ""}"/>`;
        if (reduced) { const v = $("#wt-media video"); if (v) { v.removeAttribute("autoplay"); v.pause(); } }
        $("#wt-eyebrow").textContent = st.eyebrow;
        $("#wt-title").textContent = st.title;
        $("#wt-body").textContent = st.body;
        $("#wt-cta").textContent = st.cta;
        $("#wt-cta").setAttribute("href", st.href);
        $("#wt-try").textContent = st.tryIt;
        $("#wt-prev").style.visibility = i === 0 ? "hidden" : "visible";
        $("#wt-next").textContent = i === WT_STEPS.length - 1 ? "Finish tour" : "Next";
        $$(".wt-dot", view).forEach((d, n) => { d.className = "wt-dot w-2 h-2 rounded-full " + (n === i ? "bg-ember" : "bg-forged"); });
        anime({ targets: ["#wt-media", "#wt-eyebrow", "#wt-title", "#wt-body"], opacity: [0, 1], translateY: [10, 0],
          duration: D(320), delay: anime.stagger(D(45)), easing: "easeOutQuart" });
      };
      $("#wt-next").addEventListener("click", () => { if (i < WT_STEPS.length - 1) { i++; renderWT(); } else location.hash = "#/today"; });
      $("#wt-prev").addEventListener("click", () => { if (i > 0) { i--; renderWT(); } });
      $$(".wt-dot", view).forEach((d) => d.addEventListener("click", () => { i = parseInt(d.dataset.n); renderWT(); }));
      renderWT();
    }

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
      $$(".ex-row", view).forEach((r) => {
        const head = r.querySelector('[role="button"]') || r;
        const toggle = () => {
        const tip = r.querySelector(".ex-tip"), chev = r.querySelector(".ex-chev");
        const vid = tip.querySelector("video");
        const opening = tip.classList.contains("hidden");
        head.setAttribute("aria-expanded", opening ? "true" : "false");
        tip.classList.toggle("hidden");
        // form videos decode only while their row is open (perf + interruptible)
        if (vid) { if (opening && !reduced) vid.play().catch(() => {}); else vid.pause(); }
        if (chev) anime({ targets: chev, rotate: opening ? 180 : 0, duration: D(250), easing: "easeOutQuart" });
        if (opening) anime({ targets: tip, opacity: [0, 1], translateY: [-6, 0], duration: D(260), easing: "easeOutQuart" });
        };
        head.addEventListener("click", toggle);
        head.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); toggle(); } });
      });
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
      const root = $("#wo-root");
      if (!root) return;
      const pid = root.dataset.pid, day = parseInt(root.dataset.day);
      const steps = flatWorkout(pid, day - 1);
      let i = 0, restT = null;
      const parseRest = (t) => { const [m, sec] = t.split(":").map(Number); return m * 60 + sec; };
      const closeRestW = () => {
        clearInterval(restT);
        const sh = $("#wo-rest");
        if (!sh || sh.classList.contains("hidden")) return;
        anime({ targets: sh, translateY: ["0%", "100%"], duration: D(260), easing: "easeInQuad",
          complete: () => sh.classList.add("hidden") });
      };
      const openRestW = (t) => {
        const sh = $("#wo-rest");
        sh.classList.remove("hidden");
        anime({ targets: sh, translateY: ["100%", "0%"], duration: D(380), easing: "easeOutQuart" });
        let sec = parseRest(t);
        $("#wo-rest-time").textContent = t;
        clearInterval(restT);
        restT = setInterval(() => {
          sec--;
          $("#wo-rest-time").textContent = Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
          if (sec <= 0) closeRestW();
        }, 1000);
      };
      const renderStep = () => {
        const st = steps[i];
        $("#wo-count").textContent = "EXERCISE " + (i + 1) + " OF " + steps.length;
        anime({ targets: "#wo-bar", width: (i / steps.length * 100) + "%", duration: D(300), easing: "easeOutQuart" });
        $("#wo-block").textContent = st.label;
        const med = exMedia(st.e.n, st.e.k);
        $("#wo-player").innerHTML = med.vid
          ? `<video src="${med.vid}" poster="${med.img}" autoplay loop muted playsinline class="ig-img"></video><span class="dur-chip">FORM VIDEO · 0:05</span>`
          : `<img src="${med.img}" alt="${st.e.n}" class="kenburns ig-img"/><span class="dur-chip">FORM DEMO</span>`;
        if (reduced) { const v = $("#wo-player video"); if (v) { v.removeAttribute("autoplay"); v.pause(); } }
        $("#wo-name").textContent = st.e.n;
        $("#wo-val").textContent = st.e.v;
        $("#wo-cue").textContent = CUES[st.e.k];
        const repBased = /reps$/.test(st.e.v);
        $("#wo-sets").classList.toggle("hidden", !repBased);
        if (repBased) {
          const reps = st.e.v.split(" ")[0].replace("MAX", "12");
          $("#wo-set-rows").innerHTML = [1, 2, 3].map((n) => `
            <div class="grid grid-cols-[48px_1fr_1fr_48px] gap-3 items-center bg-iron border border-whisper rounded-xl px-1 py-2">
              <span class="font-mono text-sm text-center">${n}</span>
              <input value="185" aria-label="Weight set ${n}" class="bg-forged border border-whisper rounded-lg px-3 py-2 font-mono text-sm w-24 focus:border-ember focus:ring-0"/>
              <input value="${reps}" aria-label="Reps set ${n}" class="bg-forged border border-whisper rounded-lg px-3 py-2 font-mono text-sm w-24 focus:border-ember focus:ring-0"/>
              <button class="wo-check w-9 h-9 mx-auto rounded-lg border border-whisper text-ash flex items-center justify-center"><span class="material-symbols-outlined">check</span></button>
            </div>`).join("");
          $$(".wo-check", view).forEach((b) => b.addEventListener("click", () => {
            b.className = "wo-check w-9 h-9 mx-auto rounded-lg bg-ember flex items-center justify-center";
            b.style.color = "var(--c-furnace)";
            anime({ targets: b, scale: [1, 1.12, 1], duration: D(240), easing: "easeOutQuad" });
          }));
        }
        $("#wo-prev").style.visibility = i === 0 ? "hidden" : "visible";
        $("#wo-next").textContent = i === steps.length - 1 ? "Finish session" : "Complete exercise";
        anime({ targets: ["#wo-block", "#wo-player", "#wo-name", "#wo-cue"], opacity: [0, 1], translateY: [10, 0],
          duration: D(300), delay: anime.stagger(D(40)), easing: "easeOutQuart" });
      };
      const finish = () => {
        FMP.mark(pid, day);
        closeRestW();
        $("#wo-live").classList.add("hidden");
        anime({ targets: "#wo-bar", width: "100%", duration: D(300), easing: "easeOutQuart" });
        $("#wo-count").textContent = "COMPLETE";
        const p = PROGRAMS[pid], nx = FMP.next(pid);
        const allDone = FMP.done(pid).length >= p.days.length;
        FML.complete(pid, day);
        $("#wo-done-nav").innerHTML =
          `<a href="#/logbook/${pid}/${day}" class="press border border-whisper rounded-lg px-6 py-3 text-sm hover:bg-forged">Review logbook</a>` +
          `<a href="#/program/${pid}" class="press border border-whisper rounded-lg px-6 py-3 text-sm hover:bg-forged">Back to program</a>` +
          (allDone
            ? `<a href="#/today" class="press bg-ember rounded-lg px-6 py-3 text-sm font-semibold" style="color:var(--c-furnace)">Week complete — back to Today</a>`
            : `<a href="#/session/${pid}/${nx}" class="press bg-ember rounded-lg px-6 py-3 text-sm font-semibold" style="color:var(--c-furnace)">Next: Day ${nx} · ${p.days[nx - 1].t}</a>`);
        const dn = $("#wo-done");
        dn.classList.remove("hidden");
        anime({ targets: dn, opacity: [0, 1], translateY: [16, 0], duration: D(450), easing: "easeOutQuart" });
        pulseStreak(true);
      };
      $("#wo-rest-skip").addEventListener("click", closeRestW);
      const captureLog = () => {
        const st = steps[i];
        if (/reps$/.test(st.e.v)) {
          const sets = [];
          $$("#wo-set-rows > div", view).forEach((rw) => {
            const done = rw.querySelector(".wo-check").classList.contains("bg-ember");
            if (done) {
              const inp = rw.querySelectorAll("input");
              sets.push({ lb: inp[0].value || "0", reps: inp[1].value || "0" });
            }
          });
          FML.log(pid, day, i, sets.length ? { n: st.e.n, sets } : { n: st.e.n, val: st.e.v });
        } else {
          FML.log(pid, day, i, { n: st.e.n, val: st.e.v });
        }
      };
      $("#wo-next").addEventListener("click", () => {
        const st = steps[i];
        captureLog();
        if (i === steps.length - 1) { finish(); return; }
        i++;
        renderStep();
        if (st.rest) openRestW(st.rest);
      });
      $("#wo-prev").addEventListener("click", () => { if (i > 0) { i--; renderStep(); closeRestW(); } });
      renderStep();
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
