const guessArea = document.querySelector(".guess-area-wrapper")
const button = document.querySelector("button")
// const answer = fetch("https://random-word-api.herokuapp.com/word?length=5")
// .then(res => res.json())
// .then(res => {
//      res
// })


// function getAnswer() {
//     let answer;
//     const sth = fetch("https://random-word-api.herokuapp.com/word?length=5")
//     .then(res => res.json())
//     .then(res => {
//         return res
//     })
// }


function startInteraction() {
    const clickEvent = window.addEventListener("click", handleClickButton)
    const keyPressEvent = window.addEventListener("keyup", handlePressKey)
}

function endInteraciton() {
    const clickEvent = window.removeEventListener("click", handleClickButton)
    const keyPressEvent = window.removeEventListener("keyup", handlePressKey)
}

function handleClickButton(event) {
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
        submission = submission + tileList[i].dataset.inside
    }
    console.log(answer)
    if (submission === answer) {
        console.log(submission)
        console.log("Submission is right")
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
startInteraction();

