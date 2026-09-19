const state = {
  level: 1,
  health: 100,
  sanity: 100,
  truth: 0,
  discoveries: 0,
  inventory: [],
  chapter: 1,
  ended: false
};

let currentScene = 0;

const scenes = [
  {
    location: "Mysterious Village",
    title: "The Village That Smiles",
    story: "You wake up in a silent village. Every person is smiling, but nobody has a shadow.",
    choices: [
      {
        label: "🔍 Inspect the well",
        action: () => discover(
          "Broken Mirror", 10, 0,
          "The well reflects a place that does not exist."
        )
      },
      {
        label: "🗣️ Talk to the old man",
        action: () => discover(
          "Black Key", 5, -10,
          "The old man whispers: Never trust the smiling people."
        )
      },
      {
        label: "🚪 Leave the village",
        action: () => damage(
          15,
          "The road moves beneath your feet. You lose health."
        )
      },
      {
        label: "🛌 Rest beneath a tree",
        action: () => heal(
          15,
          "You rest, but the tree begins breathing."
        )
      }
    ]
  },

  {
    location: "The Moving Forest",
    title: "Trees Remember Your Name",
    story: "The forest rearranges itself whenever you blink. A distant voice calls you by a name you have never heard.",
    choices: [
      {
        label: "🌲 Follow the voice",
        action: () => discover(
          "Silver Coin", 15, -15,
          "The voice was yours, speaking from tomorrow."
        )
      },
      {
        label: "🔥 Light a fire",
        action: () => heal(
          10,
          "The fire protects you for a moment."
        )
      },
      {
        label: "👁️ Watch the shadows",
        action: () => discover(
          "Truth Fragment", 20, -5,
          "The shadows move before their owners do."
        )
      },
      {
        label: "🏃 Run blindly",
        action: () => damage(
          25,
          "The forest charges a price for your escape."
        )
      }
    ]
  },

  {
    location: "The False City",
    title: "Everyone Knows You",
    story: "You enter a city where strangers greet you as their ruler. Their memories change whenever you ask questions.",
    choices: [
      {
        label: "🏛️ Enter the palace",
        action: () => discover(
          "Royal Seal", 20, -20,
          "The palace is empty, but your portrait is everywhere."
        )
      },
      {
        label: "🧩 Question the crowd",
        action: () => discover(
          "Truth Fragment", 15, -10,
          "The crowd repeats the same sentence in different voices."
        )
      },
      {
        label: "🕳️ Enter underground door",
        action: () => damage(
          20,
          "The door opens into your own bedroom."
        )
      },
      {
        label: "🛌 Hide and recover",
        action: () => heal(
          20,
          "You recover, but someone leaves a message beside you."
        )
      }
    ]
  }
];

function render() {
  const scene = scenes[currentScene];

  document.getElementById("level").textContent =
    state.level;

  document.getElementById("health").textContent =
    `${state.health}/100`;

  document.getElementById("sanity").textContent =
    state.sanity;

  document.getElementById("truth").textContent =
    `${state.truth}%`;

  document.getElementById("location").textContent =
    scene.location;

  document.getElementById("scene-title").textContent =
    scene.title;

  document.getElementById("story").textContent =
    scene.story;

  document.getElementById("inventory").textContent =
    state.inventory.length
      ? state.inventory.join(" • ")
      : "Empty";

  document.getElementById("progress").textContent =
    `Chapter ${state.chapter} • ${state.discoveries}/5 discoveries`;

  const choices = document.getElementById("choices");

  choices.innerHTML = "";

  scene.choices.forEach(choice => {
    const button = document.createElement("button");

    button.textContent = choice.label;

    button.onclick = choice.action;

    button.disabled = state.ended;

    choices.appendChild(button);
  });
}

function showMessage(text) {
  document.getElementById("message").textContent =
    text;
}

function discover(item, truthGain, sanityLoss, text) {
  if (!state.inventory.includes(item)) {
    state.inventory.push(item);
    state.discoveries++;
  }

  state.truth = Math.min(
    100,
    state.truth + truthGain
  );

  state.sanity = Math.max(
    0,
    state.sanity + sanityLoss
  );

  state.level++;

  showMessage(text);

  nextScene();
}

function damage(amount, text) {
  state.health = Math.max(
    0,
    state.health - amount
  );

  state.sanity = Math.max(
    0,
    state.sanity - 5
  );

  showMessage(text);

  checkEnd();

  render();
}

function heal(amount, text) {
  state.health = Math.min(
    100,
    state.health + amount
  );

  state.sanity = Math.max(
    0,
    state.sanity - 2
  );

  showMessage(text);

  render();
}

function nextScene() {
  if (
    state.discoveries >= 5 ||
    state.truth >= 100
  ) {
    state.ended = true;

    showMessage(
      "🏆 You found enough truth to see through the lie!"
    );

    render();

    return;
  }

  currentScene =
    (currentScene + 1) % scenes.length;

  state.chapter =
    Math.min(3, currentScene + 1);

  checkEnd();

  render();
}

function checkEnd() {
  if (
    state.health <= 0 ||
    state.sanity <= 0
  ) {
    state.ended = true;

    showMessage(
      "💀 GAME OVER — The world has consumed your identity. Restart to try again."
    );
  }
}

function restartGame() {
  state.level = 1;
  state.health = 100;
  state.sanity = 100;
  state.truth = 0;
  state.discoveries = 0;
  state.inventory = [];
  state.chapter = 1;
  state.ended = false;

  currentScene = 0;

  showMessage(
    "A new journey begins. Choose carefully."
  );

  render();
}

render();

/* CHARACTER MOVEMENT */

const playerCharacter = document.getElementById("player");

let playerPosition = {
  x: 50,
  y: 35
};

const movementSpeed = 5;

function movePlayer(direction) {
  if (state.ended) return;

  if (direction === "up") {
    playerPosition.y += movementSpeed;
  }

  if (direction === "down") {
    playerPosition.y -= movementSpeed;
  }

  if (direction === "left") {
    playerPosition.x -= movementSpeed;
  }

  if (direction === "right") {
    playerPosition.x += movementSpeed;
  }

  playerPosition.x = Math.max(
    5,
    Math.min(95, playerPosition.x)
  );

  playerPosition.y = Math.max(
    5,
    Math.min(85, playerPosition.y)
  );

  playerCharacter.style.left =
    playerPosition.x + "%";

  playerCharacter.style.bottom =
    playerPosition.y + "%";

  document.getElementById("map-message").textContent =
    "You are exploring the unknown world...";
  checkNearbyLocations();
}
  
document.addEventListener("keydown", function(event) {
  const key = event.key.toLowerCase();

  if (key === "w" || key === "arrowup") {
    movePlayer("up");
     
  }

  if (key === "s" || key === "arrowdown") {
    movePlayer("down");
  }

  if (key === "a" || key === "arrowleft") {
    movePlayer("left");
  }

  if (key === "d" || key === "arrowright") {
    movePlayer("right");
  }
});

  
/* INTERACTIVE LOCATIONS */

const locations = document.querySelectorAll(".location");

locations.forEach(location => {
  location.addEventListener("click", () => {

    if (state.ended) return;

    const name = location.classList[1];

    if (name === "village") {
      showMessage(
        "🏚️ Village: Everyone is smiling, but nobody has a shadow."
      );
    }

    if (name === "forest") {
      showMessage(
        "🌲 Forest: Something is moving between the trees."
      );
    }

    if (name === "temple") {
      showMessage(
        "🏛️ Temple: An ancient secret is hidden inside."
      );
    }

    if (name === "well") {
      showMessage(
        "🕳️ Well: You can hear someone calling your name."
      );
    }

    document.getElementById("map-message").textContent =
      "You discovered a mysterious location...";

  });
});

/* DISCOVERY POPUP FUNCTIONS */

function showDiscovery(text) {
  const popup = document.getElementById("discovery-popup");
  const discoveryText = document.getElementById("discovery-text");

  discoveryText.textContent = text;
  popup.style.display = "block";
}

function closeDiscovery() {
  document.getElementById("discovery-popup").style.display =
    "none";
}

