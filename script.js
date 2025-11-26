document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for nav links
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

  // BOARD GAME PROTOTYPE LOGIC
  const tiles = Array.from(document.querySelectorAll(".board-tile"));
  const token = document.getElementById("pb-token");
  const rollButton = document.getElementById("roll-button");
  const rollResult = document.getElementById("roll-result");
  const tileLog = document.getElementById("tile-log");

  if (!tiles.length || !token || !rollButton || !rollResult || !tileLog) {
    return; // board not present, nothing to do
  }

  let currentIndex = 0;
  let isMoving = false;

  function placeToken(index) {
    tiles.forEach((tile) => {
      tile.classList.remove("active-tile");
      if (tile.contains(token)) {
        tile.removeChild(token);
      }
    });

    const tile = tiles[index];
    if (!tile) return;

    tile.classList.add("active-tile");
    tile.appendChild(token);
  }

  function describeTile(tile) {
    const type = tile.dataset.type || "event";
    const label = tile.textContent.trim() || "Tile";

    let message = "";
    switch (type) {
      case "start":
        message = "You are at the starting tile. Take your first steps.";
        break;
      case "goal":
        message = "You reached the goal! Later this will trigger rewards and next boards.";
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
      placeToken(currentIndex);
      remaining -= 1;
    }, 260);
  }

  // Initial placement
  placeToken(currentIndex);
  describeTile(tiles[currentIndex]);

  rollButton.addEventListener("click", () => {
    if (isMoving) return;
    const roll = rollDie();
    rollResult.textContent = "You rolled a " + roll + ".";
    moveSteps(roll);
  });
});
