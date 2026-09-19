
let player = {
  level: 1,
  health: 100,
  maxHealth: 100,
  xp: 0
};

function explore() {
  const damage = Math.floor(Math.random() * 20) + 5;

  player.health -= damage;
  player.xp += 25;

  if (player.health <= 0) {
    player.health = 0;
    gameOver();
    return;
  }

  if (player.xp >= 100) {
    player.level++;
    player.xp = 0;
  }

  updateGame(
    "You explored the world. Health lost: " + damage
  );
}

function rest() {
  player.health += 20;

  if (player.health > player.maxHealth) {
    player.health = player.maxHealth;
  }

  updateGame("You rested and recovered health.");
}

function gameOver() {
  document.getElementById("message").textContent =
    "💀 GAME OVER! Try again.";
}

function updateGame(message) {
  document.getElementById("level").textContent =
    "Level " + player.level;

  document.getElementById("message").textContent =
    message + " | HP: " + player.health;
}

