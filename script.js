import albumData from "./data.js";
import { clickZone, fmtTime, getParticleCount } from "./utils.js";

const book = document.getElementById("book");
book.addEventListener("selectstart", (e) => e.preventDefault());
book.addEventListener("dragstart", (e) => e.preventDefault());

function fileUrl(base, name) {
  return base + encodeURIComponent(name);
}

function makeEl(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function buildLeftTrackPage(track, index, total) {
  const wrap = makeEl("div", "page-content left");

  const head = makeEl("div", "page-head");
  const meta = makeEl("div", "track-meta");
  const num = makeEl("div", "page-num");
  num.textContent = String(index * 2 + 1);
  head.append(meta, num);

  const title = makeEl("h2", "song-title");
  title.textContent = track.title;

  const artFrame = makeEl("div", "art-frame");
  const img = makeEl("img", "art-img");
  img.alt = `${track.title} cover`;
  img.src = fileUrl("assets/images/", track.image || "cover.jpg");
  artFrame.appendChild(img);

  const player = makeEl("div", "music-player-ui");
  player.setAttribute("data-audio-id", `audio-${track.id}`);

  const btn = makeEl("button", "play-trigger");
  btn.type = "button";
  btn.textContent = "▶";

  const bar = makeEl("div", "player-bar");
  const seek = makeEl("input", "seek");
  seek.type = "range";
  seek.min = "0";
  seek.max = "100";
  seek.value = "0";
  seek.step = "0.1";

  const time = makeEl("div", "time");
  const cur = makeEl("span", "tcur");
  cur.textContent = "0:00";
  const dur = makeEl("span", "tdur");
  dur.textContent = "0:00";
  time.append(cur, dur);

  bar.append(seek, time);
  player.append(btn, bar);

  const audio = makeEl("audio", "");
  audio.id = `audio-${track.id}`;
  audio.preload = "metadata";
  audio.src = fileUrl("assets/songs/", track.audio);

  wrap.append(head, title, artFrame, player, audio);
  return wrap;
}

function buildRightStoryPage(track, index, total) {
  const wrap = makeEl("div", "page-content right");

  const head = makeEl("div", "page-head");
  const meta = makeEl("div", "track-meta");
  const num = makeEl("div", "page-num");
  num.textContent = String(index * 2 + 2);
  head.append(meta, num);

  const title = makeEl("h2", "song-title");
  title.textContent = track.title;

  const story = makeEl("div", "story-text");
  story.tabIndex = 0;
  story.textContent = track.story || "";

  wrap.append(head, title, story);
  return wrap;
}

function buildLeaf(frontKind, backKind) {
  const leaf = makeEl("div", "leaf");

  const front = makeEl("div", "page front");
  const back = makeEl("div", "page back");

  if (frontKind.kind === "cover-front") {
    front.classList.add("cover", "cover-front");
  } else if (frontKind.kind === "story") {
    front.appendChild(buildRightStoryPage(frontKind.track, frontKind.index, frontKind.total));
  }

  if (backKind.kind === "cover-back") {
    back.classList.add("cover-back");
  } else if (backKind.kind === "left") {
    back.appendChild(buildLeftTrackPage(backKind.track, backKind.index, backKind.total));
  } else if (backKind.kind === "blank") {
    const c = makeEl("div", "page-content center-content");
    const h = makeEl("h2", "");
    h.textContent = "Pahlavan";
    const p = makeEl("p", "small-note");
    p.textContent = "Flip pages to explore tracks and stories.";
    c.append(h, p);
    back.appendChild(c);
  }

  leaf.append(front, back);
  return leaf;
}

function buildBookFromData(data) {
  const total = data.length;
  const leaves = [];

  const coverLeaf = buildLeaf(
    { kind: "cover-front" },
    { kind: "left", track: data[0], index: 0, total }
  );
  leaves.push(coverLeaf);

  for (let i = 0; i < total - 1; i += 1) {
    const leaf = buildLeaf(
      { kind: "story", track: data[i], index: i, total },
      { kind: "left", track: data[i + 1], index: i + 1, total }
    );
    leaves.push(leaf);
  }

  const lastLeaf = buildLeaf(
    { kind: "story", track: data[total - 1], index: total - 1, total },
    { kind: "cover-back" }
  );
  leaves.push(lastLeaf);

  const fragment = document.createDocumentFragment();
  leaves.forEach((leaf, i) => {
    leaf.style.zIndex = String(leaves.length - i);
    fragment.appendChild(leaf);
  });
  book.appendChild(fragment);

  return leaves;
}

const leaves = buildBookFromData(albumData);

let currentPage = 0;
const totalLeaves = leaves.length;

function flipNext() {
  if (currentPage >= totalLeaves) return;
  const leaf = leaves[currentPage];
  leaf.classList.add("flipped");
  leaf.style.zIndex = String(currentPage + 1);
  currentPage += 1;
  if (currentPage === 1) book.classList.add("opened");
}

function flipPrev() {
  if (currentPage <= 0) return;
  currentPage -= 1;
  const leaf = leaves[currentPage];
  leaf.classList.remove("flipped");
  setTimeout(() => {
    leaf.style.zIndex = String(totalLeaves - currentPage);
  }, 400);
  if (currentPage === 0) book.classList.remove("opened");
}

leaves.forEach((leaf, index) => {
  leaf.addEventListener("click", (e) => {
    const rect = leaf.getBoundingClientRect();
    const zone = clickZone(e, rect);

    if (currentPage === index && zone === "right") flipNext();
    if (currentPage === index + 1 && zone === "left") flipPrev();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") flipNext();
  if (e.key === "ArrowLeft") flipPrev();
});

let currentAudio = null;
let currentBtn = null;

function stopCurrent() {
  if (!currentAudio) return;
  currentAudio.pause();
  if (currentBtn) currentBtn.textContent = "▶";
  currentAudio = null;
  currentBtn = null;
}

function stopFlipOn(el) {
  el.addEventListener("click", (e) => e.stopPropagation());
  el.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
  el.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: true });
}

document.querySelectorAll(".story-text").forEach(stopFlipOn);

document.querySelectorAll(".music-player-ui").forEach((player) => {
  stopFlipOn(player);

  const audioId = player.getAttribute("data-audio-id");
  const audio = document.getElementById(audioId);

  const btn = player.querySelector(".play-trigger");
  const seek = player.querySelector(".seek");
  const tcur = player.querySelector(".tcur");
  const tdur = player.querySelector(".tdur");

  function sync() {
    const d = audio.duration || 0;
    const c = audio.currentTime || 0;
    seek.value = d ? String((c / d) * 100) : "0";
    seek.style.setProperty('--val', seek.value + '%');
    tcur.textContent = fmtTime(c);
    tdur.textContent = fmtTime(d);
  }

  audio.addEventListener("loadedmetadata", sync);
  audio.addEventListener("timeupdate", sync);

  audio.addEventListener("ended", () => {
    btn.textContent = "▶";
    if (currentAudio === audio) {
      currentAudio = null;
      currentBtn = null;
      currentDisk = null;
    }
  });

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (currentAudio && currentAudio !== audio) stopCurrent();

    if (audio.paused) {
      audio.play().catch(() => {});
      btn.textContent = "⏸";
      currentAudio = audio;
      currentBtn = btn;
      currentDisk = disk;
    } else {
      audio.pause();
      btn.textContent = "▶";
      if (currentAudio === audio) {
        currentAudio = null;
        currentBtn = null;
        currentDisk = null;
      }
    }
  });

  seek.addEventListener("input", (e) => {
    e.stopPropagation();
    seek.style.setProperty('--val', seek.value + '%');
    if (!isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = (Number(seek.value) / 100) * audio.duration;
  });
});

(function particles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let w = 1;
  let h = 1;
  let pts = [];
  let last = performance.now();

  function resize() {
    w = Math.max(1, window.innerWidth);
    h = Math.max(1, window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function r(a, b) { return a + Math.random() * (b - a); }

  function seed(n) {
    pts = [];
    for (let i = 0; i < n; i += 1) {
      pts.push({
        x: r(0, w),
        y: r(0, h),
        s: r(0.2, 1.2),
        vx: r(-0.08, 0.08),
        vy: r(-0.22, -0.06),
        a: r(0.05, 0.22),
        t: r(0, Math.PI * 2)
      });
    }
  }

  function step(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < pts.length; i += 1) {
      const p = pts[i];
      p.t += dt * 1.2;
      p.x += (p.vx + Math.sin(p.t) * 0.04) * (dt * 60);
      p.y += p.vy * (dt * 60);

      if (p.y < -20) {
        p.y = h + 20;
        p.x = r(0, w);
      }
      if (p.x < -30) p.x = w + 30;
      if (p.x > w + 30) p.x = -30;

      ctx.fillStyle = `rgba(212,175,55,${p.a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  resize();
  seed(getParticleCount(window.innerWidth, window.innerHeight));
  window.addEventListener("resize", () => {
    resize();
    seed(getParticleCount(window.innerWidth, window.innerHeight));
  });

  requestAnimationFrame(step);
})();
