const words={
    easy:["everything","bababooey","boat","penguin","lion","dog","dawg",
    "paper","dollar","jeffery","jimmyjoejohnson","jimbojabber","sommelier","pharmacist",
    "guitar","mountain","santa claus","lighthouse","telephone","xylophone","slap",
    "on","my","nuts","free","three","tree","dee","eel","bee","bumblebee","eagle",
    "grass","naughty","cigarette","microphone","expedient","micro-penis","surströmming","august tvede",
     "tele2","weed","bajs","frankfurtkorv","baby"],

     normal:["window","computer","horse","collector","spontaneous",
     "hurricane","cannons","salmon","bright lights","come alive","shadows",
     "ruthless","commander","talk talk","strangers", "document","deodorant",
     "medusa","chord","silly","labelmaker","vatican","kinder egg","spoiled milk",
     "throwing","story-time","experience","tornado","tv-screen","hand-bag"],

     hard:["catalouge","constitutional","spontaneous",
     "concession","contrary","churchill","catastrophy","publication",
     "together","sakura","robot","dancing","snoop dog","never","always",
     "k-pop","metallica","mood-swings","trophies","destructo-disc",
     "konichiwa","foreboding","donkey-kong","curriculum","improvement",
     "convenience","withdraw","hospitality","jimmyjoejohnson","conglomerate"]
}
const delay = {
    easy: 2500,
    normal: 1500,
    hard: 1200
}
let difficulty = "normal"
let lives = 3;
let score = 0
let audioOn = false

window.addEventListener("DOMContentLoaded",()=>{
    difficulty = localStorage.getItem("difficulty") || "normal";
    document.querySelector(`[data-diff=${difficulty}]`).classList.add("active");
    enableButtons();
    document.querySelectorAll("audio").forEach((sound) => {
        sound.volume = 0.1
    });
})
function enableButtons(){
    document.querySelector("#start-button").addEventListener("click",startGame);
    document.querySelector("#instr-button").addEventListener("click",()=>{
        document.querySelector("#modal-instr").classList.remove("hidden");
    })
    document.querySelector("#checkmark-button").addEventListener("click",()=>{
        document.querySelector("#modal-instr").classList.add("hidden");
    });
    document.querySelector("#audio-button").addEventListener("click", ()=>{
        document.querySelector("#background-music").play();
        audioOn = !audioOn
        if (audioOn){
            document.querySelector("#audio-button").textContent="🔇"
            document.querySelectorAll("audio").forEach((sound) => {
                sound.volume = 0.1
            });
        } else {
            document.querySelector("#audio-button").textContent="🔊"
            document.querySelectorAll("audio").forEach((sound) => {
                sound.volume = 0
            });
        }
    })
    document.querySelectorAll("#pills-container .button").forEach(button =>{
        button.addEventListener("click",()=>{
            document.querySelector(".active").classList.remove("active");
            button.classList.add("active")
            difficulty=button.textContent.toLocaleLowerCase();
            localStorage.setItem("difficulty",difficulty);

        });
    })
    document.querySelector("#return-button").addEventListener("click",()=>{
        document.querySelector("#game-screen").classList.add("hidden")
    })
}
function startGame(){
    resetGame();
    window.addEventListener("keydown",readInput);
    document.querySelector("#game-screen").classList.remove("hidden");
    genWord();
}
function resetGame(){
    lives = 3
    score = 0
    document.querySelector("#score").textContent=0
    document.querySelector("#modal-end-screen").classList.add("hidden");
    document.querySelector("#falling-words").innerHTML=""
    document.querySelectorAll("#heart-container .hidden").forEach(life =>{
        life.classList.remove("hidden");
    })

}
//function to create words
function genWord(){ 
    const randomWord = words[difficulty][Math.floor(Math.random()*words[difficulty].length)]
    const word = document.createElement("p");
    const lettuce = randomWord.split("");
    lettuce.forEach((letter)=>{
        const letterElm=document.createElement("span");
        letterElm.textContent=letter;
        word.appendChild(letterElm);
    })
    word.style.left=Math.random()*90+"%";

    document.querySelector("#falling-words").appendChild(word)
    if(!document.querySelector(".active-word")) setActiveWord();

    word.addEventListener("animationend",()=>{
        word.remove(); //deletes words upon duration end, adds underline to new active word
        setActiveWord()
        loseLife()
    });
    if (lives >0){
    setTimeout(genWord,delay[difficulty])

    }
}
function setActiveWord(){
    console.log("setActiveWord");
    document.querySelector("#falling-words").firstElementChild?.classList.add("active-word");
    document.querySelector(".active-word")?.firstElementChild.classList.add("active-letter");
}
function readInput(e){
    const letter=document.querySelector(".active-letter");
    document.querySelector(`#typeman-${Math.floor(Math.random() * 4) + 1}`).play();

     if(e.key===letter?.textContent) {
        letter.classList="typed";
        if (letter.nextElementSibling){
            letter.nextElementSibling.classList.add("active-letter");
        } else {
            document.querySelector(".active-word").remove();
            setActiveWord();
            score++;
            document.querySelector("#score").textContent = score;
        }
    }
}
function loseLife(){
    document.querySelector(`#life-${lives}`)?.classList.add("hidden");
    lives--;
    if (lives ==0) {
        console.log("You died");
        document.querySelector("#modal-end-screen").classList.remove("hidden")
        document.querySelector("#modal-end-screen p").textContent="Score: "+score
        window.removeEventListener("keydown",readInput);

    }
}