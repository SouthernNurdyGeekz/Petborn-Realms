console.log('Petborn script.js loaded.');

// ----- STATE -----
const petbornState = {
  name: null,
  birthdate: null,
  form: 'cat',
  element: null,
  pattern: 'spots',
  fate: null,
  fateDetail: null
};

let currentTokenType = null;

// ----- DOM HOOKS -----
const bindingScreen = document.getElementById('binding-screen');
const boundScreen = document.getElementById('bound-screen');
const rollerScreen = document.getElementById('roller-screen');

const petPreview = document.getElementById('pet-preview');
const patternSelect = document.getElementById('pattern-select');

const petNameInput = document.getElementById('pet-name-input');
const birthdateInput = document.getElementById('birthdate-input');
const formSelect = document.getElementById('form-select');
const elementSelect = document.getElementById('element-select');
const bindPetBtn = document.getElementById('bind-pet-btn');

const boundMessage = document.getElementById('bound-message');
const cardName = document.getElementById('card-name');
const cardLine1 = document.getElementById('card-line-1');
const cardLine2 = document.getElementById('card-line-2');
const cardLine3 = document.getElementById('card-line-3');
const cardLine4 = document.getElementById('card-line-4');

const startGameBtn = document.getElementById('start-game');

const tokenButtons = document.querySelectorAll('.token-type-btn');
const currentTokenLabel = document.getElementById('current-token-label');
const rollBtn = document.getElementById('roll-btn');
const rollResultText = document.getElementById('roll-result-text');
const rollEffectText = document.getElementById('roll-effect-text');

const bindingSummarySection = document.getElementById('binding-summary');
const bindingSummaryText = document.getElementById('binding-summary-text');

// ----- HELPERS -----
function showScreen(screen) {
  [bindingScreen, boundScreen, rollerScreen].forEach(s => {
    if (!s) return;
    s.hidden = s !== screen;
  });
}

function updatePetPreview() {
  if (!petPreview) return;
  const form = petbornState.form || 'cat';
  const pattern = petbornState.pattern || 'spots';

  petPreview.className = 'pet-preview';
  petPreview.classList.add(`${form}-base`);
  petPreview.classList.add(`cat-${pattern}`);
}

function updateBoundCard() {
  cardName.textContent = `Name: ${petbornState.name || '—'}`;
  cardLine1.textContent = `Form: ${(petbornState.form || '—').toUpperCase()} · Element: ${(petbornState.element || '—').toUpperCase()}`;
  cardLine2.textContent = `Birthdate: ${petbornState.birthdate || '—'}`;
  cardLine3.textContent = `Pattern: ${petbornState.pattern || '—'}`;
  cardLine4.textContent = `Crystal / Fate: ${petbornState.fate || 'not rolled yet'}`;
}

function updateBindingSummary() {
  if (!bindingSummarySection || !bindingSummaryText) return;

  bindingSummaryText.textContent =
    `Petborn ${petbornState.name || '(unnamed)'} · ` +
    `Form: ${(petbornState.form || '—').toUpperCase()} · ` +
    `Element: ${(petbornState.element || '—').toUpperCase()} · ` +
    `Pattern: ${petbornState.pattern || '—'} · ` +
    `Fate: ${petbornState.fate || 'not chosen yet'} ` +
    (petbornState.fateDetail ? `· ${petbornState.fateDetail}` : '');

  bindingSummarySection.hidden = false;
}

// ----- EVENT WIRING -----

// pattern → preview
if (patternSelect) {
  patternSelect.addEventListener('change', () => {
    petbornState.pattern = patternSelect.value || 'spots';
    updatePetPreview();
  });
}

// bind pet button
if (bindPetBtn) {
  bindPetBtn.addEventListener('click', () => {
    const name = petNameInput.value.trim();
    const birthdate = birthdateInput.value;
    const form = formSelect.value || 'cat';
    const element = elementSelect.value;

    if (!birthdate || !element) {
      alert('You must at least pick a birth date and an element to bind your Petborn.');
      return;
    }

    petbornState.name = name || 'Unnamed';
    petbornState.birthdate = birthdate;
    petbornState.form = form;
    petbornState.element = element;

    updatePetPreview();
    updateBoundCard();

    boundMessage.textContent =
      `${petbornState.name} the ${petbornState.element.toUpperCase()} ${petbornState.form.toUpperCase()} ` +
      `has been bound to this realm. Future cards and battles will draw from this essence.`;

    showScreen(boundScreen);
  });
}

// start game button
if (startGameBtn) {
  startGameBtn.addEventListener('click', () => {
    showScreen(rollerScreen);
    updateBindingSummary();
  });
}

// token type selection
tokenButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentTokenType = btn.dataset.token;
    currentTokenLabel.textContent = currentTokenType.toUpperCase();

    // simple visual state
    tokenButtons.forEach(b => b.classList.remove('active-token'));
    btn.classList.add('active-token');
  });
});

// rolling logic
if (rollBtn) {
  rollBtn.addEventListener('click', () => {
    if (!currentTokenType) {
      alert('Choose a tile type first (Power, Crystal, Monster, etc.).');
      return;
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    rollResultText.textContent = `You rolled a ${roll} on the ${currentTokenType.toUpperCase()} track.`;

    let effect = '';

    switch (currentTokenType) {
      case 'crystal':
        if (roll <= 2) {
          petbornState.fate = 'Crystal Initiate';
          petbornState.fateDetail = 'You gain a basic crystal slot for future card upgrades.';
          effect = 'You gain a basic crystal. Later, this will power up your Petborn cards.';
        } else if (roll <= 4) {
          petbornState.fate = 'Crystal Adept';
          petbornState.fateDetail = 'Your crystal capacity increases – stronger card combos later.';
          effect = 'Your crystal capacity expands. In the full game, this unlocks stronger combos.';
        } else {
          petbornState.fate = 'Crystal Nexus';
          petbornState.fateDetail = 'Top-tier crystal alignment; rare effects in battles.';
          effect = 'You tap into a rare Crystal Nexus. Future battles will tilt in your favor.';
        }
        break;

      case 'power':
        petbornState.fate = petbornState.fate || 'Awakened Power';
        petbornState.fateDetail = 'You rolled on Power; this will later boost your attack/skill cards.';
        effect = 'Prototype note: Power will later modify attack/skill values in your deck.';
        break;

      case 'monster':
        petbornState.fate = petbornState.fate || 'Monster Encounter';
        petbornState.fateDetail = 'You crossed a Monster tile; future: test battles / trials.';
        effect = 'Prototype note: Monster tiles will later trigger small test battles.';
        break;

      case 'potion':
        petbornState.fate = petbornState.fate || 'Potion Flux';
        petbornState.fateDetail = 'Potion rolls will become healing / buff items.';
        effect = 'Prototype note: Potion tiles become healing or buff items in your inventory.';
        break;

      case 'event':
        petbornState.fate = petbornState.fate || 'Realm Event';
        petbornState.fateDetail = 'Events will introduce story choices or random shifts.';
        effect = 'Prototype note: Events will bring story choices and random realm effects.';
        break;

      case 'gold':
        petbornState.fate = petbornState.fate || 'Treasurebound';
        petbornState.fateDetail = 'Gold rolls will later fund shops / card crafting.';
        effect = 'Prototype note: Gold adds currency for shops and crafting later.';
        break;

      default:
        effect = 'The realm shrugged. (Unknown token type.)';
    }

    rollEffectText.textContent = effect;
    updateBoundCard();
    updateBindingSummary();
  });
}

// initial preview
updatePetPreview();
showScreen(bindingScreen);
