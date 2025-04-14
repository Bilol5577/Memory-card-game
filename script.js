let timeInSeconds = 50;
let timerInterval;
let timerStarted = false;
let flippedCards = [];
let lockBoard = false;
let matchedPairs = 0;
let score = 0;

const totalPairs = 8; 
const timerButton = document.getElementById('timer');
const timeUpMessage = document.getElementById('loseMessage');
const winMessage = document.getElementById('winMessage');
const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');


const emojis = ['🍎', '🚗', '🎵', '🐶', '⚽', '🌞', '🍕', '🎁'];
let emojiPairs = [...emojis, ...emojis]; 


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(emojiPairs);


emojiPairs.forEach(emoji => {
  const card = createCard(emoji);
  gameBoard.appendChild(card);
});


function updateTimer() {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  timerButton.textContent = `⏱️ ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (timeInSeconds > 0) {
    timeInSeconds--;
  } else {
    clearInterval(timerInterval);
    endGame(false); 
  }
}


function startTimer() {
  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
  }
}


function createCard(emoji) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.emoji = emoji;

  const front = document.createElement('div');
  front.classList.add('card-face', 'card-front');

  const back = document.createElement('div');
  back.classList.add('card-face', 'card-back');
  back.textContent = emoji;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', () => {
    startTimer();
    flipCard(card);
  });

  return card;
}


function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}


function checkForMatch() {
  const [first, second] = flippedCards;
  if (first.dataset.emoji === second.dataset.emoji) {
    score += 10;
    matchedPairs++;
    updateScore();
    flippedCards = [];
    checkWin();
  } else {
    lockBoard = true;
    setTimeout(() => {
      first.classList.remove('flipped');
      second.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}


function updateScore() {
  scoreDisplay.textContent = `Ball: ${score}`;
}


function checkWin() {
  if (matchedPairs === totalPairs) {
    clearInterval(timerInterval);
    endGame(true); 
  }
}


function endGame(won) {

  document.querySelectorAll('.card').forEach(card => {
    card.classList.add('blur');
  });

  if (won) {
    winMessage.classList.add('show');
  } else {
    timeUpMessage.classList.add('show');
  }
}
