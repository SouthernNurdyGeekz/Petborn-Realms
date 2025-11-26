// Simple debug ping so we know script loaded
console.log("Petborn Realms script loaded");

let playerState = {
  birthdate: null,
  sign: null,
  element: null,
  species: null,
  role: null,
};

let boardTiles = [];
let currentIndex = 0;
let isMoving = false;

function $(id) {
  return document.getElementById(id);
}

// Screen toggles
function showTitle() {
  const title = $("title-screen");
  const charScreen = $("character-screen");
  const game = $("game");

  if (title) title.classList.remove("hidden");
  if (charScreen) charScreen.classList.add("hidden");
  if (game) game.classList.add("hidden");
}

function showCharacter() {
  const title = $("title-screen");
  const charScreen = $("character-screen");
  const game = $("game");

  if (title) title.classList.add("hidden");
  if (charScreen) {
    charScreen.classList.remove("hidden");
    charScreen.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (game) game.classList.add("hidden");
}

function showGame() {
  const title = $("title-screen");
  const charScreen = $("character-screen");
  const game = $("game");

  if (title) title.classList.add("hidden");
  if (charScreen) charScreen.classList.add("hidden");
  if (game) {
    game.classList.remove("hidden");
    game.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Zodiac helpers
function getZodiacSign(month, day) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  return "Unknown";
}

function getElementForSign(sign) {
  switch (sign) {
    case "Aries":
    case "Leo":
    case "Sagittarius":
      return "Fire";
    case "Taurus":
    case "Virgo":
    case "Capricorn":
      return "Earth";
    case "Gemini":
    case "Libra":
    case "Aquarius":
      return "Air";
    case "Cancer":
    case "Scorpio":
    case "Pisces":
      return "Water";
    default:
      return "Unknown";
  }
}

// Called when you click "Bind to Your Realm"
function bindPetborn() {
  const birthInput = $("birthdate");
  const previewIcon = $("preview-icon");
  const previewText = $("preview-text");
  const playerSummary = $("player-summary");
  const tokenEmoji = $("pb-token");

  if (!birthInput || !previewText) return;

  const birthVal = birthInput.value;
  const speciesInput = document.querySelector('input[name="species"]:checked');
  const roleInput = document.querySelector('input[name="role"]:checked');

  if (!birthVal || !speciesInput || !roleInput) {
    previewText.textContent =
      "You must choose a birthdate, a form (cat/dog), and a role before binding.";
    return;
  }

  const parts = birthVal.split("-");
  if (parts.length !== 3) {
    previewText.textContent = "Birthdate format is not recognized.";
    return;
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    previewText.textContent = "Birthdate numbers are not valid.";
    return;
  }

  const sign = getZodiacSign(month, day);
  const element = getElementForSign(sign);
  const species = speciesInput.value; // "cat" or "dog"
  const role = roleInput.value;       // "Wizard", "Guardian", "Trickster"

  playerState.birthdate = birthVal;
  playerState.sign = sign;
  playerState.element = element;
  playerState.species = species;
  playerState.role = role;

  const speciesEmoji = species === "cat" ? "🐱" : "🐶";
  if (previewIcon) previewIcon.textContent = speciesEmoji;

  previewText.textContent =
    sign +
    " (" +
    element +
    ") · " +
    role +
    " · " +
    (species === "cat" ? "Petborn Cat" : "Petborn Dog") +
    ". This is your starting identity on the board.";

  if (tokenEmoji) {
    tokenEmoji.textContent = speciesEmoji;
  }

  if (playerSummary) {
    playerSummary.textContent =
      "Bound Petborn: " +
      (species === "cat" ? "Cat" : "Dog") +
      " · Role: " +
      role +
      " · Sign: " +
      sign +
      " · Element: " +
      element +
      ". This will later influence your cards, battles, and growth.";
  }

  showGame();
}

// --- Board logic ---
function initBoard() {
  boardTiles = Array.from(document.querySelectorAll(".board-tile"));
  currentIndex = 0;
  isMoving = false;

  if (boardTiles.length === 0) return;

  placeTokenOnTile(currentIndex);
  describeTile(boardTiles[currentIndex]);
}

function placeTokenOnTile(index) {
  if (!boardTiles.length) return;
  boardTiles.forEach((tile) => tile.classList.remove("active-tile"));
  const tile = boardTiles[index];
  if (!tile) return;
  tile.classList.add("active-tile");
}

function describeTile(tile) {
  const tileLog = $("tile-log");
  if (!tile || !tileLog) return;

  const type = tile.dataset.type || "event";
  const labelEl = tile.querySelector(".board-tile-label");
  const label = labelEl ? labelEl.textContent.trim() : "Tile";

  let message = "";
  switch (type) {
    case "start":
      message = "You are at the starting tile. Take your first steps.";
      break;
    case "goal":
      message =
        "You reached the goal! Later this will trigger rewards and new boards.";
      break;
    case "power":
      message = "Power tile: you would draw from the Power deck here.";
      break;
    case "crystal":
      message = "Crystal tile: you would gain or upgrade a crystal here.";
      break;
    case "monster":
      message = "Monster tile: a battle would start here in a future build.";
      break;
    case "potion":
      message = "Potion tile: you would recover or gain buffs here.";
      break;
    case "event":
    default:
      message = "Event tile: something unusual happens here.";
      break;
  }

  tileLog.innerHTML =
    'You are at <span class="log-highlight">' +
    label +
    "</span>. " +
    message;
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollOnBoard() {
  const rollButton = $("roll-button");
  const rollResult = $("roll-result");

  if (!boardTiles.length || !rollButton || !rollResult) return;
  if (isMoving) return;

  const steps = rollDie();
  rollResult.textContent = "You rolled a " + steps + ".";
  isMoving = true;
  rollButton.disabled = true;

  let remaining = steps;

  const intervalId = setInterval(() => {
    if (remaining <= 0) {
      clearInterval(intervalId);
      const tile = boardTiles[currentIndex];
      describeTile(tile);
      isMoving = false;
      rollButton.disabled = false;
      return;
    }

    if (currentIndex < boardTiles.length - 1) {
      currentIndex += 1;
    }
    placeTokenOnTile(currentIndex);
    remaining -= 1;
  }, 260);
}

// Initialize once (script is at the bottom)
(function initialSetup() {
  const tagline = document.querySelector(".tagline");
  if (tagline) {
    tagline.textContent += " · Prototype wired";
  }

  initBoard();
  showTitle();
})();
