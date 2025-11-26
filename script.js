// Simple debug ping so we know script loaded
console.log("Petborn Realms script loaded (realms prototype)");

let playerState = {
  birthdate: null,
  sign: null,
  element: null,
  species: null,
  role: null,
};

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
  const tokenEmoji = $("pb-token"); // not used now but left for future
  const gamePreviewIcon = $("game-preview-icon");
  const gamePreviewText = $("game-preview-text");

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

  const coreText =
    sign +
    " (" +
    element +
    ") · " +
    role +
    " · " +
    (species === "cat" ? "Petborn Cat" : "Petborn Dog");

  previewText.textContent =
    coreText + ". This is your starting identity in the Realms.";

  // Mirror into Realms panel
  if (gamePreviewIcon) gamePreviewIcon.textContent = speciesEmoji;
  if (gamePreviewText) {
    gamePreviewText.textContent =
      coreText +
      ". Later this card will show stats, health, and equipped powers.";
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
      ". This will later influence your encounters in each Realm.";
  }

  showGame();
}

// Realm selection
function enterRealm(realm) {
  const log = $("realm-log");
  if (!log) return;

  if (!playerState.sign || !playerState.element || !playerState.role) {
    log.textContent =
      "You haven’t bound a Petborn yet. Go back to Create and bind your birthdate, form, and role first.";
    return;
  }

  const { element, role, species, sign } = playerState;

  let advantageText = "";
  if (
    (realm === "Air" && element === "Air") ||
    (realm === "Earth" && element === "Earth") ||
    (realm === "Fire" && element === "Fire") ||
    (realm === "Water" && element === "Water")
  ) {
    advantageText =
      "This is your home element. You gain an advantage on most encounters here.";
  } else {
    advantageText =
      "This Realm doesn’t match your element, so conditions are trickier but rewards can be higher.";
  }

  let roleFlavor = "";
  switch (role) {
    case "Wizard":
      roleFlavor =
        "As a Wizard, you’re more likely to trigger spell challenges, puzzles, and magical duels.";
      break;
    case "Guardian":
      roleFlavor =
        "As a Guardian, expect defense missions, shielding allies, and holding lines against waves of enemies.";
      break;
    case "Trickster":
      roleFlavor =
        "As a Trickster, you’ll see stealth paths, pranks, and high-risk/high-reward gambits.";
      break;
    default:
      roleFlavor = "Your role shapes the type of encounters you’ll see.";
  }

  const speciesText =
    species === "cat"
      ? "Your feline instincts help with agility and awareness."
      : "Your canine instincts help with loyalty and pack-based bonuses.";

  log.innerHTML =
    "<strong>" +
    realm +
    " Realm</strong><br>" +
    "Sign: " +
    sign +
    " · Element: " +
    element +
    " · Role: " +
    role +
    "<br>" +
    advantageText +
    "<br>" +
    roleFlavor +
    "<br>" +
    speciesText +
    "<br><br>" +
    "In a later build, clicking this Realm would open a full scene with map tiles, NPCs, and battles.";
}

// Initialize
(function initialSetup() {
  const tagline = document.querySelector(".tagline");
  if (tagline) {
    tagline.textContent += " · Realms prototype";
  }
  showTitle();
})();
