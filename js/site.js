/*
 * The 26 Club — members site behavior (simple shared-password version).
 * No dependencies, no build step. Handles the password gate, content
 * rendering, lazy video embeds, and gentle scroll reveals.
 */
(function () {
  "use strict";

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
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
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
    renderList("benefit-grid", typeof CLUB_BENEFITS !== "undefined" ? CLUB_BENEFITS : [], benefitCard);
    renderList("events", typeof CLUB_EVENTS !== "undefined" ? CLUB_EVENTS : [], eventRow);
    renderPosts();
    renderVideos();
    wireReveals();
  }

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

  function wireReveals() {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var revealables = document.querySelectorAll(".reveal");
    if (!revealables.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  }
})();
