console.log("Petborn Realms script.js loaded (animated stats)");

// ----- STATE -----
const pet = {
  name: null,
  birth: null,
  zodiac: null,
  element: null,
  form: "cat",
  pattern: "spots",
  role: null,
  stats: {
    strength: 0,
    dexterity: 0,
    endurance: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0
  },
  tile: 1
};

const TOTAL_TILES = 40;

// ----- SCREEN ELEMENTS -----
const scrBind  = document.getElementById("binding-screen");
const scrBound = document.getElementById("bound-screen");
const scrBuild = document.getElementById("build-screen");
const scrBoard = document.getElementById("board-screen");

// ----- INPUTS -----
const inpName   = document.getElementById("pet-name-input");
const inpBirth  = document.getElementById("birthdate-input");
const selForm   = document.getElementById("form-select");
const selPat    = document.getElementById("pattern-select");
const btnBind   = document.getElementById("bind-pet-btn");

const msgBound  = document.getElementById("bound-message");
const cName     = document.getElementById("card-name");
const c1        = document.getElementById("card-line-1");
const c2        = document.getElementById("card-line-2");
const c3        = document.getElementById("card-line-3");
const c4        = document.getElementById("card-line-4");

const btnStart  = document.getElementById("start-game");

// ----- CLASS/STATS -----
const selRole   = document.getElementById("role-select");
const btnRoll   = document.getElementById("roll-stats-btn");
const btnBoard  = document.getElementById("enter-board-btn");

const statStr = document.getElementById("stat-strength");
const statDex = document.getElementById("stat-dexterity");
const statEnd = document.getElementById("stat-endurance");
const statInt = document.getElementById("stat-intelligence");
const statWis = document.getElementById("stat-wisdom");
const statCha = document.getElementById("stat-charisma");

// ----- BOARD -----
const lblTile = document.getElementById("current-tile-label");
const btnMove = document.getElementById("move-one-btn");
const lblDesc = document.getElementById("tile-effect-text");
const board   = document.getElementById("board-container");

// ----- HELPERS -----
function show(which) {
  scrBind.hidden  = which !== "bind";
  scrBound.hidden = which !== "bound";
  scrBuild.hidden = which !== "build";
  scrBoard.hidden = which !== "board";
}

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function zodiac(month, day) {
  if ((month==1 && day>=20)||(month==2 && day<=18)) return "Aquarius";
  if ((month==2 && day>=19)||(month==3 && day<=20)) return "Pisces";
  if ((month==3 && day>=21)||(month==4 && day<=19)) return "Aries";
  if ((month==4 && day>=20)||(month==5 && day<=20)) return "Taurus";
  if ((month==5 && day>=21)||(month==6 && day<=20)) return "Gemini";
  if ((month==6 && day>=21)||(month==7 && day<=22)) return "Cancer";
  if ((month==7 && day>=23)||(month==8 && day<=22)) return "Leo";
  if ((month==8 && day>=23)||(month==9 && day<=22)) return "Virgo";
  if ((month==9 && day>=23)||(month==10&& day<=22)) return "Libra";
  if ((month==10&& day>=23)||(month==11&& day<=21)) return "Scorpio";
  if ((month==11&& day>=22)||(month==12&& day<=21)) return "Sagittarius";
  return "Capricorn";
}

function element(sign) {
  switch (sign) {
    case "Aries": case "Leo": case "Sagittarius": return "Fire";
    case "Taurus": case "Virgo": case "Capricorn": return "Earth";
    case "Gemini": case "Libra": case "Aquarius": return "Air";
    case "Cancer": case "Scorpio": case "Pisces": return "Water";
    default: return "Spirit";
  }
}

function tileDesc(n) {
  return "You are on Tile " + n + ".";
}

// ----- BOARD BUILDER -----
function buildBoard() {
  board.innerHTML = "";
  for (let i = 1; i <= TOTAL_TILES; i++) {
    const d = document.createElement("div");
    d.className = "board-tile";
    d.dataset.tile = i;
    d.textContent = "Tile " + i;
    board.appendChild(d);
  }
}

// ----- UPDATE TILE -----
function updateTile() {
  lblTile.textContent = pet.tile;
  lblDesc.textContent = tileDesc(pet.tile);

  document.querySelectorAll(".board-tile").forEach(t => {
    t.classList.toggle("active-tile", Number(t.dataset.tile) === pet.tile);
  });
}

// ----- ANIMATED STAT ROLLING -----
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function rollStatsAnimated() {
  if (!selRole.value) {
    alert("Choose a class first.");
    return;
  }

  // lock UI during animation
  btnRoll.disabled  = true;
  btnBoard.disabled = true;

  pet.role = selRole.value;
  c4.textContent = "Class: " + pet.role;

  const sequence = [
    { key: "strength",     el: statStr },
    { key: "dexterity",    el: statDex },
    { key: "endurance",    el: statEnd },
    { key: "intelligence", el: statInt },
    { key: "wisdom",       el: statWis },
    { key: "charisma",     el: statCha }
  ];

  for (const item of sequence) {
    // simple little flicker effect: show "…" then final value
    item.el.textContent = "…";
    await sleep(250);

    const value = rollD20();
    pet.stats[item.key] = value;
    item.el.textContent = value;

    await sleep(220);
  }

  // enable entering the board after animation is done
  btnBoard.disabled = false;
  btnRoll.disabled  = false;
}

// ----- EVENTS -----
// BIND PET
btnBind.addEventListener("click", () => {
  if (!inpBirth.value) {
    alert("Pick a birth date first.");
    return;
  }

  const [y, m, d] = inpBirth.value.split("-");
  pet.name    = inpName.value.trim() || "Unnamed";
  pet.birth   = inpBirth.value;
  pet.form    = selForm.value;
  pet.pattern = selPat.value;
  pet.zodiac  = zodiac(Number(m), Number(d));
  pet.element = element(pet.zodiac);

  msgBound.textContent =
    `${pet.name} the ${pet.element} ${pet.form.toUpperCase()} (${pet.zodiac}) is bound.`;

  cName.textContent = "Name: " + pet.name;
  c1.textContent = `Form: ${pet.form.toUpperCase()} · Element: ${pet.element} · Sign: ${pet.zodiac}`;
  c2.textContent = "Birthdate: " + pet.birth;
  c3.textContent = "Pattern: " + pet.pattern;
  c4.textContent = "Class: not chosen yet";

  show("bound");
});

// GO TO CLASS SCREEN
btnStart.addEventListener("click", () => show("build"));

// ROLL STATS (animated, one-by-one)
btnRoll.addEventListener("click", () => {
  rollStatsAnimated();
});

// ENTER BOARD
btnBoard.addEventListener("click", () => {
  pet.tile = 1;
  buildBoard();
  updateTile();
  show("board");
});

// MOVE 1 SPACE
btnMove.addEventListener("click", () => {
  pet.tile++;
  if (pet.tile > TOTAL_TILES) pet.tile = 1;
  updateTile();
});

// ----- INIT -----
show("bind");
buildBoard();
updateTile();
