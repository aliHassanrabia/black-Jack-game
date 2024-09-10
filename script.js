const suits = ['Hearts ♥', 'Diamonds ♦', 'Clubs ♣', 'Spades ♠']
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const cardValues = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 10,
  Q: 10,
  K: 10,
  A: 11
}

let deck = []
let playerHand = []
let dealerHand = []
let playerBet = 0
let gameStarted = false

const dealerCards = document.getElementById('dealer-cards')
const playerCards = document.getElementById('player-cards')
const dealerScore = document.getElementById('dealer-score')
const playerScore = document.getElementById('player-score')
const playerBetDisplay = document.getElementById('player-bet')
const betButton = document.getElementById('bet-button')
const hitButton = document.getElementById('hit-button')
const stayButton = document.getElementById('stay-button')

function createDeck() {
  deck = []
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank })
    }
  }
  deck = shuffle(deck)
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function dealCard() {
  return deck.pop()
}

function calculateScore(hand) {
  let score = 0
  let hasAce = false
  for (const card of hand) {
    score += cardValues[card.rank]
    if (card.rank === 'A') hasAce = true
  }
  if (hasAce && score > 21) score -= 10
  return score
}

function updateDisplay() {
  dealerCards.innerHTML = ''
  playerCards.innerHTML = ''

  for (const card of dealerHand) {
    dealerCards.innerHTML += `<div class="card">${card.rank} of ${card.suit}</div>`
  }
  for (const card of playerHand) {
    playerCards.innerHTML += `<div class="card">${card.rank} of ${card.suit}</div>`
  }

  dealerScore.textContent = `Score: ${calculateScore(dealerHand)}`
  playerScore.textContent = `Score: ${calculateScore(playerHand)}`
}

function startGame() {
  createDeck()
  playerHand = [dealCard(), dealCard()]
  dealerHand = [dealCard(), dealCard()]
  updateDisplay()
  gameStarted = true
  hitButton.disabled = false
  stayButton.disabled = false
}

function endGame(result) {
  alert(result)
  gameStarted = false
  hitButton.disabled = true
  stayButton.disabled = true
  playerBetDisplay.textContent = `Bet: $0`
}

function handleBet() {
  let betAmount = prompt('Enter your bet $: ')
  if (betAmount && !isNaN(betAmount) && betAmount > 0) {
    playerBet = parseInt(betAmount, 10)
    playerBetDisplay.textContent = `Bet: $${playerBet}`
    startGame()
  } else {
    alert('Please enter a valid bet amount.')
  }
}

betButton.addEventListener('click', handleBet)

hitButton.addEventListener('click', () => {
  playerHand.push(dealCard())
  updateDisplay()
  const playerHandScore = calculateScore(playerHand)
  if (playerHandScore > 21) {
    dealCard()
    setTimeout(() => {
      endGame('Player busts, you lost..😔')
    }, 1000)
  }
})
stayButton.addEventListener('click', () => {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(dealCard())
    updateDisplay()
  }

  const dealerScore = calculateScore(dealerHand)
  const playerScore = calculateScore(playerHand)

  if (dealerScore > 21 || playerScore > dealerScore) {
    dealCard()
    setTimeout(() => {
      endGame('you win...😃')
    }, 1000)
  } else if (playerScore < dealerScore) {
    dealCard()
    setTimeout(() => {
      endGame('you lose...😔')
    }, 1000)
  } else {
    dealCard()
    setTimeout(() => {
      endGame('its a tie...😮')
    }, 1000)
  }
})
