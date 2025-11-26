// Simple "2.5D" cat forager
const gameArea = document.getElementById("game-area");
const catEl = document.getElementById("cat");
const resourcesContainer = document.getElementById("resources");
const scoreEl = document.getElementById("score");

// Internal state
let cat = {
  x: 0,
  y: 0,
  speed: 210, // pixels per second
  dirX: 0,
  dirY: 0
};

let keys = {
  up: false,
  down: false,
  left: false,
  right: false
};

let resources = [];
let lastTime = null;
let score = 0;
let chopping = false;
let chopCooldown = false;

// Helpers to get game bounds in pixels
function getGameRect() {
  const rect = gameArea.getBoundingClientRect();
  // "Floor" area is slightly inset so we don't clip
  const padding = 20;
  return {
    left: padding,
    top: padding,
    right: rect.width - padding,
    bottom: rect.height - padding
  };
}

// Center the cat at start
function positionCatInitial() {
  const rect = getGameRect();
  cat.x = (rect.right - rect.left) / 2;
  cat.y = (rect.bottom - rect.top) / 2;
}

// Spawn some fake 3D resources
function spawnResources(count = 7) {
  resourcesContainer.innerHTML = "";
  resources = [];

  const rect = getGameRect();

  for (let i = 0; i < count; i++) {
    const type = Math.random() < 0.55 ? "rock" : "crystal";
    const el = document.createElement("div");
    el.className = `resource ${type} bobbing`;

    const x = rect.left + 40 + Math.random() * (rect.right - rect.left - 80);
    const y = rect.top + 40 + Math.random() * (rect.bottom - rect.top - 80);

    resources.push({ el, x, y, collected: false });
    resourcesContainer.appendChild(el);
  }
}

// Input handling
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      keys.up = true;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      keys.down = true;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      keys.left = true;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      keys.right = true;
      break;
    case " ":
    case "Spacebar":
      e.preventDefault();
      triggerChop();
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      keys.up = false;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      keys.down = false;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      keys.left = false;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      keys.right = false;
      break;
  }
});

// Chop action
function triggerChop() {
  if (chopCooldown) return;

  chopping = true;
  chopCooldown = true;

  catEl.classList.add("chopping");

  setTimeout(() => {
    catEl.classList.remove("chopping");
    chopping = false;
  }, 140);

  setTimeout(() => {
    chopCooldown = false;
  }, 180);

  // Check collisions right when we chop
  checkResourceHits(true);
}

// Update movement & state
function update(dt) {
  const rect = getGameRect();

  // Determine direction vector
  cat.dirX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  cat.dirY = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);

  const length = Math.hypot(cat.dirX, cat.dirY);
  if (length > 0) {
    cat.dirX /= length;
    cat.dirY /= length;
  }

  // Move the cat
  if (length > 0) {
    const dist = cat.speed * dt;
    cat.x += cat.dirX * dist;
    cat.y += cat.dirY * dist;

    // Clamp within bounds
    cat.x = Math.max(rect.left, Math.min(rect.right, cat.x));
    cat.y = Math.max(rect.top, Math.min(rect.bottom, cat.y));

    // Moving class for animation
    catEl.classList.add("moving");
    catEl.classList.remove("idle");

    // Flip cat based on direction
    const scaleX = cat.dirX < 0 ? -1 : 1;
    catEl.style.transform = `translate(-50%, -50%) translate(${cat.x}px, ${cat.y}px) scaleX(${scaleX})`;
  } else {
    catEl.classList.remove("moving");
    catEl.classList.add("idle");
    catEl.style.transform = `translate(-50%, -50%) translate(${cat.x}px, ${cat.y}px)`;
  }

  // Update resources visual position
  resources.forEach((r) => {
    if (r.collected) return;
    r.el.style.transform = `translate(-50%, -100%) translate(${r.x}px, ${r.y}px)`;
  });

  // Check “proximity” (soft glow / hit flash only if chopping)
  checkResourceHits(false);
}

// Collision / hit detection
function checkResourceHits(collectIfChopping) {
  const catRadius = 24;

  resources.forEach((r) => {
    if (r.collected) return;

    const dx = r.x - cat.x;
    const dy = r.y - cat.y;
    const dist = Math.hypot(dx, dy);

    const hitRange = 40;

    if (dist < hitRange) {
      r.el.classList.add("hit");

      // Remove hit class after very short time
      setTimeout(() => {
        r.el.classList.remove("hit");
      }, 120);

      if (collectIfChopping) {
        collectResource(r);
      }
    }
  });
}

function collectResource(resource) {
  if (resource.collected) return;
  resource.collected = true;
  resource.el.classList.add("collected");

  score += 1;
  scoreEl.textContent = score.toString();

  // Remove from DOM after animation
  setTimeout(() => {
    if (resource.el && resource.el.parentNode) {
      resource.el.parentNode.removeChild(resource.el);
    }
  }, 220);
}

// Game loop
function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(dt);
  requestAnimationFrame(loop);
}

// Init
function init() {
  positionCatInitial();
  spawnResources(8);
  catEl.classList.add("idle");
  requestAnimationFrame(loop);
}

// Delay init slightly so layout is ready
window.addEventListener("load", () => {
  setTimeout(init, 60);
});
