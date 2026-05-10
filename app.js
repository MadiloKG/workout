// ═════════════════════════════════════════════════════════════════════════
// BANKAI · app.js
// ═════════════════════════════════════════════════════════════════════════

// ── ANTI-ZOOM iOS (gestures + double-tap) ─────────────────────────────────
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend', e => e.preventDefault());
let _lastTap = 0;
document.addEventListener('touchend', e => {
  const now = Date.now();
  if (now - _lastTap < 320) e.preventDefault();
  _lastTap = now;
}, { passive: false });

// ── CONSTANTES ────────────────────────────────────────────────────────────
const POLY = ["Leg Press","Fentes","Tractions","Rowing","RDL","Hip Thrust","Développé couché","Dips"];
const REST_T = { Force:180, Hypertrophie:90, Métabolique:60, "Avant-bras":60, Cardio:0 };
const ZONES = {
  Force:        {color:"#7a95a8", bg:"rgba(89,112,129,.12)", border:"rgba(89,112,129,.3)"},
  Hypertrophie: {color:"#D2D2D2", bg:"rgba(210,210,210,.08)", border:"rgba(210,210,210,.2)"},
  Métabolique:  {color:"#9db3c0", bg:"rgba(89,112,129,.1)",  border:"rgba(89,112,129,.25)"},
  "Avant-bras": {color:"#597081", bg:"rgba(89,112,129,.1)",  border:"rgba(89,112,129,.22)"},
  Cardio:       {color:"#aaaaaa", bg:"rgba(210,210,210,.06)", border:"rgba(210,210,210,.15)"},
};
const ZONE_LIST = ["Force","Hypertrophie","Métabolique","Avant-bras","Cardio"];

// ── DAYS (méta) ───────────────────────────────────────────────────────────
const DAYS_META = [
  { id:"lundi",    label:"LUNDI",    sub:"Upper A · Push",            color:"#7a95a8" },
  { id:"mardi",    label:"MARDI",    sub:"Lower A · Quad",            color:"#9db3c0" },
  { id:"jeudi",    label:"JEUDI",    sub:"Upper B · Pull",            color:"#D2D2D2" },
  { id:"vendredi", label:"VENDREDI", sub:"Lower B · Ischio/Fessier",  color:"#597081" },
];

// ── PROGRAMME PAR DÉFAUT ──────────────────────────────────────────────────
const DEFAULT_EXOS = {
  lundi: [
    {id:"dci",   name:"Développé couché incliné",    muscle:"Pectoraux sup.",       w:17.5, unit:"kg/côté",    sets:4, reps:"6-8",   zone:"Force",        note:"Premier exercice, pectoraux frais. RPE cible 7-8."},
    {id:"dips",  name:"Dips lestés",                 muscle:"Pectoraux bas / Triceps", w:5,  unit:"kg lest",   sets:3, reps:"10-12", zone:"Hypertrophie", note:"Remplace DCP. Même stim pec/tri, moins de fatigue articulaire."},
    {id:"pd",    name:"Pec Deck machine",            muscle:"Pectoraux (fin.)",     w:30,   unit:"kg",         sets:3, reps:"15-20", zone:"Métabolique",  note:"Finition isolation."},
    {id:"dem",   name:"Développé épaules machine",   muscle:"Deltoïdes ant.",       w:22,   unit:"kg",         sets:3, reps:"10-12", zone:"Hypertrophie"},
    {id:"elc",   name:"Élévations latérales câble",  muscle:"Deltoïdes lat.",       w:5,    unit:"kg/côté",    sets:4, reps:"15-20", zone:"Métabolique"},
    {id:"etc",   name:"Extension triceps corde",     muscle:"Triceps",              w:17.5, unit:"kg",         sets:3, reps:"10-12", zone:"Hypertrophie"},
    {id:"sk",    name:"Skull crusher haltères",      muscle:"Triceps long",         w:8,    unit:"kg/côté",    sets:3, reps:"10-12", zone:"Hypertrophie"},
    {id:"hiit_l",name:"HIIT vélo elliptique",        muscle:"Cardio",               w:8,    unit:"intervalles",sets:1, reps:"8×30s", zone:"Cardio", isCardio:true},
  ],
  mardi: [
    {id:"lp",    name:"Leg Press",            muscle:"Quadriceps",       w:120, unit:"kg",        sets:4, reps:"6-8",    zone:"Force",        note:"Quadriceps frais. Amplitude complète, genoux à 90°."},
    {id:"fb",    name:"Fentes bulgares",      muscle:"Quad / Fessiers",  w:10,  unit:"kg/main",   sets:3, reps:"10/jambe", zone:"Hypertrophie", note:"Avant Leg Extension pour stabilité."},
    {id:"le",    name:"Leg Extension",        muscle:"Quad (iso)",       w:40,  unit:"kg",        sets:3, reps:"15-20",  zone:"Métabolique"},
    {id:"lcc",   name:"Leg Curl couché",      muscle:"Ischio-jambiers",  w:42,  unit:"kg",        sets:4, reps:"10-12",  zone:"Hypertrophie", note:"Ischio frais, pas pré-fatigués."},
    {id:"cm",    name:"Crunch machine",       muscle:"Abdominaux",       w:10,  unit:"kg",        sets:3, reps:"12-15",  zone:"Hypertrophie"},
    {id:"pp",    name:"Pallof Press câble",   muscle:"Core / Obliques",  w:8,   unit:"kg",        sets:3, reps:"12/côté", zone:"Hypertrophie"},
    {id:"liss_m",name:"LISS Rameur",          muscle:"Cardio",           w:0,   unit:"20min",     sets:1, reps:"65% FC max", zone:"Cardio", isCardio:true},
  ],
  jeudi: [
    {id:"tr",    name:"Tractions lestées",            muscle:"Dos / Biceps",    w:5,  unit:"kg lest",  sets:4, reps:"6-8",   zone:"Force",        note:"Dos frais. RPE 7-8. Dead hang en bas."},
    {id:"rhs",   name:"Rowing Hammer Strength",       muscle:"Dos (épaisseur)", w:30, unit:"kg/côté",  sets:4, reps:"8-10",  zone:"Hypertrophie", note:"Avant Tirage poitrine : dos encore frais."},
    {id:"tp",    name:"Tirage poitrine câble",        muscle:"Dos (largeur)",   w:50, unit:"kg",       sets:3, reps:"10-12", zone:"Hypertrophie"},
    {id:"fp",    name:"Face Pull câble corde",        muscle:"Deltoïdes post.", w:12, unit:"kg",       sets:4, reps:"15-20", zone:"Métabolique"},
    {id:"sh",    name:"Shrug haltères",               muscle:"Trapèzes",        w:14, unit:"kg/main",  sets:3, reps:"12-15", zone:"Métabolique"},
    {id:"cb",    name:"Curl biceps supination",       muscle:"Biceps",          w:10, unit:"kg/côté",  sets:3, reps:"10-12", zone:"Hypertrophie"},
    {id:"cm2",   name:"Curl marteau",                 muscle:"Brachial / Biceps", w:12, unit:"kg/côté",sets:3, reps:"10-12", zone:"Hypertrophie"},
    {id:"wc",    name:"Wrist curl",                   muscle:"Avant-bras",      w:7,  unit:"kg",       sets:2, reps:"12-15", zone:"Avant-bras"},
    {id:"rvc",   name:"Reverse curl",                 muscle:"Avant-bras ext.", w:8,  unit:"kg",       sets:2, reps:"12-15", zone:"Avant-bras"},
  ],
  vendredi: [
    {id:"rdl",   name:"RDL haltères",          muscle:"Ischio / Fessiers", w:15, unit:"kg/main",   sets:4, reps:"8-10",   zone:"Hypertrophie", note:"Chaîne post fraîche. Mouvement technique lourd."},
    {id:"ht",    name:"Hip Thrust machine",    muscle:"Fessiers",          w:70, unit:"kg",        sets:4, reps:"10-12",  zone:"Hypertrophie", note:"Fessiers pré-activés par le RDL."},
    {id:"lca",   name:"Leg Curl assis",        muscle:"Ischio-jambiers",   w:35, unit:"kg",        sets:3, reps:"15-20",  zone:"Métabolique"},
    {id:"fmv",   name:"Fentes marchées",       muscle:"Quad / Fessiers",   w:10, unit:"kg/main",   sets:3, reps:"10/jambe", zone:"Hypertrophie"},
    {id:"mol",   name:"Mollets machine",       muscle:"Mollets",           w:50, unit:"kg",        sets:4, reps:"15-20",  zone:"Métabolique"},
    {id:"rj",    name:"Relevés de jambes",     muscle:"Abdominaux bas",    w:0,  unit:"pds corps", sets:3, reps:"12-15",  zone:"Hypertrophie"},
    {id:"fc",    name:"Farmer's carry",        muscle:"Avant-bras / Core", w:18, unit:"kg/main",   sets:3, reps:"25m",    zone:"Avant-bras"},
    {id:"hiit_v",name:"HIIT Skillmill",        muscle:"Cardio",            w:6,  unit:"intervalles", sets:1, reps:"6×40s", zone:"Cardio", isCardio:true},
  ],
};

const MUSCLES = ["Pectoraux","Dos","Épaules","Triceps","Biceps","Avant-bras","Quadriceps","Ischio-jambiers","Fessiers","Abdominaux","Mollets","Core"];
function mg(m){
  if(m.includes("Pect"))return"Pectoraux";if(m.includes("Dos"))return"Dos";
  if(m.includes("Delt")||m.includes("paul"))return"Épaules";if(m.includes("Tric"))return"Triceps";
  if(m.includes("Bic")||m.includes("Brach"))return"Biceps";if(m.includes("Avant"))return"Avant-bras";
  if(m.includes("Quad"))return"Quadriceps";if(m.includes("Ischio"))return"Ischio-jambiers";
  if(m.includes("Fess"))return"Fessiers";if(m.includes("Abdo"))return"Abdominaux";
  if(m.includes("Molet")||m.includes("Mollet"))return"Mollets";return"Core";
}

// ── STATE ─────────────────────────────────────────────────────────────────
let S = {}, H = [], aDay = 0, pending = null, selExo = null;
let editingExo = null; // { dayId, exoId } ou { dayId, isNew: true }

const STORAGE_KEY = "bk7";        // bumped pour nouveau format
const STORAGE_HIST = "bk7h";

function defaultSets(ex){
  const r = String(ex.reps).split("-")[0] || ex.reps;
  return Array.from({length:ex.sets}, () => ({ w:ex.w, reps:r, rpe:0, done:false }));
}

function initS(){
  const now = new Date(), dow = now.getDay(), diff = dow===0 ? -6 : 1-dow;
  const mon = new Date(now); mon.setDate(now.getDate()+diff);
  const s = {
    weekNum: 1,
    startDate: mon.toISOString().split("T")[0],
    exos: {},
    data: {},
  };
  DAYS_META.forEach(d => {
    s.exos[d.id] = JSON.parse(JSON.stringify(DEFAULT_EXOS[d.id]));
    s.data[d.id] = {};
    s.exos[d.id].forEach(e => {
      s.data[d.id][e.id] = e.isCardio ? { done:false } : { sets:defaultSets(e) };
    });
  });
  return s;
}

function migrateOldState(){
  // Migration depuis l'ancien format bk6 (DAYS const + S[dayId][exoId])
  try {
    const raw = localStorage.getItem("bk6");
    if (!raw) return null;
    const old = JSON.parse(raw);
    const s = {
      weekNum: old.weekNum || 1,
      startDate: old.startDate || initS().startDate,
      exos: {},
      data: {},
    };
    DAYS_META.forEach(d => {
      s.exos[d.id] = JSON.parse(JSON.stringify(DEFAULT_EXOS[d.id]));
      s.data[d.id] = {};
      s.exos[d.id].forEach(e => {
        const oldEx = old[d.id]?.[e.id];
        if (e.isCardio) s.data[d.id][e.id] = { done: !!oldEx?.done };
        else if (oldEx?.sets) s.data[d.id][e.id] = { sets: oldEx.sets };
        else s.data[d.id][e.id] = { sets: defaultSets(e) };
      });
    });
    return s;
  } catch { return null; }
}

function load(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      S = JSON.parse(raw);
    } else {
      const migrated = migrateOldState();
      S = migrated || initS();
      save();
    }
  } catch { S = initS(); }
  // Sécurité : assure que toutes les structures existent
  if (!S.exos) S.exos = {};
  if (!S.data) S.data = {};
  DAYS_META.forEach(d => {
    if (!S.exos[d.id]) S.exos[d.id] = JSON.parse(JSON.stringify(DEFAULT_EXOS[d.id]));
    if (!S.data[d.id]) S.data[d.id] = {};
    S.exos[d.id].forEach(e => {
      if (!S.data[d.id][e.id]) {
        S.data[d.id][e.id] = e.isCardio ? { done:false } : { sets:defaultSets(e) };
      }
    });
  });
  try {
    const h = localStorage.getItem(STORAGE_HIST);
    H = h ? JSON.parse(h) : [];
  } catch { H = []; }
}

function save(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
    localStorage.setItem(STORAGE_HIST, JSON.stringify(H));
  } catch (e) { console.warn("Save failed:", e); }
}

function fd(iso){return new Date(iso).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});}
function ad(iso,n){const d=new Date(iso);d.setDate(d.getDate()+n);return d.toISOString().split("T")[0];}
function poly(n){return POLY.some(p => n.includes(p));}
function restLbl(z){const s=REST_T[z]||90;return s>=60 ? `${s/60}min` : `${s}s`;}
function uid(){return "x"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}

// ── PERF / FATIGUE ────────────────────────────────────────────────────────
function dayExos(dayId){ return S.exos[dayId] || []; }

function dayPg(id){
  const exos = dayExos(id);
  let done=0, tot=0;
  exos.forEach(e => {
    if (e.isCardio) { tot++; if (S.data[id][e.id]?.done) done++; }
    else { const sets = S.data[id][e.id]?.sets || []; tot += sets.length; done += sets.filter(s=>s.done).length; }
  });
  return { done, tot, pct: tot ? Math.round(done/tot*100) : 0 };
}

function dayFatigue(id){
  let rpeTotal=0, rpeCount=0, repRatio=0, repCount=0;
  dayExos(id).forEach(e => {
    if (e.isCardio) return;
    const sets = S.data[id][e.id]?.sets || [];
    sets.filter(s => s.done).forEach(s => {
      if (s.rpe>0) { rpeTotal += s.rpe; rpeCount++; }
      const target = parseFloat(String(e.reps).split("-")[1] || String(e.reps).split("-")[0] || e.reps) || 12;
      const actual = parseFloat(s.reps) || 0;
      repRatio += Math.min(1, actual/target); repCount++;
    });
  });
  return {
    avgRpe: rpeCount ? Math.round(rpeTotal/rpeCount*10)/10 : null,
    repEff: repCount ? Math.round(repRatio/repCount*100) : null,
  };
}

function exoPerf(dId, eId){
  const sets = S.data[dId]?.[eId]?.sets || [];
  const done = sets.filter(s => s.done);
  if (!done.length) return null;
  const avgW = done.reduce((a,s) => a + (parseFloat(s.w)||0), 0) / done.length;
  const rpes = done.filter(s => s.rpe>0);
  const avgRpe = rpes.length ? rpes.reduce((a,s) => a + s.rpe, 0) / rpes.length : null;
  return { avgW, avgRpe, doneCount: done.length };
}

// ── TIMER ─────────────────────────────────────────────────────────────────
let tIv=null, tTotal=0, tLeft=0, tPaused=false;
const CIRC = 2 * Math.PI * 80;
function startTimer(exo){
  const sec = REST_T[exo.zone] || 90;
  if (!sec) { showBankai(); return; }
  tTotal = sec; tLeft = sec; tPaused = false;
  document.getElementById("tName").textContent = exo.name.toUpperCase();
  document.getElementById("tPause").textContent = "⏸";
  document.getElementById("tOv").classList.add("open");
  updT(); clearInterval(tIv); tIv = setInterval(tick, 1000);
}
function tick(){ if (tPaused) return; tLeft--; if (tLeft<=0) { tLeft=0; updT(); clearInterval(tIv); closeTimer(); showBankai(); return; } updT(); }
function updT(){
  const m = Math.floor(tLeft/60), s = tLeft%60;
  document.getElementById("tTime").textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  const r = tTotal>0 ? tLeft/tTotal : 0, off = CIRC*(1-r);
  const p = document.getElementById("tProg");
  p.style.strokeDashoffset = off;
  const ratio = 1-r;
  p.style.stroke = ratio<.5 ? "#597081" : ratio<.8 ? "#9db3c0" : "#D2D2D2";
}
function togglePause(){ tPaused = !tPaused; document.getElementById("tPause").textContent = tPaused ? "▶" : "⏸"; }
function skipTimer(){ clearInterval(tIv); closeTimer(); showBankai(); }
function closeTimer(){ document.getElementById("tOv").classList.remove("open"); clearInterval(tIv); }
function adj(s){ tLeft = Math.max(5, tLeft + s); if (s>0) tTotal = Math.max(tTotal, tLeft); updT(); }

// ── BANKAI ────────────────────────────────────────────────────────────────
function showBankai(){
  if (navigator.vibrate) navigator.vibrate([80,40,80,40,250]);
  document.getElementById("bkOv").classList.add("open");
  setTimeout(closeBankai, 4500);
}
function closeBankai(){ document.getElementById("bkOv").classList.remove("open"); }

// ── RENDER ────────────────────────────────────────────────────────────────
function rpeColor(v){ if (!v) return "rgba(89,112,129,.3)"; if (v>=9) return "#D2D2D2"; if (v>=7) return "#9db3c0"; return "#597081"; }

function render(){
  const day = DAYS_META[aDay];
  const pg = dayPg(day.id), fat = dayFatigue(day.id);

  let fatHtml = "";
  if (fat.avgRpe !== null) {
    const rpeC = fat.avgRpe>=9 ? "#D2D2D2" : fat.avgRpe>=7 ? "#9db3c0" : "#597081";
    const rpeBg = fat.avgRpe>=9 ? "rgba(210,210,210,.1)" : fat.avgRpe>=7 ? "rgba(89,112,129,.1)" : "rgba(89,112,129,.06)";
    fatHtml += `<span class="f-chip" style="color:${rpeC};background:${rpeBg};border-color:${rpeC}">RPE moy. ${fat.avgRpe}</span>`;
  }
  if (fat.repEff !== null) {
    const effC = fat.repEff>=90 ? "#9db3c0" : fat.repEff>=70 ? "#7a95a8" : "#597081";
    const effBg = fat.repEff>=90 ? "rgba(89,112,129,.1)" : "rgba(89,112,129,.06)";
    fatHtml += `<span class="f-chip" style="color:${effC};background:${effBg};border-color:${effC}">Eff. reps ${fat.repEff}%</span>`;
  }

  document.getElementById("root").innerHTML = `
    <div class="hdr">
      <div class="hdr-glass">
        <div class="hdr-inner">
          <div class="hdr-top">
            <div class="hdr-left">
              <div class="logo">
                <div class="logo-icon">⚔️</div>
                <div class="logo-text">BANKAI</div>
              </div>
              <div class="week-pill">
                <div class="week-num">S${S.weekNum}</div>
                <div class="week-date">${fd(S.startDate)} → ${fd(ad(S.startDate,6))}</div>
              </div>
            </div>
            <div class="hdr-right">
              <button class="act-btn" onclick="openRecap()" aria-label="Récap">📊</button>
              <button class="act-btn" onclick="openHistory()" aria-label="Historique">📈</button>
              <button class="act-btn" onclick="openBackup()" aria-label="Sauvegarde">💾</button>
              <button class="act-btn" onclick="resetDay('${day.id}')" aria-label="Reset jour">↺</button>
              <button class="act-btn act-btn-next" onclick="openNext()">SEM+</button>
            </div>
          </div>
          <div class="tabs-wrap">
            ${DAYS_META.map((d,i) => `<button class="tab ${i===aDay?"active":""}" onclick="switchDay(${i})">${d.label}</button>`).join("")}
          </div>
        </div>
      </div>
    </div>
    <div class="fatigue-bar">
      <div class="fatigue-inner">
        <div class="pg-row">
          <div style="display:flex;align-items:baseline;gap:4px">
            <span class="pg-done" id="pgDone">${pg.done}</span>
            <span class="pg-total" id="pgTotal">/ ${pg.tot} séries</span>
          </div>
          <span class="pg-pct" id="pgPct">${pg.pct}%</span>
        </div>
        <div class="pg-track"><div class="pg-fill" id="pgFill" style="width:${pg.pct}%"></div></div>
        <div class="fatigue-row">
          <span class="fatigue-lbl">${day.label} — ${day.sub}</span>
          <div class="fatigue-chips" id="fatChips">${fatHtml}</div>
        </div>
      </div>
    </div>
    <div class="grid">
      ${dayExos(day.id).map(e => renderCard(e, day)).join("")}
      <div class="add-exo-card" onclick="openExoEditor('${day.id}', null)">
        <div class="add-icon">＋</div>
        <div class="add-lbl">AJOUTER UN EXERCICE</div>
      </div>
    </div>`;
}

function renderCard(ex, day){
  const z = ZONES[ex.zone] || ZONES["Hypertrophie"];
  const rl = restLbl(ex.zone);

  if (ex.isCardio) {
    const done = S.data[day.id][ex.id]?.done;
    return `<div class="card" data-exo="${day.id}-${ex.id}" style="border-color:${z.border}">
      <div class="card-line"></div>
      <div class="card-body">
        <div class="card-head">
          <div style="min-width:0;flex:1">
            <div class="card-name">${ex.name}</div>
            <div class="card-muscle">${ex.muscle}</div>
          </div>
          <div class="card-head-r">
            <span class="zone-badge" style="background:${z.bg};color:${z.color};border-color:${z.border}">${ex.zone}</span>
            <div class="exo-actions">
              <button class="exo-act" onclick="openExoEditor('${day.id}','${ex.id}')" aria-label="Modifier">✎</button>
              <button class="exo-act" onclick="deleteExo('${day.id}','${ex.id}')" aria-label="Supprimer">🗑</button>
            </div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0">
          <div class="set-check ${done?"checked":""}" onclick="togCardio('${day.id}','${ex.id}')">✓</div>
          <span style="font-size:.75rem;color:var(--muted2)">${ex.reps} — ${ex.w} ${ex.unit}</span>
        </div>
        ${ex.note ? `<div style="font-size:.62rem;color:var(--muted);font-style:italic;padding:0 2px">${ex.note}</div>` : ""}
      </div>
    </div>`;
  }

  const sets = S.data[day.id][ex.id]?.sets || defaultSets(ex);

  const rows = sets.map((s, i) => {
    const rpeC = rpeColor(s.rpe);
    return `<div class="set-row ${s.done?"done-row":""}">
      <span class="set-num">${i+1}</span>
      <input class="set-input ${s.done?"done-input":""}" type="number" inputmode="decimal" step="0.5" value="${s.w}"
        onfocus="this.select()"
        onchange="setVal('${day.id}','${ex.id}',${i},'w',this.value)"
        style="border-color:${s.done?"rgba(89,112,129,.35)":"rgba(89,112,129,.18)"}">
      <input class="set-input ${s.done?"done-input":""}" type="number" inputmode="numeric" min="0" max="50" value="${s.reps}"
        onfocus="this.select()"
        onchange="setVal('${day.id}','${ex.id}',${i},'reps',this.value)"
        style="border-color:${s.done?"rgba(89,112,129,.35)":"rgba(89,112,129,.18)"}">
      <div class="rpe-input-wrap">
        <input class="rpe-input" type="number" inputmode="numeric" min="0" max="10" value="${s.rpe||""}" placeholder="—"
          onfocus="this.select()"
          onchange="setVal('${day.id}','${ex.id}',${i},'rpe',this.value)"
          style="border-color:${s.rpe?rpeC:"rgba(89,112,129,.18)"};color:${s.rpe?rpeC:"var(--muted2)"}">
      </div>
      <div class="set-check ${s.done?"checked":""}" onclick="togSet('${day.id}','${ex.id}',${i})">✓</div>
    </div>`;
  }).join("");

  return `<div class="card" data-exo="${day.id}-${ex.id}" style="border-color:${z.border}">
    <div class="card-line"></div>
    <div class="card-body">
      <div class="card-head">
        <div style="min-width:0;flex:1">
          <div class="card-name">${ex.name}</div>
          <div class="card-muscle">${ex.muscle}</div>
        </div>
        <div class="card-head-r">
          <span class="zone-badge" style="background:${z.bg};color:${z.color};border-color:${z.border}">${ex.zone}</span>
          <div class="exo-actions">
            <button class="exo-act" onclick="openExoEditor('${day.id}','${ex.id}')" aria-label="Modifier">✎</button>
            <button class="exo-act" onclick="deleteExo('${day.id}','${ex.id}')" aria-label="Supprimer">🗑</button>
          </div>
        </div>
      </div>
      ${ex.note ? `<div style="font-size:.62rem;color:var(--muted);font-style:italic;padding:0 2px;border-left:2px solid var(--steel);padding-left:7px">${ex.note}</div>` : ""}
      <div class="perf-wrap" data-perf="${day.id}-${ex.id}">${renderPerfHtml(day.id, ex)}</div>
      <div class="sets-table">
        <div class="sets-header">
          <span>SÉR.</span><span>KG</span><span>REPS</span><span>RPE</span><span></span>
        </div>
        ${rows}
      </div>
      <div class="timer-btn" onclick='startTimer(${JSON.stringify({id:ex.id,name:ex.name,zone:ex.zone}).replace(/'/g,"&#39;")})'>
        <div class="timer-btn-l">
          <div class="timer-icon">⏱</div>
          <span>Récupération</span>
        </div>
        <span class="timer-dur">${rl}</span>
      </div>
    </div>
  </div>`;
}

function renderPerfHtml(dId, ex) {
  const perf = exoPerf(dId, ex.id);
  if (!perf) return "";
  const avgRpeC = perf.avgRpe ? (perf.avgRpe>=9 ? "#D2D2D2" : perf.avgRpe>=7 ? "#9db3c0" : "#7a95a8") : "var(--muted)";
  return `<div class="card-perf">
    <div class="perf-item">
      <span class="perf-val" style="color:var(--light2)">${perf.doneCount}/${ex.sets}</span>
      <span class="perf-lbl">SÉRIES</span>
    </div>
    <div class="perf-sep"></div>
    <div class="perf-item">
      <span class="perf-val" style="color:var(--steel2)">${perf.avgW.toFixed(1)}</span>
      <span class="perf-lbl">KG MOY</span>
    </div>
    <div class="perf-sep"></div>
    <div class="perf-item">
      <span class="perf-val" style="color:${avgRpeC}">${perf.avgRpe ? perf.avgRpe.toFixed(1) : "—"}</span>
      <span class="perf-lbl">RPE MOY</span>
    </div>
  </div>`;
}

// ── REFRESH PARTIEL (sans re-render full → garde le focus input) ─────────
function refreshPerfFor(dId, eId) {
  const wrap = document.querySelector(`[data-perf="${dId}-${eId}"]`);
  if (!wrap) return;
  const ex = dayExos(dId).find(e => e.id === eId);
  if (ex) wrap.innerHTML = renderPerfHtml(dId, ex);
}
function refreshFatigueBar() {
  const day = DAYS_META[aDay];
  const pg = dayPg(day.id), fat = dayFatigue(day.id);
  const $d = document.getElementById("pgDone"), $t = document.getElementById("pgTotal"), $p = document.getElementById("pgPct"), $f = document.getElementById("pgFill"), $c = document.getElementById("fatChips");
  if ($d) $d.textContent = pg.done;
  if ($t) $t.textContent = `/ ${pg.tot} séries`;
  if ($p) $p.textContent = `${pg.pct}%`;
  if ($f) $f.style.width = `${pg.pct}%`;
  if ($c) {
    let html = "";
    if (fat.avgRpe !== null) {
      const rpeC = fat.avgRpe>=9 ? "#D2D2D2" : fat.avgRpe>=7 ? "#9db3c0" : "#597081";
      const rpeBg = fat.avgRpe>=9 ? "rgba(210,210,210,.1)" : fat.avgRpe>=7 ? "rgba(89,112,129,.1)" : "rgba(89,112,129,.06)";
      html += `<span class="f-chip" style="color:${rpeC};background:${rpeBg};border-color:${rpeC}">RPE moy. ${fat.avgRpe}</span>`;
    }
    if (fat.repEff !== null) {
      const effC = fat.repEff>=90 ? "#9db3c0" : fat.repEff>=70 ? "#7a95a8" : "#597081";
      const effBg = fat.repEff>=90 ? "rgba(89,112,129,.1)" : "rgba(89,112,129,.06)";
      html += `<span class="f-chip" style="color:${effC};background:${effBg};border-color:${effC}">Eff. reps ${fat.repEff}%</span>`;
    }
    $c.innerHTML = html;
  }
}

// ── INTERACTIONS ──────────────────────────────────────────────────────────
function switchDay(i){ aDay = i; render(); }

function togSet(dId, eId, idx){
  const sets = S.data[dId][eId].sets;
  sets[idx].done = !sets[idx].done;
  save();
  // Re-render juste la card (pour le visuel done-row)
  rerenderCard(dId, eId);
  refreshFatigueBar();
}

function togCardio(dId, eId){
  S.data[dId][eId].done = !S.data[dId][eId].done;
  save();
  rerenderCard(dId, eId);
  refreshFatigueBar();
}

function rerenderCard(dId, eId) {
  const card = document.querySelector(`[data-exo="${dId}-${eId}"]`);
  if (!card) return;
  const day = DAYS_META.find(d => d.id === dId);
  const ex = dayExos(dId).find(e => e.id === eId);
  if (!day || !ex) return;
  const tmp = document.createElement("div");
  tmp.innerHTML = renderCard(ex, day);
  card.replaceWith(tmp.firstElementChild);
}

// IMPORTANT : setVal n'appelle PAS render() — il met juste à jour l'état
// + rafraîchit le perf summary et la fatigue bar. L'input garde son focus.
function setVal(dId, eId, idx, key, val){
  const sets = S.data[dId][eId].sets;
  let v;
  if (key === "rpe") v = Math.min(10, Math.max(0, parseFloat(val) || 0));
  else if (key === "reps") v = Math.max(0, parseInt(val,10) || 0);
  else v = parseFloat(val) || 0;
  sets[idx][key] = v;
  save();
  refreshPerfFor(dId, eId);
  refreshFatigueBar();
}

function resetDay(dId){
  if (!confirm("Réinitialiser toutes les séries de ce jour ?")) return;
  dayExos(dId).forEach(e => {
    if (e.isCardio) S.data[dId][e.id].done = false;
    else S.data[dId][e.id].sets = defaultSets(e);
  });
  save(); render();
}

// ── PROGRESSION INTELLIGENTE (RPE-aware) ──────────────────────────────────
// Logique :
//  - Échec (< moitié des séries faites) → -2.5kg
//  - Partiel (moitié à toutes-1) → maintien
//  - Toutes séries ✓ :
//      RPE moyen ≥ 9   → maintien (consolider, on est à la limite)
//      RPE moyen 7.5-9 → +1 rep (intensité élevée → augmenter volume)
//      RPE moyen < 7.5 → +charge (poly +5, iso +2.5) (séance facile)
//      RPE non renseigné → +charge par défaut (legacy)
function calcChanges(){
  const r = {};
  DAYS_META.forEach(d => {
    r[d.id] = dayExos(d.id).map(e => {
      if (e.isCardio) return { id:e.id, name:e.name, oldW:e.w, newW:e.w, deltaW:0, oldReps:e.reps, newReps:e.reps, mode:"cardio", reason:"Cardio", status:"→", hint:"" };

      const sets = S.data[d.id][e.id]?.sets || [];
      const doneSets = sets.filter(s => s.done);
      const total = e.sets;
      const all = doneSets.length >= total;
      const half = doneSets.length >= Math.ceil(total/2);

      const avgW = doneSets.length ? doneSets.reduce((a,s)=>a + (parseFloat(s.w)||0), 0) / doneSets.length : e.w;
      const avgReps = doneSets.length ? doneSets.reduce((a,s)=>a + (parseFloat(s.reps)||0), 0) / doneSets.length : 0;
      const rpes = doneSets.filter(s => s.rpe>0);
      const avgRpe = rpes.length ? rpes.reduce((a,s)=>a+s.rpe,0) / rpes.length : null;

      let mode = "hold", deltaW = 0, deltaReps = 0, reason = "Maintien", hint = "";
      let newW = avgW, newReps = e.reps;

      if (!half) {
        mode = "down"; deltaW = -2.5; reason = "Échec";
        hint = "Reps min. non atteintes → charge réduite";
      } else if (!all) {
        mode = "hold"; reason = "Partiel";
        hint = "Pas toutes les séries faites → on consolide";
      } else {
        // Toutes les séries ✓
        if (avgRpe !== null && avgRpe >= 9) {
          mode = "hold"; reason = `RPE ${avgRpe.toFixed(1)}`;
          hint = "Très dur — on consolide la charge";
        } else if (avgRpe !== null && avgRpe >= 7.5) {
          mode = "reps"; deltaReps = 1; reason = `RPE ${avgRpe.toFixed(1)}`;
          hint = "Intensité bonne → +1 rep cible";
          newReps = bumpReps(e.reps, 1);
        } else {
          mode = "up"; deltaW = poly(e.name) ? 5 : 2.5;
          reason = avgRpe !== null ? `RPE ${avgRpe.toFixed(1)}` : "Toutes ✓";
          hint = avgRpe !== null ? "Séance facile → +charge" : "Toutes ✓ → +charge";
        }
      }

      newW = Math.max(0, avgW + deltaW);
      const status = mode === "up" ? "↑kg" : mode === "reps" ? "↑rep" : mode === "down" ? "↓kg" : "→";

      return {
        id: e.id, name: e.name,
        oldW: avgW.toFixed(1), newW: newW.toFixed(1),
        deltaW, oldReps: e.reps, newReps,
        mode, reason, status, hint, avgRpe,
      };
    });
  });
  return r;
}

function bumpReps(repsStr, n) {
  // "8-10" → "9-11", "10/jambe" → "11/jambe", "12-15" → "13-16"
  if (/^\d+-\d+$/.test(repsStr)) {
    const [a,b] = repsStr.split("-").map(Number);
    return `${a+n}-${b+n}`;
  }
  const m = String(repsStr).match(/^(\d+)(.*)$/);
  if (m) return `${parseInt(m[1],10)+n}${m[2]}`;
  return repsStr;
}

function openNext(){
  pending = calcChanges();
  document.getElementById("nextSub").textContent = `Progression intelligente → Semaine ${S.weekNum+1} (RPE-aware)`;
  document.getElementById("nextContent").innerHTML = DAYS_META.map(d => `
    <div class="day-grp">
      <div class="day-grp-title"><div class="day-dot"></div>${d.label} · ${d.sub}</div>
      ${pending[d.id].map(c => {
        const col = c.status.includes("↑") ? "#D2D2D2" : c.status.includes("↓") ? "#597081" : "#9db3c0";
        const bg = c.status.includes("↑") ? "rgba(210,210,210,.12)" : c.status.includes("↓") ? "rgba(89,112,129,.12)" : "rgba(89,112,129,.08)";
        const txt = c.mode === "reps" ? `${c.oldReps} → ${c.newReps} reps`
                  : c.mode === "cardio" ? "—"
                  : `${c.oldW} → ${c.newW} kg`;
        return `<div class="ch-item" style="flex-wrap:wrap">
          <span class="ch-name">${c.name}</span>
          <span class="ch-w">${txt}</span>
          <span class="st-badge" style="background:${bg};color:${col}">${c.status}</span>
          <span class="ch-reason">${c.reason}</span>
          ${c.hint ? `<span class="ch-hint">${c.hint}</span>` : ""}
        </div>`;
      }).join("")}
    </div>`).join("");
  openSheet("nextOv");
}

function confirmNext(){
  const snap = JSON.parse(JSON.stringify(S));
  snap._label = `S${S.weekNum}`;
  H = [...H.slice(-11), snap];

  DAYS_META.forEach(d => pending[d.id].forEach(c => {
    const ex = dayExos(d.id).find(e => e.id === c.id);
    if (!ex || ex.isCardio) return;
    if (c.mode === "reps") {
      ex.reps = c.newReps;
      // garde même charge sur les séries
      S.data[d.id][c.id].sets = S.data[d.id][c.id].sets.map(s => ({ ...s, reps: String(c.newReps).split("-")[0]||c.newReps, done:false, rpe:0 }));
    } else {
      const newW = parseFloat(c.newW);
      ex.w = newW;
      S.data[d.id][c.id].sets = S.data[d.id][c.id].sets.map(s => ({ ...s, w:newW, reps: String(ex.reps).split("-")[0]||ex.reps, done:false, rpe:0 }));
    }
  }));
  S.weekNum++;
  S.startDate = ad(S.startDate, 7);
  save(); closeSheet("nextOv"); render();
}

// ── HISTORY ───────────────────────────────────────────────────────────────
function openHistory(){
  const all = DAYS_META.flatMap(d => dayExos(d.id).filter(e => !e.isCardio));
  if (!selExo || !all.find(e => e.id === selExo)) selExo = all[0]?.id || null;
  renderHist(); openSheet("histOv");
}

function renderHist(){
  const all = DAYS_META.flatMap(d => dayExos(d.id).filter(e => !e.isCardio));
  if (!all.length) {
    document.getElementById("histContent").innerHTML = `<div style="color:var(--muted);font-size:.78rem;text-align:center;padding:20px">Aucun exercice à afficher.</div>`;
    return;
  }
  const ex = all.find(e => e.id === selExo) || all[0];
  const data = H.map((snap, i) => {
    let w = null, rpe = null;
    DAYS_META.forEach(d => {
      const es = snap.data?.[d.id]?.[selExo] || snap[d.id]?.[selExo]; // compat
      if (es?.sets) {
        const ws = es.sets.map(s => parseFloat(s.w)||0);
        if (ws.length) w = ws.reduce((a,b)=>a+b,0)/ws.length;
        const rpes = es.sets.filter(s => s.rpe>0).map(s => s.rpe);
        if (rpes.length) rpe = rpes.reduce((a,b)=>a+b,0)/rpes.length;
      }
    });
    return { l: snap._label || `S${i+1}`, w, rpe };
  }).filter(d => d.w != null).slice(-6);

  const maxW = data.length ? Math.max(...data.map(d => d.w), 1) : 1;
  const maxRpe = 10;
  const rpeBars = data.length>=2 && data.some(d => d.rpe) ? `
    <div style="margin-top:14px">
      <div class="chart-ttl" style="margin-bottom:8px">RPE MOYEN</div>
      <div class="rpe-mini">${data.map(d => `
        <div class="rpe-col">
          ${d.rpe ? `<div style="font-size:.55rem;color:var(--steel2)">${d.rpe.toFixed(1)}</div>` : ""}
          <div class="rpe-bar" style="height:${d.rpe ? Math.max(4, d.rpe/maxRpe*36) : 4}px;background:${d.rpe>=9?"rgba(210,210,210,.4)":d.rpe>=7?"rgba(122,149,168,.4)":"rgba(89,112,129,.3)"}"></div>
          <div class="rpe-lbl">${d.l}</div>
        </div>`).join("")}
      </div>
    </div>` : "";

  document.getElementById("histContent").innerHTML = `
    <select class="exo-sel" onchange="selExo=this.value;renderHist()">
      ${DAYS_META.map(d => `<optgroup label="${d.label} – ${d.sub}">${dayExos(d.id).filter(e => !e.isCardio).map(e => `<option value="${e.id}" ${e.id===selExo?"selected":""}>${e.name}</option>`).join("")}</optgroup>`).join("")}
    </select>
    <div class="chart-card">
      <div class="chart-ttl">${ex.name} — CHARGE (kg)</div>
      ${data.length<2 ? `<div style="color:var(--muted);font-size:.78rem;text-align:center;padding:20px">Complète 2+ semaines pour voir la progression.</div>` : `
      <div class="mini-chart">${data.map(d => `
        <div class="bar-col">
          <div class="bar-v">${Math.round(d.w*10)/10}</div>
          <div class="bar-r" style="height:${Math.max(8, d.w/maxW*70)}px"></div>
          <div class="bar-l">${d.l}</div>
        </div>`).join("")}
      </div>${rpeBars}`}
    </div>
    ${H.length ? `<div class="chips">${H.slice(-6).map((snap, i) => {
      let w = null;
      DAYS_META.forEach(d => {
        const es = snap.data?.[d.id]?.[selExo] || snap[d.id]?.[selExo];
        if (es?.sets) { const ws = es.sets.map(s => parseFloat(s.w)||0); if (ws.length) w = ws.reduce((a,b)=>a+b,0)/ws.length; }
      });
      return `<div class="chip"><span class="chip-l">${snap._label || "S"+(i+1)}</span>${w!=null ? (Math.round(w*10)/10) + " " + ex.unit : "—"}</div>`;
    }).join("")}</div>` : ""}`;
}

// ── RECAP ─────────────────────────────────────────────────────────────────
function openRecap(){
  const vol = {}; MUSCLES.forEach(m => { vol[m] = 0; });
  DAYS_META.forEach(d => dayExos(d.id).forEach(e => {
    if (e.isCardio) return;
    const g = mg(e.muscle); vol[g] = (vol[g] || 0) + e.sets;
  }));
  const maxV = Math.max(...Object.values(vol), 1);

  document.getElementById("recapSub").textContent = `S${S.weekNum} · ${fd(S.startDate)} → ${fd(ad(S.startDate,6))}`;
  document.getElementById("recapContent").innerHTML = `
    <div class="recap-card">
      <div class="recap-ttl">VOLUME PAR GROUPE MUSCULAIRE</div>
      ${MUSCLES.filter(m => vol[m]>0).map(m => `
        <div class="vol-item">
          <div class="vol-top"><span>${m}</span><span class="vol-val">${vol[m]} séries</span></div>
          <div class="vol-track"><div class="vol-fill" style="width:${vol[m]/maxV*100}%"></div></div>
        </div>`).join("")}
    </div>
    <div class="recap-card">
      <div class="recap-ttl">PROGRESSION INTELLIGENTE</div>
      ${[
        {sym:"↑kg",col:"#D2D2D2",t:"Toutes ✓ + RPE < 7.5 → poly +5kg / isolation +2.5kg"},
        {sym:"↑rep",col:"#9db3c0",t:"Toutes ✓ + RPE 7.5-9 → +1 rep cible"},
        {sym:"→",col:"#9db3c0",t:"Maintien : RPE ≥ 9 ou séries partielles"},
        {sym:"↓kg",col:"#597081",t:"Échec (< moitié des séries) → −2.5kg"},
      ].map(r => `
        <div class="rule-item"><span class="rule-sym" style="color:${r.col}">${r.sym}</span><span class="rule-desc">${r.t}</span></div>`).join("")}
    </div>`;
  openSheet("recapOv");
}

// ── BACKUP (export / import JSON) ─────────────────────────────────────────
function openBackup(){
  const lastImport = localStorage.getItem("bk7_lastBackup") || "—";
  document.getElementById("backupContent").innerHTML = `
    <div class="bk-grid">
      <button class="bk-btn" onclick="exportData()">
        <span class="bk-ico">⬇</span>
        EXPORTER
      </button>
      <button class="bk-btn" onclick="document.getElementById('importFile').click()">
        <span class="bk-ico">⬆</span>
        IMPORTER
      </button>
    </div>
    <div class="bk-info">
      <strong>Pourquoi sauvegarder ?</strong>
      Tes données sont stockées dans le navigateur (localStorage). Si tu réinstalles l'app, changes de téléphone, ou vides le cache Safari, elles disparaissent. Exporte régulièrement le fichier JSON et garde-le dans tes Fichiers / iCloud Drive.
    </div>
    <div class="bk-info" style="margin-top:8px">
      <strong>Dernier export</strong>
      ${lastImport}
    </div>`;
  openSheet("backupOv");
}

function exportData(){
  const payload = {
    _app: "BANKAI",
    _version: 2,
    _exportedAt: new Date().toISOString(),
    state: S,
    history: H,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g, "-");
  a.href = url; a.download = `bankai-backup-${stamp}.json`;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
  localStorage.setItem("bk7_lastBackup", new Date().toLocaleString("fr-FR"));
  openBackup();
}

function importData(file){
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.state || !data.state.exos || !data.state.data) {
        alert("Fichier invalide : structure non reconnue."); return;
      }
      if (!confirm("Remplacer les données actuelles par celles du fichier ?\n\nCela écrasera ta semaine en cours et ton historique.")) return;
      S = data.state;
      H = data.history || [];
      // S'assure que tous les jours existent
      DAYS_META.forEach(d => {
        if (!S.exos[d.id]) S.exos[d.id] = JSON.parse(JSON.stringify(DEFAULT_EXOS[d.id]));
        if (!S.data[d.id]) S.data[d.id] = {};
      });
      save(); render();
      closeSheet("backupOv");
      setTimeout(() => alert("Import réussi ✓"), 200);
    } catch (err) {
      alert("Erreur d'import : " + err.message);
    }
  };
  reader.readAsText(file);
}

// ── EXO EDITOR (CRUD) ─────────────────────────────────────────────────────
function openExoEditor(dayId, exoId){
  const day = DAYS_META.find(d => d.id === dayId);
  const ex = exoId ? dayExos(dayId).find(e => e.id === exoId) : null;
  editingExo = { dayId, exoId };
  const isNew = !ex;
  const e = ex || { name:"", muscle:"", w:0, unit:"kg", sets:3, reps:"10-12", zone:"Hypertrophie", note:"", isCardio:false };

  document.getElementById("exoTitle").textContent = isNew ? "AJOUTER" : "MODIFIER";
  document.getElementById("exoSub").textContent = `${day.label} · ${day.sub}`;
  document.getElementById("exoForm").innerHTML = `
    <div class="form-row">
      <label class="form-lbl">Nom</label>
      <input class="form-input" id="ef_name" type="text" value="${escapeAttr(e.name)}" placeholder="ex. Développé couché incliné">
    </div>
    <div class="form-row">
      <label class="form-lbl">Muscle</label>
      <input class="form-input" id="ef_muscle" type="text" value="${escapeAttr(e.muscle)}" placeholder="ex. Pectoraux sup.">
    </div>
    <div class="form-row cols2">
      <div>
        <label class="form-lbl">Charge</label>
        <input class="form-input" id="ef_w" type="number" inputmode="decimal" step="0.5" value="${e.w}" onfocus="this.select()">
      </div>
      <div>
        <label class="form-lbl">Unité</label>
        <input class="form-input" id="ef_unit" type="text" value="${escapeAttr(e.unit)}" placeholder="kg, kg/côté…">
      </div>
    </div>
    <div class="form-row cols2">
      <div>
        <label class="form-lbl">Séries</label>
        <input class="form-input" id="ef_sets" type="number" inputmode="numeric" min="1" max="10" value="${e.sets}" onfocus="this.select()">
      </div>
      <div>
        <label class="form-lbl">Reps</label>
        <input class="form-input" id="ef_reps" type="text" value="${escapeAttr(e.reps)}" placeholder="ex. 8-10">
      </div>
    </div>
    <div class="form-row">
      <label class="form-lbl">Zone</label>
      <select class="form-input" id="ef_zone">
        ${ZONE_LIST.map(z => `<option value="${z}" ${z===e.zone?"selected":""}>${z}</option>`).join("")}
      </select>
    </div>
    <div class="form-row">
      <label class="form-lbl">Note (optionnelle)</label>
      <input class="form-input" id="ef_note" type="text" value="${escapeAttr(e.note||"")}" placeholder="Conseils, technique…">
    </div>
    <div class="form-actions">
      ${!isNew ? `<button class="form-btn form-btn-danger" onclick="deleteExoFromEditor()">SUPPRIMER</button>` : ""}
      <button class="form-btn form-btn-ghost" onclick="closeSheet('exoOv')">ANNULER</button>
      <button class="form-btn form-btn-primary" onclick="saveExoFromEditor()">${isNew?"AJOUTER":"ENREGISTRER"}</button>
    </div>`;
  openSheet("exoOv");
}

function escapeAttr(s){ return String(s).replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

function saveExoFromEditor(){
  if (!editingExo) return;
  const { dayId, exoId } = editingExo;
  const name = document.getElementById("ef_name").value.trim();
  if (!name) { alert("Le nom est obligatoire."); return; }
  const zone = document.getElementById("ef_zone").value;
  const data = {
    name,
    muscle: document.getElementById("ef_muscle").value.trim() || "—",
    w: parseFloat(document.getElementById("ef_w").value) || 0,
    unit: document.getElementById("ef_unit").value.trim() || "kg",
    sets: Math.max(1, parseInt(document.getElementById("ef_sets").value, 10) || 3),
    reps: document.getElementById("ef_reps").value.trim() || "10",
    zone,
    note: document.getElementById("ef_note").value.trim(),
    isCardio: zone === "Cardio",
  };

  if (exoId) {
    const ex = dayExos(dayId).find(e => e.id === exoId);
    if (ex) {
      // Si nb séries change, ajuste la data
      const oldSets = S.data[dayId][exoId].sets || [];
      Object.assign(ex, data);
      ex.id = exoId;
      if (data.isCardio) {
        S.data[dayId][exoId] = { done: S.data[dayId][exoId]?.done || false };
      } else {
        if (oldSets.length !== data.sets) {
          // Régénère, en gardant ce qui peut l'être
          const newSets = defaultSets(data);
          for (let i=0; i<Math.min(oldSets.length, data.sets); i++) {
            newSets[i] = oldSets[i];
          }
          S.data[dayId][exoId] = { sets: newSets };
        }
      }
    }
  } else {
    const id = uid();
    S.exos[dayId].push({ id, ...data });
    S.data[dayId][id] = data.isCardio ? { done:false } : { sets: defaultSets({ ...data, sets: data.sets }) };
  }

  save();
  closeSheet("exoOv");
  render();
}

function deleteExoFromEditor(){
  if (!editingExo || !editingExo.exoId) return;
  if (!confirm("Supprimer définitivement cet exercice ?")) return;
  deleteExo(editingExo.dayId, editingExo.exoId);
  closeSheet("exoOv");
}

function deleteExo(dayId, exoId){
  const ex = dayExos(dayId).find(e => e.id === exoId);
  if (!ex) return;
  if (!confirm(`Supprimer "${ex.name}" ?`)) return;
  S.exos[dayId] = S.exos[dayId].filter(e => e.id !== exoId);
  delete S.data[dayId][exoId];
  save(); render();
}

// ── UTILS ─────────────────────────────────────────────────────────────────
function openSheet(id){ document.getElementById(id).classList.add("open"); }
function closeSheet(id){ document.getElementById(id).classList.remove("open"); }

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".s-ov").forEach(el => el.addEventListener("click", e => {
    if (e.target === el) el.classList.remove("open");
  }));
  // Import file handler
  const fi = document.getElementById("importFile");
  if (fi) fi.addEventListener("change", e => {
    const f = e.target.files?.[0];
    if (f) importData(f);
    e.target.value = ""; // reset pour pouvoir re-importer le même fichier
  });
  load(); render();
});
