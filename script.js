document.addEventListener("DOMContentLoaded", () => {
  // --- Smooth scroll for nav links ---
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // --- Screen handling ---
  const titleScreen = document.getElementById("title-screen");
  const characterScreen = document.getElementById("character-screen");
  const gameScreen = document.getElementById("game");
  const startButton = document.getElementById("start-game-btn");
  const createCharacterButton = document.getElementById("create-character-btn");

  let playerState = {
    birthdate: null,
    sign: null,
    element: null,
    species: null,
  };

  function showTitle() {
    titleScreen.classList.remove("hidden");
    characterScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
  }

  function showCharacter() {
    titleScreen.classList.add("hidden");
    characterScreen.classList.remove("hidden");
    gameScreen.classList.add("hidden");
    characterScreen.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showGame() {
    titleScreen.classList.add("hidden");
    characterScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameScreen.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (startButton) {
    startButton.addEventListener("click", showCharacter);
  }

  // --- Zodiac / element helpers ---

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

  // --- Character creation logic ---

  const birthdateInput = document.getElementById("birthdate");
  const previewIcon = document.getElementById("preview-icon");
  const previewText = document.getElementById("preview-text");
  const playerSummary = document.getElementById("player-summary");
  const tokenEmoji = document.getElementById("pb-token");

  function updatePreview() {
    if (!playerState.birthdate || !playerState.species || !playerState.sign) {
      previewIcon.textContent = "🐾";
      previewText.textContent =
        "No Petborn bound yet. Fill out birthdate and choose a form.";
      return;
    }

    const speciesEmoji = playerState.species === "cat" ? "🐱" : "🐶";
    previewIcon.textContent = speciesEmoji;

    previewText.textContent =
      playerState.sign +
      " (" +
      playerState.element +
      ") · " +
      (playerState.species === "cat" ? "Petborn Cat" : "Petborn Dog") +
      ". This is your starting identity on the board.";
  }

  if (createCharacterButton) {
    createCharacterButton.addEventListener("click", () => {
      const birthVal = birthdateInput.value;
      const speciesInput = document.querySelector('input[name="species"]:checked');

      if (!birthVal || !speciesInput) {
        previewText.textContent =
          "You must choose a birthdate and a form (cat or dog) before binding.";
        return;
      }

      const date = new Date(birthVal + "T00:00:00");
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const sign = getZodiacSign(month, day);
      const element = getElementForSign(sign);
      const species = speciesInput.value;

      playerState.birthdate = birthVal;
      playerState.sign = sign;
      playerState.element = element;
      playerState.species = species;

      updatePreview();

      if (tokenEmoji) {
        tokenEmoji.textContent = species === "cat" ? "🐱" : "🐶";
      }

      if (playerSummary) {
        playerSummary.textContent =
          "Bound Petborn: " +
          (species === "cat" ? "Cat" : "Dog") +
          " · Sign: " +
          sign +
          " · Element: " +
          element +
          ". This will later influence your cards, battles, and growth.";
      }

      showGame();
    });
  }

  // --- Board logic ---

  const tiles = Array.from(document.querySelectorAll(".board-tile"));
  const rollButton = document.getElementById("roll-button");
  const rollResult = document.getElementById("roll-result");
  const tileLog = document.getElementById("tile-log");

  if (!tiles.length || !rollButton || !rollResult || !tileLog) {
    showTitle();
    return;
  }

  let currentIndex = 0;
  let isMoving = false;

  function placeTokenOnTile(index) {
    tiles.forEach((tile) => tile.classList.remove("active-tile"));
    const tile = tiles[index];
    if (!tile) return;
    tile.classList.add("active-tile");
  }

  function describeTile(tile) {
    const type = tile.dataset.type || "event";
    const labelEl = tile.querySelector(".board-tile-label");
    const label = labelEl ? labelEl.textContent.trim() : "Tile";

    let message = "";
    switch (type) {
      case "start":
        message = "You are at the starting tile. Take your first steps.";
        break;
      case "goal":
        message = "You reached the goal! Later this will trigger rewards and new boards.";
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

  function moveSteps(steps) {
    if (isMoving) return;
    isMoving = true;
    rollButton.disabled = true;

    let remaining = steps;

    const intervalId = setInterval(() => {
      if (remaining <= 0) {
        clearInterval(intervalId);
        const tile = tiles[currentIndex];
        if (tile) describeTile(tile);
        isMoving = false;
        rollButton.disabled = false;
        return;
      }

      if (currentIndex < tiles.length - 1) {
        currentIndex += 1;
      }
      placeTokenOnTile(currentIndex);
      remaining -= 1;
    }, 260);
  }

  placeTokenOnTile(currentIndex);
  describeTile(tiles[currentIndex]);

  rollButton.addEventListener("click", () => {
    if (isMoving) return;
    const roll = rollDie();
    rollResult.textContent = "You rolled a " + roll + ".";
    moveSteps(roll);
  });

  showTitle();
});
