(function () {
  "use strict";

  // ---- Theme (persisted) ----
  var root = document.documentElement;
  var btn = document.getElementById("themeToggle");
  var label = document.getElementById("themeLabel");

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    label.textContent = t === "dark" ? "Light mode" : "Dark mode";
  }
  var stored = null;
  try { stored = localStorage.getItem("fav-theme"); } catch (e) {}
  applyTheme(stored || "light");

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("fav-theme", next); } catch (e) {}
  });

  // ---- Helpers ----
  function initials(s) {
    var clean = String(s).replace(/[^A-Za-z ]/g, " ").trim().split(/\s+/).filter(Boolean);
    if (clean.length >= 2) return (clean[0][0] + clean[1][0]).toUpperCase();
    if (clean[0]) return clean[0].slice(0, 2).toUpperCase();
    return "#";
  }

  function initialsSpan(name) {
    var s = document.createElement("span");
    s.className = "initials";
    s.textContent = initials(name);
    return s;
  }

  // Square tile: real cover if present (graceful fallback to initials), else initials.
  function buildTile(entry) {
    var box = document.createElement("div");
    box.className = "tile";
    if (entry.img) {
      var img = document.createElement("img");
      img.className = "cover";
      img.alt = entry.name || "";
      img.loading = "lazy";
      img.onerror = function () { box.innerHTML = ""; box.appendChild(initialsSpan(entry.name)); };
      img.src = entry.img;
      box.appendChild(img);
    } else {
      box.appendChild(initialsSpan(entry.name));
    }
    return box;
  }

  function buildRow(entry, i, kind) {
    var li = document.createElement("li");
    li.className = "row";

    var rank = document.createElement("span");
    rank.className = "rank mono";
    rank.textContent = String(i + 1).padStart(2, "0");

    var text = document.createElement("div");
    text.className = "rowtext";

    var name = document.createElement("span");
    name.className = "name";
    name.textContent = entry.name || "";
    text.appendChild(name);

    if (kind === "album") {
      var parts = [];
      if (entry.artist) parts.push(entry.artist);
      if (entry.year) parts.push(String(entry.year));
      if (parts.length) {
        var meta = document.createElement("span");
        meta.className = "meta";
        meta.textContent = parts.join("  ·  ");
        text.appendChild(meta);
      }
    } else if (entry.note) {
      var note = document.createElement("span");
      note.className = "note";
      note.textContent = entry.note;
      text.appendChild(note);
    }

    li.appendChild(rank);
    if (kind === "album") li.appendChild(buildTile(entry));
    li.appendChild(text);
    return li;
  }

  // "2026-06-28" -> "June 28, 2026" (no timezone shift). Bad/missing input -> "".
  function formatUpdated(value) {
    if (!value) return "";
    var m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return "";
    var months = ["January","February","March","April","May","June",
      "July","August","September","October","November","December"];
    var month = months[parseInt(m[2], 10) - 1];
    if (!month) return "";
    return month + " " + parseInt(m[3], 10) + ", " + m[1];
  }

  function renderUpdated(value) {
    var el = document.getElementById("updated");
    if (!el) return;
    var pretty = formatUpdated(value);
    el.textContent = pretty ? "  ·  Updated " + pretty : "";
  }

  function renderList(listId, countId, items, kind) {
    var ul = document.getElementById(listId);
    ul.innerHTML = "";
    (items || []).forEach(function (entry, i) {
      ul.appendChild(buildRow(entry, i, kind));
    });
    document.getElementById(countId).textContent =
      String((items || []).length).padStart(2, "0");
  }

  // ---- Load data ----
  fetch("data.yaml", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then(function (txt) {
      var data = window.jsyaml.load(txt) || {};
      renderList("artists", "artistsCount", data.artists, "artist");
      renderList("albums", "albumsCount", data.albums, "album");
      renderUpdated(data.updated);
    })
    .catch(function (err) {
      var wrap = document.querySelector(".columns");
      wrap.innerHTML = '<div class="err">Could not load data.yaml (' +
        String(err.message) +
        '). Serve this page over HTTP — fetch does not work from file://.</div>';
    });
})();
