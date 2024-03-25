const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
//De score begint bij 0 en je kan 2 kaarten kiezen

document.querySelector(".kaarten").textContent = score;

fetch("./ok.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });
//Linkt naar de json bestand waarbij er 2 functies worden gemaakt
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}
//hier zorg ik dat als ik de 2e kaart aan klik dat niet de 1e kaart terug draait
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}
//
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".kaarten").textContent = score;
  lockBoard = true;
//Hier zorg ik er voor dat je geen andere kaarten kan aanklikken als je al 2 keuzes hebt gemaakt(tot de kaarten terug zijn gedraaid.)
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}
//hier zorg ik er voor dat js kijkt als de data van de 2 fotos overeenkomt met elkaar en onder de regels hier beneden 
//zorg ik er voor wat er gebeurd als de data overeenkomt of niet over eenkomt
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}
//hier zorg ik er voor als het geen match heeft dat de animatie dat de kaarten terug draait 1sec duurt

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".kaarten").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}
//hier mee zorg ik er voor dat de de restart button weer de score naar 0 gaat en dat de kaarten opnieuw geshuffld worden dan
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}
//dit laat zien dat als de kaarten overeen met elkaar moeten komen anders is het fals