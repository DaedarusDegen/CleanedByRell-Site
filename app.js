/* ============================================================================
   Cleaned By Rell — shared behaviour for every page.
   Each page sets data-page on <body>; only that page's module runs.
   ============================================================================ */
const $ = s => document.querySelector(s);
const money = n => '$' + (Math.round(n * 100) / 100).toLocaleString('en-AU',
  { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const jobNo = String(Math.floor(1000 + Math.random() * 8999));

const T_ = CONFIG.turnaround;
const dayRange = (lo, hi) => lo === hi ? `${lo} day${lo > 1 ? 's' : ''}` : `${lo}–${hi} days`;
const baseEta  = () => dayRange(T_.base[0], T_.base[1]);

/* runs on every page */
function chrome() {
  const y = $('#yr'); if (y) y.textContent = new Date().getFullYear();
  const c = CONFIG.contact;
  document.querySelectorAll('[data-ig]').forEach(a => a.href = `https://instagram.com/${c.instagram}`);
  document.querySelectorAll('[data-tel]').forEach(a => {
    a.href = `tel:${c.phone.replace(/\s/g, '')}`;
    if (a.dataset.tel === 'label') a.textContent = c.phone;
  });
  document.querySelectorAll('[data-mail]').forEach(a => {
    a.href = `mailto:${c.email}`;
    if (a.dataset.mail === 'label') a.textContent = c.email;
  });
  // mark the current page in the nav
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav a').forEach(a =>
    a.toggleAttribute('aria-current', a.dataset.nav === page));
}

/* ---------------------------------------------------------------- home ---- */
function pageHome() {
  $('#heroLocLabel').textContent = CONFIG.hero.locationLabel;
  $('#heroLoc').textContent      = CONFIG.hero.location;
  $('#heroExp').textContent      = CONFIG.hero.experience;
  $('#heroHead').innerHTML       = `${esc(CONFIG.hero.headline)}<em>${esc(CONFIG.hero.accent)}</em>`;
  $('#heroSub').textContent      = CONFIG.hero.sub;
  document.title = `Cleaned By Rell — Sneaker cleaning in ${CONFIG.hero.location}`;

  $('#areaList').innerHTML = CONFIG.serviceAreas.map(a => `<b>${esc(a)}</b>`).join('');

  $('#facts').innerHTML = CONFIG.facts.map(f => `
    <div class="fact">
      <div class="fact-k num">${esc(f.k)}</div>
      <div class="fact-v"><b>${esc(f.title)}</b>${esc(f.desc)}</div>
    </div>`).join('');

  const T_ = CONFIG.turnaround;
  const dayRange = (lo, hi) => lo === hi ? `${lo} day${lo > 1 ? 's' : ''}` : `${lo}–${hi} days`;
  const baseEta = () => dayRange(T_.base[0], T_.base[1]);

  $('#pkgHead').textContent = CONFIG.packagesIntro.heading;
  $('#pkgSub').textContent  = CONFIG.packagesIntro.sub;
  if (CONFIG.packages.length === 1) $('#tiers').classList.add('tiers--one');

  $('#tiers').innerHTML = CONFIG.packages.map(p => `
    <article class="tier${p.featured ? ' tier--hero' : ''}">
      ${p.featured ? '<div class="tier-tag">Most booked</div>' : ''}
      <div class="tier-top">
        <h3>${esc(p.name)}</h3>
        <div class="tier-price num">${money(p.price)}<small>per pair</small></div>
      </div>
      <p class="tier-for">${esc(p.for)}</p>
      ${p.basedOn ? `<p class="tier-base">${esc(p.basedOn)}</p>` : ''}
      <ul>${p.includes.map(i => typeof i === 'string'
        ? `<li>${esc(i)}</li>`
        : `<li><b>${esc(i.name)}</b>${i.desc ? `<span>${esc(i.desc)}</span>` : ''}</li>`).join('')}</ul>
      ${p.bestFor ? `<div class="tier-best">
        <div class="tier-best-k">Right for you if</div>
        <ul>${p.bestFor.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>` : ''}
      <div class="tier-time"><span>Turnaround</span><b>${esc(baseEta())}</b></div>
    </article>`).join('');

  renderReviews();

  $('#creedHead').textContent = CONFIG.creed.heading;
  $('#creedBody').innerHTML =
    `<p class="lead">${esc(CONFIG.creed.lead)}</p>` +
    CONFIG.creed.body.map(t => `<p>${esc(t)}</p>`).join('');

  $('#hours').innerHTML = CONFIG.hours
    .map(([d, h]) => `<div class="hour"><span>${esc(d)}</span><b>${esc(h)}</b></div>`).join('');

  (() => {
    const P = CONFIG.proof;
    const card = CONFIG.packages[0].includes;
    const short = n => n.replace(/\s*\(.*\)/, '');   // "Uppers (Scrub & Steam)" -> "Uppers"

    // a point can prove several lines at once; the labels come from the card
    const points = P.points.map(pt => {
      const items = pt.ids.map(id => card.find(i => i && i.id === id)).filter(Boolean);
      if (!items.length) return null;
      return {
        key:    pt.ids.join('-'),
        tab:    items.map(i => short(i.name)).join(' & '),
        name:   items.map(i => i.name).join(' & '),
        claims: items.map(i => i.desc).filter(Boolean),
        before: pt.before, after: pt.after, image: pt.image,
      video: pt.video, poster: pt.poster, label: pt.label
      };
    }).filter(Boolean);

    if (!points.length) { $('#proof').remove(); return; }

    $('#proofHead').textContent = P.heading;
    $('#proofSub').textContent  = P.sub;

    let at = 0, side = 'before';

    $('#proofTabs').innerHTML = points.map((p, i) => `
      <button type="button" class="proof-tab" role="tab"
              aria-selected="${i === 0}" data-i="${i}">${esc(p.tab)}</button>`).join('');

    function paint() {
      const p = points[at];
      const vid    = $('#proofVideo');
      const isVid  = !!p.video;
      const single = isVid || !!p.image;   // one frame already shows both states
      const url    = p.image || (isVid ? null : p[side]);
      $('#proofToggle').hidden = single;

      // a clip only runs on the tab you're on — nothing decodes in the background
      if (!isVid && vid) { vid.pause(); vid.hidden = true; vid.classList.remove('on'); }
      if (isVid) {
        $('#proofEmpty').hidden = true;
        $('#proofBefore').classList.remove('on');
        $('#proofAfter').classList.remove('on');
        vid.hidden = false;
        if (p.poster) vid.poster = p.poster;
        // a clip that isn't uploaded yet says so, same as a missing photo
        vid.onerror = () => {
          vid.classList.remove('on');
          vid.hidden = true;
          $('#proofEmpty').hidden = false;
          $('#proofEmpty').innerHTML =
            `<b>clip</b><span>Waiting on <code>${esc(p.video)}</code></span>`;
        };
        if (vid.getAttribute('src') !== p.video) vid.setAttribute('src', p.video);
        vid.classList.add('on');
        // someone who asked for less motion gets a still with controls instead
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
          vid.controls = true;
        } else {
          vid.controls = false;
          vid.play().catch(() => { vid.controls = true; });   // autoplay blocked
        }
        $('#proofName').textContent = p.name;
        $('#proofClaim').innerHTML  = p.claims.map(c => `<p>${esc(c)}</p>`).join('');
        $('#proofPair').hidden = !p.label;
        $('#proofPair').textContent = p.label || '';
        warm(p);
        return;
      }

      document.querySelectorAll('.proof-tab').forEach((t, i) =>
        t.setAttribute('aria-selected', String(i === at)));
      $('#btnBefore').setAttribute('aria-pressed', String(side === 'before'));
      $('#btnAfter').setAttribute('aria-pressed',  String(side === 'after'));

      const imgB = $('#proofBefore'), imgA = $('#proofAfter');
      const live  = side === 'before' ? imgB : imgA;
      const other = side === 'before' ? imgA : imgB;
      other.classList.remove('on');

      const waiting = () => {
        live.classList.remove('on');
        $('#proofEmpty').hidden = false;
        const what = single ? 'side by side' : side;
        $('#proofEmpty').innerHTML = url
          ? `<b>${esc(what)} shot</b><span>Waiting on <code>${esc(url)}</code></span>`
          : `<b>${esc(what)} shot</b><span>Add a path for the ${esc(p.tab)} point</span>`;
      };
      const ready = () => { $('#proofEmpty').hidden = true; live.classList.add('on'); };

      if (!url) {
        waiting();
      } else {
        live.hidden = false;
        live.alt = single ? `${p.name}, before and after side by side` : `${p.name}, ${side}`;
        live.onload  = ready;
        live.onerror = waiting;      // file not uploaded yet — say so, don't break
        if (live.getAttribute('src') !== url) {
          waiting();                 // hold the note until it actually loads
          live.setAttribute('src', url);
        } else if (live.complete) {
          live.naturalWidth ? ready() : waiting();
        } else {
          waiting();
        }
      }

      warm(p);
      $('#proofName').textContent = p.name;
      $('#proofClaim').innerHTML  = p.claims.map(c => `<p>${esc(c)}</p>`).join('');
      // naming the pair keeps it straight when a shot comes from another shoe
      $('#proofPair').hidden = !p.label;
      $('#proofPair').textContent = p.label || '';
    }

    $('#proofTabs').addEventListener('click', e => {
      const t = e.target.closest('.proof-tab');
      if (!t) return;
      at = +t.dataset.i;
      paint();
    });

    // arrow keys move between points, as a tablist should
    $('#proofTabs').addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      at = (at + (e.key === 'ArrowRight' ? 1 : points.length - 1)) % points.length;
      paint();
      document.querySelectorAll('.proof-tab')[at].focus();
      e.preventDefault();
    });

    $('#btnBefore').addEventListener('click', () => { side = 'before'; paint(); });
    $('#btnAfter').addEventListener('click',  () => { side = 'after';  paint(); });

    // only warm the tab you're actually looking at — preloading every
    // hidden shot pulled ~280 KB of invisible photos on page load
    const warmed = new Set();
    function warm(p) {
      [p.before, p.after, p.image, p.poster].forEach(u => {
        if (u && !warmed.has(u)) { warmed.add(u); new Image().src = u; }
      });
    }

    paint();
  })();
}

function renderReviews() {
  const R = CONFIG.reviews;
  const box = $('#reviews');
  if (!box || !R || !R.items || !R.items.length) { if (box) box.remove(); return; }

  $('#revHead').textContent = R.heading;
  $('#revSub').textContent  = R.sub;

  $('#revList').innerHTML = R.items.map(r => {
    const meta = [r.name, r.place, r.pair, r.when].filter(Boolean);
    return `
    <figure class="rev">
      <blockquote class="rev-text">${esc(r.text)}</blockquote>
      ${meta.length ? `<figcaption class="rev-who">
        <b>${esc(meta[0])}</b>${meta.slice(1).map(x => `<span>${esc(x)}</span>`).join('')}
      </figcaption>` : ''}
    </figure>`;
  }).join('');

  // the link out is the whole point — without it these are unverifiable
  const cta = $('#revCta');
  if (R.highlightUrl) {
    cta.href = R.highlightUrl;
    cta.textContent = R.ctaLabel || 'See the screenshots';
  } else {
    cta.remove();
  }
}

/* --------------------------------------------------------------- quote ---- */
function pageQuote() {
  const jobEl = $('#jobNo'); if (jobEl) jobEl.textContent = jobNo;

  const radio = (group, list, checkedId, priceFmt) => list.map(o => `
    <label class="opt">
      <input type="radio" name="${group}" value="${o.id}"${o.id === checkedId ? ' checked' : ''}>
      <span class="tick" aria-hidden="true"></span>
      <span class="opt-body">
        <span class="opt-name">${esc(o.name)}</span>
        ${o.desc ? `<span class="opt-desc">${esc(o.desc)}</span>` : ''}
      </span>
      <span class="opt-price num">${priceFmt(o)}</span>
    </label>`).join('');

  const L = CONFIG.logistics;
  const T = L.travel;

  // no driving fee until we know where they are
  let travel = null;   // { name, postcode, km, roadKm, fee }
  const travelFee = () => travel && !travel.tooFar ? travel.fee : 0;

  $('#modeOpts').innerHTML = L.modes.map(o => `
    <label class="opt${o.soon ? ' opt--soon' : ''}">
      <input type="radio" name="mode" value="${o.id}"${o.id === L.modes[0].id ? ' checked' : ''}${o.soon ? ' disabled' : ''}>
      <span class="tick" aria-hidden="true"></span>
      <span class="opt-body">
        <span class="opt-name">${esc(o.name)}</span>
        ${o.desc ? `<span class="opt-desc">${esc(o.desc)}</span>` : ''}
      </span>
      ${o.soon ? '<span class="opt-price opt-soon">Coming soon</span>' : ''}
    </label>`).join('');

  /* ---- distance lookup ----------------------------------------------------- */
  const labelFor = s => `${s[0]} NSW ${s[1]}`;
  const suburbIndex = new Map(SUBURBS.map(s => [labelFor(s).toLowerCase(), s]));
  $('#suburbList').innerHTML = SUBURBS.map(s => `<option value="${esc(labelFor(s))}">`).join('');

  function kmBetween(a1, o1, a2, o2) {
    const R = 6371, rad = d => d * Math.PI / 180;
    const p1 = rad(a1), p2 = rad(a2);
    const dp = p2 - p1, dl = rad(o2 - o1);
    const x = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }

  function setSuburb(raw) {
    const s = suburbIndex.get((raw || '').trim().toLowerCase());
    const box = $('#suburbIn'), out = $('#distOut');

    if (!s) {
      travel = null;
      box.classList.remove('addr--ok');
      const typed = (raw || '').trim().length > 2;
      out.hidden = !typed;
      if (typed) out.innerHTML =
        `<span>Can't find that one. Check the spelling — or if you're outside NSW, posting is the way to go.</span>`;
    } else {
      const km = kmBetween(T.origin.lat, T.origin.lng, s[2], s[3]);
      const roadKm = km * T.roadFactor;
      const fee = Math.max(T.minimum, Math.round(T.base + T.perKm * roadKm));
      travel = { name: s[0], postcode: s[1], km, roadKm, fee, tooFar: roadKm > T.maxKm };
      box.classList.add('addr--ok');
      out.hidden = false;
      out.innerHTML = travel.tooFar
        ? `<span>${esc(s[0])} is about ${roadKm.toFixed(0)} km by road — further than I drive.</span><b>Post it instead</b>`
        : `<span>${esc(s[0])} — roughly ${roadKm.toFixed(1)} km from ${esc(T.origin.name)} by road</span><b>${money(fee)} both ways</b>`;
    }

    render();
  }

  $('#suburbIn').addEventListener('input', e => setSuburb(e.target.value));
  $('#mailOpts').innerHTML = radio('mail', L.mail.options, L.mail.options[0].id,
    o => o.price ? `+${money(o.price)}` : 'Free');
  $('#mailNote').textContent = `${L.mail.note} Delivering to ${L.mail.states}.`;

  // priority is tiered: one price for the first pair, another for each extra
  $('#rushOpts').innerHTML = radio('rush', CONFIG.rush, CONFIG.rush[0].id,
    o => o.perPair ? `+${money(o.perPair)}<small>a pair</small>` : 'Included');

  const bulkTiers = [...CONFIG.bulk.tiers].sort((x, y) => x.from - y.from);
  $('#bulkHint').textContent = bulkTiers.length
    ? bulkTiers.map(t => t.percent
        ? `${t.percent}% off for ${t.from} or more pairs`
        : `${t.from} pairs or more takes ${money(t.off)} off each`).join('. ') + '.'
    : '';

  const pkgById = id => CONFIG.packages.find(p => p.id === id);
  const legById = (list, id) => list.find(o => o.id === id);

  const qty    = {};   // how many pairs of each clean
  const addQty = {};   // how many pairs get each add-on
  const surQty = {};   // how many pairs a surcharge applies to
  CONFIG.packages.forEach((p, i) => qty[p.id] = i === 0 ? 1 : 0);
  CONFIG.addons.forEach(a => addQty[a.id] = 0);
  CONFIG.surcharges.forEach(s => surQty[s.id] = 0);

  let lastKeys = new Set();

  const totalPairs = () => CONFIG.packages.reduce((s, p) => s + qty[p.id], 0);

  // an add-on can only go on pairs whose clean doesn't already include it
  const eligibleFor = a => CONFIG.packages
    .filter(p => !(a.includedIn || []).includes(p.id))
    .reduce((s, p) => s + qty[p.id], 0);

  function stepper(kind, id, value, label) {
    return `
      <div class="step step--sm" data-${kind}="${id}">
        <button type="button" data-d="-1" aria-label="One fewer ${esc(label)}">&minus;</button>
        <output class="num" aria-live="polite">${value}</output>
        <button type="button" data-d="1" aria-label="One more ${esc(label)}">+</button>
      </div>`;
  }

  function buildQty() {
    $('#qtyList').innerHTML = CONFIG.packages.map(p => `
      <div class="qty${qty[p.id] ? ' qty--on' : ''}">
        <div class="qty-body">
          <div class="qty-name">${esc(p.name)}<span class="qty-price num">${money(p.price)} a pair</span></div>
          <div class="qty-desc">${esc(p.for)}</div>
        </div>
        ${stepper('pkg', p.id, qty[p.id], p.name)}
      </div>`).join('');

    $('#addQtyList').innerHTML = CONFIG.addons.map(a => {
      const max = eligibleFor(a);
      return `
      <div class="qty${addQty[a.id] ? ' qty--on' : ''}"${max ? '' : ' hidden'}>
        <div class="qty-body">
          <div class="qty-name">${esc(a.name)}<span class="qty-price num">+${money(a.price)} a pair</span></div>
          <div class="qty-desc">${esc(a.desc)}</div>
        </div>
        ${stepper('add', a.id, addQty[a.id], a.name)}
      </div>`;
    }).join('');

    const n = totalPairs();
    $('#tally').hidden = CONFIG.packages.length < 2;
    $('#tally').innerHTML = `<span>Pairs in this job</span><b>${n}</b>`;
  }

  function buildSurcharges() {
    const n = totalPairs();
    $('#surList').innerHTML = CONFIG.surcharges.map(s => {
      const on = surQty[s.id] > 0;
      return `
      <div class="sur">
        <p class="q">${esc(s.question)}</p>
      ${s.sub ? `<p class="q-sub">${esc(s.sub)}</p>` : ''}
        <div class="opts">
          <label class="opt">
            <input type="radio" name="sur-${s.id}" value="no"${on ? '' : ' checked'}>
            <span class="tick" aria-hidden="true"></span>
            <span class="opt-body"><span class="opt-name">${esc(s.no)}</span></span>
            <span class="opt-price">Free</span>
          </label>
          <label class="opt">
            <input type="radio" name="sur-${s.id}" value="yes"${on ? ' checked' : ''}>
            <span class="tick" aria-hidden="true"></span>
            <span class="opt-body"><span class="opt-name">${esc(s.yes)}</span></span>
            <span class="opt-price num">+${money(s.price)}<small>a pair</small></span>
          </label>
        </div>
        <div class="qty sur-count"${on && n > 1 ? '' : ' hidden'}>
          <div class="qty-body"><div class="qty-name">${esc(s.countLabel)}</div></div>
          ${stepper('sur', s.id, surQty[s.id], s.name)}
        </div>
        <p class="hint">${esc(s.note)}</p>
      </div>`;
    }).join('');
  }

  function bump(kind, id, d) {
    if (kind === 'pkg') {
      const next = qty[id] + d;
      if (next < 0 || next > CONFIG.maxPairs) return;
      if (next === 0 && totalPairs() - qty[id] === 0) return;  // never zero pairs
      qty[id] = next;
      // fewer pairs may mean an add-on or surcharge count no longer fits
      CONFIG.addons.forEach(a => addQty[a.id] = Math.min(addQty[a.id], eligibleFor(a)));
      CONFIG.surcharges.forEach(s => surQty[s.id] = Math.min(surQty[s.id], totalPairs()));
    } else if (kind === 'add') {
      const a = CONFIG.addons.find(x => x.id === id);
      const next = addQty[id] + d;
      if (next < 0 || next > eligibleFor(a)) return;
      addQty[id] = next;
    } else {
      const next = surQty[id] + d;
      if (next < 1 || next > totalPairs()) return;   // "yes" always means at least one
      surQty[id] = next;
    }
    buildQty();
    buildSurcharges();
    render();
  }

  // answering the material question sets or clears the count
  function answerSurcharge(id, yes) {
    const n = totalPairs();
    surQty[id] = yes ? Math.min(Math.max(surQty[id], 1), n) : 0;
    buildSurcharges();
    render();
  }

  /* ---- pricing ------------------------------------------------------------- */
  function quote() {
    const L = CONFIG.logistics;
    const mode = $('input[name=mode]:checked').value;
    const rush = legById(CONFIG.rush, $('input[name=rush]:checked').value);
    const post = legById(L.mail.options, $('input[name=mail]:checked').value);

    const n = totalPairs();
    const lines = [];

    CONFIG.packages.forEach(p => {
      if (qty[p.id]) lines.push({
        k: 'pkg-' + p.id,
        label: `${p.name} × ${qty[p.id]}`,
        val: p.price * qty[p.id]
      });
    });

    CONFIG.addons.forEach(a => {
      if (addQty[a.id]) lines.push({
        k: 'add-' + a.id,
        label: `${a.name} × ${addQty[a.id]}`,
        val: a.price * addQty[a.id]
      });
    });

    CONFIG.surcharges.forEach(s => {
      if (surQty[s.id]) lines.push({
        k: 'sur-' + s.id,
        label: `${s.name} × ${surQty[s.id]}`,
        val: s.price * surQty[s.id]
      });
    });

    // highest qualifying tier wins; they don't stack. a percentage comes off
    // the cleans only — never add-ons, surcharge, travel or priority.
    const cleans = CONFIG.packages.reduce((s, p) => s + p.price * qty[p.id], 0);
    const tier = [...CONFIG.bulk.tiers].sort((x, y) => y.from - x.from).find(t => n >= t.from);
    if (tier) {
      const cut   = tier.percent ? cleans * tier.percent / 100 : tier.off * n;
      const label = tier.percent
        ? `${tier.percent}% off for ${tier.from}+ pairs`
        : `${tier.from}+ pairs — ${money(tier.off)} off each`;
      lines.push({ k: 'bulk', label, val: -cut, off: true });
    }

    let travelDays = 0;
    if (mode === 'local') {
      const fee = travelFee();
      if (fee) {
        lines.push({ k: 'local', label: `Pickup and return — ${travel.name}`, val: fee });
        travelDays = L.travel.days;
      }
    } else if (mode === 'mail') {
      lines.push({ k: 'mail', label: `${post.name} — sending and return`, val: post.price });
      travelDays = post.days;
    }

    const rushFee = rush.perPair * n;
    if (rushFee) lines.push({
      k: 'rush',
      label: n > 1 ? `${rush.name} (${n} pairs)` : rush.name,
      val: rushFee
    });

    const total = lines.reduce((s, l) => s + l.val, 0);
    // what the travel alone came to — this is what the deposit covers
    const deliveryTotal = lines
      .filter(l => ['local','mail'].includes(l.k))
      .reduce((s, l) => s + l.val, 0);

    // bigger jobs take longer; travel adds on top of bench time
    let eta;
    if (rush.fixedEta && mode !== 'mail') {
      eta = rush.fixedEta;                        // priority is a guarantee, not an estimate
    } else {
      let lo = T_.base[0], hi = T_.base[1];
      if (n > T_.upTo) { lo += T_.extra[0]; hi += T_.extra[1]; }
      if (rush.fixedEta) { lo = 1; hi = 1; }      // posted priority: a day on the bench
      lo = Math.max(1, lo + travelDays);
      hi = Math.max(lo, hi + travelDays);
      eta = dayRange(lo, hi);
    }

    const how = mode === 'mail'  ? `${post.name}, sending and return`
              : mode === 'local' ? `Pickup and return${travel ? ` — ${travel.name} NSW ${travel.postcode}` : ''}`
              : 'Drop off and collect in store';

    return { lines, total, eta, mode, how, rush, n, deliveryTotal };
  }

  function syncMode() {
    const mode = $('input[name=mode]:checked').value;
    $('#localPanel').hidden = mode !== 'local';
    $('#mailPanel').hidden  = mode !== 'mail';

    const cap = CONFIG.logistics.mail.maxPairs;
    const warn = $('#mailWarn');

    const needsSuburb = mode === 'local' && !travel;

    if (mode === 'mail' && totalPairs() > cap) {
      warn.hidden = false;
      warn.textContent = `Only ${cap} pairs can go in one parcel. Drop it to ${cap} or fewer, or message me and we'll split it across two.`;
    } else if (mode === 'local' && travel && travel.tooFar) {
      warn.hidden = false;
      warn.textContent = `${travel.name} is about ${travel.roadKm.toFixed(0)} km by road, past the ${CONFIG.logistics.travel.maxKm} km I drive to. Posting them is the way to go — it covers sending and return.`;
    } else if (needsSuburb) {
      warn.hidden = false;
      warn.textContent = `Pop your suburb in above and I'll work out the driving fee.`;
    } else {
      warn.hidden = true;
    }
  }

  function render() {
    syncMode();
    const q = quote();

    $('#lines').innerHTML = q.lines.map(l => `
      <div class="ln${l.off ? ' ln--off' : ''}${lastKeys.has(l.k) ? '' : ' ln-new'}">
        <span class="ln-lbl">${esc(l.label)}</span>
        <span class="ln-val num">${l.val < 0 ? '−' : ''}${money(Math.abs(l.val))}</span>
      </div>`).join('');
    lastKeys = new Set(q.lines.map(l => l.k));

    const dep = CONFIG.booking.depositIsDelivery ? q.deliveryTotal : 0;
    $('#dkPay').innerHTML = dep ? `
      <div class="pay pay--now">
        <span>Deposit at booking, covers the travel</span><b class="num">${money(dep)}</b>
      </div>
      <div class="pay">
        <span>Balance ${esc(CONFIG.booking.balanceNote)}</span><b class="num">${money(q.total - dep)}</b>
      </div>` : '';

    $('#dkNote').textContent = (dep
      ? `The deposit is the travel cost, taken when you book so the drive is covered either way. It comes off your total, it isn't an extra charge. `
      : '') + (CONFIG.booking.quoteNote || '');

    $('#total').textContent    = money(q.total);
    { const sv = $('#stickVal'); if (sv) sv.textContent = money(q.total); }
    $('#eta').textContent      = q.eta;
    $('#etaNote').textContent  = T_.note;

    const items = [
      ...CONFIG.packages.filter(p => qty[p.id]).map(p => `  ${p.name} × ${qty[p.id]}`),
      ...CONFIG.addons.filter(a => addQty[a.id]).map(a => `  ${a.name} × ${addQty[a.id]}`),
      ...CONFIG.surcharges.filter(s => surQty[s.id]).map(s => `  ${s.name} × ${surQty[s.id]}`)
    ].join('\n');

    const msg =
  `Hey Rell — here's my quote from the site.

  Job no. ${jobNo}
  ${items}

  ${q.how}
  ${q.rush.name}

  Total: ${money(q.total)}${dep ? `
  Deposit to book: ${money(dep)}
  Balance ${CONFIG.booking.balanceNote}: ${money(q.total - dep)}` : ''}
  Estimated: ${q.eta}

  Can I lock in a time?`;

    const c = CONFIG.contact;
    const smsHref  = c.phone ? `sms:${c.phone.replace(/\s/g, '')}?&body=${encodeURIComponent(msg)}` : '';
    const mailHref = c.email
      ? `mailto:${c.email}?subject=${encodeURIComponent('Quote ' + jobNo + ' — Cleaned By Rell')}&body=${encodeURIComponent(msg)}`
      : '';

    // these tiles only exist on the home page
    const sms = $('#smsLink'), mail = $('#mailLink');
    if (sms  && smsHref)  { sms.href  = smsHref;  sms.querySelector('span').textContent  = c.phone; }
    if (mail && mailHref) { mail.href = mailHref; mail.querySelector('span').textContent = c.email; }

    const external = CONFIG.booking.url || smsHref || `https://instagram.com/${c.instagram}`;
    [$('#send'), $('#stickBtn')].filter(Boolean).forEach(btn => {
      btn.href = external;
      if (external !== smsHref) { btn.target = '_blank'; btn.rel = 'noopener'; }
      btn.dataset.msg = msg;
    });
  }

  /* ---- wiring -------------------------------------------------------------- */
  [$('#send'), $('#stickBtn')].filter(Boolean).forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.clipboard) navigator.clipboard.writeText(btn.dataset.msg).catch(() => {});
    });
  });

  $('#surWrap').addEventListener('click', e => {
    const btn = e.target.closest('button[data-d]');
    if (!btn) return;
    bump('sur', btn.closest('[data-sur]').dataset.sur, +btn.dataset.d);
  });

  $('#surWrap').addEventListener('change', e => {
    const m = (e.target.name || '').match(/^sur-(.+)$/);
    if (m) answerSurcharge(m[1], e.target.value === 'yes');
  });

  $('#qtyWrap').addEventListener('click', e => {
    const btn = e.target.closest('button[data-d]');
    if (!btn) return;
    const box = btn.closest('[data-pkg],[data-add]');
    const kind = box.dataset.pkg ? 'pkg' : 'add';
    bump(kind, box.dataset.pkg || box.dataset.add, +btn.dataset.d);
  });

  $('#docket').addEventListener('change', render);

  const stick = $('#stick');
  if (stick) {
    new IntersectionObserver(([e]) => {
      stick.classList.toggle('on', e.boundingClientRect.top < 0 || e.isIntersecting);
    }, { threshold: 0 }).observe($('#docket'));

    // tuck it away once they reach the foot of the page
    const tail = $('.nudge');
    if (tail) new IntersectionObserver(([e]) => {
      if (e.isIntersecting) stick.classList.remove('on');
    }, { threshold: .2 }).observe(tail);
  }

  buildQty();
  buildSurcharges();
  render();
}

/* -------------------------------------------------------------- stains ---- */
function pageStains() {
  const FIG = {
    surface: `<svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Threads seen end-on, still white, with dirt resting on top of them.">
    <defs><clipPath id="clipSurface"><rect x="4" y="4" width="292" height="142" rx="5"/></clipPath></defs>
    <rect x="4" y="4" width="292" height="142" rx="5" fill="#FFFFFF" stroke="#DDE4E9"/>
    <g clip-path="url(#clipSurface)">
      <circle cx="22" cy="46" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="60" cy="46" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="98" cy="46" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="136" cy="46" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="174" cy="46" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="212" cy="46" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="250" cy="46" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="288" cy="46" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="41" cy="80" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="79" cy="80" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="117" cy="80" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="155" cy="80" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="193" cy="80" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="231" cy="80" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="269" cy="80" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="22" cy="114" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="60" cy="114" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="98" cy="114" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="136" cy="114" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="174" cy="114" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="212" cy="114" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="250" cy="114" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="288" cy="114" r="17" fill="#F2F5F7" stroke="#C8D0D7" stroke-width="1.5"/>
      <ellipse cx="44" cy="30" rx="9" ry="5.58" fill="#8A7461" opacity=".88"/>
      <ellipse cx="90" cy="26" rx="7" ry="4.34" fill="#8A7461" opacity=".88"/>
      <ellipse cx="133" cy="32" rx="10" ry="6.2" fill="#8A7461" opacity=".88"/>
      <ellipse cx="178" cy="27" rx="8" ry="4.96" fill="#8A7461" opacity=".88"/>
      <ellipse cx="216" cy="31" rx="7" ry="4.34" fill="#8A7461" opacity=".88"/>
      <ellipse cx="254" cy="28" rx="9" ry="5.58" fill="#8A7461" opacity=".88"/>
      <ellipse cx="68" cy="52" rx="6" ry="3.7199999999999998" fill="#8A7461" opacity=".88"/>
      <ellipse cx="154" cy="56" rx="7" ry="4.34" fill="#8A7461" opacity=".88"/>
      <ellipse cx="234" cy="54" rx="6" ry="3.7199999999999998" fill="#8A7461" opacity=".88"/>
      <ellipse cx="112" cy="50" rx="5" ry="3.1" fill="#8A7461" opacity=".88"/>
      <ellipse cx="198" cy="52" rx="5" ry="3.1" fill="#8A7461" opacity=".88"/>
    </g>
  </svg>`,
    material: `<svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The same threads, now coloured all the way through.">
    <defs><clipPath id="clipMaterial"><rect x="4" y="4" width="292" height="142" rx="5"/></clipPath></defs>
    <rect x="4" y="4" width="292" height="142" rx="5" fill="#FFFFFF" stroke="#DDE4E9"/>
    <g clip-path="url(#clipMaterial)">
      <circle cx="22" cy="46" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="60" cy="46" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="98" cy="46" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="136" cy="46" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="174" cy="46" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="212" cy="46" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="250" cy="46" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="288" cy="46" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="41" cy="80" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="79" cy="80" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="117" cy="80" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="155" cy="80" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="193" cy="80" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="231" cy="80" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="269" cy="80" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="22" cy="114" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="60" cy="114" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="98" cy="114" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="136" cy="114" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="174" cy="114" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="212" cy="114" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="250" cy="114" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
      <circle cx="288" cy="114" r="17" fill="#B9A08A" stroke="#C8D0D7" stroke-width="1.5"/>
    </g>
  </svg>`
  };
  const FIGCAP = {
    surface: 'Threads seen end-on. The dirt is resting on top; the thread underneath is still white.',
    material: 'The same threads, coloured all the way through. There is nothing sitting on top to lift off.'
  };

  $('#scopeHead').innerHTML  = esc(CONFIG.scope.heading).replace(/\n/g, '<br>');
  $('#scopeIntro').textContent = CONFIG.scope.intro;

  $('#levels').innerHTML = CONFIG.scope.levels.map(l => `
    <article class="lvl lvl--${l.good ? 'yes' : 'no'}">
      <div class="lvl-top">
        <h3>${esc(l.name)}</h3>
        <span class="lvl-verdict">${esc(l.verdict)}</span>
      </div>
      <div class="lvl-fig">${FIG[l.id] || ''}</div>
      <p class="lvl-cap">${esc(FIGCAP[l.id] || '')}</p>
      <p class="lvl-body">${esc(l.body)}</p>
      <ul class="lvl-ex">${l.examples.map(e => `<li>${esc(e)}</li>`).join('')}</ul>
    </article>`).join('');

  const D = CONFIG.scope.damage;
  $('#scopeNotes').innerHTML =
    CONFIG.scope.notes.map(n => `
      <div class="note"><h4>${esc(n.t)}</h4><p>${esc(n.b)}</p></div>`).join('')
    + `<div class="note">
         <h4>${esc(D.t)}</h4><p>${esc(D.b)}</p>
         <ul class="lvl-ex">${D.examples.map(e => `<li>${esc(e)}</li>`).join('')}</ul>
       </div>`;

  $('#scopeOut').innerHTML = `<b>Still unsure?</b> ${esc(CONFIG.scope.outText)}`;
}

/* ----------------------------------------------------------- questions ---- */
function pageQuestions() {
  $('#faqList').innerHTML = CONFIG.faq.map(f => `
    <details>
      <summary>${esc(f.q)}</summary>
      <div class="faq-a"><p>${esc(f.a)}</p></div>
    </details>`).join('');
}

chrome();
({ home: pageHome, quote: pageQuote, stains: pageStains, questions: pageQuestions }
  [document.body.dataset.page] || (() => {}))();
