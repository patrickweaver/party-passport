(() => {
  'use strict';

  const STORAGE_KEY = 'party-passport:v1';
  const PHOTO_SIZE = 640; // px, square
  const PHOTO_QUALITY = 0.82;

  // Each passport holder gets one ink color, picked once at random.
  const INKS = [
    { id: 'red', color: '#8e1b1b', weight: 0.4 },
    { id: 'green', color: '#1d5b31', weight: 0.4 },
    { id: 'yellow', color: '#eaa612', weight: 0.2 },
  ];

  const $ = (sel) => document.querySelector(sel);
  const stations = window.STATIONS;

  // ---------- storage ----------

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (_) { /* fall through */ }
    return {};
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      alert('Sorry, your passport could not be saved on this device (storage is full or blocked).');
      return false;
    }
  }

  function pickInk() {
    let r = Math.random();
    for (const ink of INKS) {
      if ((r -= ink.weight) < 0) return ink.id;
    }
    return INKS[0].id;
  }

  const state = loadState();
  if (!state.ink || !INKS.some((i) => i.id === state.ink)) state.ink = pickInk();
  if (!state.stations) state.stations = {};
  saveState();

  const inkColor = () => INKS.find((i) => i.id === state.ink).color;

  // ---------- rendering ----------

  // A holly wreath drawn around the circular photo. viewBox is -60..60;
  // the photo itself occupies radius 40.
  const WREATH_SVG = (() => {
    const parts = [];
    const leaf = 'M0,-7 C3.5,-3 3.5,3 0,7 C-3.5,3 -3.5,-3 0,-7Z';
    const holly =
      'M0,-9 L2,-6 L4.5,-6.5 L3.5,-3 L6,-1.5 L3.5,0.5 L4.5,4 L2,3.5 L0,7 L-2,3.5 L-4.5,4 L-3.5,0.5 L-6,-1.5 L-3.5,-3 L-4.5,-6.5 L-2,-6Z';
    const N = 30;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * 360;
      const wobble = ((i * 37) % 7) - 3;
      parts.push(
        `<path d="${leaf}" fill="#1c4d2b" transform="rotate(${a}) translate(0,-47) rotate(${48 + wobble})"/>`,
        `<path d="${leaf}" fill="#2f7a43" transform="rotate(${a + 6}) translate(0,-50.5) rotate(${-42 + wobble})"/>`,
        `<path d="${leaf}" fill="#245f35" transform="rotate(${a + 3}) translate(0,-44) rotate(${-50 - wobble})"/>`
      );
    }
    // holly sprigs with berries every 60deg (skip the bottom, where the bow goes)
    for (let k = 0; k < 6; k++) {
      const a = k * 60 + 30;
      if (a === 210 || a === 150) continue;
      parts.push(
        `<g transform="rotate(${a}) translate(0,-48)">
          <path d="${holly}" fill="#17402a" transform="rotate(-55) translate(0,-5)"/>
          <path d="${holly}" fill="#215a37" transform="rotate(55) translate(0,-5)"/>
          <circle cx="-2.4" cy="0.5" r="2.6" fill="#b3141d"/>
          <circle cx="2.4" cy="0.5" r="2.6" fill="#c8202a"/>
          <circle cx="0" cy="-2.8" r="2.6" fill="#a10f19"/>
          <circle cx="-0.8" cy="-3.6" r="0.8" fill="#fff" opacity=".7"/>
        </g>`
      );
    }
    // bow
    parts.push(`
      <g transform="translate(0,49)">
        <path d="M-2,2 L-9,15 L-5,14 L-3,18 L1,4Z" fill="#9c1118"/>
        <path d="M2,2 L9,15 L5,14 L3,18 L-1,4Z" fill="#b3141d"/>
        <path d="M0,0 C-6,-9 -17,-8 -15,0 C-13,7 -5,4 0,0Z" fill="#c8202a"/>
        <path d="M0,0 C6,-9 17,-8 15,0 C13,7 5,4 0,0Z" fill="#c8202a"/>
        <path d="M0,0 C-5,-6 -12,-6 -12,-1" fill="none" stroke="#e5525a" stroke-width="1"/>
        <path d="M0,0 C5,-6 12,-6 12,-1" fill="none" stroke="#e5525a" stroke-width="1"/>
        <ellipse cx="0" cy="0" rx="3.5" ry="3" fill="#8a0d14"/>
      </g>`);
    return `
      <svg class="wreath" viewBox="-60 -60 120 120" aria-hidden="true">
        <circle r="40.6" fill="none" stroke="#c9a24a" stroke-width="1.6"/>
        ${parts.join('')}
      </svg>`;
  })();

  function cornerPosition(corner) {
    // Center of the stamp sits on the photo's circular edge at 45 degrees.
    // Photo radius is 40/120 of the box; 0.5 ± 0.333 * cos45.
    const near = 26.5;
    const far = 73.5;
    return {
      left: corner[1] === 'l' ? near : far,
      top: corner[0] === 't' ? near : far,
    };
  }

  function renderStation(station, index) {
    const li = document.createElement('li');
    li.className = 'station';
    li.dataset.id = station.id;
    const entry = state.stations[station.id];
    const num = String(index + 1).padStart(2, '0');

    li.innerHTML = `
      <p class="station-num">Station ${num}</p>
      <h2 class="station-name">${station.name}</h2>`;

    if (!entry) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'stamp-slot';
      btn.setAttribute('aria-label', `Visit ${station.name}: take your photo`);
      btn.innerHTML = `
        <span class="stamp-slot-inner">
          <span class="stamp-slot-ghost">${station.name}</span>
          <svg class="stamp-slot-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
            <circle cx="12" cy="13" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/>
          </svg>
          <span class="stamp-slot-cta">Tap to stamp</span>
        </span>`;
      btn.addEventListener('click', () => visitStation(station));
      li.appendChild(btn);
      return li;
    }

    const pos = cornerPosition(station.stampCorner || 'br');
    const entryEl = document.createElement('div');
    entryEl.className = 'entry';
    entryEl.innerHTML = `
      <div class="photo">
        <img class="photo-img" alt="${station.name} selfie">
        ${WREATH_SVG}
        <div class="stamp" style="
          --x:${pos.left + entry.stamp.dx}%;
          --y:${pos.top + entry.stamp.dy}%;
          --rot:${entry.stamp.rot}deg;
          --w:${(station.stampSize || 0.56) * 100}%;
          color:${inkColor()};
          opacity:${entry.stamp.opacity};
        ">${station.stamp()}</div>
      </div>`;
    entryEl.querySelector('.photo-img').src = entry.photo;
    if (entry.answer) {
      const cap = document.createElement('p');
      cap.className = 'caption';
      cap.textContent = entry.answer;
      entryEl.appendChild(cap);
    }
    li.appendChild(entryEl);
    return li;
  }

  function render() {
    const list = $('#stations');
    list.replaceChildren(...stations.map(renderStation));
    const done = stations.filter((s) => state.stations[s.id]).length;
    $('#progress').textContent =
      done === stations.length
        ? `All ${done} stamps collected. Merry Christmas!`
        : `${done} of ${stations.length} stamps collected`;
  }

  // ---------- station flow ----------

  async function visitStation(station) {
    const photo = await camera.open(station.instructions);
    if (!photo) return;
    if (station.question) {
      askQuestion(station, photo);
    } else {
      complete(station, { photo });
    }
  }

  function complete(station, data) {
    const rand = (min, max) => min + Math.random() * (max - min);
    state.stations[station.id] = {
      ...data,
      completedAt: new Date().toISOString(),
      stamp: {
        rot: Math.round(rand(-22, 22)),
        dx: Math.round(rand(-4, 4)),
        dy: Math.round(rand(-4, 4)),
        opacity: rand(0.82, 0.95).toFixed(2),
      },
    };
    if (!saveState()) {
      delete state.stations[station.id];
      return;
    }
    render();
    const stamp = document.querySelector(`.station[data-id="${station.id}"] .stamp`);
    const card = stamp && stamp.closest('.station');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      stamp.classList.add('stamp-landing');
    }
  }

  // ---------- question sheet ----------

  const sheet = {
    el: $('#sheet'),
    form: $('#sheet-form'),
    input: $('#sheet-answer'),
    station: null,
    photo: null,
  };

  function askQuestion(station, photo) {
    sheet.station = station;
    sheet.photo = photo;
    $('#sheet-station').textContent = station.name;
    $('#sheet-question').textContent = station.question;
    $('#sheet-photo').src = photo;
    sheet.input.value = '';
    sheet.el.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(() => sheet.input.focus(), 50);
  }

  function closeSheet() {
    sheet.el.hidden = true;
    document.body.classList.remove('modal-open');
  }

  sheet.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const answer = sheet.input.value.trim();
    if (!answer) return;
    closeSheet();
    complete(sheet.station, { photo: sheet.photo, answer });
  });
  $('#sheet-cancel').addEventListener('click', closeSheet);
  $('#sheet-retake').addEventListener('click', () => {
    const station = sheet.station;
    closeSheet();
    visitStation(station);
  });

  // ---------- camera ----------

  const camera = (() => {
    const el = $('#camera');
    const video = $('#camera-video');
    const preview = $('#camera-preview');
    const fileInput = $('#camera-file');
    let stream = null;
    let facing = 'user';
    let resolver = null;
    let captured = null;

    const setState = (s) => (el.dataset.state = s);

    function stopStream() {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      stream = null;
      video.srcObject = null;
    }

    async function startStream() {
      stopStream();
      setState('starting');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showFallback('Your browser can’t show a live camera here, but you can still take a photo.');
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (el.hidden) return stopStream(); // closed while waiting for permission
        video.srcObject = stream;
        video.classList.toggle('mirrored', facing === 'user');
        await video.play().catch(() => {});
        setState('live');
      } catch (err) {
        showFallback(
          err && err.name === 'NotAllowedError'
            ? 'Camera access was blocked. You can still take a photo with your camera app.'
            : 'We couldn’t open the camera here, but you can still take a photo.'
        );
      }
    }

    function showFallback(msg) {
      $('#camera-fallback-text').textContent = msg;
      setState('fallback');
    }

    function squareCrop(source, sw, sh, mirror) {
      const size = Math.min(sw, sh);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = PHOTO_SIZE;
      const ctx = canvas.getContext('2d');
      if (mirror) {
        ctx.translate(PHOTO_SIZE, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(source, (sw - size) / 2, (sh - size) / 2, size, size, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
      return canvas.toDataURL('image/jpeg', PHOTO_QUALITY);
    }

    function review(dataUrl) {
      captured = dataUrl;
      preview.src = dataUrl;
      setState('review');
    }

    $('#camera-shutter').addEventListener('click', () => {
      if (!video.videoWidth) return;
      review(squareCrop(video, video.videoWidth, video.videoHeight, facing === 'user'));
      video.pause();
    });

    $('#camera-flip').addEventListener('click', () => {
      facing = facing === 'user' ? 'environment' : 'user';
      startStream();
    });

    $('#camera-retake').addEventListener('click', () => {
      captured = null;
      if (stream) {
        video.play().catch(() => {});
        setState('live');
      } else {
        setState('fallback');
        fileInput.click();
      }
    });

    $('#camera-use').addEventListener('click', () => finish(captured));
    $('#camera-close').addEventListener('click', () => finish(null));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !el.hidden) finish(null);
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      fileInput.value = '';
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        review(squareCrop(img, img.naturalWidth, img.naturalHeight, false));
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        showFallback('That file couldn’t be read as a photo. Try again?');
      };
      img.src = url;
    });

    function finish(result) {
      stopStream();
      el.hidden = true;
      document.body.classList.remove('modal-open');
      const r = resolver;
      resolver = null;
      captured = null;
      if (r) r(result);
    }

    function open(instructions) {
      if (resolver) finish(null);
      $('#camera-instructions').textContent = instructions;
      preview.removeAttribute('src');
      el.hidden = false;
      document.body.classList.add('modal-open');
      startStream();
      return new Promise((resolve) => (resolver = resolve));
    }

    return { open };
  })();

  // ---------- reset ----------

  $('#reset').addEventListener('click', () => {
    if (!confirm('Erase all photos and stamps from this passport?')) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  render();
})();
