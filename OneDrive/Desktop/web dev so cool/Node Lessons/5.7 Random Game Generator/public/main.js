
let title = document.querySelector("#title")
let rollButton = document.querySelector(".roll-button")
let light = document.querySelector(".light")
let light2 = document.querySelector(".light2")
let light3 = document.querySelector(".light3")

let outcomes = document.querySelectorAll(".outcome")

let sounds = {
    spin: '/sounds/spin.mp3',
    outcomes: '/sounds/outcomes.mp3'
}

// SETTINGS

let appearDelays = [
    500,
    1200,
    1900,
]

let gameTitleDelay = 1000;

let rollingDuration = 3750
let lightsOnDelay = 1000

let typeSpeed = 150 // letters per milisecond
let explodeSpeed = 0.2
let explodeCap = 5000

let $_duration = 100

let glitchIntervalMin = 300
let glitchIntervalMax = 3000
let glitchDuration = 100
let titleShadowOffsetMin = -20
let titleShadowOffsetMax = 20

let bobSpeed = 0.005;
let bobDistance = 20;
let rotateSpeed = 0.0035;
let rotateIntensity = 7.5 // degrees

let titleInteractCooldown = 500
let titleInteractDebounce = false

let followRate = 0.01
let followRate2 = 0.0075
let followRate3 = 0.005

// VARIABLES

let bobTime = 0;
let rotTime = 0

let mouseX
let mouseY

let spinning = false

// HELPERS

function mathClamp(NUMBER, MIN, MAX) {
    if (NUMBER < MIN) {
        NUMBER = MIN
    }

    if (NUMBER > MAX) {
        NUMBER = MAX
    }

    return NUMBER
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function loop(callFunction) {
    callFunction()
}

function randomNumber(MIN, MAX) {
    return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

// INNER INITS

function lightsOff(delay) {
    setTimeout(() => {
        light.style.opacity = "0"
        light2.style.opacity = "0"
        light3.style.opacity = "0"
    }, delay)
}

function lightsOn(delay) {
    setTimeout(() => {
        light.style.opacity = "1"
        light2.style.opacity = "1"
        light3.style.opacity = "1"
    }, delay)
}

function glitchTitle() {
    title.classList.add("glitch-wiggle")
    title.classList.remove("glow-white")
    title.style.textShadow = `
        ${randomNumber(titleShadowOffsetMin, titleShadowOffsetMax)}px ${randomNumber(titleShadowOffsetMin, titleShadowOffsetMax)}px 0 red,
        ${randomNumber(titleShadowOffsetMin, titleShadowOffsetMax)}px ${randomNumber(titleShadowOffsetMin, titleShadowOffsetMax)}px 0 #455EFF80,
        10px 0 0 cyan
    `;

    setTimeout(() => {
        title.classList.remove("glitch-wiggle")
        title.classList.add("glow-white")
        title.style.textShadow = "none"
    }, glitchDuration)
}

function loopGlitchTitle() {
    title.classList.add("glitch-wiggle")
    title.classList.remove("glow-white")
    title.style.textShadow = `
        ${randomNumber(titleShadowOffsetMin, titleShadowOffsetMax)}px ${randomNumber(titleShadowOffsetMin, titleShadowOffsetMax)}px 0 red,
        ${randomNumber(titleShadowOffsetMin, titleShadowOffsetMax)}px ${randomNumber(titleShadowOffsetMin, titleShadowOffsetMax)}px 0 #455EFF80,
        10px 0 0 cyan
    `;

    setTimeout(() => {
        title.classList.remove("glitch-wiggle")
        title.classList.add("glow-white")
        title.style.textShadow = "none"

        setTimeout(() => {
            loopGlitchTitle()
        }, randomNumber(glitchIntervalMin, glitchIntervalMax)) 
    }, glitchDuration)
}

function animateTitle() {
    bobTime += bobSpeed
    rotTime += rotateSpeed
    const yOffset = Math.sin(bobTime) * bobDistance;
    const rotOffset = Math.sin(rotTime) * rotateIntensity;
    
    title.style.transform = `translateY(${yOffset}px) rotate(${rotOffset}deg)`;
    
    requestAnimationFrame(animateTitle); 
}  

function typeText(element, explodes) {
    let content = element.querySelector(".content")
    let letters = content.innerHTML.split('')
    content.textContent = ""

    if (explodes === true) {
        letters.forEach((l, i) => {
            let delay = Math.exp(i * explodeSpeed) * 100;
            delay = mathClamp(delay, 0, explodeCap)

            if (l === "$") {
                setTimeout(() => {
                }, i * $_duration)
                console.log("GG!!")
            }

            setTimeout(() => {
            content.append(`${l}`)
        }, delay)
    })
    } else {
        letters.forEach((l, i) => {
            if (l === "$") {
                setTimeout(() => {
                }, i * $_duration)
                console.log("GG!!")
            }

            setTimeout(() => {
            content.append(`${l}`)
        }, i * typeSpeed)
    })
    }

    addCursor(element)
}

function addCursor(element) {
    let cursor = element.querySelector(".cursor")
    if (cursor) {
        cursor.classList.add("blink")
    }
}

function followPointer() {
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX
        mouseY = event.clientY
    });    
}

function animatePointer() {
    const currentX = parseFloat(light.style.left) || 0;
    const currentY = parseFloat(light.style.top) || 0;
    
    const newX = currentX + (mouseX - currentX) * followRate;
    const newY = currentY + (mouseY - currentY) * followRate;

    const currentX2 = parseFloat(light2.style.left) || 0;
    const currentY2 = parseFloat(light2.style.top) || 0;
    
    const newX2 = currentX2 + (mouseX - currentX2) * followRate2;
    const newY2 = currentY2 + (mouseY - currentY2) * followRate2;

    const currentX3 = parseFloat(light3.style.left) || 0;
    const currentY3 = parseFloat(light3.style.top) || 0;
    
    const newX3 = currentX3 + (mouseX - currentX3) * followRate3;
    const newY3 = currentY3 + (mouseY - currentY3) * followRate3;
    
    light.style.left = newX + 'px';
    light.style.top = newY + 'px';
    
    light2.style.left = newX2 + 'px';
    light2.style.top = newY2 + 'px';
    
    light3.style.left = newX3 + 'px';
    light3.style.top = newY3 + 'px';

    requestAnimationFrame(() => animatePointer(light))
}

function addFallingWind(element, duration, speed) {
    let lastTime = Date.now()
    let time = 0

    function timer() {
        if (time < duration) {
            const dt = (Date.now() - lastTime) / 1000;
            lastTime = Date.now();
            time += dt

            // ANIMATION'

            let wind = document.createElement("div")
            element.append(wind)

            wind.classList.add("wind", "blur")
            wind.style.left = `${randomNumber(0, element.offsetWidth)}px`

            wind.style.width = `${randomNumber(4, 40)}px`
            wind.style.height = `${randomNumber(100, 450)}px`

            setTimeout(() => { wind.remove() }, 200)

            requestAnimationFrame(timer)
        } else { // yay finished the timer
            console.log("yo")
        }
    }

    timer()
}

function addFallingQuestionMarks(element, duration) {
    let lastTime = Date.now()
    let time = 0

    function timer() {
        if (time < duration) {
            const dt = (Date.now() - lastTime) / 1000;
            lastTime = Date.now();
            time += dt

            // ANIMATION'

            let questionMark = document.createElement("h1")
            element.append(questionMark)

            questionMark.classList.add("question-mark", "jet")
            questionMark.innerHTML = "?"
            questionMark.style.left = `${element.offsetWidth}`

            setTimeout(() => { questionMark.remove() }, 200)

            requestAnimationFrame(timer)
        } else { // yay finished the timer
            console.log("yo")
        }
    }

    timer()
}

function displayGame(outcome, data) {
    outcome.classList.add("tv-static-light", "glow-box")
    outcome.classList.remove("tv-static")
    console.log("DISPLAYING")

    let displayImg = document.createElement("img")
    outcome.append(displayImg)
    displayImg.src = data.background_image
    displayImg.classList.add("display-image", "zoom-out", "tv-static-light")
    displayImg.style.transform = "scale(0.8)"

    displayImg.offsetHeight

    displayImg.style.transform = "scale(0.92)"
}

function hideGame(outcome) {
    outcome.classList.remove("tv-static-light")
    outcome.classList.add("tv-static")
    console.log("HIDING")

    if (outcome.querySelector(".display-image") != null) {
        outcome.querySelector(".display-image").remove()
    }
}

function displayTitle(outcome, data) {
    let gameTitle = document.createElement("h3")
    
    gameTitle.classList.add("jet", "game-title", "glow-white")
    gameTitle.innerHTML = data.name
    outcome.append(gameTitle)
}

function hideTitle(outcome) {
    if (outcome.querySelector(".game-title")) {
        outcome.querySelector(".game-title").remove()
    }
}

function outcomeStartAnimation(outcome) {
    addFallingWind(outcome, 3.75, 1)
    hideGame(outcome)
    hideTitle(outcome)
    addFallingQuestionMarks(outcome, 3.75, 1)
    outcome.classList.remove("fast-transitions")
    outcome.classList.add("glow-box-high", "slow-transitions")
}

function outcomeEndAnimation(outcome) {
    outcome.classList.remove("glow-box", "tv-static", "glow-box-high", "slow-transitions")
    outcome.classList.add("fast-transitions")
}

// INTERACTIONS

title.addEventListener("mouseenter", () => {
    if (titleInteractDebounce === false) {
        titleInteractDebounce = true
        glitchTitle() 
        setTimeout(() => {
            titleInteractDebounce = false
            console.log("timer done")
        }, titleInteractCooldown)
    }
})

rollButton.addEventListener("mouseenter", () => {
    rollButton.classList.add("vibrate-3")
})

rollButton.addEventListener("mouseleave", () => {
    rollButton.classList.remove("vibrate-3")
})

rollButton.addEventListener("click", async () => {
    if (spinning != true) {
        spinning = true
        let sound = new Audio(sounds["spin"])
        sound.play()

        // BOXES ANIMATION?

        outcomes.forEach((outcome) => {
            outcomeStartAnimation(outcome)
        })

        document.body.classList.add("zoomed", "rolling-shake")
        document.body.style.transition = "all 0.1s"
        document.body.style.overflow = 'hidden';
        document.body.style.background = "rgb(255, 255, 255) !important"

        lightsOff()

        // INFO GATHERING

        let games = []

        try {
            const fetchPromise = fetch("/outcomes").then(res => res.json())

            const delayPromise = sleep(rollingDuration)
            const [data] = await Promise.all([fetchPromise, delayPromise])

            games = data
            console.log(games)

        } catch (error) {
            console.error("ohhh shi...:", error)
        }

        console.log(games)

        spinning = false
        document.body.classList.remove("zoomed", "rolling-shake")
        document.body.style.transition = "all 0.4s"
        document.body.style.overflow = 'hidden'
        document.body.style.background = "radial-gradient(circle at center, #080114, #0d0118)"

        sound = new Audio(sounds["outcomes"])
        sound.play()

        lightsOn(lightsOnDelay)

        outcomes.forEach((outcome, index) => {
            outcomeEndAnimation(outcome)

            setTimeout(() => {
                displayGame(outcome, games[index])
                displayTitle(outcome, games[index])
            }, appearDelays[index])
        })
    }
})

// INITS

function initTitle() {
    animateTitle()
    typeText(title, true)
    loopGlitchTitle()
}

function initRoll() {

}

function initLight() {
    followPointer()
    animatePointer()
}

initTitle()
initLight()