/*
 * The 26 Club — members site behavior (simple shared-password version).
 * No dependencies, no build step. Handles the password gate, content
 * rendering, lazy video embeds, and gentle scroll reveals.
 */
(function () {
  "use strict";

  // Declared up top: unlock() (cached-session path below) calls buildSite ->
  // renderGallery before top-level execution reaches these lines, so a `var x = []`
  // initializer further down would reset them AFTER they were populated.
  var galleryItems = [];
  var lbIndex = -1;
  var TABS = ["home", "impact", "whatsnext", "gallery"];
  var tabsReady = false;
  var revealIO = null;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // We drive scroll ourselves (tab switches, roadmap "now") — stop the browser
  // from restoring/overriding scroll on reload or hash navigation.
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}

  var STORAGE_KEY = "club26_unlocked";
  var body = document.body;
  var gate = document.getElementById("gate");
  var gateForm = document.getElementById("gate-form");
  var gateInput = document.getElementById("gate-password");
  var gateError = document.getElementById("gate-error");

  function unlock() {
    body.classList.remove("locked");
    if (gate) gate.setAttribute("hidden", "");
    buildSite();
  }

  var alreadyIn = false;
  try { alreadyIn = sessionStorage.getItem(STORAGE_KEY) === "yes"; } catch (e) {}

  if (alreadyIn) {
    unlock();
  } else {
    body.classList.add("locked");
    if (gateForm) {
      gateForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var pw = (gateInput.value || "").trim();
        if (pw === CLUB_CONFIG.password) {
          try { sessionStorage.setItem(STORAGE_KEY, "yes"); } catch (e2) {}
          unlock();
        } else {
          gateError.textContent = "That password isn't right. Please try again.";
          gate.classList.add("shake");
          gateInput.select();
          setTimeout(function () { gate.classList.remove("shake"); }, 500);
        }
      });
    }
  }

  /* Sign out */
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-signout]") : null;
    if (!t) return;
    e.preventDefault();
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e2) {}
    window.location.reload();
  });

  /* ------------------------------------------------------------ HELPERS */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function parseVideo(url) {
    if (!url) return null;
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return { provider: "youtube", id: m[1] };
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return { provider: "vimeo", id: m[1] };
    return null;
  }
  function videoPoster(v, parsed) {
    if (v.poster) return v.poster;
    if (parsed && parsed.provider === "youtube") return "https://img.youtube.com/vi/" + parsed.id + "/hqdefault.jpg";
    return "";
  }
  function embedSrc(parsed) {
    if (parsed.provider === "youtube") return "https://www.youtube.com/embed/" + parsed.id + "?autoplay=1&rel=0";
    return "https://player.vimeo.com/video/" + parsed.id + "?autoplay=1";
  }

  /* ------------------------------------------------------- RENDER SITE */
  function buildSite() {
    renderList("impact-grid", typeof CLUB_IMPACT !== "undefined" ? CLUB_IMPACT : [], impactCell);
    renderRoadmap();
    renderGallery();
    initReveals();
    initScrollFx();
    initHero();
    initTabs();
  }

  /* ------------------------------------------------------- HERO MONTAGE */
  function initHero() {
    var v = document.getElementById("hero-video");
    var cityEl = document.getElementById("hero-city");
    var noteEl = document.getElementById("hero-note");
    var fb = document.getElementById("hero-fallback");
    if (!v || typeof CLUB_HERO === "undefined" || !CLUB_HERO.segments || !CLUB_HERO.segments.length) return;
    if (noteEl && reduceMotion) { noteEl.textContent = segs0note(); }
    if (reduceMotion) return; // respect reduced motion: keep the still fallback
    function segs0note(){ return (CLUB_HERO.segments[0] && CLUB_HERO.segments[0].note) || ""; }
    var segs = CLUB_HERO.segments, i = 0, timer = null;
    function load(idx) {
      v.classList.remove("show");
      if (cityEl) cityEl.classList.remove("show");
      if (noteEl) noteEl.classList.remove("show");
      v.src = segs[idx].src;
      v.load();
    }
    v.addEventListener("loadedmetadata", function () {
      var s = segs[i];
      try { v.currentTime = s.start || 0; } catch (e) {}
    });
    v.addEventListener("playing", function () {
      v.classList.add("show");
      if (fb) fb.classList.add("hide");
      if (cityEl) { cityEl.textContent = segs[i].city || ""; cityEl.classList.add("show"); }
      if (noteEl) { noteEl.textContent = segs[i].note || ""; noteEl.classList.add("show"); }
      clearTimeout(timer);
      timer = setTimeout(next, (segs[i].seconds || 6) * 1000);
    });
    v.addEventListener("ended", next);
    v.addEventListener("error", next);
    function next() {
      clearTimeout(timer);
      i = (i + 1) % segs.length;
      load(i);
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    }
    load(0);
    // Show the first city immediately (so the giant text is visible even before
    // the video starts / if autoplay is briefly blocked).
    if (cityEl) { cityEl.textContent = segs[0].city || ""; cityEl.classList.add("show"); }
    if (noteEl) { noteEl.textContent = segs[0].note || ""; noteEl.classList.add("show"); }
    var p = v.play(); if (p && p.catch) p.catch(function () {});
    // If autoplay is blocked, kick it off on the first interaction.
    var kick = function () { var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); };
    ["pointerdown", "touchstart", "keydown", "scroll"].forEach(function (ev) {
      window.addEventListener(ev, kick, { once: true, passive: true });
    });
  }

  /* ------------------------------------------------------- ROADMAP */
  function rmItem(r, i) {
    var side = (i % 2 === 0) ? "left" : "right";
    var logos = (r.logos || []).map(function (name) {
      return '<span class="rm-logo" data-name="' + esc(name) + '">' +
        '<img src="images/logos/' + esc(name) + '.svg" alt="' + esc(name) + '" ' +
        'onerror="this.style.display=\'none\';this.parentNode.classList.add(\'ph\')"></span>';
    }).join("");
    return '<div class="rm-item ' + side + " " + esc(r.phase) + " reveal " + (side === "left" ? "reveal-l" : "reveal-r") + '">' +
      '<span class="rm-node"></span>' +
      '<div class="rm-card">' +
        '<div class="rm-when">' + esc(r.when) + (r.place ? ' &middot; ' + esc(r.place) : "") + '</div>' +
        (logos ? '<div class="rm-logos">' + logos + '</div>' : '') +
        '<div class="rm-title">' + esc(r.title) + '</div>' +
      '</div>' +
    '</div>';
  }
  function renderRoadmap() {
    var el = document.getElementById("roadmap");
    if (!el || typeof CLUB_ROADMAP === "undefined") return;
    var past = CLUB_ROADMAP.filter(function (r) { return r.phase === "past"; });
    var future = CLUB_ROADMAP.filter(function (r) { return r.phase !== "past"; });
    var html = "", idx = 0;
    past.forEach(function (r) { html += rmItem(r, idx++); });
    html += '<div class="rm-now" id="rm-now"><span class="rm-now-dot"></span><span class="rm-now-label">You are here</span></div>';
    future.forEach(function (r) { html += rmItem(r, idx++); });
    el.innerHTML = html;
  }

  /* ------------------------------------------------------- TABS */
  function showTab(name) {
    if (TABS.indexOf(name) === -1) name = "featured";
    var active = null;
    document.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === name;
      p.classList.toggle("active", on);
      if (on) active = p;
    });
    document.querySelectorAll(".navlinks a[data-tab], .mobile-tabs a[data-tab]").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-tab") === name);
    });
    if (name === "whatsnext") {
      // land "frozen" on NOW — history above (scroll up), future below (scroll down).
      // Defer past the browser's native hash jump with a double rAF.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var now = document.getElementById("rm-now");
          if (!now) { window.scrollTo(0, 0); return; }
          var y = now.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo(0, Math.max(0, y));
        });
      });
    } else {
      window.scrollTo(0, 0);
    }
    rearmReveals(active);
  }
  function tabFromHash() {
    showTab((location.hash || "").replace("#", "") || "featured");
  }
  function initTabs() {
    if (tabsReady) { tabFromHash(); return; }
    tabsReady = true;
    window.addEventListener("hashchange", tabFromHash);
    tabFromHash();
  }

  /* Scroll to top (footer control) without changing the tab */
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-top]")) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  });

  /* ------------------------------------------------------- FEATURED */
  function renderFeatured() {
    renderTiles("featured-grid", typeof CLUB_FEATURED !== "undefined" ? CLUB_FEATURED : []);
    renderTiles("films-grid", typeof CLUB_FILMS !== "undefined" ? CLUB_FILMS : []);
  }
  function renderTiles(gridId, arr) {
    var el = document.getElementById(gridId);
    if (!el || !arr) return;
    el.innerHTML = arr.map(function (f, i) {
      var poster = f.poster ? '<img loading="lazy" src="' + esc(f.poster) + '" alt="">' : '';
      var idx = '<span class="feat-index">' + ("0" + (i + 1)).slice(-2) + '</span>';
      var play = f.video ? '<span class="feat-play" aria-hidden="true">&#9654;</span>' : '';
      var cta = f.video ? '' : '<span class="go">Open</span>';
      var body = '<span class="feat-body">' +
          '<span class="feat-kicker">' + esc(f.kicker || "") + '</span>' +
          '<span class="feat-title">' + esc(f.title || "") + '</span>' +
          (f.desc ? '<span class="feat-desc">' + esc(f.desc) + '</span>' : '') + cta +
        '</span>';
      var cls = "feat-item" + (f.primary ? " feat-primary" : "");
      if (f.video) {
        return '<button class="' + cls + '" type="button" data-video="' + esc(f.video) + '">' + poster + idx + play + body + '</button>';
      }
      return '<a class="' + cls + '" href="' + esc(f.href || "#") + '">' + poster + idx + body + '</a>';
    }).join("");
  }

  /* ------------------------------------------------------- GALLERY + LIGHTBOX */
  function galleryTile(it, i) {
    if (it.type === "video") {
      var bg = it.poster ? '<img loading="lazy" src="' + esc(it.poster) + '" alt="">' : '';
      return '<button class="g-item g-video" data-i="' + i + '" type="button" aria-label="Play video">' +
        bg + '<span class="g-play"><span>&#9654;</span></span></button>';
    }
    return '<button class="g-item" data-i="' + i + '" type="button" aria-label="Open photo">' +
      '<img loading="lazy" src="' + esc(it.src) + '" alt=""></button>';
  }
  function renderGallery() {
    var host = document.getElementById("galleries");
    if (!host || typeof CLUB_GALLERIES === "undefined") return;
    galleryItems = [];
    host.innerHTML = CLUB_GALLERIES.map(function (g) {
      var tiles = (g.items || []).map(function (it) {
        var i = galleryItems.length;
        galleryItems.push(it);
        return galleryTile(it, i);
      }).join("");
      return '<div class="gallery-block">' +
        '<div class="section-head center reveal"><div class="mono-label center">Trip</div>' +
          '<div class="h2">' + esc(g.title) + '</div>' +
          (g.caption ? '<p>' + esc(g.caption) + '</p>' : '') + '</div>' +
        '<div class="gallery reveal stagger">' + tiles + '</div>' +
      '</div>';
    }).join("");
  }

  function setNav(show) {
    var p = document.getElementById("lb-prev"), n = document.getElementById("lb-next");
    if (p) p.hidden = !show;
    if (n) n.hidden = !show;
  }
  function showStage(html) {
    var lb = document.getElementById("lightbox");
    var stage = document.getElementById("lb-stage");
    if (!lb || !stage) return;
    stage.innerHTML = html;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function openLightbox(i) {
    if (!galleryItems[i]) return;
    lbIndex = i;
    var it = galleryItems[i];
    setNav(galleryItems.length > 1);
    if (it.type === "video") {
      showStage('<video src="' + esc(it.src) + '" controls autoplay playsinline preload="metadata"' +
        (it.poster ? ' poster="' + esc(it.poster) + '"' : '') + '></video>');
    } else {
      showStage('<img src="' + esc(it.src) + '" alt="">');
    }
  }
  function openSingleVideo(src, poster) {
    lbIndex = -1;
    setNav(false);
    var parsed = parseVideo(src); // YouTube / Vimeo?
    if (parsed) {
      showStage('<iframe src="' + embedSrc(parsed) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>');
    } else {
      showStage('<video src="' + esc(src) + '" controls autoplay playsinline preload="metadata"' +
        (poster ? ' poster="' + esc(poster) + '"' : '') + '></video>');
    }
  }
  function closeLightbox() {
    var lb = document.getElementById("lightbox");
    var stage = document.getElementById("lb-stage");
    if (lb) lb.hidden = true;
    if (stage) stage.innerHTML = "";
    document.body.style.overflow = "";
    lbIndex = -1;
  }
  function stepLightbox(dir) {
    if (lbIndex < 0 || !galleryItems.length) return;
    var n = (lbIndex + dir + galleryItems.length) % galleryItems.length;
    openLightbox(n);
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("#lb-close")) { closeLightbox(); return; }
    if (e.target.closest("#lb-prev")) { e.stopPropagation(); stepLightbox(-1); return; }
    if (e.target.closest("#lb-next")) { e.stopPropagation(); stepLightbox(1); return; }
    var feat = e.target.closest(".feat-item[data-video]");
    if (feat) { e.preventDefault(); openSingleVideo(feat.getAttribute("data-video")); return; }
    var gitem = e.target.closest(".g-item");
    if (gitem) { openLightbox(parseInt(gitem.getAttribute("data-i"), 10)); return; }
    var lb = document.getElementById("lightbox");
    if (lb && !lb.hidden && e.target === lb) closeLightbox(); // click backdrop
  });
  document.addEventListener("keydown", function (e) {
    var lb = document.getElementById("lightbox");
    if (!lb || lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") stepLightbox(-1);
    else if (e.key === "ArrowRight") stepLightbox(1);
  });

  function renderList(id, items, tpl) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(tpl).join("");
  }

  function impactCell(s) {
    return '<div class="impact-cell"><div class="num">' + esc(s.num) + '</div>' +
      '<div class="lab">' + esc(s.label) + '</div>' +
      (s.sub ? '<div class="sub">' + esc(s.sub) + '</div>' : '') + '</div>';
  }

  function benefitCard(b) {
    return '<div class="benefit"><div class="benefit-icon" aria-hidden="true">' + esc(b.icon) + '</div>' +
      '<div class="benefit-title">' + esc(b.title) + '</div>' +
      '<div class="benefit-desc">' + esc(b.desc) + '</div></div>';
  }

  function eventRow(ev) {
    var isUpcoming = (ev.status || "").toLowerCase() === "upcoming";
    var tag = ev.status ? '<span class="ev-status' + (isUpcoming ? " up" : "") + '">' + esc(ev.status) + '</span>' : '';
    return '<div class="ev-row">' +
      '<div class="ev-date">' + esc(ev.date) + '</div>' +
      '<div class="ev-main"><div class="ev-title">' + esc(ev.title) + tag + '</div>' +
        (ev.place ? '<div class="ev-place">' + esc(ev.place) + '</div>' : '') + '</div>' +
    '</div>';
  }

  function renderPosts() {
    var el = document.getElementById("feed");
    if (!el || typeof CLUB_POSTS === "undefined") return;
    el.innerHTML = CLUB_POSTS.map(function (p) {
      var media = p.image ? '<img src="' + esc(p.image) + '" alt="">' : '<div class="ph">&#128247;</div>';
      var tag = p.tag ? '<span class="post-tag">' + esc(p.tag) + '</span>' : '';
      var more = p.link ? '<span class="more">Read more</span>' : '';
      var open = p.link ? '<a class="post" href="' + esc(p.link) + '" target="_blank" rel="noopener">' : '<div class="post">';
      var close = p.link ? '</a>' : '</div>';
      return open +
        '<div class="post-media">' + media + '</div>' +
        '<div class="post-body"><div class="post-meta">' + tag +
          '<span class="post-date">' + esc(p.date) + '</span></div>' +
          '<h3>' + esc(p.title) + '</h3><p>' + esc(p.body) + '</p>' + more +
        '</div>' + close;
    }).join("");
  }

  function renderVideos() {
    var el = document.getElementById("video-grid");
    if (!el || typeof CLUB_VIDEOS === "undefined") return;
    el.innerHTML = CLUB_VIDEOS.map(function (v) {
      // A local/self-hosted file ("file", or a url ending in a video extension)
      var fileSrc = v.file || (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(v.url || "") ? v.url : "");
      var parsed = fileSrc ? null : parseVideo(v.url);
      var poster = v.poster || (parsed ? videoPoster(v, parsed) : "");
      var thumbBg = poster ? '<img src="' + esc(poster) + '" alt="">' : '';
      var attr = fileSrc ? ' data-file="' + esc(fileSrc) + '"'
               : parsed  ? ' data-embed="' + esc(embedSrc(parsed)) + '"' : '';
      return '<div class="vcard"><div class="vthumb"' + attr + '>' + thumbBg +
        '<div class="play"><span>&#9654;</span></div></div>' +
        '<div class="vmeta"><div class="vt">' + esc(v.title) + '</div>' +
        (v.desc ? '<div class="vd">' + esc(v.desc) + '</div>' : '') + '</div></div>';
    }).join("");

    el.addEventListener("click", function (e) {
      var thumb = e.target.closest(".vthumb");
      if (!thumb) return;
      var file = thumb.getAttribute("data-file");
      var embed = thumb.getAttribute("data-embed");
      if (file) {
        thumb.innerHTML = '<video src="' + file + '" controls autoplay playsinline preload="metadata"></video>';
      } else if (embed) {
        thumb.innerHTML = '<iframe src="' + embed + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      } else {
        return;
      }
      thumb.removeAttribute("data-file");
      thumb.removeAttribute("data-embed");
      thumb.style.cursor = "default";
    });
  }

  /* ------------------------------------------------------- MOTION */
  function activateReveal(el) {
    if (el.classList.contains("stagger")) {
      var kids = el.children, n = kids.length;
      for (var i = 0; i < n; i++) {
        kids[i].style.transitionDelay = Math.min(i * 55, 620) + "ms";
      }
    }
    el.classList.add("is-visible");
    if (el.id === "impact-grid") {
      el.querySelectorAll(".num").forEach(countUp);
    }
  }
  function initReveals() {
    var revealables = document.querySelectorAll(".reveal");
    if (!revealables.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { activateReveal(el); });
      return;
    }
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          activateReveal(entry.target);
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { revealIO.observe(el); });
  }
  /* Replay a panel's reveals each time its tab is opened */
  function rearmReveals(panel) {
    if (!panel || reduceMotion || !revealIO) return;
    panel.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.remove("is-visible");
      revealIO.observe(el);
    });
  }

  /* Count-up for the impact numbers */
  function countUp(el) {
    var raw = el.getAttribute("data-raw") || el.textContent;
    el.setAttribute("data-raw", raw);
    var m = raw.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!m) return;
    var prefix = m[1], digits = m[2], suffix = m[3];
    var target = parseInt(digits.replace(/,/g, ""), 10);
    if (isNaN(target)) return;
    if (/^\d{4}$/.test(digits) && target > 1900) { el.textContent = raw; return; } // leave years
    var hasComma = digits.indexOf(",") > -1;
    function fmt(n) { n = Math.round(n); return hasComma ? n.toLocaleString("en-US") : String(n); }
    var dur = 1300, start = null;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(target * e) + suffix;
      if (p < 1) requestAnimationFrame(frame); else el.textContent = raw;
    }
    el.textContent = prefix + fmt(0) + suffix;
    requestAnimationFrame(frame);
  }

  /* Hero parallax + scroll progress + header shadow */
  function initScrollFx() {
    var header = document.querySelector(".siteheader");
    var progress = document.getElementById("scroll-progress");
    var heroBg = document.querySelector(".mhero-bg");
    var ticking = false;
    function onScroll() {
      var y = window.scrollY || window.pageYOffset || 0;
      if (header) header.classList.toggle("scrolled", y > 8);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      }
      if (heroBg && !reduceMotion) {
        heroBg.style.transform = "translate3d(0," + (y * 0.4) + "px,0) scale(1.06)";
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
  }
})();
