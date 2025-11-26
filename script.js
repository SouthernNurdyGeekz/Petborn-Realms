console.log('Petborn script.js loaded (short version).');

// ----- SIMPLE STATE -----
const petbornState = {
  name: null,
  birthdate: null,
  zodiac: null,
  element: null,
  form: 'cat',
  pattern: 'spots',
  role: null,
  stats: {
    power: null,
    defense: null,
    magic: null,
    speed: null,
    luck: null,
    focus: null,
  },
  currentTile: 1,
};

const TOTAL_TILES = 40;

// ----- SCREEN ELEMENTS -----
const bindingScreen = document.getElementById('binding-screen');
const boundScreen   = document.getElementById('bound-screen');
const buildScreen   = document.getElementById('build-screen');
const boardScreen   = document.getElementById('board-screen');

// ----- BINDING ELEMENTS -----
const petNameInput   = document.getElementById('pet-name-input');
const birthdateInput = document.getElementById('birthdate-input');
const formSelect     = document.getElementById('form-select');
const patternSelect  = document.getElementById('pattern-select');
const bindPetBtn     = document.getElementById('bind-pet-btn');

const boundMessage = document.getElementById('bound-message');
const cardName     = document.getElementById('card-name');
const cardLine1    = document.getElementById('card-line-1');
const cardLine2    = document.getElementById('card-line-2');
const cardLine3    = document.getElementById('card-line-3');
const cardLine4    = document.getElementById('card-line-4');

const startGameBtn = document.getElementById('start-game');

// ----- CLASS / STATS ELEMENTS -----
const roleSelect     = document.getElementById('role-select');
const rollStatsBtn   = document.getElementById('roll-stats-btn');
const enterBoardBtn  = document.getElementById('enter-board-btn');

const statPower   = document.getElementById('stat-power');
const statDefense = document.getElementById('stat-defense');
const statMagic   = document.getElementById('stat-magic');
const statSpeed   = document.getElementById('stat-speed');
const statLuck    = document.getElementById('stat-luck');
const statFocus   = document.getElementById('stat-focus');

// ----- BOARD ELEMENTS -----
const currentTileLabel = document.getElementById('current-tile-label');
const moveOneBtn       = document.getElementById('move-one-btn');
const tileEffectText   = document.getElementById('tile-effect-text');
const boardContainer   = document.getElementById('board-container');

// ----- HELPERS -----
function showScreen(which) {
  if (bindingScreen) bindingScreen.hidden = (which !== 'binding');
  if (boundScreen)   boundScreen.hidden   = (which !== 'bound');
  if (buildScreen)   buildScreen.hidden   = (which !== 'build');
  if (boardScreen)   boardScreen.hidden   = (which !== 'board');
}

function getZodiacSign(month, day) {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  return 'Capricorn';
}

function elementFromZodiac(sign) {
  switch (sign) {
    case 'Aries':
    case 'Leo':
    case 'Sagittarius':
      return 'Fire';
    case 'Taurus':
    case 'Virgo':
    case 'Capricorn':
      return 'Earth';
    case 'Gemini':
    case 'Libra':
    case 'Aquarius':
      return 'Air';
    case 'Cancer':
    case 'Scorpio':
    case 'Pisces':
      return 'Water';
    default:
      return 'Spirit';
  }
}

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

// Simple “tile info” for now – just a label
function getTileLabel(n) {
  return 'Tile ' + n;
}

// Build a simple 40-tile board (just numbered)
function buildBoardTiles() {
  if (!boardContainer) return;
  boardContainer.innerHTML = '';
  for (let i = 1; i <= TOTAL_TILES; i++) {
    const div = document.createElement('div');
    div.className = 'board-tile';
    div.setAttribute('data-tile', String(i));
    div.textContent = getTileLabel(i);
    boardContainer.appendChild(div);
  }
}

function updateBoardDisplay() {
  if (!currentTileLabel || !tileEffectText || !boardContainer) return;
  currentTileLabel.textContent = petbornState.currentTile;
  tileEffectText.textContent = 'You are on ' + getTileLabel(petbornState.currentTile) + '.';

  const tiles = boardContainer.querySelectorAll('.board-tile');
  tiles.forEach(tile => {
    const n = Number(tile.getAttribute('data-tile'));
    tile.classList.toggle('active-tile', n === petbornState.currentTile);
  });
}

// ----- EVENT HANDLERS -----
// Bind pet
if (bindPetBtn) {
  bindPetBtn.addEventListener('click', () => {
    const name = petNameInput.value.trim();
    const birthdate = birthdateInput.value;

    if (!birthdate) {
      alert('Pick a birth date first.');
      return;
    }

    const parts = birthdate.split('-');
    const month = Number(parts[1]);
    const day   = Number(parts[2]);

    const zodiac  = getZodiacSign(month, day);
    const element = elementFromZodiac(zodiac);

    petbornState.name      = name || 'Unnamed';
    petbornState.birthdate = birthdate;
    petbornState.form      = formSelect.value || 'cat';
    petbornState.pattern   = patternSelect.value || 'spots';
    petbornState.zodiac    = zodiac;
    petbornState.element   = element;

    if (boundMessage) {
      boundMessage.textContent =
        petbornState.name + ' the ' +
        petbornState.element + ' ' +
        petbornState.form.toUpperCase() +
        ' (' + petbornState.zodiac + ') is bound.';
    }

    if (cardName)  cardName.textContent  = 'Name: ' + petbornState.name;
    if (cardLine1) cardLine1.textContent = 'Form: ' + petbornState.form.toUpperCase() +
                                           ' · Element: ' + petbornState.element +
                                           ' · Sign: ' + petbornState.zodiac;
    if (cardLine2) cardLine2.textContent = 'Birthdate: ' + petbornState.birthdate;
    if (cardLine3) cardLine3.textContent = 'Pattern: ' + petbornState.pattern;
    if (cardLine4) cardLine4.textContent = 'Class: not chosen yet';

    showScreen('bound');
  });
}

// Go to class/stats
if (startGameBtn) {
  startGameBtn.addEventListener('click', () => {
    showScreen('build');
  });
}

// Roll stats
if (rollStatsBtn) {
  rollStatsBtn.addEventListener('click', () => {
    const role = roleSelect.value;
    if (!role) {
      alert('Choose a class first.');
      return;
    }

    petbornState.role          = role;
    petbornState.stats.power   = rollD20();
    petbornState.stats.defense = rollD20();
    petbornState.stats.magic   = rollD20();
    petbornState.stats.speed   = rollD20();
    petbornState.stats.luck    = rollD20();
    petbornState.stats.focus   = rollD20();

    statPower.textContent   = petbornState.stats.power;
    statDefense.textContent = petbornState.stats.defense;
    statMagic.textContent   = petbornState.stats.magic;
    statSpeed.textContent   = petbornState.stats.speed;
    statLuck.textContent    = petbornState.stats.luck;
    statFocus.textContent   = petbornState.stats.focus;

    if (cardLine4) {
      cardLine4.textContent = 'Class: ' + role;
    }

    enterBoardBtn.disabled = false;
  });
}

// Enter board
if (enterBoardBtn) {
  enterBoardBtn.addEventListener('click', () => {
    petbornState.currentTile = 1;
    buildBoardTiles();
    updateBoardDisplay();
    showScreen('board');
  });
}

// Move one space
if (moveOneBtn) {
  moveOneBtn.addEventListener('click', () => {
    petbornState.currentTile += 1;
    if (petbornState.currentTile > TOTAL_TILES) {
      petbornState.currentTile = 1;
    }
    updateBoardDisplay();
  });
}

// ----- INIT -----
showScreen('binding');
buildBoardTiles();
updateBoardDisplay();
