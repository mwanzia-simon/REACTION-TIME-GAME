const userBtn = document.querySelector("#user");
const startBtn = document.querySelector("#get-started-btn");
const user = document.querySelector("#user");
const gameContainer = document.querySelector("#game-container");

//Signin details
const signinForm = document.querySelector("#signinForm");
const signinEmail = document.querySelector("#signinEmail");
const signinPassword = document.querySelector("#signinPassword");

//signup details
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

//To keep track of the game state
let state = "idle";
let startTime;
let timeOutId;
let trials = 0;
let finalReactionTime;
let reactionTimes = [];
const clickSound = new Audio();
const failSound = new Audio();
const doneSound = new Audio();
clickSound.src = "/Frontend/assets/click.wav";
failSound.src = "/Frontend/assets/failSound.wav";
doneSound.src = "/Frontend/assets/doneSound.wav";

//function to save the user score to ocal storage
function saveUserScore(score) {
  localStorage.setItem("USER-SCORE", score);
  alert("Score saved succesifully!");
}

//Function to get user scoer
function getUserScore() {
  return Number(localStorage.getItem("USER-SCORE"));
}

const API_URL = "http://localhost:3000";

if (userBtn) {
  userBtn.addEventListener("click", () => {
    window.open("signup.html", "_self");
  });
}

if (startBtn) {
  startBtn.addEventListener("click", () => {
    window.open("game.html", "_self");
  });
}

if (gameContainer) {
  gameContainer.addEventListener("click", (e) => {
    if (e.target == gameContainer) {
      startGame();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 32) {
    e.preventDefault();
    startGame();
  }
});

//Main game function
function startGame() {
  clickSound.play();
  if (state == "idle") {
    state = "waiting";
    gameContainer.innerHTML = `
    <h1><i class="fa-solid fa-ellipsis"></i></h1>
    <h2>Waiting for green</h2>
    `;

    const delay = Math.random() * 3000 + 2000;

    timeOutId = setTimeout(() => {
      state = "ready";
      gameContainer.style.background = "#4bdb6a";
      gameContainer.innerHTML = `
        <h1><i class="fa-solid fa-ellipsis"></i></h1>
        <h2>Click!</h2>
    `;
      startTime = performance.now();
    }, delay);
  } else if (state == "waiting") {
    failSound.play();
    clearTimeout(timeOutId);
    state = "idle";
    gameContainer.style.background = "#2c87d1";
    gameContainer.innerHTML = `
        <h1><i class="fa-solid fa-circle-exclamation"></i></h1>
        <h1>Too soon!</h1>
        <h2>Click to try again!</h2>
    `;
  } else if (state == "ready") {
    const reactionTime = Math.round(performance.now() - startTime);
    reactionTimes.push(reactionTime);
    state = "idle";
    gameContainer.style.background = "#2c87d1";
    gameContainer.innerHTML = `
        <h1><i class="fa-solid fa-clock"></i></h1>
        <h1>${reactionTime} ms</h1>
        <h3>Click to keep going!</h3>
    `;
    trials++;
    if (trials == 4) {
      state = "completed";
    }
  } else if (state == "completed") {
    finalReactionTime = Math.floor(
      reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length,
    );
    state = "idle";
    reactionTimes = [];
    trials = 0;
    doneSound.play();

    gameContainer.style.background = "#2c87d1";
    gameContainer.innerHTML = `
        <h1><i class="fa-solid fa-bolt-lightning"></i></h1>
        <h3>Your reaction time is</h3>
        <h1>${finalReactionTime} ms</h1>
        <div class="buttons">
        <button class="saveBtn" onclick="saveUserScore(${finalReactionTime})">Save score</button>
        </div>
        <p>click anywhere to try again!</p>
    `;
  }
}
