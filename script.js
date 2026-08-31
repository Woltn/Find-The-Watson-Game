// ============================================================
// FIND WATSON
// COMPLETE GAME + FIREBASE LEADERBOARD
// ============================================================
//
// IMPORTANT:
// This file MUST be loaded with:
//
// <script type="module" src="script.js"></script>
//
// DO NOT add another Firebase script to index.html.
// ============================================================


console.log("");
console.log("==============================================");
console.log("🎯 FIND WATSON SCRIPT STARTING");
console.log("==============================================");


// ============================================================
// FIREBASE IMPORTS
// ============================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
    set,
    query,
    orderByChild
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";


console.log("✅ Firebase modules imported");


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


console.log("🔧 Firebase configuration loaded");


// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

let firebaseApp = null;

let database = null;

let firebaseReady = false;


try {

    firebaseApp =
        initializeApp(firebaseConfig);


    console.log(
        "✅ Firebase app initialized"
    );


    database =
        getDatabase(firebaseApp);


    console.log(
        "✅ Firebase Realtime Database initialized"
    );


    firebaseReady = true;


}

catch (error) {

    console.error(
        "❌ FIREBASE INITIALIZATION FAILED"
    );

    console.error(error);

    firebaseReady = false;

}


// ============================================================
// SETTINGS
// ============================================================

const GAME_LENGTH = 60;

const STARTING_WATSON_SIZE = 115;

const MIN_WATSON_SIZE = 37;

const STARTING_FIND_TIME = 20;

const MIN_FIND_TIME = 2;

const POINTS_PER_FIND = 12;

const WRONG_CLICK_PENALTY = 10;

const WATSONS_PER_LEVEL = 4;


// ============================================================
// ELEMENT HELPER
// ============================================================

function getElement(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.error(
            `❌ MISSING ELEMENT: #${id}`
        );

    }

    else {

        console.log(
            `✅ Found element: #${id}`
        );

    }


    return element;

}


// ============================================================
// ELEMENTS
// ============================================================

const gameMusic =
    getElement("gameMusic");


const menuScreen =
    getElement("menuScreen");


const gameScreen =
    getElement("gameScreen");


const gameOverScreen =
    getElement("gameOverScreen");


const leaderboardScreen =
    getElement("leaderboardScreen");


const playButton =
    getElement("playButton");


const playAgainButton =
    getElement("playAgainButton");


const menuButton =
    getElement("menuButton");


const highScoreButton =
    getElement("highScoreButton");


const highScoreModal =
    getElement("highScoreModal");


const closeHighScore =
    getElement("closeHighScore");


const modalPlayButton =
    getElement("modalPlayButton");


const leaderboardButton =
    getElement("leaderboardButton");


const leaderboardBackButton =
    getElement("leaderboardBackButton");


const leaderboardList =
    getElement("leaderboardList");


const addLeaderboardButton =
    getElement("addLeaderboardButton");


const leaderboardNameOverlay =
    getElement("leaderboardNameOverlay");


const leaderboardNameInput =
    getElement("leaderboardNameInput");


const leaderboardScore =
    getElement("leaderboardScore");


const leaderboardNameError =
    getElement("leaderboardNameError");


const submitLeaderboardButton =
    getElement("submitLeaderboardButton");


const cancelLeaderboardButton =
    getElement("cancelLeaderboardButton");


const pauseButton =
    getElement("pauseButton");


const pauseOverlay =
    getElement("pauseOverlay");


const resumeButton =
    getElement("resumeButton");


const pauseMenuButton =
    getElement("pauseMenuButton");


const watson =
    getElement("watson");


const gameArea =
    getElement("gameArea");


const scoreDisplay =
    getElement("score");


const streakDisplay =
    getElement("streak");


const multiplierDisplay =
    getElement("multiplier");


const levelDisplay =
    getElement("level");


const timerDisplay =
    getElement("timer");


const findTimerDisplay =
    getElement("findTimer");


const levelProgressBar =
    getElement("levelProgressBar");


const levelMessage =
    getElement("levelMessage");


const levelMessageSmall =
    getElement("levelMessageSmall");


const levelMessageBig =
    getElement("levelMessageBig");


const feedback =
    getElement("feedback");


const menuHighScore =
    getElement("menuHighScore");


const modalHighScore =
    getElement("modalHighScore");


const finalScore =
    getElement("finalScore");


const finalWatsons =
    getElement("finalWatsons");


const finalBestStreak =
    getElement("finalBestStreak");


const finalAccuracy =
    getElement("finalAccuracy");


const finalLevel =
    getElement("finalLevel");


const newHighScore =
    getElement("newHighScore");


const loadingScreen =
    getElement("loadingScreen");


const loadingText =
    getElement("loadingText");


// ============================================================
// BACKGROUNDS
// ============================================================

const backgrounds = [

    "background1.jpg",

    "background2.jpg",

    "background3.jpg",

    "background4.jpg",

    "background5.jpg",

    "background6.jpg",

    "background7.jpg"

];


console.log(
    "🖼️ Backgrounds:",
    backgrounds
);


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

let currentFindTime =
    STARTING_FIND_TIME;

let currentWatsonSize =
    STARTING_WATSON_SIZE;

let gameTimer = null;

let findTimer = null;

let gameRunning = false;

let gamePaused = false;

let gameFinished = false;

let feedbackTimeout = null;

let levelMessageTimeout = null;


// ============================================================
// IMAGE DEBUGGING
// ============================================================

console.log(
    "🖼️ Watson image source:",
    watson ? watson.src : "MISSING"
);


if (watson) {

    watson.addEventListener(
        "load",
        function() {

            console.log(
                "✅ Watson image loaded successfully"
            );

            console.log(
                "Watson dimensions:",
                watson.naturalWidth,
                "x",
                watson.naturalHeight
            );

        }
    );


    watson.addEventListener(
        "error",
        function() {

            console.error(
                "❌ WATSON IMAGE FAILED TO LOAD"
            );

            console.error(
                "Expected file: watson.png"
            );

            console.error(
                "Current URL:",
                watson.src
            );

        }
    );

}


// ============================================================
// MUSIC DEBUGGING
// ============================================================

if (gameMusic) {

    gameMusic.addEventListener(
        "canplay",
        function() {

            console.log(
                "✅ Music loaded successfully"
            );

        }
    );


    gameMusic.addEventListener(
        "error",
        function() {

            console.error(
                "❌ MUSIC FAILED TO LOAD"
            );

            console.error(
                "Expected file: music.mp3"
            );

            console.error(
                "Current URL:",
                gameMusic.src
            );

        }
    );

}


// ============================================================
// BACKGROUND IMAGE DEBUGGING
// ============================================================

backgrounds.forEach(
    function(path) {

        const testImage =
            new Image();


        testImage.onload =
            function() {

                console.log(
                    "✅ Background loaded:",
                    path
                );

            };


        testImage.onerror =
            function() {

                console.error(
                    "❌ Background FAILED:",
                    path
                );

            };


        testImage.src = path;

    }
);


// ============================================================
// MUSIC
// ============================================================

function startMusic() {

    if (!gameMusic) {

        console.error(
            "❌ Cannot start music: audio element missing"
        );

        return;

    }


    gameMusic.volume = 0.35;


    const promise =
        gameMusic.play();


    if (promise !== undefined) {

        promise.then(
            function() {

                console.log(
                    "🎵 Music started"
                );

            }
        )
        .catch(
            function(error) {

                console.warn(
                    "⚠️ Music autoplay/play failed:",
                    error
                );

            }
        );

    }

}


function stopMusic() {

    if (!gameMusic) {
        return;
    }


    gameMusic.pause();

    console.log(
        "🎵 Music stopped"
    );

}


// ============================================================
// SCREEN MANAGEMENT
// ============================================================

function showScreen(screen) {

    console.log(
        "🖥️ Showing screen:",
        screen ? screen.id : "NULL"
    );


    [
        menuScreen,
        gameScreen,
        gameOverScreen,
        leaderboardScreen
    ]
    .forEach(
        function(item) {

            if (item) {

                item.classList.add(
                    "hidden"
                );

            }

        }
    );


    if (screen) {

        screen.classList.remove(
            "hidden"
        );

    }

}


// ============================================================
// START GAME
// ============================================================

function startGame() {

    console.log("");
    console.log(
        "=============================================="
    );

    console.log(
        "🎮 STARTING GAME"
    );

    console.log(
        "=============================================="
    );


    // Reset game

    score = 0;

    streak = 0;

    bestStreak = 0;

    watsonsFound = 0;

    wrongClicks = 0;

    level = 1;

    gameTime = GAME_LENGTH;

    currentFindTime =
        STARTING_FIND_TIME;

    currentWatsonSize =
        STARTING_WATSON_SIZE;

    gameRunning = true;

    gamePaused = false;

    gameFinished = false;


    // Clear timers

    clearInterval(gameTimer);

    clearInterval(findTimer);


    // Close menus/modals

    highScoreModal.classList.add(
        "hidden"
    );

    pauseOverlay.classList.add(
        "hidden"
    );

    leaderboardNameOverlay.classList.add(
        "hidden"
    );


    // Show game

    showScreen(gameScreen);


    // Background

    changeBackground();


    // Watson

    watson.classList.remove(
        "watson-explosion"
    );

    spawnWatson();


    // UI

    updateDisplays();


    // Music

    startMusic();


    // Timers

    startGameTimer();

    startFindTimer();


    // Level intro

    showLevelMessage(
        "GET READY",
        "LEVEL 1"
    );


    console.log(
        "✅ Game started successfully"
    );

}


// ============================================================
// SPAWN WATSON
// ============================================================

function spawnWatson() {

    if (!gameRunning || gamePaused) {

        console.log(
            "⚠️ spawnWatson cancelled:",
            {
                gameRunning,
                gamePaused
            }
        );

        return;

    }


    const areaWidth =
        gameArea.clientWidth;


    const areaHeight =
        gameArea.clientHeight;


    const maxX =
        Math.max(
            0,
            areaWidth -
            currentWatsonSize
        );


    const maxY =
        Math.max(
            0,
            areaHeight -
            currentWatsonSize
        );


    const randomX =
        Math.random() * maxX;


    const randomY =
        Math.random() * maxY;


    watson.classList.remove(
        "watson-explosion"
    );


    watson.style.width =
        `${currentWatsonSize}px`;


    watson.style.left =
        `${randomX}px`;


    watson.style.top =
        `${randomY}px`;


    watson.style.display =
        "block";


    const rotation =
        Math.random() * 12 - 6;


    watson.style.transform =
        `rotate(${rotation}deg)`;


    console.log(
        "🎯 Watson spawned:",
        {
            x: Math.round(randomX),
            y: Math.round(randomY),
            size: currentWatsonSize,
            level
        }
    );

}


// ============================================================
// WATSON CLICK
// ============================================================

watson.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        console.log(
            "🎯 WATSON CLICKED"
        );


        if (!gameRunning) {

            console.log(
                "⚠️ Click ignored: game not running"
            );

            return;

        }


        if (gamePaused) {

            console.log(
                "⚠️ Click ignored: game paused"
            );

            return;

        }


        // Found Watson

        watsonsFound++;

        streak++;


        if (streak > bestStreak) {

            bestStreak =
                streak;

        }


        // Multiplier

        const multiplier =
            getMultiplier();


        const points =
            Math.round(
                POINTS_PER_FIND *
                multiplier
            );


        score += points;


        console.log(
            `🔥 Watson found! +${points}`,
            {
                score,
                streak,
                multiplier,
                watsonsFound
            }
        );


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


        // Reset timer

        resetFindTimer();


        // UI

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


        if (gamePaused) {
            return;
        }


        wrongClicks++;


        score -=
            WRONG_CLICK_PENALTY;


        if (score < 0) {

            score = 0;

        }


        streak = 0;


        console.log(
            "❌ Wrong click:",
            {
                score,
                wrongClicks
            }
        );


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

    const multiplierLevel =
        Math.floor(
            streak / 1
        );


    return Math.min(
        1 +
        multiplierLevel * 0.15,

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


    console.log(
        "📉 Watson size:",
        currentWatsonSize
    );

}


// ============================================================
// FIND TIMER
// ============================================================

function startFindTimer() {

    clearInterval(findTimer);


    currentFindTime =
        getFindTime();


    updateFindTimer();


    findTimer =
        setInterval(
            function() {

                if (!gameRunning) {
                    return;
                }


                if (gamePaused) {
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


    console.log(
        "⏱️ Find timer reset:",
        currentFindTime
    );

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

    if (!findTimerDisplay) {
        return;
    }


    findTimerDisplay.textContent =
        Math.max(
            0,
            Math.ceil(
                currentFindTime
            )
        );


    if (
        currentFindTime <= 5
    ) {

        findTimerDisplay.style.color =
            "#ff4444";

        findTimerDisplay.style.transform =
            "scale(1.15)";

    }

    else {

        findTimerDisplay.style.color =
            "white";

        findTimerDisplay.style.transform =
            "scale(1)";

    }

}


// ============================================================
// WATSON EXPLOSION
// ============================================================

function watsonExplodes() {

    if (!gameRunning) {
        return;
    }


    if (gamePaused) {
        return;
    }


    console.log(
        "💥💥💥 WATSON EXPLODED 💥💥💥"
    );


    // Reset streak

    streak = 0;


    // Bigger explosion

    watson.classList.add(
        "watson-explosion"
    );


    // Screen shake

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


    // Message

    showLevelMessage(
        "TOO SLOW 💥",
        "WATSON EXPLODED"
    );


    // Hide after animation

    setTimeout(
        function() {

            if (!gameRunning) {
                return;
            }


            watson.style.display =
                "none";


            watson.classList.remove(
                "watson-explosion"
            );


            spawnWatson();


            resetFindTimer();

        },
        650
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


        console.log(
            "🎉 LEVEL UP:",
            level
        );


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

    if (!levelProgressBar) {
        return;
    }


    const progress =
        watsonsFound %
        WATSONS_PER_LEVEL;


    const percentage =
        (
            progress /
            WATSONS_PER_LEVEL
        ) * 100;


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

    if (!levelMessage) {
        return;
    }


    clearTimeout(
        levelMessageTimeout
    );


    levelMessageSmall.textContent =
        smallText;


    levelMessageBig.textContent =
        bigText;


    levelMessage.style.opacity =
        "1";


    levelMessage.style.transform =
        "translate(-50%, -50%) scale(1.05)";


    levelMessageTimeout =
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


    const background =
        backgrounds[index];


    console.log(
        "🖼️ Changing background:",
        background
    );


    gameScreen.style.backgroundImage =
        `
        linear-gradient(
            rgba(0,0,0,0.25),
            rgba(0,0,0,0.25)
        ),
        url("${background}")
        `;

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


                if (gamePaused) {
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

    if (!timerDisplay) {
        return;
    }


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

    }

    else {

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

    if (!feedback) {
        return;
    }


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


    clearTimeout(
        feedbackTimeout
    );


    feedbackTimeout =
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
// PAUSE
// ============================================================

function pauseGame() {

    if (!gameRunning) {

        console.log(
            "⚠️ Cannot pause: game isn't running"
        );

        return;

    }


    if (gamePaused) {
        return;
    }


    console.log(
        "⏸️ GAME PAUSED"
    );


    gamePaused = true;


    pauseOverlay.classList.remove(
        "hidden"
    );

}


function resumeGame() {

    if (!gameRunning) {
        return;
    }


    if (!gamePaused) {
        return;
    }


    console.log(
        "▶️ GAME RESUMED"
    );


    gamePaused = false;


    pauseOverlay.classList.add(
        "hidden"
    );

}


// ============================================================
// PAUSE -> MENU
// ============================================================

function pauseToMenu() {

    console.log(
        "🏠 Leaving game from pause menu"
    );


    gameRunning = false;

    gamePaused = false;


    clearInterval(gameTimer);

    clearInterval(findTimer);


    stopMusic();


    pauseOverlay.classList.add(
        "hidden"
    );


    watson.style.display =
        "none";


    showScreen(menuScreen);


    updateHighScoreDisplays();

}


// ============================================================
// END GAME
// ============================================================

function endGame() {

    if (!gameRunning) {
        return;
    }


    console.log("");
    console.log(
        "=============================================="
    );

    console.log(
        "🏁 GAME OVER"
    );

    console.log(
        "=============================================="
    );

    console.log(
        "Final score:",
        score
    );

    console.log(
        "Watsons:",
        watsonsFound
    );

    console.log(
        "Best streak:",
        bestStreak
    );

    console.log(
        "Level:",
        level
    );


    gameRunning = false;

    gamePaused = false;

    gameFinished = true;


    clearInterval(gameTimer);

    clearInterval(findTimer);


    stopMusic();


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


    // Final UI

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


    // Local high score

    const oldHighScore =
        getHighScore();


    if (
        score >
        oldHighScore
    ) {

        console.log(
            "🏆 NEW LOCAL HIGH SCORE"
        );


        localStorage.setItem(
            "watsonHighScore",
            String(score)
        );


        newHighScore.classList.remove(
            "hidden"
        );

    }

    else {

        newHighScore.classList.add(
            "hidden"
        );

    }


    updateHighScoreDisplays();


    // Show game over

    showScreen(
        gameOverScreen
    );


    console.log(
        "✅ Game over screen displayed"
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


    if (menuHighScore) {

        menuHighScore.textContent =
            highScore.toLocaleString();

    }


    if (modalHighScore) {

        modalHighScore.textContent =
            highScore.toLocaleString();

    }


    console.log(
        "🏆 Local high score:",
        highScore
    );

}


// ============================================================
// HIGH SCORE MODAL
// ============================================================

highScoreButton.addEventListener(
    "click",
    function() {

        console.log(
            "🏆 High score button clicked"
        );


        updateHighScoreDisplays();


        highScoreModal.classList.remove(
            "hidden"
        );

    }
);


closeHighScore.addEventListener(
    "click",
    function() {

        console.log(
            "❌ Closing high score modal"
        );


        highScoreModal.classList.add(
            "hidden"
        );

    }
);


modalPlayButton.addEventListener(
    "click",
    function() {

        console.log(
            "▶️ Modal PLAY clicked"
        );


        highScoreModal.classList.add(
            "hidden"
        );


        startGame();

    }
);


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
// PLAY BUTTONS
// ============================================================

playButton.addEventListener(
    "click",
    function() {

        console.log(
            "▶️ MAIN PLAY BUTTON CLICKED"
        );


        startGame();

    }
);


playAgainButton.addEventListener(
    "click",
    function() {

        console.log(
            "🔄 PLAY AGAIN CLICKED"
        );


        startGame();

    }
);


menuButton.addEventListener(
    "click",
    function() {

        console.log(
            "🏠 MAIN MENU CLICKED"
        );


        gameRunning = false;

        gamePaused = false;


        clearInterval(gameTimer);

        clearInterval(findTimer);


        stopMusic();


        showScreen(
            menuScreen
        );


        updateHighScoreDisplays();

    }
);


// ============================================================
// PAUSE BUTTONS
// ============================================================

pauseButton.addEventListener(
    "click",
    function() {

        console.log(
            "⏸️ PAUSE BUTTON CLICKED"
        );


        pauseGame();

    }
);


resumeButton.addEventListener(
    "click",
    function() {

        console.log(
            "▶️ RESUME BUTTON CLICKED"
        );


        resumeGame();

    }
);


pauseMenuButton.addEventListener(
    "click",
    function() {

        console.log(
            "🏠 PAUSE MENU BUTTON CLICKED"
        );


        pauseToMenu();

    }
);


// ============================================================
// LEADERBOARD
// ============================================================

console.log("");
console.log(
    "=============================================="
);

console.log(
    "🌎 LEADERBOARD SYSTEM"
);

console.log(
    "=============================================="
);


// ============================================================
// NAME MODERATION
// ============================================================
//
// This is intentionally only a client-side first check.
// Firebase security rules should also protect your database.
// ============================================================

const blockedWords = [

    "fuck",
    "shit",
    "cunt",
    "bitch",
    "asshole",
    "nigger",
    "nigga",
    "faggot",
    "whore",
    "slut",
    "porn",
    "sex",
    "rape",
    "pedo",
    "p3do",
    "kill",
    "kys"

];


function namePassesModeration(name) {

    const cleaned =
        name
            .toLowerCase()
            .replace(
                /[^a-z0-9]/g,
                ""
            );


    console.log(
        "🔍 Moderating name:",
        name
    );


    if (
        cleaned.length < 2
    ) {

        console.warn(
            "❌ Name too short"
        );

        return false;

    }


    if (
        cleaned.length > 20
    ) {

        console.warn(
            "❌ Name too long"
        );

        return false;

    }


    for (
        const word of blockedWords
    ) {

        if (
            cleaned.includes(word)
        ) {

            console.warn(
                "❌ Blocked word detected"
            );

            return false;

        }

    }


    return true;

}


// ============================================================
// LEADERBOARD KEY
// ============================================================

function getNameKey(name) {

    return name
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9_-]/g,
            "_"
        );

}


// ============================================================
// DATE
// ============================================================

function getLeaderboardDate() {

    const now =
        new Date();


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const year =
        String(
            now.getFullYear()
        ).slice(-2);


    return `${day}/${month}/${year}`;

}


// ============================================================
// OPEN LEADERBOARD
// ============================================================

leaderboardButton.addEventListener(
    "click",
    async function() {

        console.log(
            "🌎 LEADERBOARD BUTTON CLICKED"
        );


        showScreen(
            leaderboardScreen
        );


        await loadLeaderboard();

    }
);


// ============================================================
// CLOSE LEADERBOARD
// ============================================================

leaderboardBackButton.addEventListener(
    "click",
    function() {

        console.log(
            "← LEADERBOARD BACK CLICKED"
        );


        showScreen(
            menuScreen
        );

    }
);


// ============================================================
// LOAD LEADERBOARD
// ============================================================

async function loadLeaderboard() {

    console.log("");
    console.log(
        "📊 LOADING GLOBAL LEADERBOARD..."
    );


    leaderboardList.innerHTML = `
        <div class="leaderboard-loading">
            LOADING LEADERBOARD...
        </div>
    `;


    if (!firebaseReady || !database) {

        console.error(
            "❌ Firebase is NOT ready"
        );


        leaderboardList.innerHTML = `
            <div class="leaderboard-empty">
                ⚠️ LEADERBOARD CONNECTION FAILED
                <br><br>
                Check the browser console.
            </div>
        `;


        return;

    }


    try {

        const leaderboardRef =
            ref(
                database,
                "leaderboard"
            );


        console.log(
            "📡 Firebase path:",
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
            "📦 Firebase snapshot received"
        );


        if (!snapshot.exists()) {

            console.log(
                "ℹ️ Leaderboard is empty"
            );


            leaderboardList.innerHTML = `
                <div class="leaderboard-empty">
                    🏆 NO SCORES YET!
                    <br><br>
                    BE THE FIRST WATSON HUNTER!
                </div>
            `;


            return;

        }


        const scores = [];


        snapshot.forEach(
            function(child) {

                const value =
                    child.val();


                if (!value) {
                    return;
                }


                scores.push({

                    name:
                        String(
                            value.name ||
                            "UNKNOWN"
                        ),

                    score:
                        Number(
                            value.score ||
                            0
                        ),

                    date:
                        String(
                            value.date ||
                            "--/--/--"
                        )

                });

            }
        );


        // Highest first

        scores.sort(
            function(a, b) {

                return b.score -
                    a.score;

            }
        );


        const topTen =
            scores.slice(
                0,
                10
            );


        console.log(
            "🏆 Top scores:",
            topTen
        );


        leaderboardList.innerHTML =
            "";


        topTen.forEach(
            function(player, index) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "leaderboard-row";


                let rankText =
                    String(
                        index + 1
                    );


                if (
                    index === 0
                ) {

                    rankText =
                        "🥇";

                }

                else if (
                    index === 1
                ) {

                    rankText =
                        "🥈";

                }

                else if (
                    index === 2
                ) {

                    rankText =
                        "🥉";

                }


                row.innerHTML = `

                    <div class="leaderboard-rank">
                        ${rankText}
                    </div>

                    <div class="leaderboard-name">
                        ${escapeHTML(
                            player.name
                        )}
                    </div>

                    <div class="leaderboard-score">
                        ${player.score.toLocaleString()}
                    </div>

                    <div class="leaderboard-date">
                        ${escapeHTML(
                            player.date
                        )}
                    </div>

                `;


                leaderboardList.appendChild(
                    row
                );

            }
        );


        console.log(
            "✅ Leaderboard displayed"
        );

    }

    catch (error) {

        console.error(
            "❌ LEADERBOARD LOAD ERROR"
        );

        console.error(
            error
        );


        leaderboardList.innerHTML = `
            <div class="leaderboard-empty">
                ⚠️ COULDN'T LOAD LEADERBOARD.
                <br><br>
                PLEASE TRY AGAIN.
            </div>
        `;

    }

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(text) {

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// OPEN SCORE SUBMISSION
// ============================================================

addLeaderboardButton.addEventListener(
    "click",
    function() {

        console.log(
            "🏆 ADD TO LEADERBOARD CLICKED"
        );


        if (!gameFinished) {

            console.warn(
                "⚠️ Game isn't finished yet"
            );

            return;

        }


        leaderboardScore.textContent =
            score.toLocaleString();


        leaderboardNameInput.value =
            "";


        leaderboardNameError.textContent =
            "";


        leaderboardNameOverlay.classList.remove(
            "hidden"
        );


        setTimeout(
            function() {

                leaderboardNameInput.focus();

            },
            100
        );

    }
);


// ============================================================
// CANCEL SUBMISSION
// ============================================================

cancelLeaderboardButton.addEventListener(
    "click",
    function() {

        console.log(
            "❌ Leaderboard submission cancelled"
        );


        leaderboardNameOverlay.classList.add(
            "hidden"
        );

    }
);


// ============================================================
// SUBMIT WITH ENTER
// ============================================================

leaderboardNameInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Enter"
        ) {

            submitLeaderboardScore();

        }

    }
);


// ============================================================
// SUBMIT SCORE
// ============================================================

submitLeaderboardButton.addEventListener(
    "click",
    submitLeaderboardScore
);


async function submitLeaderboardScore() {

    console.log("");
    console.log(
        "=============================================="
    );

    console.log(
        "🏆 SUBMITTING LEADERBOARD SCORE"
    );

    console.log(
        "=============================================="
    );


    const name =
        leaderboardNameInput.value.trim();


    leaderboardNameError.textContent =
        "";


    console.log(
        "Name:",
        name
    );

    console.log(
        "Score:",
        score
    );


    // --------------------------------------------------------
    // Check Firebase
    // --------------------------------------------------------

    if (
        !firebaseReady ||
        !database
    ) {

        console.error(
            "❌ Firebase isn't ready"
        );


        leaderboardNameError.textContent =
            "Leaderboard is currently unavailable. Please try again.";


        return;

    }


    // --------------------------------------------------------
    // Moderate
    // --------------------------------------------------------

    if (
        !namePassesModeration(name)
    ) {

        console.warn(
            "❌ NAME FAILED MODERATION"
        );


        leaderboardNameError.textContent =
            "Name Didn't Pass Moderation, Please Enter Another Name";


        return;

    }


    // --------------------------------------------------------
    // Disable button
    // --------------------------------------------------------

    submitLeaderboardButton.disabled =
        true;


    submitLeaderboardButton.textContent =
        "SUBMITTING...";


    try {

        const nameKey =
            getNameKey(name);


        console.log(
            "🔑 Firebase name key:",
            nameKey
        );


        const scoreRef =
            ref(
                database,
                `leaderboard/${nameKey}`
            );


        console.log(
            "📡 Checking existing score..."
        );


        const existingSnapshot =
            await get(
                scoreRef
            );


        // ----------------------------------------------------
        // Existing player
        // ----------------------------------------------------

        if (
            existingSnapshot.exists()
        ) {

            const existing =
                existingSnapshot.val();


            const existingScore =
                Number(
                    existing.score ||
                    0
                );


            console.log(
                "📦 Existing score:",
                existingScore
            );


            // ------------------------------------------------
            // Only replace if higher
            // ------------------------------------------------

            if (
                score <=
                existingScore
            ) {

                console.log(
                    "ℹ️ Existing score is higher/equal"
                );


                leaderboardNameError.textContent =
                    `You already have a higher score (${existingScore.toLocaleString()}).`;


                submitLeaderboardButton.disabled =
                    false;


                submitLeaderboardButton.textContent =
                    "SUBMIT SCORE";


                return;

            }


            console.log(
                "🔥 NEW PERSONAL BEST FOR THIS NAME"
            );

        }


        // ----------------------------------------------------
        // Save
        // ----------------------------------------------------

        const scoreData = {

            name:
                name,

            score:
                Number(score),

            date:
                getLeaderboardDate()

        };


        console.log(
            "📤 Sending score to Firebase:",
            scoreData
        );


        await set(
            scoreRef,
            scoreData
        );


        console.log(
            "✅ SCORE SUCCESSFULLY SAVED"
        );


        // ----------------------------------------------------
        // Close modal
        // ----------------------------------------------------

        leaderboardNameOverlay.classList.add(
            "hidden"
        );


        // ----------------------------------------------------
        // Show leaderboard
        // ----------------------------------------------------

        showScreen(
            leaderboardScreen
        );


        await loadLeaderboard();

    }

    catch (error) {

        console.error(
            "❌ SCORE SUBMISSION FAILED"
        );

        console.error(
            error
        );


        leaderboardNameError.textContent =
            "Couldn't submit score. Please try again.";


    }

    finally {

        submitLeaderboardButton.disabled =
            false;


        submitLeaderboardButton.textContent =
            "SUBMIT SCORE";

    }

}


// ============================================================
// LOADING SCREEN
// ============================================================

function finishLoading() {

    console.log("");
    console.log(
        "=============================================="
    );

    console.log(
        "🔧 INITIALIZING GAME"
    );

    console.log(
        "=============================================="
    );


    updateHighScoreDisplays();


    if (loadingText) {

        loadingText.textContent =
            "Ready!";

    }


    setTimeout(
        function() {

            if (loadingScreen) {

                loadingScreen.style.opacity =
                    "0";


                setTimeout(
                    function() {

                        loadingScreen.classList.add(
                            "hidden"
                        );

                    },
                    400
                );

            }

        },
        300
    );

}


// ============================================================
// INITIALIZATION
// ============================================================

console.log("");
console.log(
    "=============================================="
);

console.log(
    "🔧 INITIALIZATION"
);

console.log(
    "=============================================="
);


console.log(
    "Local high score:",
    getHighScore()
);


console.log(
    "Firebase ready:",
    firebaseReady
);


console.log(
    "Database object:",
    database
);


updateHighScoreDisplays();


finishLoading();


console.log("");
console.log(
    "=============================================="
);

console.log(
    "✅ FIND WATSON LOADED SUCCESSFULLY"
);

console.log(
    "=============================================="
);

console.log("");
