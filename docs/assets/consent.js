// Cookie consent for Google Analytics (via Google Tag Manager).
// Consent Mode starts as "denied" in each page's <head>, so nothing is stored
// until the visitor clicks Accept. The choice is kept in localStorage.
(function () {
  var KEY = "glint-consent";
  var TEXT = {
    en: {
      msg: "We use Google Analytics cookies to count visits to this website. The Glint app itself collects nothing.",
      accept: "Accept", decline: "Decline", more: "Privacy"
    },
    tr: {
      msg: "Bu sitenin ziyaretlerini saymak için Google Analytics çerezleri kullanıyoruz. Glint uygulaması hiçbir veri toplamaz.",
      accept: "Kabul et", decline: "Reddet", more: "Gizlilik"
    }
  };

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function gtag() { (window.dataLayer = window.dataLayer || []).push(arguments); }
  function lang() {
    var l = document.documentElement.lang || navigator.language || "en";
    return l.toLowerCase().indexOf("tr") === 0 ? "tr" : "en";
  }

  var bar = null, observer = null;

  function choose(granted) {
    store(granted ? "granted" : "denied");
    gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
    if (!granted) clearCookies();
    hide();
  }

  // Remove Google Analytics cookies left from an earlier "Accept".
  function clearCookies() {
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid") {
        var host = location.hostname;
        ["", host, "." + host].forEach(function (d) {
          document.cookie = name + "=; Max-Age=0; path=/" + (d ? "; domain=" + d : "");
        });
      }
    });
  }

  function render() {
    if (!bar) return;
    var t = TEXT[lang()];
    var privacy = "/privacy.html";
    bar.innerHTML =
      '<p>' + t.msg + ' <a href="' + privacy + '">' + t.more + '</a></p>' +
      '<div><button type="button" data-c="0">' + t.decline + '</button>' +
      '<button type="button" data-c="1" class="ok">' + t.accept + '</button></div>';
    bar.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () { choose(b.getAttribute("data-c") === "1"); };
    });
  }

  function show() {
    if (bar) return;
    var style = document.createElement("style");
    style.textContent =
      "#glint-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:720px;margin:0 auto;" +
      "display:flex;gap:12px 16px;align-items:center;flex-wrap:wrap;padding:14px 16px;border-radius:14px;" +
      "background:rgba(18,20,30,.96);border:1px solid rgba(255,255,255,.1);color:#eef0f7;" +
      "font:14px/1.45 -apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.45);" +
      "-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}" +
      "#glint-consent p{margin:0;flex:1 1 280px;color:#c9cce0}" +
      "#glint-consent a{color:#4fd8c4}" +
      "#glint-consent div{display:flex;gap:8px;margin-left:auto}" +
      "#glint-consent button{font:inherit;font-weight:600;padding:8px 14px;border-radius:9px;cursor:pointer;" +
      "border:1px solid rgba(255,255,255,.14);background:transparent;color:#eef0f7}" +
      "#glint-consent button.ok{background:#4fd8c4;border-color:#4fd8c4;color:#07080d}" +
      "#glint-consent button:focus-visible{outline:2px solid #4fd8c4;outline-offset:2px}";
    document.head.appendChild(style);
    bar = document.createElement("div");
    bar.id = "glint-consent";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Cookie consent");
    document.body.appendChild(bar);
    render();
    // Follow the page's EN/TR switch.
    observer = new MutationObserver(render);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  function hide() {
    if (observer) observer.disconnect();
    if (bar) bar.remove();
    bar = null; observer = null;
  }

  // Lets the privacy page reopen the choice.
  window.glintConsent = {
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} show(); }
  };

  if (!stored()) {
    if (document.body) show();
    else document.addEventListener("DOMContentLoaded", show);
  }
})();
