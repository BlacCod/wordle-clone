const guessArea = document.querySelector(".guess-area-wrapper")
const keyboard = document.querySelector(".keyboard-area")
const root = document.documentElement;
const LETTER_LENGTH = guessArea.dataset.letterLength;
const popup = document.querySelector(".popup")
root.style.setProperty("--letter-length", LETTER_LENGTH)
let answer = "";

function startGame() {
    getWord()
    startInteraction()
}

startGame()
async function getWord() {
    const response = await fetch(`https://random-word-api2.herokuapp.com/word?length=${LETTER_LENGTH}`)
    const data = await response.json()
    answer = data[0]
}


function startInteraction() {
    const clickEvent = window.addEventListener("click", handleClickButton)
    const keyPressEvent = window.addEventListener("keyup", handlePressKey)
}

function endInteraciton() {
    const clickEvent = window.removeEventListener("click", handleClickButton)
    const keyPressEvent = window.removeEventListener("keyup", handlePressKey)
}

function checkEndGame() {
    if (guessArea.querySelector(":not([data-inside])") === null) {
        showPopup(false)
        console.log("You lost")
        endInteraciton()
    }
}
function handleClickButton(event) {
    checkEndGame()
    if (event.target.matches("[data-key]")) {
        addLetter(event.target.dataset.key)
        return
    }

    if (event.target.matches("[data-enter]")) {
        submitGuess();
        return
    }

    if (event.target.matches("[data-delete]")) {
        deleteLastLetter();
        return
    }

}

function handlePressKey(event) {
    checkEndGame()
    if (event.code == "Enter") {
        submitGuess();
        return;
    }

    if (event.code == "Backspace" || event.code == "Return") {
        deleteLastLetter()
        return
    }
    if (event.code.match(/Key[A-Z]+/)) {
        addLetter(event.key)
        return
    }
}

function addLetter(key) {
    // Check if current attempt is already 5 letters or not
    const unsubmittedTileList = getUnsubmittedTiles()
    if (unsubmittedTileList.length >= LETTER_LENGTH) return
    
    const currentTile = guessArea.querySelector(":not([data-inside])")
    currentTile.textContent = key
    currentTile.dataset.inside = key.toLowerCase()
    currentTile.dataset.state = "unsubmitted"

}

function getUnsubmittedTiles() {
    return guessArea.querySelectorAll('[data-state="unsubmitted"]')
}
function submitGuess() {
    const tileList = getUnsubmittedTiles()
    let submission = ""
    if (tileList.length < LETTER_LENGTH) return
    for (let i = 0; i < tileList.length; i++) {
        const yourLetter = tileList[i].dataset.inside;
        submission += yourLetter
        tileList[i].dataset.state = "incorrect"
        keyboard.querySelector(`[data-key="${yourLetter.toUpperCase()}"]`).dataset.state = "incorrect"
        for (let j = 0; j < answer.length; j++) {
            if (yourLetter == answer.charAt(j)) {
                tileList[i].dataset.state = "wrong-location"
                keyboard.querySelector(`[data-key="${yourLetter.toUpperCase()}"]`).dataset.state = "wrong-location"
                if (i === j) {
                    tileList[i].dataset.state = "correct";
                    keyboard.querySelector(`[data-key="${yourLetter.toUpperCase()}"]`).dataset.state = "correct"
                    break;
                }
            }
        }
    }
    if (submission === answer) {
        console.log("You won")
        showPopup(true)
        endInteraciton()
    }  
}


function deleteLastLetter() {
    const currentSubmission = getUnsubmittedTiles();
    if (currentSubmission.length == 0) return;
    const currentTile = guessArea.querySelector(":not([data-inside])")
    const tileToDelete = currentTile.previousElementSibling
    tileToDelete.textContent = ""
    tileToDelete.removeAttribute("data-inside")
    tileToDelete.removeAttribute("data-state")
}

function showPopup(hasWon) {
    const gameStatus = popup.querySelector("#game-status")
    const placeToShowAnswer = popup.querySelector("#answer")
    const restartBtn = popup.querySelector("#restart")
    const closePopupBtn = popup.querySelector("#close")

    gameStatus.textContent = hasWon ? "You won" : "You lost"
    placeToShowAnswer.textContent = `The answer is ${answer.toUpperCase()}`
    popup.classList.add("show")

    closePopupBtn.onclick = () => {
        popup.classList.remove("show")
    }

    restartBtn.onclick = () => {
        //reload website
        location.reload()
    }
}

