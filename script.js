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

  if (tiles.length > 0 && token && rollButton && rollResult && tileLog) {
    let currentIndex = 0;
    let isMoving = false;

    // Attach token to starting tile
    function placeToken(index) {
      tiles.forEach((tile) => tile.classList.remove("has-token"));
      const tile = tiles[index];
      if (!tile) return;
      tile.classList.add("has-token");

      // Position token roughly above the tile
      const boardRect = tile.parentElement.getBoundingClientRect();
      const tileRect = tile.getBoundingClientRect();
      const offsetLeft = tileRect.left - boardRect.left;

      token.style.transform = `translateX(${offsetLeft}px)`;
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
          message = "You reached the goal! In the future, this will trigger level rewards.";
          break;
        case "power":
          message = "You drew a Power card. Gain a temporary boost to your next combat.";
          break;
        case "crystal":
          message = "You found a crystal. These will later upgrade your abilities.";
          break;
        case "monster":
          message = "A monster appears! In future versions, this will start a battle.";
          break;
        case "potion":
          message = "You discovered a potion. It will restore or buff your stats later.";
          break;
        case "event":
        default:
          message = "A strange event occurs. This tile will host special effects later.";
          break;
      }

      tileLog.innerHTML = `You are at <span class="log-highlight">${label}</span>. ${message}`;
    }

    function rollDie() {
      return Math.floor(Math.random() * 6) + 1;
    }

    function moveSteps(steps) {
      if (isMoving) return;
      isMoving = true;
      rollButton.disabled = true;

      let remaining = steps;

      const stepInterval = setInterval(() => {
        if (remaining <= 0) {
          clearInterval(stepInterval);
          const tile = tiles[currentIndex];
          if (tile) describeTile(tile);
          isMoving = false;
          rollButton.disabled = false;
          return;
        }

        // Move one step
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
      rollResult.textContent = `You rolled a ${roll}.`;
      moveSteps(roll);
    });
  }
});
