const gameArea = document.getElementById("game-area");
const catEl = document.getElementById("cat");
const resourcesContainer = document.getElementById("resources");
const scoreEl = document.getElementById("score");

let cat = {
  x: 0,
  y: 0,
  speed: 220,
  dirX: 0,
  dirY: 0,
};

let keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};

let resources = [];
let lastTime = null;
let score = 0;
let chopping = false;
let chopCooldown = false;

// Get local width/height of game area
function getGameSize() {
  return {
    width: gameArea.clientWidth,
    height: gameArea.clientHeight,
  };
}

function positionCatInitial() {
  const { width, height } = getGameSize();
  cat.x = width / 2;
  cat.y = height / 2;
  updateCatPosition();
}

function updateCatPosition() {
  // Clamp within bounds
  const { width, height } = getGameSize();
  const halfW = 24; // half of cat width (48)
  const halfH = 20; // half of cat height (40)

  cat.x = Math.max(halfW, Math.min(width - halfW, cat.x));
  cat.y = Math.max(halfH, Math.min(height - halfH, cat.y));

  catEl.style.left = (cat.x - halfW) + "px";
  catEl.style.top = (cat.y - halfH) + "px";
}

// Spawn resources around the map
function spawnResources(count = 8) {
  resourcesContainer.innerHTML = "";
  resources = [];
  const { width, height } = getGameSize();

  for (let i = 0; i < count; i++) {
    const type = Math.random() < 0.55 ? "block" : "crystal";
    const el = document.createElement("div");
    el.className = `resource ${type} bobbing`;

    const margin = 40;
    const x = margin + Math.random() * (width - margin * 2);
    const y = margin + Math.random() * (height - margin * 2);

    resources.push({ el, x, y, collected: false });
    el.style.left = (x - 16) + "px";
    el.style.top = (y - 16) + "px";

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

function triggerChop() {
  if (chopCooldown) return;

  chopping = true;
  chopCooldown = true;
  catEl.classList.add("chopping");

  setTimeout(() => {
    catEl.classList.remove("chopping");
    chopping = false;
  }, 150);

  setTimeout(() => {
    chopCooldown = false;
  }, 180);

  checkResourceHits(true);
}

// Update loop
function update(dt) {
  // Direction vector
  let dx = 0;
  let dy = 0;
  if (keys.up) dy -= 1;
  if (keys.down) dy += 1;
  if (keys.left) dx -= 1;
  if (keys.right) dx += 1;

  const length = Math.hypot(dx, dy);
  if (length > 0) {
    dx /= length;
    dy /= length;
  }

  if (length > 0) {
    cat.x += dx * cat.speed * dt;
    cat.y += dy * cat.speed * dt;
    updateCatPosition();

    catEl.classList.add("moving");
    catEl.classList.remove("idle");

    // Flip cat horizontally
    const scaleX = dx < 0 ? -1 : 1;
    catEl.style.transform = `scaleX(${scaleX})`;
  } else {
    catEl.classList.remove("moving");
    catEl.classList.add("idle");
  }

  // Update resources (bobbing animation handled by CSS; here we only enforce positions)
  resources.forEach((r) => {
    if (r.collected) return;
    r.el.style.left = (r.x - 16) + "px";
    r.el.style.top = (r.y - 16) + "px";
  });

  // Proximity effects
  checkResourceHits(false);
}

function checkResourceHits(collectIfChopping) {
  const collectRadius = 45;

  resources.forEach((r) => {
    if (r.collected) return;

    const dx = r.x - cat.x;
    const dy = r.y - cat.y;
    const dist = Math.hypot(dx, dy);

    if (dist < collectRadius) {
      r.el.classList.add("hit");
      setTimeout(() => r.el.classList.remove("hit"), 110);

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
  scoreEl.textContent = String(score);

  setTimeout(() => {
    if (resource.el && resource.el.parentNode) {
      resource.el.parentNode.removeChild(resource.el);
    }
  }, 220);
}

// Main loop
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

// Make sure layout is ready first
window.addEventListener("load", () => {
  init();
});
