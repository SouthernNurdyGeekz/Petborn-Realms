// Simple debug ping so we know script loaded
console.log("Petborn Realms script loaded (field prototype)");

let playerState = {
  birthdate: null,
  sign: null,
  element: null,
  species: null,
  role: null,
  wood: 0,
  crystal: 0,
};

function $(id) {
  return document.getElementById(id);
}

// ----- Screen toggles -----
function showTitle() {
  const title = $("title-screen");
  const charScreen = $("character-screen");
  const field = $("field-screen");

  if (title) title.classList.remove("hidden");
  if (charScreen) charScreen.classList.add("hidden");
  if (field) field.classList.add("hidden");
}

function showCharacter() {
  const title = $("title-screen");
  const charScreen = $("character-screen");
  const field = $("field-screen");

  if (title) title.classList.add("hidden");
  if (charScreen) {
    charScreen.classList.remove("hidden");
    charScreen.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (field) field.classList.add("hidden");
}

function showField() {
  const title = $("title-screen");
  const charScreen = $("character-screen");
  const field = $("field-screen");

  if (title) title.classList.add("hidden");
  if (charScreen) charScreen.classList.add("hidden");
  if (field) {
    field.classList.remove("hidden");
    field.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ----- Zodiac helpers -----
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

// ----- Bind Petborn (called by button) -----
function bindPetborn() {
  const birthInput = $("birthdate");
  const previewIcon = $("preview-icon");
  const previewText = $("preview-text");
  const playerSummary = $("player-summary");
  const gamePet = $("field-petborn");
  const hudElement = $("hud-element");
  const hudRole = $("hud-role");
  const hudResources = $("hud-resources");

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
    coreText + ". This is your starting identity on the field.";

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
      ". This will later influence encounters and resource bonuses.";
  }

  if (gamePet) {
    gamePet.textContent = speciesEmoji;
  }

  if (hudElement) hudElement.textContent = "Element: " + element;
  if (hudRole) hudRole.textContent = "Role: " + role;
  if (hudResources) {
    hudResources.textContent =
      "Wood: " + playerState.wood + " · Crystal: " + playerState.crystal;
  }

  // Drop straight into the field
  showField();
}

// ----- Resource collection -----
function collectResource(button) {
  if (!button || !button.dataset) return;

  const type = button.dataset.type; // "wood" or "crystal"

  if (type === "wood") {
    playerState.wood += 1;
  } else if (type === "crystal") {
    playerState.crystal += 1;
  }

  const hudResources = $("hud-resources");
  if (hudResources) {
    hudResources.textContent =
      "Wood: " + playerState.wood + " · Crystal: " + playerState.crystal;
  }

  // Visually remove the node
  button.style.transform = "scale(0.1)";
  button.style.opacity = "0";
  button.disabled = true;
}

// ----- Initial setup -----
(function initialSetup() {
  const tagline = document.querySelector(".tagline");
  if (tagline) {
    tagline.textContent += " · Field prototype";
  }
  showTitle();
})();
