// ============================================================
// FIND WATSON
// FULL VERSION WITH DEBUGGING
// ============================================================

console.log("======================================");
console.log("🎯 FIND WATSON SCRIPT STARTING");
console.log("======================================");


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
// ELEMENT HELPER
// ============================================================

function getElement(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.error(
            `❌ ELEMENT NOT FOUND: #${id}`
        );

    } else {

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

    console.log("======================================");
    console.log("🎮 START GAME");
    console.log("======================================");


    score = 0;

    streak = 0;

    bestStreak = 0;

    watsonsFound = 0;

    wrongClicks = 0;

    level = 1;

    gameTime =
        GAME_LENGTH;

    currentWatsonSize =
        STARTING_WATSON_SIZE;


    gameRunning = true;


    console.log(
        "Game variables reset:",
        {
            score,
            streak,
            level,
            gameTime,
            currentWatsonSize
        }
    );


    if (gameMusic) {

        gameMusic.currentTime = 0;

        gameMusic.volume = 0.5;


        gameMusic.play()
            .then(function() {

                console.log(
                    "🎵 Music started"
                );

            })
            .catch(function(error) {

                console.warn(
                    "⚠️ Music could not autoplay:",
                    error
                );

            });

    }


    menuScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    leaderboardScreen.classList.add("hidden");

    highScoreModal.classList.add("hidden");


    gameScreen.classList.remove("hidden");


    changeBackground();

    updateDisplays();

    spawnWatson();

    startGameTimer();

    startFindTimer();


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

    if (!gameRunning) {

        console.warn(
            "⚠️ spawnWatson called while game isn't running"
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
        Math.random() *
        12 -
        6;


    watson.style.transform =
        `rotate(${rotation}deg)`;


    console.log(
        "👤 Watson spawned:",
        {
            x: randomX,
            y: randomY,
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


        if (!gameRunning) {

            console.log(
                "⚠️ Watson clicked but game isn't running"
            );

            return;

        }


        console.log(
            "🎯 WATSON FOUND!"
        );


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


        console.log(
            "📈 Find result:",
            {
                points,
                score,
                streak,
                multiplier,
                watsonsFound
            }
        );


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


        console.log(
            "❌ WRONG CLICK:",
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


    const multiplier =
        Math.min(
            1 +
            multiplierLevel *
            0.15,

            5
        );


    return multiplier;

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
        "📉 Difficulty increased:",
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


                currentFindTime--;


                updateFindTimer();


                if (
                    currentFindTime <= 0
                ) {

                    console.log(
                        "💥 FIND TIMER REACHED ZERO"
                    );

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


    console.log(
        "⏱️ Find timer reset:",
        currentFindTime
    );


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

    if (!findTimerDisplay) {
        return;
    }


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
        "💥💥💥 WATSON EXPLODED 💥💥💥"
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


        console.log(
            "🚀 LEVEL UP:",
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


    console.log(
        "🖼️ Changing background:",
        backgrounds[index]
    );


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
        "======================================"
    );

    console.log(
        "🏁 GAME OVER"
    );

    console.log(
        "Final score:",
        score
    );

    console.log(
        "======================================"
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


        console.log(
            "🏆 NEW LOCAL HIGH SCORE!"
        );

    } else {

        newHighScore.classList.add(
            "hidden"
        );

    }


    updateHighScoreDisplays();


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
// HIGH SCORE BUTTON
// ============================================================

highScoreButton.addEventListener(
    "click",
    function() {

        console.log(
            "🏆 High Score button clicked"
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
            "❌ High Score modal closed"
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
            "▶ Modal Play clicked"
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
            "▶ MAIN PLAY BUTTON CLICKED"
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


// ============================================================
// MAIN MENU
// ============================================================

menuButton.addEventListener(
    "click",
    function() {

        console.log(
            "🏠 MAIN MENU CLICKED"
        );


        gameRunning = false;


        clearInterval(gameTimer);

        clearInterval(findTimer);


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
// NAME MODERATION
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


function namePassesModeration(name) {

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
            cleaned.includes(word)
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

        console.log(
            "🌎 LEADERBOARD BUTTON CLICKED"
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

        console.log(
            "⬅️ LEADERBOARD BACK CLICKED"
        );


        leaderboardScreen.classList.add(
            "hidden"
        );


        menuScreen.classList.remove(
            "hidden"
        );

    }
);


// ============================================================
// LOAD LEADERBOARD
// ============================================================

async function loadLeaderboard() {

    console.log(
        "======================================"
    );

    console.log(
        "🌎 LOADING GLOBAL LEADERBOARD"
    );

    console.log(
        "Firebase ready?",
        window.firebaseReady
    );

    console.log(
        "Database:",
        window.firebaseDatabase
    );

    console.log(
        "======================================"
    );


    leaderboardList.innerHTML = `
        <div class="leaderboard-loading">
            LOADING...
        </div>
    `;


    if (
        !window.firebaseReady
    ) {

        console.error(
            "❌ Firebase is NOT ready!"
        );


        leaderboardList.innerHTML = `
            <div class="leaderboard-empty">
                Firebase isn't connected.<br><br>
                Check the browser console.
            </div>
        `;


        return;

    }


    try {

        const database =
            window.firebaseDatabase;


        const leaderboardRef =
            window.firebaseRef(
                database,
                "leaderboard"
            );


        console.log(
            "📡 Firebase reference:",
            leaderboardRef
        );


        const leaderboardQuery =
            window.firebaseQuery(
                leaderboardRef,
                window.firebaseOrderByChild(
                    "score"
                )
            );


        console.log(
            "📡 Firebase query created"
        );


        const snapshot =
            await window.firebaseGet(
                leaderboardQuery
            );


        console.log(
            "📡 Firebase response:",
            snapshot
        );


        if (
            !snapshot.exists()
        ) {

            console.log(
                "ℹ️ No leaderboard scores exist yet"
            );


            leaderboardList.innerHTML = `
                <div class="leaderboard-empty">
                    🏆 NO SCORES YET<br><br>
                    BE THE FIRST WATSON HUNTER!
                </div>
            `;


            return;

        }


        const scores = [];


        snapshot.forEach(
            function(child) {

                const data =
                    child.val();


                console.log(
                    "📊 Score found:",
                    data
                );


                scores.push({

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


        console.log(
            "🏆 TOP 10:",
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
                    index + 1;


                if (
                    index === 0
                ) {

                    rankText = "🥇";

                }

                else if (
                    index === 1
                ) {

                    rankText = "🥈";

                }

                else if (
                    index === 2
                ) {

                    rankText = "🥉";

                }


                row.innerHTML = `

                    <div class="leaderboard-rank">
                        ${rankText}
                    </div>

                    <div class="leaderboard-name">
                        ${escapeLeaderboardHTML(
                            player.name
                        )}
                    </div>

                    <div class="leaderboard-score">
                        ${player.score.toLocaleString()}
                    </div>

                    <div class="leaderboard-date">
                        ${player.date}
                    </div>

                `;


                leaderboardList.appendChild(
                    row
                );

            }
        );


        console.log(
            "✅ Leaderboard displayed successfully"
        );

    }

    catch (error) {

        console.error(
            "🔥🔥 LEADERBOARD LOAD ERROR 🔥🔥",
            error
        );


        leaderboardList.innerHTML = `
            <div class="leaderboard-empty">
                ❌ COULDN'T LOAD LEADERBOARD<br><br>
                Check the browser console.
            </div>
        `;

    }

}


// ============================================================
// ESCAPE HTML
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
// OPEN ADD SCORE
// ============================================================

addLeaderboardButton.addEventListener(
    "click",
    function() {

        console.log(
            "🏆 ADD TO LEADERBOARD CLICKED"
        );


        leaderboardScore.textContent =
            score.toLocaleString();


        leaderboardNameInput.value =
            "";


        leaderboardNameError.textContent =
            "";


        leaderboardNameOverlay.classList.remove(
            "hidden"
        );


        leaderboardNameInput.focus();

    }
);


// ============================================================
// CANCEL SCORE
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
// SUBMIT SCORE
// ============================================================

submitLeaderboardButton.addEventListener(
    "click",
    submitLeaderboardScore
);


async function submitLeaderboardScore() {

    console.log(
        "======================================"
    );

    console.log(
        "📤 SUBMITTING LEADERBOARD SCORE"
    );

    console.log(
        "======================================"
    );


    const name =
        leaderboardNameInput.value.trim();


    console.log(
        "Name entered:",
        name
    );


    console.log(
        "Score:",
        score
    );


    leaderboardNameError.textContent =
        "";


    if (
        !namePassesModeration(name)
    ) {

        console.warn(
            "🚫 NAME FAILED MODERATION"
        );


        leaderboardNameError.textContent =
            "Name Didn't Pass Moderation, Please Enter Another Name";


        return;

    }


    if (
        !window.firebaseReady
    ) {

        console.error(
            "❌ Firebase is not ready!"
        );


        leaderboardNameError.textContent =
            "Leaderboard isn't connected. Please try again.";


        return;

    }


    submitLeaderboardButton.disabled =
        true;


    submitLeaderboardButton.textContent =
        "SUBMITTING...";


    try {

        const database =
            window.firebaseDatabase;


        console.log(
            "📡 Getting leaderboard..."
        );


        const leaderboardRef =
            window.firebaseRef(
                database,
                "leaderboard"
            );


        const snapshot =
            await window.firebaseGet(
                leaderboardRef
            );


        console.log(
            "📡 Existing leaderboard:",
            snapshot.exists()
        );


        // ==========================================
        // CHECK IF NAME ALREADY EXISTS
        // ==========================================

        let existingEntryKey =
            null;

        let existingEntry =
            null;


        if (
            snapshot.exists()
        ) {

            snapshot.forEach(
                function(child) {

                    const data =
                        child.val();


                    if (
                        String(
                            data.name
                        ).toLowerCase() ===
                        name.toLowerCase()
                    ) {

                        existingEntryKey =
                            child.key;

                        existingEntry =
                            data;

                    }

                }
            );

        }


        // ==========================================
        // EXISTING NAME
        // ==========================================

        if (
            existingEntryKey
        ) {

            console.log(
                "👤 Existing player found:",
                existingEntry
            );


            if (
                score <=
                Number(
                    existingEntry.score
                )
            ) {

                leaderboardNameError.textContent =
                    "You already have a higher score on the leaderboard!";


                console.log(
                    "ℹ️ Existing score is higher/equal"
                );


                submitLeaderboardButton.disabled =
                    false;

                submitLeaderboardButton.textContent =
                    "SUBMIT SCORE";


                return;

            }


            // Update their score

            const existingRef =
                window.firebaseRef(
                    database,
                    "leaderboard/" +
                    existingEntryKey
                );


            await window.firebaseSet(
                existingRef,
                {

                    name:
                        name,

                    score:
                        Number(
                            score
                        ),

                    date:
                        getLeaderboardDate()

                }
            );


            console.log(
                "✅ Existing player's score updated!"
            );

        }


        // ==========================================
        // NEW PLAYER
        // ==========================================

        else {

            console.log(
                "👤 New player — creating leaderboard entry"
            );


            const newScoreRef =
                window.firebasePush(
                    leaderboardRef
                );


            await window.firebaseSet(
                newScoreRef,
                {

                    name:
                        name,

                    score:
                        Number(
                            score
                        ),

                    date:
                        getLeaderboardDate()

                }
            );


            console.log(
                "✅ New leaderboard score created!"
            );

        }


        // ==========================================
        // CLOSE POPUP
        // ==========================================

        leaderboardNameOverlay.classList.add(
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


        console.log(
            "🔄 Reloading leaderboard..."
        );


        await loadLeaderboard();


        console.log(
            "🎉 SCORE SUBMISSION COMPLETE!"
        );

    }

    catch (error) {

        console.error(
            "🔥🔥 SCORE SUBMISSION ERROR 🔥🔥",
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
// INITIALIZATION
// ============================================================

console.log(
    "======================================"
);

console.log(
    "🔧 INITIALIZING GAME"
);

console.log(
    "======================================"
);


updateHighScoreDisplays();


console.log(
    "Local high score:",
    getHighScore()
);


console.log(
    "Firebase ready at script startup:",
    window.firebaseReady
);


console.log(
    "======================================"
);

console.log(
    "✅ FIND WATSON LOADED SUCCESSFULLY"
);

console.log(
    "======================================"
);
