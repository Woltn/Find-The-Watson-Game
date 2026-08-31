// ============================================================
// FIND WATSON
// Version 3
// Firebase Leaderboard Edition
// ============================================================


// ============================================================
// FIREBASE
// ============================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    get,
    query,
    orderByChild,
    push
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";


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


const firebaseApp =
    initializeApp(firebaseConfig);


const database =
    getDatabase(firebaseApp);


// ============================================================
// SETTINGS
// ============================================================

const GAME_LENGTH = 61;

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
    document.getElementById(
        "gameMusic"
    );


const menuScreen =
    document.getElementById(
        "menuScreen"
    );


const gameScreen =
    document.getElementById(
        "gameScreen"
    );


const gameOverScreen =
    document.getElementById(
        "gameOverScreen"
    );


const leaderboardScreen =
    document.getElementById(
        "leaderboardScreen"
    );


const leaderboardNameOverlay =
    document.getElementById(
        "leaderboardNameOverlay"
    );


const playButton =
    document.getElementById(
        "playButton"
    );


const playAgainButton =
    document.getElementById(
        "playAgainButton"
    );


const menuButton =
    document.getElementById(
        "menuButton"
    );


const highScoreButton =
    document.getElementById(
        "highScoreButton"
    );


const highScoreModal =
    document.getElementById(
        "highScoreModal"
    );


const closeHighScore =
    document.getElementById(
        "closeHighScore"
    );


const modalPlayButton =
    document.getElementById(
        "modalPlayButton"
    );


const leaderboardButton =
    document.getElementById(
        "leaderboardButton"
    );


const leaderboardBackButton =
    document.getElementById(
        "leaderboardBackButton"
    );


const leaderboardList =
    document.getElementById(
        "leaderboardList"
    );


const addLeaderboardButton =
    document.getElementById(
        "addLeaderboardButton"
    );


const leaderboardNameInput =
    document.getElementById(
        "leaderboardNameInput"
    );


const leaderboardScore =
    document.getElementById(
        "leaderboardScore"
    );


const leaderboardNameError =
    document.getElementById(
        "leaderboardNameError"
    );


const submitLeaderboardButton =
    document.getElementById(
        "submitLeaderboardButton"
    );


const cancelLeaderboardButton =
    document.getElementById(
        "cancelLeaderboardButton"
    );


const watson =
    document.getElementById(
        "watson"
    );


const gameArea =
    document.getElementById(
        "gameArea"
    );


const scoreDisplay =
    document.getElementById(
        "score"
    );


const streakDisplay =
    document.getElementById(
        "streak"
    );


const multiplierDisplay =
    document.getElementById(
        "multiplier"
    );


const levelDisplay =
    document.getElementById(
        "level"
    );


const timerDisplay =
    document.getElementById(
        "timer"
    );


const findTimerDisplay =
    document.getElementById(
        "findTimer"
    );


const levelProgressBar =
    document.getElementById(
        "levelProgressBar"
    );


const levelMessage =
    document.getElementById(
        "levelMessage"
    );


const levelMessageSmall =
    document.getElementById(
        "levelMessageSmall"
    );


const levelMessageBig =
    document.getElementById(
        "levelMessageBig"
    );


const feedback =
    document.getElementById(
        "feedback"
    );


const menuHighScore =
    document.getElementById(
        "menuHighScore"
    );


const modalHighScore =
    document.getElementById(
        "modalHighScore"
    );


const finalScore =
    document.getElementById(
        "finalScore"
    );


const finalWatsons =
    document.getElementById(
        "finalWatsons"
    );


const finalBestStreak =
    document.getElementById(
        "finalBestStreak"
    );


const finalAccuracy =
    document.getElementById(
        "finalAccuracy"
    );


const finalLevel =
    document.getElementById(
        "finalLevel"
    );


const newHighScore =
    document.getElementById(
        "newHighScore"
    );


// ============================================================
// BACKGROUNDS
// ============================================================

const backgrounds = [

    "assets/background1.jpg",

    "assets/background2.jpg",

    "assets/background3.jpg",

    "assets/background4.jpg",

    "assets/background5.jpg",

    "assets/background6.jpg",

    "assets/background7.jpg"

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

let currentFindTime =
    STARTING_FIND_TIME;

let currentWatsonSize =
    STARTING_WATSON_SIZE;

let gameTimer = null;

let findTimer = null;

let gameRunning = false;


// ============================================================
// START GAME
// ============================================================

function startGame() {

    console.log(
        "Starting Find Watson..."
    );


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


    clearInterval(gameTimer);

    clearInterval(findTimer);


    // Music

    gameMusic.currentTime = 0;

    gameMusic.volume = 0.99;

    gameMusic.play().catch(
        function(error) {

            console.log(
                "Music error:",
                error
            );

        }
    );


    // Screens

    menuScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    leaderboardScreen.classList.add(
        "hidden"
    );

    highScoreModal.classList.add(
        "hidden"
    );

    leaderboardNameOverlay.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );


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
        Math.random() *
        maxX;


    const randomY =
        Math.random() *
        maxY;


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


        watsonsFound++;

        streak++;


        if (streak > bestStreak) {

            bestStreak =
                streak;

        }


        const multiplier =
            getMultiplier();


        const points =
            Math.round(
                POINTS_PER_FIND *
                multiplier
            );


        score += points;


        showFeedback(
            `+${points} 🔥`,
            event.clientX,
            event.clientY
        );


        increaseDifficulty();


        checkLevel();


        spawnWatson();


        resetFindTimer();


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


        score -=
            WRONG_CLICK_PENALTY;


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

    const multiplierLevel =
        Math.floor(
            streak / 5
        );


    return Math.min(
        1 +
        multiplierLevel * 0.1,

        1.5
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
        Math.ceil(
            currentFindTime
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
        newLevel > level
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
        (
            level - 1
        ) %
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


    const oldHighScore =
        Number(
            localStorage.getItem(
                "watsonHighScore"
            ) || 0
        );


    if (
        score > oldHighScore
    ) {

        localStorage.setItem(
            "watsonHighScore",
            score
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


    gameScreen.classList.add(
        "hidden"
    );


    leaderboardNameOverlay.classList.add(
        "hidden"
    );


    leaderboardScreen.classList.add(
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
// MAIN MENU BUTTONS
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


        leaderboardNameOverlay.classList.add(
            "hidden"
        );


        gameOverScreen.classList.add(
            "hidden"
        );


        gameScreen.classList.add(
            "hidden"
        );


        leaderboardScreen.classList.add(
            "hidden"
        );


        menuScreen.classList.remove(
            "hidden"
        );


        updateHighScoreDisplays();

    }
);


// ============================================================
// LEADERBOARD MODERATION
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

    "sex"

];


function namePassesModeration(
    name
) {

    const cleaned =
        name
            .toLowerCase()
            .replace(
                /[^a-z0-9]/g,
                ""
            );


    if (
        cleaned.length < 2 ||
        cleaned.length > 20
    ) {

        return false;

    }


    for (
        const word of blockedWords
    ) {

        if (
            cleaned.includes(
                word
            )
        ) {

            return false;

        }

    }


    return true;

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
    function() {

        // Make absolutely sure
        // other screens are hidden.

        gameRunning = false;


        leaderboardNameOverlay.classList.add(
            "hidden"
        );


        highScoreModal.classList.add(
            "hidden"
        );


        gameScreen.classList.add(
            "hidden"
        );


        gameOverScreen.classList.add(
            "hidden"
        );


        menuScreen.classList.add(
            "hidden"
        );


        leaderboardScreen.classList.remove(
            "hidden"
        );


        loadLeaderboard();

    }
);


// ============================================================
// CLOSE LEADERBOARD
// ============================================================

leaderboardBackButton.addEventListener(
    "click",
    function() {

        leaderboardScreen.classList.add(
            "hidden"
        );


        menuScreen.classList.remove(
            "hidden"
        );


        updateHighScoreDisplays();

    }
);


// ============================================================
// LOAD LEADERBOARD
// ============================================================

async function loadLeaderboard() {

    leaderboardList.innerHTML = `

        <div class="leaderboard-loading">

            Loading leaderboard...

        </div>

    `;


    try {

        const leaderboardRef =
            ref(
                database,
                "leaderboard"
            );


        const leaderboardQuery =
            query(
                leaderboardRef,
                orderByChild(
                    "score"
                )
            );


        const snapshot =
            await get(
                leaderboardQuery
            );


        if (
            !snapshot.exists()
        ) {

            leaderboardList.innerHTML = `

                <div class="leaderboard-empty">

                    No scores yet!<br><br>

                    Be the first Watson Hunter!

                </div>

            `;

            return;

        }


        const scores = [];


        snapshot.forEach(
            function(child) {

                const data =
                    child.val();


                scores.push({

                    id:
                        child.key,

                    name:
                        data.name,

                    score:
                        Number(
                            data.score
                        ),

                    date:
                        data.date

                });

            }
        );


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


        leaderboardList.innerHTML =
            "";


        topTen.forEach(
            function(
                player,
                index
            ) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "leaderboard-row";


                let rankText =
                    index + 1;


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

                    <div
                        class="leaderboard-rank">

                        ${rankText}

                    </div>


                    <div
                        class="leaderboard-name">

                        ${escapeLeaderboardHTML(
                            player.name
                        )}

                    </div>


                    <div
                        class="leaderboard-score">

                        ${player.score.toLocaleString()}

                    </div>


                    <div
                        class="leaderboard-date">

                        ${escapeLeaderboardHTML(
                            player.date
                        )}

                    </div>

                `;


                leaderboardList.appendChild(
                    row
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        leaderboardList.innerHTML = `

            <div class="leaderboard-empty">

                Couldn't load leaderboard.<br><br>

                Please try again.

            </div>

        `;

    }

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeLeaderboardHTML(
    text
) {

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

        leaderboardScore.textContent =
            score.toLocaleString();


        leaderboardNameInput.value =
            "";


        leaderboardNameError.textContent =
            "";


        // Hide Game Over while
        // the popup is open.

        gameOverScreen.classList.add(
            "hidden"
        );


        leaderboardScreen.classList.add(
            "hidden"
        );


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
// CANCEL SCORE SUBMISSION
// ============================================================

cancelLeaderboardButton.addEventListener(
    "click",
    function() {

        leaderboardNameOverlay.classList.add(
            "hidden"
        );


        // Return to Game Over.

        gameOverScreen.classList.remove(
            "hidden"
        );

    }
);


// ============================================================
// ENTER KEY
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

    const name =
        leaderboardNameInput.value.trim();


    leaderboardNameError.textContent =
        "";


    // Moderation

    if (
        !namePassesModeration(
            name
        )
    ) {

        leaderboardNameError.textContent =
            "Name Didn't Pass Moderation, Please Enter Another Name";


        leaderboardNameInput.focus();

        return;

    }


    submitLeaderboardButton.disabled =
        true;


    submitLeaderboardButton.textContent =
        "SUBMITTING...";


    try {

        const leaderboardRef =
            ref(
                database,
                "leaderboard"
            );


        const snapshot =
            await get(
                leaderboardRef
            );


        let nameAlreadyExists =
            false;


        if (
            snapshot.exists()
        ) {

            snapshot.forEach(
                function(child) {

                    const data =
                        child.val();


                    const existingName =
                        String(
                            data.name
                        ).trim()
                        .toLowerCase();


                    if (
                        existingName ===
                        name.toLowerCase()
                    ) {

                        nameAlreadyExists =
                            true;

                    }

                }
            );

        }


        if (
            nameAlreadyExists
        ) {

            leaderboardNameError.textContent =
                "That Name Is Already Taken, Please Choose Another Name";


            submitLeaderboardButton.disabled =
                false;


            submitLeaderboardButton.textContent =
                "SUBMIT SCORE";


            leaderboardNameInput.focus();


            return;

        }


        // Create unique Firebase entry

        const newScoreRef =
            push(
                leaderboardRef
            );


        await set(
            newScoreRef,
            {

                name:
                    name,

                score:
                    Number(score),

                date:
                    getLeaderboardDate()

            }
        );


        // Success

        leaderboardNameOverlay.classList.add(
            "hidden"
        );


        gameOverScreen.classList.add(
            "hidden"
        );


        leaderboardScreen.classList.remove(
            "hidden"
        );


        await loadLeaderboard();

    }

    catch (error) {

        console.error(
            "Score submission error:",
            error
        );


        leaderboardNameError.textContent =
            "Couldn't submit score. Please try again.";

    }


    submitLeaderboardButton.disabled =
        false;


    submitLeaderboardButton.textContent =
        "SUBMIT SCORE";

}


// ============================================================
// INITIALIZE
// ============================================================

updateHighScoreDisplays();


console.log(
    "Find Watson loaded successfully!"
);

console.log(
    "Firebase leaderboard connected."
);
