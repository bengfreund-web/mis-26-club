/*
 * The 26 Club — decrypt gate + renderer (public, safe to publish).
 *
 * The club content is AES-256-GCM encrypted in enc/payload.js. This file asks
 * for the password, derives the key with PBKDF2 (Web Crypto), decrypts the
 * content, and renders it. The password is never stored — a correct one simply
 * decrypts; a wrong one fails to. The decrypted content is cached in
 * sessionStorage so a reload within the same tab doesn't re-prompt.
 */
(function () {
  "use strict";

  var CACHE_KEY = "club26_content";
  var body = document.body;
  var gate = document.getElementById("gate");
  var gateForm = document.getElementById("gate-form");
  var gateInput = document.getElementById("gate-password");
  var gateError = document.getElementById("gate-error");
  var gateBtn = gateForm ? gateForm.querySelector("button") : null;

  /* -------------------------------------------------- base64 -> bytes */
  function b64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  /* -------------------------------------------------- decrypt */
  function deriveAndDecrypt(password, payload) {
    var enc = new TextEncoder();
    var salt = b64ToBytes(payload.salt);
    var iv = b64ToBytes(payload.iv);
    var ct = b64ToBytes(payload.ct);
    return crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"])
      .then(function (baseKey) {
        return crypto.subtle.deriveKey(
          { name: "PBKDF2", salt: salt, iterations: payload.iter, hash: "SHA-256" },
          baseKey,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );
      })
      .then(function (key) {
        return crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, ct);
      })
      .then(function (buf) {
        return JSON.parse(new TextDecoder().decode(buf));
      });
  }

  /* -------------------------------------------------- unlock flow */
  function reveal(content) {
    renderAll(content);
    body.classList.remove("locked");
    if (gate) gate.setAttribute("hidden", "");
    wireReveals();
  }

  // Skip the prompt if we already unlocked this tab
  var cached = null;
  try { cached = sessionStorage.getItem(CACHE_KEY); } catch (e) {}
  if (cached) {
    try { reveal(JSON.parse(cached)); } catch (e) { cached = null; }
  }

  if (!cached) {
    body.classList.add("locked");
    if (gateForm) {
      gateForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (typeof window.CLUB_PAYLOAD === "undefined") {
          gateError.textContent = "Content failed to load. Refresh and try again.";
          return;
        }
        var pw = (gateInput.value || "").trim();
        gateError.textContent = "";
        if (gateBtn) { gateBtn.disabled = true; }
        deriveAndDecrypt(pw, window.CLUB_PAYLOAD)
          .then(function (content) {
            try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(content)); } catch (e2) {}
            reveal(content);
          })
          .catch(function () {
            if (gateBtn) { gateBtn.disabled = false; }
            gateError.textContent = "That password isn't right. Please try again.";
            gate.classList.add("shake");
            gateInput.select();
            setTimeout(function () { gate.classList.remove("shake"); }, 500);
          });
      });
    }
  }

  /* Sign out */
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-signout]") : null;
    if (!t) return;
    e.preventDefault();
    try { sessionStorage.removeItem(CACHE_KEY); } catch (e2) {}
    window.location.reload();
  });

  /* -------------------------------------------------- render helpers */
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

  function renderAll(c) {
    renderImpact(c.impact || []);
    renderPosts(c.posts || []);
    renderVideos(c.videos || []);
  }

  function renderImpact(items) {
    var el = document.getElementById("impact-grid");
    if (!el) return;
    el.innerHTML = items.map(function (s) {
      return '<div class="impact-cell"><div class="num">' + esc(s.num) + '</div>' +
        '<div class="lab">' + esc(s.label) + '</div>' +
        (s.sub ? '<div class="sub">' + esc(s.sub) + '</div>' : '') + '</div>';
    }).join("");
  }

  function renderPosts(items) {
    var el = document.getElementById("feed");
    if (!el) return;
    el.innerHTML = items.map(function (p) {
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

  function renderVideos(items) {
    var el = document.getElementById("video-grid");
    if (!el) return;
    el.innerHTML = items.map(function (v) {
      var parsed = parseVideo(v.url);
      var poster = videoPoster(v, parsed);
      var thumbBg = poster ? '<img src="' + esc(poster) + '" alt="">' : '';
      var playable = parsed ? ' data-embed="' + esc(embedSrc(parsed)) + '"' : '';
      return '<div class="vcard"><div class="vthumb"' + playable + '>' + thumbBg +
        '<div class="play"><span>&#9654;</span></div></div>' +
        '<div class="vmeta"><div class="vt">' + esc(v.title) + '</div>' +
        (v.desc ? '<div class="vd">' + esc(v.desc) + '</div>' : '') + '</div></div>';
    }).join("");

    el.addEventListener("click", function (e) {
      var thumb = e.target.closest(".vthumb");
      if (!thumb || !thumb.getAttribute("data-embed")) return;
      var src = thumb.getAttribute("data-embed");
      thumb.innerHTML = '<iframe src="' + src + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
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
