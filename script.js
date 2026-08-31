import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
    set,
    query,
    orderByChild
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

console.log("======================================");
console.log("🔥 FIREBASE LEADERBOARD MODULE LOADED");
console.log("======================================");

// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyAvs8RGpxommOqs_5Xe5JgKZp5xcSsFlQw",

    authDomain:
        "find-the-watson-game.firebaseapp.com",

    projectId:
        "find-the-watson-game",

    storageBucket:
        "find-the-watson-game.firebasestorage.app",

    messagingSenderId:
        "642451332683",

    appId:
        "1:642451332683:web:125d0f0b1b7c825d5b37ce",

    measurementId:
        "G-L8CLXMKT2R"

};

console.log("🔥 Firebase config loaded");


// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

let firebaseApp = null;
let database = null;
let firebaseReady = false;

try {

    console.log("🔥 Initializing Firebase...");

    firebaseApp =
        initializeApp(firebaseConfig);

    console.log(
        "✅ Firebase app initialized:",
        firebaseApp
    );

    database =
        getDatabase(firebaseApp);

    console.log(
        "✅ Firebase database initialized:",
        database
    );

    firebaseReady = true;

    console.log(
        "🟢 Firebase leaderboard is READY"
    );

}

catch (error) {

    console.error(
        "🔴 FIREBASE INITIALIZATION FAILED"
    );

    console.error(error);

    firebaseReady = false;

}

// ============================================================
// FIND WATSON
// Version 2
// ============================================================


// ============================================================
// SETTINGS
// ============================================================

const GAME_LENGTH = 5;

const STARTING_WATSON_SIZE = 115;
const MIN_WATSON_SIZE = 37;

const STARTING_FIND_TIME = 20;
const MIN_FIND_TIME = 2.5;

const POINTS_PER_FIND = 12;

const WRONG_CLICK_PENALTY = 10;

const WATSONS_PER_LEVEL = 4;


// ============================================================
// ELEMENTS
// ============================================================

const gameMusic =
    document.getElementById("gameMusic");

const menuScreen =
    document.getElementById("menuScreen");
    document.getElementById("menuScreen");

const gameScreen =
    document.getElementById("gameScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const playButton =
    document.getElementById("playButton");

const playAgainButton =
    document.getElementById("playAgainButton");

const menuButton =
    document.getElementById("menuButton");

const highScoreButton =
    document.getElementById("highScoreButton");

const highScoreModal =
    document.getElementById("highScoreModal");

const closeHighScore =
    document.getElementById("closeHighScore");

const modalPlayButton =
    document.getElementById("modalPlayButton");

const watson =
    document.getElementById("watson");

const gameArea =
    document.getElementById("gameArea");

const scoreDisplay =
    document.getElementById("score");

const streakDisplay =
    document.getElementById("streak");

const multiplierDisplay =
    document.getElementById("multiplier");

const levelDisplay =
    document.getElementById("level");

const timerDisplay =
    document.getElementById("timer");

const findTimerDisplay =
    document.getElementById("findTimer");

const levelProgressBar =
    document.getElementById("levelProgressBar");

const levelMessage =
    document.getElementById("levelMessage");

const levelMessageSmall =
    document.getElementById("levelMessageSmall");

const levelMessageBig =
    document.getElementById("levelMessageBig");

const feedback =
    document.getElementById("feedback");

const menuHighScore =
    document.getElementById("menuHighScore");

const modalHighScore =
    document.getElementById("modalHighScore");

const finalScore =
    document.getElementById("finalScore");

const finalWatsons =
    document.getElementById("finalWatsons");

const finalBestStreak =
    document.getElementById("finalBestStreak");

const finalAccuracy =
    document.getElementById("finalAccuracy");

const finalLevel =
    document.getElementById("finalLevel");

const newHighScore =
    document.getElementById("newHighScore");


// ============================================================
// BACKGROUNDS
// ============================================================

const backgrounds = [

    "/Find-The-Watson-Game/background1.jpg",
    "/Find-The-Watson-Game/background2.jpg",
    "/Find-The-Watson-Game/background3.jpg",
    "/Find-The-Watson-Game/background4.jpg",
    "/Find-The-Watson-Game/background5.jpg",
    "/Find-The-Watson-Game/background6.jpg",
    "/Find-The-Watson-Game/background7.jpg"

];


// ============================================================
// GAME VARIABLES
// ============================================================

let score = 0;

let streak = 0;

let bestStreak = 0;

let watsonsFound = 0;

let wrongClicks = 0;

let level = 1;

let gameTime = GAME_LENGTH;

let findTime = STARTING_FIND_TIME;

let currentFindTime = STARTING_FIND_TIME;

let currentWatsonSize =
    STARTING_WATSON_SIZE;

let gameTimer = null;

let findTimer = null;

let gameRunning = false;


// ============================================================
// START GAME
// ============================================================

function startGame() {

    console.log("Starting Find Watson...");


    // Reset

    score = 0;

    streak = 0;

    bestStreak = 0;

    watsonsFound = 0;

    wrongClicks = 0;

    level = 1;

    gameTime = GAME_LENGTH;

    currentWatsonSize =
        STARTING_WATSON_SIZE;


    gameRunning = true;

    gameMusic.currentTime = 0;
    gameMusic.volume = 0.99;

    gameMusic.play().catch(function(error) {
    console.log("Music error:", error);
    });


    // Screens

    menuScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    highScoreModal.classList.add("hidden");

    gameScreen.classList.remove("hidden");


    // Background

    changeBackground();


    // UI

    updateDisplays();


    // Watson

    spawnWatson();


    // Timers

    startGameTimer();

    startFindTimer();


    // Level intro

    showLevelMessage(
        "GET READY",
        "LEVEL 1"
    );

}


// ============================================================
// SPAWN WATSON
// ============================================================

function spawnWatson() {

    if (!gameRunning) {
        return;
    }


    const areaWidth =
        gameArea.clientWidth;

    const areaHeight =
        gameArea.clientHeight;


    const maxX =
        Math.max(
            0,
            areaWidth - currentWatsonSize
        );


    const maxY =
        Math.max(
            0,
            areaHeight - currentWatsonSize
        );


    const randomX =
        Math.random() * maxX;


    const randomY =
        Math.random() * maxY;


    watson.style.width =
        `${currentWatsonSize}px`;


    watson.style.left =
        `${randomX}px`;


    watson.style.top =
        `${randomY}px`;


    watson.style.display =
        "block";


    // Random rotation

    const rotation =
        Math.random() * 12 - 6;


    watson.style.transform =
        `rotate(${rotation}deg)`;

}


// ============================================================
// WATSON CLICK
// ============================================================

watson.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        if (!gameRunning) {
            return;
        }


        // Found!

        watsonsFound++;

        streak++;


        if (streak > bestStreak) {
            bestStreak = streak;
        }


        // Points

        const multiplier =
            getMultiplier();


        const points =
            Math.round(
                POINTS_PER_FIND *
                multiplier
            );


        score += points;


        // Feedback

        showFeedback(
            `+${points} 🔥`,
            event.clientX,
            event.clientY
        );


        // Difficulty

        increaseDifficulty();


        // Level

        checkLevel();


        // New Watson

        spawnWatson();


        // Reset countdown

        resetFindTimer();


        // Update

        updateDisplays();

    }
);


// ============================================================
// WRONG CLICK
// ============================================================

gameArea.addEventListener(
    "click",
    function(event) {

        if (!gameRunning) {
            return;
        }


        wrongClicks++;


        score -= WRONG_CLICK_PENALTY;


        if (score < 0) {
            score = 0;
        }


        showFeedback(
            `-${WRONG_CLICK_PENALTY} ❌`,
            event.clientX,
            event.clientY
        );


        updateDisplays();

    }
);


// ============================================================
// MULTIPLIER
// ============================================================

function getMultiplier() {

    return Math.min(
        1 + (streak * 0.3),
        5
    );

}


// ============================================================
// DIFFICULTY
// ============================================================

function increaseDifficulty() {

    currentWatsonSize -= 3;


    if (
        currentWatsonSize <
        MIN_WATSON_SIZE
    ) {

        currentWatsonSize =
            MIN_WATSON_SIZE;

    }

}


// ============================================================
// FIND TIMER
// ============================================================

function startFindTimer() {

    clearInterval(findTimer);


    currentFindTime =
        getFindTime();


    findTimer =
        setInterval(
            function() {

                if (!gameRunning) {
                    return;
                }


                currentFindTime--;


                updateFindTimer();


                if (
                    currentFindTime <= 0
                ) {

                    watsonExplodes();

                }

            },
            1000
        );

}


// ============================================================
// RESET FIND TIMER
// ============================================================

function resetFindTimer() {

    currentFindTime =
        getFindTime();


    updateFindTimer();

}


// ============================================================
// FIND TIME
// ============================================================

function getFindTime() {

    const reduction =
        (level - 1) * 3;


    return Math.max(
        STARTING_FIND_TIME -
        reduction,

        MIN_FIND_TIME
    );

}


// ============================================================
// FIND TIMER DISPLAY
// ============================================================

function updateFindTimer() {

    findTimerDisplay.textContent =
        currentFindTime;


    if (
        currentFindTime <= 5
    ) {

        findTimerDisplay.style.color =
            "#ff4444";

        findTimerDisplay.style.transform =
            "scale(1.15)";

    } else {

        findTimerDisplay.style.color =
            "white";

        findTimerDisplay.style.transform =
            "scale(1)";

    }

}


// ============================================================
// EXPLOSION
// ============================================================

function watsonExplodes() {

    if (!gameRunning) {
        return;
    }


    console.log(
        "Watson exploded!"
    );


    watson.style.display =
        "none";


    streak = 0;


    gameScreen.classList.add(
        "screen-shake"
    );


    setTimeout(
        function() {

            gameScreen.classList.remove(
                "screen-shake"
            );

        },
        500
    );


    showLevelMessage(
        "TOO SLOW 💥",
        "WATSON EXPLODED"
    );


    setTimeout(
        function() {

            if (!gameRunning) {
                return;
            }


            spawnWatson();

            resetFindTimer();

        },
        700
    );


    updateDisplays();

}


// ============================================================
// LEVEL SYSTEM
// ============================================================

function checkLevel() {

    const newLevel =
        Math.floor(
            watsonsFound /
            WATSONS_PER_LEVEL
        ) + 1;


    if (
        newLevel >
        level
    ) {

        level =
            newLevel;


        showLevelMessage(
            "LEVEL UP!",
            `LEVEL ${level}`
        );


        changeBackground();

    }


    updateLevelProgress();

}


// ============================================================
// LEVEL PROGRESS
// ============================================================

function updateLevelProgress() {

    const progress =
        watsonsFound %
        WATSONS_PER_LEVEL;


    const percentage =
        (progress /
        WATSONS_PER_LEVEL) *
        100;


    levelProgressBar.style.width =
        `${percentage}%`;

}


// ============================================================
// LEVEL MESSAGE
// ============================================================

function showLevelMessage(
    smallText,
    bigText
) {

    levelMessageSmall.textContent =
        smallText;


    levelMessageBig.textContent =
        bigText;


    levelMessage.style.opacity =
        "1";


    levelMessage.style.transform =
        "translate(-50%, -50%) scale(1.05)";


    setTimeout(
        function() {

            levelMessage.style.opacity =
                "0";


            levelMessage.style.transform =
                "translate(-50%, -50%) scale(0.8)";

        },
        1000
    );

}


// ============================================================
// BACKGROUND
// ============================================================

function changeBackground() {

    const index =
        (level - 1) %
        backgrounds.length;


    gameScreen.style.backgroundImage =
        `linear-gradient(
            rgba(0,0,0,0.25),
            rgba(0,0,0,0.25)
        ),
        url("${backgrounds[index]}")`;

}


// ============================================================
// GAME TIMER
// ============================================================

function startGameTimer() {

    clearInterval(gameTimer);


    gameTimer =
        setInterval(
            function() {

                if (!gameRunning) {
                    return;
                }


                gameTime--;


                updateTimer();


                if (
                    gameTime <= 0
                ) {

                    endGame();

                }

            },
            1000
        );

}


// ============================================================
// TIMER
// ============================================================

function updateTimer() {

    const minutes =
        Math.floor(
            gameTime / 60
        );


    const seconds =
        gameTime % 60;


    timerDisplay.textContent =
        `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;


    if (
        gameTime <= 10
    ) {

        timerDisplay.style.color =
            "#ff3333";

    } else {

        timerDisplay.style.color =
            "white";

    }

}


// ============================================================
// UI
// ============================================================

function updateDisplays() {

    scoreDisplay.textContent =
        score.toLocaleString();


    streakDisplay.textContent =
        streak;


    multiplierDisplay.textContent =
        `${getMultiplier().toFixed(1)}x`;


    levelDisplay.textContent =
        level;


    updateTimer();

    updateFindTimer();

    updateLevelProgress();

}


// ============================================================
// FEEDBACK
// ============================================================

function showFeedback(
    text,
    x,
    y
) {

    const rect =
        gameArea.getBoundingClientRect();


    feedback.textContent =
        text;


    feedback.style.left =
        `${x - rect.left}px`;


    feedback.style.top =
        `${y - rect.top}px`;


    feedback.style.opacity =
        "1";


    feedback.style.transform =
        "translate(-50%, -50%) scale(1.3)";


    setTimeout(
        function() {

            feedback.style.opacity =
                "0";


            feedback.style.transform =
                "translate(-50%, -50%) scale(1)";

        },
        400
    );

}


// ============================================================
// END GAME
// ============================================================

function endGame() {

    if (!gameRunning) {
        return;
    }


    console.log(
        "Game over!"
    );


    gameRunning = false;


    clearInterval(gameTimer);

    clearInterval(findTimer);


    watson.style.display =
        "none";


    // Accuracy

    const totalClicks =
        watsonsFound +
        wrongClicks;


    let accuracy = 0;


    if (
        totalClicks > 0
    ) {

        accuracy =
            Math.round(
                (
                    watsonsFound /
                    totalClicks
                ) * 100
            );

    }


    // Final screen

    finalScore.textContent =
        score.toLocaleString();


    finalWatsons.textContent =
        watsonsFound;


    finalBestStreak.textContent =
        bestStreak;


    finalAccuracy.textContent =
        `${accuracy}%`;


    finalLevel.textContent =
        level;


    // High score

    const oldHighScore =
        Number(
            localStorage.getItem(
                "watsonHighScore"
            ) || 0
        );


    if (
        score >
        oldHighScore
    ) {

        localStorage.setItem(
            "watsonHighScore",
            score
        );


        newHighScore.classList.remove(
            "hidden"
        );

    } else {

        newHighScore.classList.add(
            "hidden"
        );

    }


    updateHighScoreDisplays();


    // Screens

    gameScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.remove(
        "hidden"
    );

}


// ============================================================
// HIGH SCORE
// ============================================================

function getHighScore() {

    return Number(
        localStorage.getItem(
            "watsonHighScore"
        ) || 0
    );

}


function updateHighScoreDisplays() {

    const highScore =
        getHighScore();


    menuHighScore.textContent =
        highScore.toLocaleString();


    modalHighScore.textContent =
        highScore.toLocaleString();

}


// ============================================================
// HIGH SCORE MODAL
// ============================================================

highScoreButton.addEventListener(
    "click",
    function() {

        updateHighScoreDisplays();

        highScoreModal.classList.remove(
            "hidden"
        );

    }
);


closeHighScore.addEventListener(
    "click",
    function() {

        highScoreModal.classList.add(
            "hidden"
        );

    }
);


modalPlayButton.addEventListener(
    "click",
    function() {

        startGame();

    }
);


// Click outside modal

highScoreModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            highScoreModal
        ) {

            highScoreModal.classList.add(
                "hidden"
            );

        }

    }
);


// ============================================================
// BUTTONS
// ============================================================

playButton.addEventListener(
    "click",
    function() {

        startGame();

    }
);


playAgainButton.addEventListener(
    "click",
    function() {

        startGame();

    }
);


menuButton.addEventListener(
    "click",
    function() {

        gameRunning = false;


        clearInterval(
            gameTimer
        );


        clearInterval(
            findTimer
        );


        gameOverScreen.classList.add(
            "hidden"
        );


        gameScreen.classList.add(
            "hidden"
        );


        menuScreen.classList.remove(
            "hidden"
        );


        updateHighScoreDisplays();

    }
);


// ============================================================
// INITIALIZE
// ============================================================

updateHighScoreDisplays();

console.log(
    "Find Watson loaded successfully!"
);

// ============================================================
// FIREBASE LEADERBOARD
// ============================================================

console.log("");
console.log("======================================");
console.log("🏆 LEADERBOARD SYSTEM STARTING");
console.log("======================================");


const leaderboardButton =
    document.getElementById("leaderboardButton");

const leaderboardScreen =
    document.getElementById("leaderboardScreen");

const leaderboardBackButton =
    document.getElementById("leaderboardBackButton");

const leaderboardList =
    document.getElementById("leaderboardList");

const addLeaderboardButton =
    document.getElementById("addLeaderboardButton");

const leaderboardNameOverlay =
    document.getElementById("leaderboardNameOverlay");

const leaderboardNameInput =
    document.getElementById("leaderboardNameInput");

const leaderboardScore =
    document.getElementById("leaderboardScore");

const leaderboardNameError =
    document.getElementById("leaderboardNameError");

const submitLeaderboardButton =
    document.getElementById("submitLeaderboardButton");

const cancelLeaderboardButton =
    document.getElementById("cancelLeaderboardButton");


console.log(
    "🏆 Leaderboard elements:"
);

console.log(
    "Button:",
    leaderboardButton
);

console.log(
    "Screen:",
    leaderboardScreen
);

console.log(
    "Back:",
    leaderboardBackButton
);

console.log(
    "List:",
    leaderboardList
);

console.log(
    "Add:",
    addLeaderboardButton
);

console.log(
    "Name overlay:",
    leaderboardNameOverlay
);

console.log(
    "Name input:",
    leaderboardNameInput
);

console.log(
    "Score:",
    leaderboardScore
);

console.log(
    "Submit:",
    submitLeaderboardButton
);

console.log(
    "Cancel:",
    cancelLeaderboardButton
);


// ============================================================
// OPEN LEADERBOARD
// ============================================================

if (leaderboardButton) {

    leaderboardButton.addEventListener(
        "click",
        function() {

            console.log("");
            console.log(
                "🏆 LEADERBOARD BUTTON CLICKED"
            );

            document
                .querySelectorAll(".screen")
                .forEach(function(screen) {

                    screen.classList.add(
                        "hidden"
                    );

                });


            if (leaderboardScreen) {

                leaderboardScreen.classList.remove(
                    "hidden"
                );

                console.log(
                    "✅ Leaderboard screen opened"
                );

            }


            loadLeaderboard();

        }
    );

    console.log(
        "✅ Leaderboard button listener attached"
    );

}

else {

    console.error(
        "❌ leaderboardButton NOT FOUND"
    );

}


// ============================================================
// BACK BUTTON
// ============================================================

if (leaderboardBackButton) {

    leaderboardBackButton.addEventListener(
        "click",
        function() {

            console.log(
                "← LEADERBOARD BACK CLICKED"
            );


            if (leaderboardScreen) {

                leaderboardScreen.classList.add(
                    "hidden"
                );

            }


            if (menuScreen) {

                menuScreen.classList.remove(
                    "hidden"
                );

            }


            console.log(
                "✅ Returned to menu"
            );

        }
    );

}

else {

    console.error(
        "❌ leaderboardBackButton NOT FOUND"
    );

}


// ============================================================
// LOAD LEADERBOARD
// ============================================================

async function loadLeaderboard() {

    console.log("");
    console.log(
        "📡 LOADING FIREBASE LEADERBOARD..."
    );


    if (!leaderboardList) {

        console.error(
            "❌ leaderboardList missing"
        );

        return;

    }


    leaderboardList.innerHTML =
        "<p>LOADING LEADERBOARD...</p>";


    if (!firebaseReady || !database) {

        console.error(
            "❌ Firebase is not ready"
        );

        leaderboardList.innerHTML =
            "<p>LEADERBOARD UNAVAILABLE</p>";

        return;

    }


    try {

        console.log(
            "📡 Reading database path: leaderboard"
        );


        const leaderboardRef =
            ref(
                database,
                "leaderboard"
            );


        const leaderboardQuery =
            query(
                leaderboardRef,
                orderByChild("score")
            );


        const snapshot =
            await get(
                leaderboardQuery
            );


        console.log(
            "📦 Firebase snapshot:",
            snapshot
        );


        if (!snapshot.exists()) {

            console.log(
                "ℹ️ No leaderboard scores yet"
            );

            leaderboardList.innerHTML =
                "<p>NO SCORES YET!</p>";

            return;

        }


        const scores = [];


        snapshot.forEach(
            function(child) {

                const data =
                    child.val();


                console.log(
                    "📦 Score found:",
                    data
                );


                scores.push({

                    name:
                        data.name || "Unknown",

                    date:
                        data.date || "--/--/--",

                    score:
                        Number(
                            data.score || 0
                        )

                });

            }
        );


        // Highest score first

        scores.sort(
            function(a, b) {

                return b.score - a.score;

            }
        );


        console.log(
            "🏆 SORTED SCORES:",
            scores
        );


        leaderboardList.innerHTML = "";


        scores
            .slice(0, 10)
            .forEach(
                function(player, index) {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "leaderboard-row";


                    const rank =
                        index + 1;


                    row.innerHTML = `

                        <div class="leaderboard-rank">
                            #${rank}
                        </div>

                        <div class="leaderboard-name">
                            ${escapeLeaderboardHTML(
                                player.name
                            )}
                        </div>

                        <div class="leaderboard-date">
                            ${escapeLeaderboardHTML(
                                player.date
                            )}
                        </div>

                        <div class="leaderboard-score">
                            ${player.score.toLocaleString()}
                        </div>

                    `;


                    leaderboardList.appendChild(
                        row
                    );

                }
            );


        console.log(
            "✅ LEADERBOARD DISPLAYED"
        );

    }

    catch (error) {

        console.error(
            "🔴 FAILED TO LOAD LEADERBOARD"
        );

        console.error(
            error
        );


        leaderboardList.innerHTML =
            "<p>FAILED TO LOAD LEADERBOARD</p>";

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeLeaderboardHTML(text) {

    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ============================================================
// ADD TO LEADERBOARD
// ============================================================

if (addLeaderboardButton) {

    addLeaderboardButton.addEventListener(
        "click",
        function() {

            console.log("");
            console.log(
                "🏆 ADD TO LEADERBOARD CLICKED"
            );


            console.log(
                "Current score:",
                score
            );


            if (leaderboardScore) {

                leaderboardScore.textContent =
                    score.toLocaleString();

            }


            if (leaderboardNameInput) {

                leaderboardNameInput.value = "";

            }


            if (leaderboardNameError) {

                leaderboardNameError.textContent =
                    "";

            }


            if (leaderboardNameOverlay) {

                leaderboardNameOverlay.classList.remove(
                    "hidden"
                );

            }


            setTimeout(
                function() {

                    if (leaderboardNameInput) {

                        leaderboardNameInput.focus();

                    }

                },
                100
            );

        }
    );


    console.log(
        "✅ Add leaderboard listener attached"
    );

}

else {

    console.error(
        "❌ addLeaderboardButton NOT FOUND"
    );

}


// ============================================================
// CANCEL
// ============================================================

if (cancelLeaderboardButton) {

    cancelLeaderboardButton.addEventListener(
        "click",
        function() {

            console.log(
                "❌ LEADERBOARD NAME CANCELLED"
            );


            leaderboardNameOverlay.classList.add(
                "hidden"
            );

        }
    );

}


// ============================================================
// SUBMIT
// ============================================================

if (submitLeaderboardButton) {

    submitLeaderboardButton.addEventListener(
        "click",
        submitLeaderboardScore
    );

}


// ============================================================
// ENTER KEY
// ============================================================

if (leaderboardNameInput) {

    leaderboardNameInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                submitLeaderboardScore();

            }

        }
    );

}


// ============================================================
// SUBMIT SCORE
// ============================================================

async function submitLeaderboardScore() {

    console.log("");
    console.log(
        "======================================"
    );

    console.log(
        "🏆 SUBMITTING SCORE"
    );

    console.log(
        "======================================"
    );


    if (!firebaseReady || !database) {

        console.error(
            "❌ Firebase NOT READY"
        );

        leaderboardNameError.textContent =
            "Leaderboard unavailable.";

        return;

    }


    const name =
        leaderboardNameInput.value.trim();


    console.log(
        "👤 Name:",
        name
    );

    console.log(
        "🎯 Score:",
        score
    );


    if (name.length < 2) {

        console.warn(
            "❌ Name too short"
        );

        leaderboardNameError.textContent =
            "Please enter at least 2 characters.";

        return;

    }


    if (name.length > 20) {

        console.warn(
            "❌ Name too long"
        );

        leaderboardNameError.textContent =
            "Name must be 20 characters or less.";

        return;

    }


    submitLeaderboardButton.disabled =
        true;


    submitLeaderboardButton.textContent =
        "SAVING...";


    try {

        const cleanName =
            name
                .toLowerCase()
                .replace(
                    /[^a-z0-9_-]/g,
                    "_"
                );


        console.log(
            "🔑 Database key:",
            cleanName
        );


        const scoreRef =
            ref(
                database,
                "leaderboard/" +
                cleanName
            );


        console.log(
            "📡 Checking existing player..."
        );


        const existing =
            await get(scoreRef);


        if (existing.exists()) {

            const existingData =
                existing.val();


            const existingScore =
                Number(
                    existingData.score || 0
                );


            console.log(
                "📦 Existing score:",
                existingScore
            );


            if (
                score <=
                existingScore
            ) {

                console.log(
                    "ℹ️ Existing score is higher"
                );


                leaderboardNameError.textContent =
                    `Your existing score is ${existingScore}.`;

                return;

            }

        }


        const now =
            new Date();


        const date =
            `${String(
                now.getDate()
            ).padStart(2, "0")}/` +

            `${String(
                now.getMonth() + 1
            ).padStart(2, "0")}/` +

            `${now.getFullYear()}`;


        const scoreData = {

            name:
                name,

            date:
                date,

            score:
                Number(score)

        };


        console.log(
            "📤 SAVING:",
            scoreData
        );


        await set(
            scoreRef,
            scoreData
        );


        console.log(
            "✅ SCORE SAVED TO FIREBASE!"
        );


        leaderboardNameOverlay.classList.add(
            "hidden"
        );


        // Show leaderboard

        document
            .querySelectorAll(".screen")
            .forEach(function(screen) {

                screen.classList.add(
                    "hidden"
                );

            });


        leaderboardScreen.classList.remove(
            "hidden"
        );


        await loadLeaderboard();


    }

    catch (error) {

        console.error(
            "🔴 SCORE SAVE FAILED"
        );

        console.error(
            error
        );


        leaderboardNameError.textContent =
            "Failed to save score.";

    }

    finally {

        submitLeaderboardButton.disabled =
            false;


        submitLeaderboardButton.textContent =
            "SUBMIT SCORE";

    }

}

console.log("");
console.log(
    "======================================"
);

console.log(
    "✅ LEADERBOARD SYSTEM READY"
);

console.log(
    "Firebase ready:",
    firebaseReady
);

console.log(
    "======================================"
);

// ============================================================
// LEADERBOARD NAME PROMPT
// ============================================================

const addLeaderboardButton =
    document.getElementById("addLeaderboardButton");

const leaderboardNameOverlay =
    document.getElementById("leaderboardNameOverlay");

const leaderboardNameInput =
    document.getElementById("leaderboardNameInput");

const leaderboardNameError =
    document.getElementById("leaderboardNameError");

const submitLeaderboardButton =
    document.getElementById("submitLeaderboardButton");

const cancelLeaderboardButton =
    document.getElementById("cancelLeaderboardButton");


console.log("🏆 Leaderboard name prompt loaded");


// ------------------------------------------------------------
// OPEN NAME PROMPT
// ------------------------------------------------------------

if (addLeaderboardButton) {

    addLeaderboardButton.addEventListener("click", function() {

        console.log("🏆 ADD TO LEADERBOARD CLICKED");

        leaderboardNameInput.value = "";
        leaderboardNameError.textContent = "";

        leaderboardNameOverlay.classList.remove("hidden");

        setTimeout(function() {

            leaderboardNameInput.focus();

        }, 100);

    });

}


// ------------------------------------------------------------
// CANCEL
// ------------------------------------------------------------

if (cancelLeaderboardButton) {

    cancelLeaderboardButton.addEventListener("click", function() {

        console.log("❌ Name prompt cancelled");

        leaderboardNameOverlay.classList.add("hidden");

    });

}


// ------------------------------------------------------------
// CONTINUE
// ------------------------------------------------------------

if (submitLeaderboardButton) {

    submitLeaderboardButton.addEventListener("click", function() {

        const name =
            leaderboardNameInput.value.trim();

        console.log("👤 Entered name:", name);


        if (name.length === 0) {

            leaderboardNameError.textContent =
                "Please enter a name.";

            return;

        }


        console.log(
            "✅ Name accepted:",
            name
        );

        console.log(
            "📊 Score that will eventually be submitted:",
            score
        );


        // For now, just close the prompt.
        // We will connect this to Firebase later.

        leaderboardNameOverlay.classList.add("hidden");

    });

}


// ------------------------------------------------------------
// ENTER KEY
// ------------------------------------------------------------

if (leaderboardNameInput) {

    leaderboardNameInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                submitLeaderboardButton.click();

            }

        }
    );

}
