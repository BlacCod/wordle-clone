const guessArea = document.querySelector(".guess-area-wrapper")
const keyboard = document.querySelector(".keyboard-area")
let answer = "";

function startGame() {
    getWord()
    startInteraction()
}

startGame()
async function getWord() {
    const response = await fetch("https://random-word-api.herokuapp.com/word?length=5")
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
    if (unsubmittedTileList.length >= 5) return
    
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
    if (tileList.length < 5) return
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
        endInteraciton()
    }  
}


function deleteLastLetter() {
    const currentTile = guessArea.querySelector(":not([data-inside])")
    const tileToDelete = currentTile.previousElementSibling
    if (tileToDelete == null) return
    tileToDelete.textContent = ""
    tileToDelete.removeAttribute("data-inside")
    tileToDelete.removeAttribute("data-state")

}

