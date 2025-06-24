const words = [
  "Hayashidesuka?", "cry", "uniuniuni", "aaaaaa"
];

let currentWord = "";
const wordDiv = document.getElementById("word");
const input = document.getElementById("input");
const result = document.getElementById("result");

function setNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  wordDiv.textContent = currentWord;
  input.value = "";
  result.textContent = "";
}

input.addEventListener("input", () => {
  if (input.value === currentWord) {
    result.textContent = "正解！";
    setTimeout(setNewWord, 1000);
  }
});

window.onload = setNewWord;
