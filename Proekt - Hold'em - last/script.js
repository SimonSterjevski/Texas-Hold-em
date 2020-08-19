
// Player constructor
function Player(cash, id) {
  this.id = id;
  this.playingCards = [];
  this.playingCardsNums = [];
  this.winningCards = [];
  this.pot = 0;
  this.totalCash = cash;
  this.betPerTurn = 0;
  this.betPerRound = 0;
  this.moneyToCall = 0;
  this.isActiveForResult = true;
  this.winnerInfo = ``;
}

let allPlayers = []; // initial empty list of players


// Game parametars
let gameParams = {
  totalBets: 0,
  smallBlindPlayerId: 1,
  bigBlindPlayerId: 2,
  usedCards: [],
  smallBlindAmount: 5,
  cardsOnTable: 0,
  lastPlayerIdOnTurn: 2,
  firstPlayerIdOnTurn: 1,
  numberOfRounds: 0,
  smallBlindRaise: 5,
  highestBet: 0,
  lastBetAmount: 0,
  playerIdToAdd: 0,
  startingChipsAmount: 0
}


// DOM
let domClasses = {
  chipAmount: document.querySelector(".playerschips"),
  playersNumber: document.querySelector(".playersnumber"),
  startButton: document.querySelector(".btnstart"),
  infoBegin: document.querySelector(".info"),
  cardsField: document.querySelector(".cards"),
  totalBets: document.querySelector(".totalbets"),
  cardBox: document.querySelector(".cardbox"),
  texasDiv: document.querySelector(".texasdiv"),
  winnerId: document.querySelector(".winnerid"),
  winnetText: document.querySelector(".winnertext"),
  allPlayers: document.querySelector(".players"),
  addPlayer: document.querySelector(".addplayer")
}


// Events - Actions
document.addEventListener("click", onCall);
document.addEventListener("click", onFold);
document.addEventListener("click", onCheck);
document.addEventListener("click", onRaise);
document.addEventListener("click", onBet);
document.addEventListener("click", onAllIn);
document.addEventListener("click", onLeave);
domClasses.addPlayer.addEventListener("click", addPlayer);
domClasses.startButton.addEventListener("click", startGame);  // Ask for chip amount and number of players and starts the game on click


// 1. START AND RESET

// New Round
function newRound() {
  resetParamsBeforeNewRound(allPlayers)
  dealPlayersCards(allPlayers);
  dealPlayersCards(allPlayers);
  smallAndBigBlindAdjust(allPlayers);
}


// Starting the game
function startGame() {
  
  if (parseInt(domClasses.playersNumber.value) < 10 && parseInt(domClasses.playersNumber.value) > 1 && 
  parseInt(domClasses.chipAmount.value) < 1000001 &&  parseInt(domClasses.chipAmount.value) > 499) {
    gameParams.startingChipsAmount = parseInt(domClasses.chipAmount.value);
    document.body.style.backgroundColor = "white";
    createPlayers(parseInt(domClasses.playersNumber.value), parseInt(domClasses.chipAmount.value));
    domClasses.playersNumber.value = ``;
    domClasses.chipAmount.value = ``;
    renderPlayers(allPlayers);
    newRound();
  }
}


/// completely new game if there is no more than one player left, reset 
function newGame() {

  domClasses.cardsField.innerHTML = ``;
  domClasses.infoBegin.style.display = "flex";
  domClasses.cardBox.style.visibility = "hidden";   
  domClasses.allPlayers.innerHTML = ``;
  domClasses.texasDiv.style.display = "flex";
  document.body.style.backgroundColor = "rgb(72, 201, 136)";
  allPlayers = [];
  resetGameParams();
}


// Parameters that need to be reset after every round, also add the player in the queue.
function resetParamsBeforeNewRound(players) {

  domClasses.addPlayer.disabled = false;
  if (gameParams.playerIdToAdd > 0) {
    if (!allPlayers.map(player => player.id).includes(gameParams.playerIdToAdd)) {
      players.push(new Player(gameParams.startingChipsAmount, gameParams.playerIdToAdd));
    } else {
      players.filter(player => player.id === gameParams.playerIdToAdd)[0].totalCash = gameParams.startingChipsAmount;
    }   
  }
  players.sort((a, b) => a.id - b.id);
  let activePlayers = players.filter(player => player.totalCash > 0);
  players.filter(player => player.totalCash === 0).forEach(player => {
    player.isActiveForResult = false;
  })
    gameParams.totalBets = 0;
    gameParams.usedCards = [];
    gameParams.highestBet = 0;
    gameParams.numberOfRounds ++;
    gameParams.cardsOnTable = 0;
    domClasses.cardsField.innerHTML = ``;
    domClasses.winnetText.innerText = ``;
    gameParams.playerIdToAdd = 0;
    gameParams.lastBetAmount = gameParams.smallBlindAmount*2;

    activePlayers.forEach(player => {
    player.playingCards = [];
    player.playingCardsNums = [];
    player.betPerRound = 0;
    player.betPerTurn = 0;
    player.isActiveForResult = true;
    player.moneyToCall = 0;
    player.winnerInfo = ``;
    player.winningCards = [];
    player.pot = 0;
    document.querySelector(`.player_${player.id}`).style.border = "none";
   
    if (gameParams.numberOfRounds > 1) {
      document.querySelector(`.player${player.id}`).innerHTML = ``;
      document.querySelector(`.player_${player.id}`).style.opacity = "0.7";
    }
  })
  players.filter(player => player.isActiveForResult === false).forEach(player => {
    document.querySelector(`.player_${player.id}`).style.visibility = "hidden";
  }) 
    
}


/// reseting game parametars on new game
function resetGameParams() {
  gameParams.totalBets = 0;
  gameParams.smallBlindPlayerId = 1;
  gameParams.bigBlindPlayerId = 2;
  gameParams.usedCards = [];
  gameParams.smallBlindAmount = 5;
  gameParams.cardsOnTable = 0;
  gameParams.lastPlayerIdOnTurn = 2;
  gameParams.firstPlayerIdOnTurn = 1;
  gameParams.numberOfRounds = 0;
  gameParams.smallBlindRaise = 5;
  gameParams.highestBet = 0;
  gameParams.lastBetAmount = 0;
  gameParams.playerIdToAdd = 0;
  gameParams.startingChipsAmount = 0;
}


// 2. CARD DEALING

// Compose Card, 14 is defined as ACE, 11 as J, 12 as Q, 13 as K
// ramndom numbers from 1 to 4 present colors
function composeCard () {
    let card;
    let cardNumber;
    let cardColor;
    let first = Math.floor(Math.random()*13+1);
      switch (first) {
        case 1:
        cardNumber = "14";
        break;
        case 2:
        cardNumber = "2";
        break;
        case 3:
        cardNumber = "3";
        break;
        case 4:
        cardNumber = "4";
        break;
        case 5:
        cardNumber = "5";
        break;
        case 6:
        cardNumber = "6";
        break;
        case 7:
        cardNumber = "7";
        break;
        case 8:
        cardNumber = "8";
        break;
        case 9:
        cardNumber = "9";
        break;
        case 10:
        cardNumber = "10";
        break;
        case 11:
        cardNumber = "11";
        break;
        case 12:
        cardNumber = "12";
        break;
        case 13:
        cardNumber = "13";
        break;
      }
  
    let second = Math.floor(Math.random()*4+1);
      switch (second) {
        case 1:
        cardColor = "C";
        break;
        case 2:
        cardColor = "D";
        break;
        case 3:
        cardColor = "H";
        break;
        case 4:
        cardColor = "S";
        break;
      }   

    card = cardNumber + " " + cardColor;
    return [card, cardNumber];
  }

 
  // Deal Player Cards and show them on screen
  function dealPlayersCards(players) {
    let filteredPlayers = players.filter(player => player.isActiveForResult);
    for (let i = 0; i < filteredPlayers.length; i++) {
      let cards = composeCard();
      if (gameParams.usedCards.includes(cards[0])) {
        i--;
      } else {
        filteredPlayers[i].playingCards.push(cards[0]);
        filteredPlayers[i].playingCardsNums.push(parseInt(cards[1]));
        gameParams.usedCards.push(cards[0]);
        document.querySelector(`.player${filteredPlayers[i].id}`).innerHTML += `<img src="PNG/${cards[0]}.png">`
      }
    }
  }

  // Deal table card and show it on screen
  function dealTableCard(players) {    
    let cards = composeCard();
    if (gameParams.usedCards.includes(cards[0])) {
      return dealTableCard(players);
    } else {
      domClasses.cardsField.innerHTML += `<img src="PNG/${cards[0]}.png">`;
      let filteredPlayers = players.filter(player => player.isActiveForResult);
      filteredPlayers.forEach(player => {
        player.playingCards.push(cards[0]);
        player.playingCardsNums.push(parseInt(cards[1]));
        gameParams.usedCards.push(cards[0]);
        player.betPerTurn = 0;
        gameParams.highestBet = 0;
      })
      gameParams.cardsOnTable ++;
    }
  }
  
  
  // 3. PLAYERS 

  // Create players
  function createPlayers(number, cash) {

      allPlayers = [];
      for (let i = 0; i < number; i++) {
        player = new Player(cash, i+1);
        allPlayers.push(player);
      }
      domClasses.infoBegin.style.display = "none";
      domClasses.texasDiv.style.display = "none";
      domClasses.cardBox.style.visibility = "visible";  
    }
      

// add single player, if there is empty place it fills it, if no its adds player
function addPlayer() {
  if (allPlayers.filter(player => player.totalCash === 0 && player.isActiveForResult === false).length < 9) {
    if (allPlayers.filter(player => player.totalCash === 0 && player.isActiveForResult === false).length > 0) {
      let player = allPlayers.filter(player => player.totalCash === 0 && player.isActiveForResult === false)[0];
      gameParams.playerIdToAdd = player.id;
      document.querySelector(`.player_${player.id}`).style.visibility = "visible";
      document.querySelector(`.player${player.id}`).innerHTML = ``;
      document.querySelector(`.player${player.id}_cash`).innerText = gameParams.startingChipsAmount;
    } else {
      let players = [new Player(gameParams.startingChipsAmount, allPlayers[allPlayers.length-1].id+1)];
      gameParams.playerIdToAdd = players[0].id;
      renderPlayers(players);
    }
  }
  domClasses.addPlayer.disabled = true;
}


  //Render HTML player field and little css
  function renderPlayers(players) {
    players.forEach(player => {
      document.querySelector(".players").innerHTML += `
      <div class="player_${player.id}">
                  <div class="play${player.id}"> 
                  <p> Player ${player.id} </p>
                  <button class="leave_player${player.id}" disabled> Leave </button>
                  <p> Chips: <span class="player${player.id}_cash"> ${player.totalCash} </span> </p> 
                  </div>
                  <div class="bet${player.id}">
                  <p> Call: <span class="tocallplayer${player.id}"> </span> </p> 
                  <p> Bid/Raise:  <span> <input class="player${player.id}_bid" type="number" step=${gameParams.smallBlindAmount*2} 
                  min=${gameParams.smallBlindAmount*2}>  </span> </p>
                  </div>
                  <div>
                  </div>
                  <div class="player${player.id}"> </div>
                  <div class="btndiv${player.id}">
                      <button class="fold_player${player.id}" disabled> Fold </button>
                      <button class="check_player${player.id}" disabled> Check </button>
                      <button class="call_player${player.id}" disabled> Call </button>
                      <button class="bet_player${player.id}" disabled> Bet </button>
                      <button class="raise_player${player.id}" disabled> Raise </button>
                      <button class="allin_player${player.id}" disabled> All in </button>
                  </div>
              </div>`;
              document.querySelector(`.player_${player.id}`).style.opacity = "0.7";
              document.querySelector(`.player_${player.id}`).style.width = "23%";
              let firstMatch = window.matchMedia("(min-width: 901px) and (max-width: 1175px)");
              let secondMatch = window.matchMedia("(min-width: 631px) and (max-width: 900px)");
              let thirdMatch = window.matchMedia("(max-width: 630px)");
              let fourthMatch = window.matchMedia("(min-width: 1176px)");
                firstMatch.addListener(changer => {
                 if (firstMatch.matches) {
                  document.querySelector(`.player_${player.id}`).style.width = "31%";
                } 
              })
                secondMatch.addListener(changer => {
                if (secondMatch.matches) {
                  document.querySelector(`.player_${player.id}`).style.width = "45%";
                } 
              })
                thirdMatch.addListener(changer => {
                if (thirdMatch.matches) {
                  document.querySelector(`.player_${player.id}`).style.width = "90%";
                } 
              })
              fourthMatch.addListener(changer => {
                if (fourthMatch.matches) {
                  document.querySelector(`.player_${player.id}`).style.width = "23%";
                } 
              })

              document.querySelector(`.player_${player.id}`).style.margin = "10px";
              document.querySelector(`.player_${player.id}`).style.backgroundColor = "green";
              document.querySelector(`.player_${player.id}`).style.alignItems = "center";
              document.querySelector(`.play${player.id}`).style.display = "flex";
              document.querySelector(`.play${player.id}`).style.justifyContent = "space-around";
              document.querySelector(`.play${player.id}`).style.alignItems = "center";
              document.querySelector(`.bet${player.id}`).style.display = "flex";
              document.querySelector(`.bet${player.id}`).style.justifyContent = "space-around";
              document.querySelector(`.bet${player.id}`).style.alignItems = "center";
              document.querySelector(`.btndiv${player.id}`).style.display = "flex";
              document.querySelector(`.btndiv${player.id}`).style.justifyContent = "space-around";
              document.querySelector(`.btndiv${player.id}`).style.alignItems = "center";
              document.querySelector(`.btndiv${player.id}`).style.marginTop = "5px";
              document.querySelector(`.btndiv${player.id}`).style.marginBottom = "5px";
              document.querySelector(`.player${player.id}`).style.display = "flex";
              document.querySelector(`.player${player.id}`).style.justifyContent = "center";
              document.querySelector(`.player${player.id}`).style.alignItems = "center"; 
    })
  }


  // 4. SMALL AND BIG BLIND MANIPULATION

  // Small and big blind players adjust, next player adjust
function smallAndBigBlindAdjust (players) {

  if (gameParams.numberOfRounds-1 === gameParams.smallBlindRaise) {
    gameParams.smallBlindRaise += 5;
    gameParams.smallBlindAmount *= 2;
  }
  players.forEach(player => {
    document.querySelector(`.player${player.id}_bid`).setAttribute(`step`, `${gameParams.smallBlindAmount*2}`); 
  })
  if (gameParams.numberOfRounds > 1) {
    gameParams.smallBlindPlayerId = selectCurrentBlind(gameParams.smallBlindPlayerId, players);
    gameParams.bigBlindPlayerId = selectCurrentBlind(gameParams.smallBlindPlayerId, players);
    gameParams.firstPlayerIdOnTurn = gameParams.smallBlindPlayerId;
    gameParams.lastPlayerIdOnTurn = gameParams.bigBlindPlayerId;
  } 
    let currentSmallBlind = players.filter(player => player.id === gameParams.smallBlindPlayerId);
    if (currentSmallBlind[0].totalCash < gameParams.smallBlindAmount) {
      currentSmallBlind[0].betPerTurn = currentSmallBlind[0].totalCash;
      currentSmallBlind[0].totalCash = 0;
    } else {
      currentSmallBlind[0].betPerTurn = gameParams.smallBlindAmount;
      currentSmallBlind[0].totalCash -= gameParams.smallBlindAmount;
    }
    currentSmallBlind[0].betPerRound = currentSmallBlind[0].betPerTurn;
    gameParams.highestBet = currentSmallBlind[0].betPerTurn;
    checkIfIntegerText(document.querySelector(`.player${gameParams.smallBlindPlayerId}_cash`), currentSmallBlind[0].totalCash);
    if (currentSmallBlind[0].totalCash === 0) {
      gameParams.firstPlayerIdOnTurn = findNextPlayerId(gameParams.smallBlindPlayerId, allPlayers);
    }
    let currentBigBlind = players.filter(player => player.id === gameParams.bigBlindPlayerId);
    if (players.filter(player => player.isActiveForResult === true).length === 2 && currentSmallBlind[0].betPerTurn < gameParams.smallBlindAmount) {
      if (currentBigBlind[0].totalCash >= currentSmallBlind[0].betPerTurn) {
        currentBigBlind[0].betPerTurn = currentSmallBlind[0].betPerTurn;
        currentBigBlind[0].totalCash -= currentBigBlind[0].betPerTurn;
      }
      else {
        currentBigBlind[0].betPerTurn = currentBigBlind[0].totalCash;
      currentBigBlind[0].totalCash = 0;
      }
    } else {
      if (currentBigBlind[0].totalCash < gameParams.smallBlindAmount*2) {
        currentBigBlind[0].betPerTurn = currentBigBlind[0].totalCash;
        currentBigBlind[0].totalCash = 0;
      } else {
        currentBigBlind[0].betPerTurn = gameParams.smallBlindAmount*2;
        currentBigBlind[0].totalCash -= gameParams.smallBlindAmount*2;
      }
    }
    currentBigBlind[0].betPerRound = currentBigBlind[0].betPerTurn;
    checkIfIntegerText(document.querySelector(`.player${gameParams.bigBlindPlayerId}_cash`), currentBigBlind[0].totalCash);
    gameParams.totalBets = currentSmallBlind[0].betPerTurn + currentBigBlind[0].betPerTurn;
    gameParams.lastBetAmount = gameParams.smallBlindAmount*2;
    checkIfIntegerHTML(domClasses.totalBets, gameParams.totalBets);
    if (currentBigBlind[0].betPerTurn > currentSmallBlind[0].betPerTurn) {
      gameParams.highestBet = currentBigBlind[0].betPerTurn;
    }
    if (players.filter(player => player.isActiveForResult === true).length === 2 && players.filter(player => player.totalCash > 0).length < 2 && 
    currentSmallBlind[0].betPerTurn >= currentBigBlind[0].betPerTurn) {
      let isFinished = dealAllCards(currentBigBlind[0]);
      if (isFinished) {
        return setTimeout(finishRound, 2000);
      }
    }
    if (currentBigBlind[0].totalCash === 0) {
      gameParams.lastPlayerIdOnTurn = findPreviousPlayerId(currentBigBlind[0].id, allPlayers);
    }
    if (currentBigBlind[0].totalCash === 0 && gameParams.bigBlindPlayerId === gameParams.firstPlayerIdOnTurn) {
      gameParams.firstPlayerIdOnTurn = findNextPlayerId(gameParams.bigBlindPlayerId, allPlayers);
    }
    let nextPlayerId = findNextPlayerId(currentBigBlind[0].id, players);
    let nextPlayer = players.filter(player => player.id === nextPlayerId);
    if (players.filter(player => player.isActiveForResult === true).length === 2 && currentBigBlind[0].totalCash === 0) {
      nextPlayer[0].moneyToCall = gameParams.highestBet - nextPlayer[0].betPerTurn;
    } else {
      nextPlayer[0].moneyToCall = gameParams.smallBlindAmount*2 - nextPlayer[0].betPerRound; /// if big blind player goes all in and amount is less
      // then big blind amount, still next player needs to call the big blind amount
    }
    document.querySelector(`.call_player${nextPlayer[0].id}`).disabled = false;
    document.querySelector(`.fold_player${nextPlayer[0].id}`).disabled = false;
    document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled = false;
    document.querySelector(`.allin_player${nextPlayer[0].id}`).disabled = false;
    document.querySelector(`.leave_player${nextPlayer[0].id}`).disabled = false;
    nextPlayerExceptions(nextPlayer[0]);
    document.querySelector(`.player_${nextPlayerId}`).style.opacity = "1";
    checkIfIntegerText(document.querySelector(`.tocallplayer${nextPlayerId}`), nextPlayer[0].moneyToCall);
    if (document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled === false) {
      document.querySelector(`.player${nextPlayer[0].id}_bid`).setAttribute(`min`, `${gameParams.highestBet + gameParams.lastBetAmount}`);
    }
  }


  // select current blind using player Id
  function selectCurrentBlind (blind, players) {
    let nextBlind = blind + 1;
    if (blind === players.length) {
      nextBlind = 1;
    }
    let nextPlayer = players.filter(player => player.id === nextBlind);
    if (nextPlayer[0].isActiveForResult === false) {
      blind = nextBlind;
      return selectCurrentBlind(blind, players);
    }
    return nextBlind;
  }


  // 5. EVENT FUNCTIONS, GAME ACTION

  // Call event - game parametars manipulation, enable and dissable next action, also DOM manipulation
  function onCall() {

    let currentPlayerId = parseInt(event.target.className[event.target.className.length-1]);
    let currentPlayer = allPlayers.filter(player => player.id === currentPlayerId);
    if (event.target.className.includes("call")) {
    currentPlayer[0].totalCash -= currentPlayer[0].moneyToCall;
    currentPlayer[0].betPerTurn += currentPlayer[0].moneyToCall;      
    currentPlayer[0].betPerRound += currentPlayer[0].moneyToCall;
    gameParams.highestBet = currentPlayer[0].betPerTurn;
    gameParams.totalBets += currentPlayer[0].moneyToCall;
    checkIfIntegerHTML(domClasses.totalBets, gameParams.totalBets);
    adjustCurrentPlayer(currentPlayer[0]);
    let isFinished = dealAllCards(currentPlayer[0]);
    if (isFinished) {
      return setTimeout(finishRound, 2000);
    }
    if (currentPlayerId === gameParams.firstPlayerIdOnTurn && currentPlayer[0].totalCash === 0) {
      gameParams.firstPlayerIdOnTurn = findNextPlayerId(currentPlayerId, allPlayers);
    }
    let nextPlayerId = findNextPlayerId(currentPlayerId, allPlayers);
    let nextPlayer = allPlayers.filter(player => player.id === nextPlayerId);
    let previousPlayerId = findPreviousPlayerId(gameParams.firstPlayerIdOnTurn, allPlayers);
  if (currentPlayerId === gameParams.lastPlayerIdOnTurn) {
    return dealCardsOrFinishRound(nextPlayer, previousPlayerId);
  } else {
    adjustNextPlayer(nextPlayer[0], currentPlayer[0]);
    nextPlayerExceptions(nextPlayer[0]);
    if (nextPlayer[0].moneyToCall === 0) {  //first turn case when big blind can check if there was no raise
      document.querySelector(`.call_player${nextPlayer[0].id}`).disabled = true;
      document.querySelector(`.check_player${nextPlayer[0].id}`).disabled = false;
    }
    if (document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled === false) {
      document.querySelector(`.player${nextPlayer[0].id}_bid`).setAttribute(`min`, `${gameParams.highestBet + gameParams.lastBetAmount}`);
    }
  }
 } 
}


  // Fold event - game parametars manipulation, enable and dissable next action, also DOM manipulation
  function onFold() {

    let currentPlayerId = parseInt(event.target.className[event.target.className.length-1]);
    let currentPlayer = allPlayers.filter(player => player.id === currentPlayerId);
    if (event.target.className.includes("fold")) {
      adjustCurrentPlayer(currentPlayer[0]);
      document.querySelector(`.player_${currentPlayerId}`).style.opacity = "0.2";
      if (currentPlayerId === gameParams.firstPlayerIdOnTurn) {
        gameParams.firstPlayerIdOnTurn = findNextPlayerId(currentPlayerId, allPlayers); 
      }
      currentPlayer[0].isActiveForResult = false;
    if (allPlayers.filter(player => player.isActiveForResult).length === 1) {    // Finish rounf if only one player is active for result
      return setTimeout(finishRound, 2000);
      }
      let isFinished = dealAllCards(currentPlayer[0]);
      if (isFinished) {
        return setTimeout(finishRound, 2000);
      }
    let nextPlayerId = findNextPlayerId(currentPlayerId, allPlayers);
    let nextPlayer = allPlayers.filter(player => player.id === nextPlayerId);
    let previousPlayerId = findPreviousPlayerId(gameParams.firstPlayerIdOnTurn, allPlayers);
if (currentPlayerId === gameParams.lastPlayerIdOnTurn) {
  return dealCardsOrFinishRound(nextPlayer, previousPlayerId);
  } else {
    adjustNextPlayer(nextPlayer[0], currentPlayer[0]);
    nextPlayerExceptions(nextPlayer[0]);
    if (nextPlayer[0].moneyToCall === 0) {
    document.querySelector(`.call_player${nextPlayer[0].id}`).disabled = true;
    document.querySelector(`.check_player${nextPlayer[0].id}`).disabled = false;
    document.querySelector(`.bet_player${nextPlayer[0].id}`).disabled = false;
    if (nextPlayer[0].totalCash < gameParams.smallBlindAmount*2) {
      document.querySelector(`.bet_player${nextPlayer[0].id}`).disabled = true;
    }
    document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled = true;
    } 
    if (document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled === false) {
      document.querySelector(`.player${nextPlayer[0].id}_bid`).setAttribute(`min`, `${gameParams.highestBet + gameParams.lastBetAmount}`);
    }
    if (document.querySelector(`.bet_player${nextPlayer[0].id}`).disabled === false) {
      document.querySelector(`.player${nextPlayer[0].id}_bid`).setAttribute(`min`, `${gameParams.smallBlindAmount*2}`);
    }
  }
  } 
}
  

    //  Check event - game parametars manipulation, enable and dissable next action, also DOM manipulation
  function onCheck() {

    let currentPlayerId = parseInt(event.target.className[event.target.className.length-1]);
    let currentPlayer = allPlayers.filter(player => player.id === currentPlayerId);
    if (event.target.className.includes("check")) {
      adjustCurrentPlayer(currentPlayer[0]);
      let nextPlayerId = findNextPlayerId(currentPlayerId, allPlayers);
      let nextPlayer = allPlayers.filter(player => player.id === nextPlayerId);
      let previousPlayerId = findPreviousPlayerId(gameParams.firstPlayerIdOnTurn, allPlayers);
      if (currentPlayerId === gameParams.lastPlayerIdOnTurn) {
        return dealCardsOrFinishRound(nextPlayer, previousPlayerId);
      } else {
        document.querySelector(`.call_player${nextPlayer[0].id}`).disabled = true;
        document.querySelector(`.fold_player${nextPlayer[0].id}`).disabled = false;
        document.querySelector(`.check_player${nextPlayer[0].id}`).disabled = false;
        document.querySelector(`.bet_player${nextPlayer[0].id}`).disabled = false;
        document.querySelector(`.leave_player${nextPlayer[0].id}`).disabled = false;
        if (nextPlayer[0].totalCash < gameParams.smallBlindAmount*2) {
          document.querySelector(`.bet_player${nextPlayer[0].id}`).disabled = true;
        }
        document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled = true;
        document.querySelector(`.allin_player${nextPlayer[0].id}`).disabled = false;
        document.querySelector(`.player_${nextPlayer[0].id}`).style.opacity = "1";
        if (document.querySelector(`.bet_player${nextPlayer[0].id}`).disabled === false) {
          document.querySelector(`.player${nextPlayer[0].id}_bid`).setAttribute(`min`, `${gameParams.smallBlindAmount*2}`);
        }
      }
    }
  }


  //  Raise event - game parametars manipulation, enable and dissable next action, also DOM manipulation
  function onRaise() {

    let currentPlayerId = parseInt(event.target.className[event.target.className.length-1]);
    let currentPlayer = allPlayers.filter(player => player.id === currentPlayerId);
    if (event.target.className.includes("raise") && parseInt(document.querySelector(`.player${currentPlayerId}_bid`).value) <= currentPlayer[0].totalCash
     && parseInt(document.querySelector(`.player${currentPlayerId}_bid`).value) >= gameParams.highestBet + gameParams.lastBetAmount) {
        gameParams.lastBetAmount = parseInt(document.querySelector(`.player${currentPlayerId}_bid`).value) - gameParams.highestBet;
        gameParams.highestBet = parseInt(document.querySelector(`.player${currentPlayerId}_bid`).value);
        currentPlayer[0].totalCash -= (gameParams.highestBet - currentPlayer[0].betPerTurn);
        currentPlayer[0].betPerRound += (gameParams.highestBet - currentPlayer[0].betPerTurn);  // If player already put bet or made call in the turn, 
        // that amount is added in other function. Here the difference is calculated and added to betPerRound
        gameParams.totalBets += (gameParams.highestBet - currentPlayer[0].betPerTurn);
        checkIfIntegerHTML(domClasses.totalBets, gameParams.totalBets);
        currentPlayer[0].betPerTurn = gameParams.highestBet; 
        adjustCurrentPlayer(currentPlayer[0]);
        if (currentPlayerId === gameParams.firstPlayerIdOnTurn && currentPlayer[0].totalCash === 0) {
          gameParams.firstPlayerIdOnTurn = findNextPlayerId(currentPlayerId, allPlayers);
        }
        let nextPlayerId = findNextPlayerId(currentPlayerId, allPlayers);
        let nextPlayer = allPlayers.filter(player => player.id === nextPlayerId);
        onBetOrRaiseAdjustNextPlayer(nextPlayer[0]);
        nextPlayerExceptions(nextPlayer[0]);
        gameParams.lastPlayerIdOnTurn = findPreviousPlayerId(currentPlayerId, allPlayers);
        if (document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled === false) {
          document.querySelector(`.player${nextPlayer[0].id}_bid`).setAttribute(`min`, `${gameParams.highestBet + gameParams.lastBetAmount}`);
        }
        }
      }
 
    
//  Bet event - game parametars manipulation, enable and dissable next action, also DOM manipulation
function onBet() {

  let currentPlayerId = parseInt(event.target.className[event.target.className.length-1]);
  let currentPlayer = allPlayers.filter(player => player.id === currentPlayerId);
  if (event.target.className.includes("bet") && parseInt(document.querySelector(`.player${currentPlayerId}_bid`).value) >= gameParams.smallBlindAmount*2
   && parseInt(document.querySelector(`.player${currentPlayerId}_bid`).value) <= currentPlayer[0].totalCash) {
    currentPlayer[0].betPerTurn = parseInt(document.querySelector(`.player${currentPlayerId}_bid`).value);
    gameParams.highestBet = currentPlayer[0].betPerTurn;
    currentPlayer[0].betPerRound += currentPlayer[0].betPerTurn;
    gameParams.totalBets += currentPlayer[0].betPerTurn;
    gameParams.lastBetAmount = currentPlayer[0].betPerTurn;
    currentPlayer[0].totalCash -= currentPlayer[0].betPerTurn;
    checkIfIntegerHTML(domClasses.totalBets, gameParams.totalBets);
    adjustCurrentPlayer(currentPlayer[0]); 
    if (currentPlayerId === gameParams.firstPlayerIdOnTurn && currentPlayer[0].totalCash === 0) {
      gameParams.firstPlayerIdOnTurn = findNextPlayerId(currentPlayerId, allPlayers);
    }
    let nextPlayerId = findNextPlayerId(currentPlayerId, allPlayers);
    let nextPlayer = allPlayers.filter(player => player.id === nextPlayerId);
    onBetOrRaiseAdjustNextPlayer(nextPlayer[0]);
    nextPlayerExceptions(nextPlayer[0]);
    gameParams.lastPlayerIdOnTurn = findPreviousPlayerId(currentPlayerId, allPlayers);
    if (document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled === false) {
      document.querySelector(`.player${nextPlayer[0].id}_bid`).setAttribute(`min`, `${gameParams.highestBet + gameParams.lastBetAmount}`);
    }
    }
  }


  //  All in event - game parametars manipulation, enable and dissable next action, also DOM manipulation
  // player can't go all in if he has total cash same as the amount he needs to call, it is a call
function onAllIn() {

  let currentPlayerId = parseInt(event.target.className[event.target.className.length-1]);
  let currentPlayer = allPlayers.filter(player => player.id === currentPlayerId);
  if (event.target.className.includes("allin")) {
    currentPlayer[0].betPerTurn += currentPlayer[0].totalCash;
    currentPlayer[0].betPerRound += currentPlayer[0].totalCash;
    if (currentPlayer[0].betPerTurn > gameParams.highestBet) {
      if (currentPlayer[0].betPerTurn >= gameParams.highestBet + gameParams.lastBetAmount) {
        gameParams.lastBetAmount = currentPlayer[0].betPerTurn - gameParams.highestBet;  
      }
      gameParams.highestBet = currentPlayer[0].betPerTurn;
    }
    gameParams.totalBets += currentPlayer[0].totalCash;
    checkIfIntegerHTML(domClasses.totalBets, gameParams.totalBets);
    currentPlayer[0].totalCash = 0;
    adjustCurrentPlayer(currentPlayer[0]); 
    if (currentPlayer[0].betPerTurn < gameParams.highestBet) {
      let isFinished = dealAllCards(currentPlayer[0]);
      if (isFinished) {
        return setTimeout(finishRound, 2000);
      }
    }
    if (currentPlayerId === gameParams.firstPlayerIdOnTurn) {
      gameParams.firstPlayerIdOnTurn = findNextPlayerId(currentPlayerId, allPlayers);
    }
    let nextPlayerId = findNextPlayerId(currentPlayerId, allPlayers);
    let nextPlayer = allPlayers.filter(player => player.id === nextPlayerId);
    let previousPlayerId = findPreviousPlayerId(gameParams.firstPlayerIdOnTurn, allPlayers);
    if (currentPlayer[0].betPerTurn === gameParams.highestBet) {
      onBetOrRaiseAdjustNextPlayer(nextPlayer[0]);
      nextPlayerExceptions(nextPlayer[0]);
      gameParams.lastPlayerIdOnTurn = findPreviousPlayerId(currentPlayerId, allPlayers);
    } else {
      if (currentPlayerId === gameParams.lastPlayerIdOnTurn) {
        return dealCardsOrFinishRound(nextPlayer, previousPlayerId);
      } else {
        adjustNextPlayer(nextPlayer[0], currentPlayer[0]);
        nextPlayerExceptions(nextPlayer[0]);
        if (nextPlayer[0].moneyToCall === 0) {  //first turn case when big blind can check if there was no raise
          document.querySelector(`.call_player${nextPlayer[0].id}`).disabled = true;
          document.querySelector(`.check_player${nextPlayer[0].id}`).disabled = false;
          document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled = false;
          document.querySelector(`.allin_player${nextPlayer[0].id}`).disabled = false;
        }
        if (document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled === false) {
          document.querySelector(`.player${nextPlayer[0].id}_bid`).setAttribute(`min`, `${gameParams.highestBet + gameParams.lastBetAmount}`);
        }
      }
      }
    }
  }


  //  Leave event - game parametars manipulation, enable and dissable next action, also DOM manipulation
  // player leaves the game and loses cash
function onLeave() {
  let currentPlayerId = parseInt(event.target.className[event.target.className.length-1]);
  let currentPlayer = allPlayers.filter(player => player.id === currentPlayerId);
  if (event.target.className.includes("leave")) {
    currentPlayer[0].totalCash = 0;
    currentPlayer[0].isActiveForResult = false;
    document.querySelector(`.player${currentPlayerId}`).innerHTML = ``;
    document.querySelector(`.player_${currentPlayerId}`).style.visibility = "hidden";
    currentPlayer[0].moneyToCall = 0;
    document.querySelector(`.player${currentPlayerId}_bid`).value = "";
    checkIfIntegerText(document.querySelector(`.player${currentPlayerId}_cash`), player.totalCash);
    document.querySelector(`.tocallplayer${currentPlayerId}`).innerText = "";
    let isFinished = dealAllCards(currentPlayer[0]);                  // deal all cards if only one player is able to bet
    if (isFinished) {
      return setTimeout(finishRound, 2000);
    }
      if (currentPlayerId === gameParams.firstPlayerIdOnTurn) {
        gameParams.firstPlayerIdOnTurn = findNextPlayerId(currentPlayerId, allPlayers); 
      }
    if (allPlayers.filter(player => player.isActiveForResult).length === 1) {              // Finish rounf if only one player is active for result
      return setTimeout(finishRound, 2000);
      }
    let nextPlayerId = findNextPlayerId(currentPlayerId, allPlayers);
    let nextPlayer = allPlayers.filter(player => player.id === nextPlayerId);
    let previousPlayerId = findPreviousPlayerId(gameParams.firstPlayerIdOnTurn, allPlayers);
if (currentPlayerId === gameParams.lastPlayerIdOnTurn) {
    return dealCardsOrFinishRound(nextPlayer, previousPlayerId);
  } else {
    adjustNextPlayer(nextPlayer[0], currentPlayer[0]);
    if (nextPlayer[0].moneyToCall === 0) {
    document.querySelector(`.call_player${nextPlayer[0].id}`).disabled = true;
    document.querySelector(`.check_player${nextPlayer[0].id}`).disabled = false;
    document.querySelector(`.bet_player${nextPlayer[0].id}`).disabled = false;
    document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled = true;
    } 
    nextPlayerExceptions(nextPlayer[0]); 
    if (document.querySelector(`.raise_player${nextPlayer[0].id}`).disabled === false) {
      document.querySelector(`.player${nextPlayer[0].id}_bid`).setAttribute(`min`, `${gameParams.highestBet + gameParams.lastBetAmount}`);
    }
    if (document.querySelector(`.bet_player${nextPlayer[0].id}`).disabled === false) {
      document.querySelector(`.player${nextPlayer[0].id}_bid`).setAttribute(`min`, `${gameParams.smallBlindAmount*2}`);
    }
  }
}
}


/// function that ends the round, invoke winner calculation and money transfer functions
/// starts the new round if it is more than 1 player active
function finishRound() {

  allPlayers.forEach(player => {
    document.querySelector(`.call_player${player.id}`).disabled = true;
    document.querySelector(`.fold_player${player.id}`).disabled = true;
    document.querySelector(`.check_player${player.id}`).disabled = true;
    document.querySelector(`.bet_player${player.id}`).disabled = true;
    document.querySelector(`.raise_player${player.id}`).disabled = true;
    document.querySelector(`.allin_player${player.id}`).disabled = true;
  })
  allPlayers.filter(player => player.isActiveForResult === true).forEach(player => {
    document.querySelector(`.player${player.id}`).style.opacity = "0.7";
  })
  if (allPlayers.filter(player => player.isActiveForResult === true).length === 1) {
    allPlayers.filter(player => player.isActiveForResult === true)[0].totalCash += gameParams.totalBets;
    let winner = allPlayers.filter(player => player.isActiveForResult === true)[0];
    checkIfIntegerText(document.querySelector(`.player${winner.id}_cash`), winner.totalCash);
    gameParams.totalBets = 0;
    checkIfIntegerHTML(domClasses.totalBets, gameParams.totalBets);
    document.querySelector(`.player_${winner.id}`).style.border = "5px solid black";
    document.querySelector(`.player_${winner.id}`).style.opacity = "1";
    if (allPlayers.filter(player => player.totalCash > 0).length < 2) {
      return setTimeout(newGame, 5000);
     } else {
       return setTimeout(newRound, 5000);
     }
  } else {
    calcPlayerPot(allPlayers);
    let activePlayers = allPlayers.filter(player => player.isActiveForResult === true);
    transferMoney(activePlayers);
    if (allPlayers.filter(player => player.totalCash > 0).length < 2) {
     return setTimeout(newGame, 5000);
    } else {
      return setTimeout(newRound, 5000);
    }
  }
}


 // 6. EVENT/ACTION HELPING FUNCTIONS

 // dissable actions and adjust properties for current player
 function adjustCurrentPlayer(player) {
  document.querySelector(`.call_player${player.id}`).disabled = true;
  document.querySelector(`.fold_player${player.id}`).disabled = true;
  document.querySelector(`.check_player${player.id}`).disabled = true;
  document.querySelector(`.bet_player${player.id}`).disabled = true;
  document.querySelector(`.raise_player${player.id}`).disabled = true;
  document.querySelector(`.allin_player${player.id}`).disabled = true;
  document.querySelector(`.leave_player${player.id}`).disabled = true;
  player.moneyToCall = 0;
  document.querySelector(`.player${player.id}_bid`).value = "";
  checkIfIntegerText(document.querySelector(`.player${player.id}_cash`), player.totalCash);
  document.querySelector(`.tocallplayer${player.id}`).innerText = "";
  document.querySelector(`.player_${player.id}`).style.opacity = "0.7";
}


// when turn is finished card(s) are dealth, next player is the first player on turn
// adjust the next player when current is the last one on turn.
function adjustFirstPlayer(player) {
  document.querySelector(`.call_player${player.id}`).disabled = true;
  document.querySelector(`.fold_player${player.id}`).disabled = false;
  document.querySelector(`.check_player${player.id}`).disabled = false;
  document.querySelector(`.bet_player${player.id}`).disabled = false;
  document.querySelector(`.leave_player${player.id}`).disabled = false;
  if (player.totalCash < gameParams.smallBlindAmount*2) {
    document.querySelector(`.bet_player${player.id}`).disabled = true;
  }
  document.querySelector(`.raise_player${player.id}`).disabled = true;
  document.querySelector(`.allin_player${player.id}`).disabled = false;
  document.querySelector(`.player_${player.id}`).style.opacity = "1";
  if (document.querySelector(`.bet_player${player.id}`).disabled === false) {
    document.querySelector(`.player${player.id}_bid`).setAttribute(`min`, `${gameParams.smallBlindAmount*2}`);
  }
}


// adjust the next player when current is not the last one. Used after call and fold
function adjustNextPlayer(player, curplayer) {
  document.querySelector(`.call_player${player.id}`).disabled = false;
  document.querySelector(`.fold_player${player.id}`).disabled = false;
  document.querySelector(`.check_player${player.id}`).disabled = true;
  document.querySelector(`.bet_player${player.id}`).disabled = true;
  document.querySelector(`.raise_player${player.id}`).disabled = false;
  document.querySelector(`.allin_player${player.id}`).disabled = false;
  document.querySelector(`.leave_player${player.id}`).disabled = false;
  if (curplayer.betPerTurn > 0 && gameParams.highestBet < gameParams.smallBlindAmount*2) {
    player.moneyToCall = gameParams.smallBlindAmount*2;
  } else {
    player.moneyToCall = gameParams.highestBet - player.betPerTurn;
  }
  document.querySelector(`.player_${player.id}`).style.opacity = "1";
  if (player.moneyToCall === 0) {
    document.querySelector(`.tocallplayer${player.id}`).innerText = ``;
   } else {
    checkIfIntegerText(document.querySelector(`.tocallplayer${player.id}`),  player.moneyToCall);
   }
}


// Set the actions and settings for next player after bet or raise
function onBetOrRaiseAdjustNextPlayer(nextplayer) {
  nextplayer.moneyToCall = gameParams.highestBet - nextplayer.betPerTurn;
  document.querySelector(`.player_${nextplayer.id}`).style.opacity = "1";
  checkIfIntegerText(document.querySelector(`.tocallplayer${nextplayer.id}`), nextplayer.moneyToCall);
  document.querySelector(`.call_player${nextplayer.id}`).disabled = false;
  document.querySelector(`.fold_player${nextplayer.id}`).disabled = false;
  document.querySelector(`.check_player${nextplayer.id}`).disabled = true;
  document.querySelector(`.bet_player${nextplayer.id}`).disabled = true;
  document.querySelector(`.raise_player${nextplayer.id}`).disabled = false;
  document.querySelector(`.allin_player${nextplayer.id}`).disabled = false;
  document.querySelector(`.leave_player${nextplayer.id}`).disabled = false;
}
  

// some exceptions of general rules for next players, complicated raise rule implemented
function nextPlayerExceptions(player) {

  if (player.totalCash < player.moneyToCall) {
    document.querySelector(`.call_player${player.id}`).disabled = true;
  }
  if (allPlayers.filter(player => player.totalCash > 0 && player.isActiveForResult === true).length === 1 && player.id === gameParams.lastPlayerIdOnTurn &&
   player.totalCash > gameParams.highestBet) {
    document.querySelector(`.allin_player${player.id}`).disabled = true;
   }
  if (player.totalCash < gameParams.highestBet + gameParams.lastBetAmount) {
    document.querySelector(`.raise_player${player.id}`).disabled = true;
  }
  
   if (gameParams.highestBet < gameParams.lastBetAmount + player.betPerTurn) {
    if (!(gameParams.cardsOnTable === 0 && (player.id === gameParams.smallBlindPlayerId || player.id === gameParams.bigBlindPlayerId))) {
      document.querySelector(`.raise_player${player.id}`).disabled = true;            
      if (player.totalCash >= player.moneyToCall && gameParams.highestBet !== 0) {
        document.querySelector(`.allin_player${player.id}`).disabled = true;
      }
    }
  }
  if (player.totalCash === player.moneyToCall) {
    document.querySelector(`.allin_player${player.id}`).disabled = true;
  }
}


 // Find the ID of the next player 
 function findNextPlayerId(currentPlayerId, players) {

  let nextPlayerId = currentPlayerId + 1;
  if (currentPlayerId === players.length) {
    nextPlayerId = 1;
  }
  let nextPlayer = players.filter(player => player.id === nextPlayerId);                 
  if (nextPlayer[0].totalCash === 0 || nextPlayer[0].isActiveForResult === false) {
    currentPlayerId = nextPlayerId;
    return findNextPlayerId(currentPlayerId, players);
  }
  return nextPlayerId;
}

// Find the ID of the previous player 
function findPreviousPlayerId(currentPlayerId, players) {

  let previousPlayerId = currentPlayerId - 1;
  if (currentPlayerId === 1) {
    previousPlayerId = players.length;
  }
  let previousPlayer = players.filter(player => player.id === previousPlayerId);
  if (previousPlayer[0].totalCash === 0 || previousPlayer[0].isActiveForResult === false) {
    currentPlayerId = previousPlayerId;
    return findPreviousPlayerId(currentPlayerId, players);
  }
  return previousPlayerId;
}


//decide how much cards will be displayed on table, finishes round when 5 cards are on table and sets the first player as next player because turn finished
function dealCardsOrFinishRound(nextplayer, previousid) {

  nextplayer = allPlayers.filter(player => player.id === gameParams.firstPlayerIdOnTurn);  // next player is now the player who starts the new turn
  nextPlayerId = nextplayer[0].id;
  adjustFirstPlayer(nextplayer[0]);
  gameParams.lastPlayerIdOnTurn = previousid;
  if (gameParams.cardsOnTable === 0) {
    while (gameParams.cardsOnTable < 3) {
      dealTableCard(allPlayers);
    }
  } else if (gameParams.cardsOnTable === 3 || gameParams.cardsOnTable === 4){
    dealTableCard(allPlayers);
  } else {
    document.querySelector(`.player_${nextPlayerId}`).style.opacity = "0.7";
    return finishRound();
  }
}


// situation when only one player is eligible to bet (play). All cards have to be dealth
function dealAllCards(cur) {

  if (gameParams.cardsOnTable === 0 && allPlayers.filter(player => player.isActiveForResult === true).length === 2 && 
  allPlayers.filter(player => player.isActiveForResult === true).filter(player => player.totalCash > 0).length < 2 && 
  allPlayers.map(player => player.id === gameParams.lastPlayerIdOnTurn).betPerTurn === gameParams.highestBet) {
    while (gameParams.cardsOnTable < 5) {                                        
      dealTableCard(allPlayers);                                                 
    }
    return true;
  } else {
    let filteredPlayers = allPlayers.filter(player => player.totalCash > 0 && player.isActiveForResult === true);
    if (filteredPlayers.length < 2 && cur.id === gameParams.lastPlayerIdOnTurn) {     
      while (gameParams.cardsOnTable < 5) {                                        
        dealTableCard(allPlayers);                                                 
      }
      return true;
    }
  }
}


// Sets 2point decimal number if it is not interger ---  for player
function checkIfIntegerText(doc, value) {

  if (Number.isInteger(value)) {
    doc.innerText = value;
  } else {
    doc.innerText = value.toFixed(2);
  }
}

// Sets 2point decimal number if it is not interger ---  for totalBets
function checkIfIntegerHTML(doc, value) {

  if (Number.isInteger(value)) {
    doc.innerHTML = value;
  } else {
    doc.innerHTML = value.toFixed(2);
  }
}


  /// 7. CALCULATE HANDS

  // Look for straight and if it finds puts the winning cards in array. Largest straight is considered! 
  function calcStraight(playersactive) {  
    
    let sortedList = playersactive.filter(player => player.playingCardsNums.sort((a, b) => b-a))
    sortedList.forEach(player => {
      player.winningCards = [];
      let newWinnerArray = [player.playingCardsNums[0]];
      for (let i = 1; i < player.playingCardsNums.length; i++) {
        if (player.playingCardsNums[i-1] - player.playingCardsNums[i] === 1) {
          newWinnerArray.push(player.playingCardsNums[i])
        }
         else {
           if (player.playingCardsNums[i-1] !== player.playingCardsNums[i]) {
            newWinnerArray = [player.playingCardsNums[i]]
           }
        }
        if (newWinnerArray.length === 5) {
          break;
        }
      }
      if (newWinnerArray.length === 4 && newWinnerArray[newWinnerArray.length-1] === 2 && player.playingCardsNums.includes(14)) {
        newWinnerArray.push(14); // Situation where we have straight of 5, 4, 3, 2, 1, --- 1 is coded as 14
      }
      if (newWinnerArray.length === 5) {
        player.winningCards = [...newWinnerArray];
      }
    })
    return sortedList.filter(player => player.winningCards.length === 5);
  }


    // Look for straight and also checks the color and if it finds puts the winning cards in array. Largest straight is considered! 
    function calcStraightFlush(playersactive) {

      let sortedList = playersactive.filter(player => player.playingCards.sort((a, b) => parseInt(b.split(" ")[0]) - parseInt(a.split(" ")[0])))
      sortedList.forEach(player => {
        player.winningCards = [];
        let newWinnerArray = [player.playingCards[0]];
        for (let i = 1; i < player.playingCards.length; i++) {
          if (parseInt(player.playingCards[i-1].split(" ")[0]) - parseInt(player.playingCards[i].split(" ")[0]) === 1 &&  
            newWinnerArray[newWinnerArray.length-1].split(" ")[1] === player.playingCards[i].split(" ")[1]) {
            newWinnerArray.push(player.playingCards[i])
          } else {
            if (parseInt(player.playingCards[i-1].split(" ")[0]) - parseInt(player.playingCards[i].split(" ")[0]) > 1) {
              newWinnerArray = [player.playingCards[i]];
            } 
            if (parseInt(player.playingCards[i-1].split(" ")[0]) === parseInt(player.playingCards[i].split(" ")[0])) {
              if (player.playingCards[i].split(" ")[1] === newWinnerArray[0].split(" ")[1]) {
                newWinnerArray.push(player.playingCards[i]);
              }
            }
          }
          if (newWinnerArray.length === 5) {
            break;
          }
        }
        if (newWinnerArray.length === 4 && newWinnerArray[newWinnerArray.length-1].split(" ")[0] === `2` 
      && player.playingCards.includes(`14 ${newWinnerArray[0].split(" ")[1]}`)) {
        newWinnerArray.push(`14 ${newWinnerArray[0].split(" ")[1]}`);   // Situation where we have straight od 5, 4, 3, 2, 1, --- 1 is coded as 14
      }
        if (newWinnerArray.length === 5) {
          let parsedArray = newWinnerArray.map(card => parseInt(card.split(" ")[0]))
          player.winningCards = [...parsedArray];
        }
      })
      return sortedList.filter(player => player.winningCards.length === 5);
    }
    

    // Look for Flush and if it finds puts the winning cards in array by descending order
    function calcFlush(playersactive) {

      let sortedList = playersactive.filter(player => player.playingCards.sort((a, b) => parseInt(b.split(" ")[0]) - parseInt(a.split(" ")[0])))
      sortedList.forEach(player => {
        player.winningCards = [];
        let newWinnerArray = [];
        for (let i = 0; i < player.playingCards.length; i++) {
          if (newWinnerArray.length === 5) {
           break;
          }
          newWinnerArray = [player.playingCards[i]];
          for (let j = i+1; j < player.playingCards.length; j++) {
            if (player.playingCards[i].split(" ")[1] === player.playingCards[j].split(" ")[1]) {
              newWinnerArray.push(player.playingCards[j])
            }
            if (newWinnerArray.length === 5) {
              break;
            }
          }
        }
        if (newWinnerArray.length === 5) {
        let parsedArray = newWinnerArray.map(card => parseInt(card.split(" ")[0]))
          player.winningCards = [...parsedArray];
        }
      }) 
      return sortedList.filter(player => player.winningCards.length === 5);
    }
  


    // This function takes the "number" parametar and if it is 3 looks for a fullhouse or if it is 2 looks for two pairs
    // If something is found puts the winning cards in array. In full house the three cards go first and then the two.
    // In two pairs, the highest remaining card is also put in the arrray as 5th card.  
  function calcFullOrTwoPairs(playersactive, number) {

    let sortedList = playersactive.filter(player => player.playingCardsNums.sort((a, b) => b-a))
    let newWinnerArray = [[], []];
    sortedList.forEach(player => {
      player.winningCards = [];
      newWinnerArray = [[], []];
      let cardsNeeded = number;
      let counter = 0;
      for (let i = 0; i < player.playingCardsNums.length; i++) {         
        if (newWinnerArray[1].length === 2) {
         break;
        }
        newWinnerArray[counter] = [];
         if (!newWinnerArray[0].includes(player.playingCardsNums[i])) {    
          newWinnerArray[counter].push(player.playingCardsNums[i]);          
        }
        for (let j = i+1; j < player.playingCardsNums.length; j++) {
          if (newWinnerArray[counter].includes(player.playingCardsNums[j])) {
            newWinnerArray[counter].push(player.playingCardsNums[j])
          }
          if (newWinnerArray[counter].length === cardsNeeded) {
            cardsNeeded = 2;
            counter ++;
            i = -1;
            break;
        }
          }
      }
      if (newWinnerArray[0].length === number && newWinnerArray[1].length === 2) {
        player.winningCards = [...newWinnerArray[0], ...newWinnerArray[1]];
      }
    })  
   
    calcRemainingHighCards(playersactive);
    return sortedList.filter(player => player.winningCards.length === 5);
  }



// This function takes the "number" parametar and if it is 4 looks for a poker, if it is 3 looks for three of a kind, 
// and if it is 2 look for a pair. Highest of the remaining cards are also put in the array until the length reaches 5
function calcSameKindCards(playersactive, number) {

  let sortedList = playersactive.filter(player => player.playingCardsNums.sort((a, b) => b-a))
  sortedList.forEach(player => {
    player.winningCards = [];
    let newWinnerArray = [];
    for (let i = 0; i < player.playingCardsNums.length; i++) {
      if (newWinnerArray.length === number) {
        break;
      }
      newWinnerArray.push(player.playingCardsNums[i]);
      for (let j = i+1; j < player.playingCardsNums.length; j++) {
        if (newWinnerArray.includes(player.playingCardsNums[j])) {
          newWinnerArray.push(player.playingCardsNums[j])
        }
      } 
       if (newWinnerArray.length !== number) {              
        newWinnerArray = [];
      }
    }
    player.winningCards = [...newWinnerArray];
  })
  calcRemainingHighCards(playersactive);
  return sortedList.filter(player => player.winningCards.length === 5);
}
  

  // This function calculates the high cards where there is no other result. It basically put the first 5 of 7
  // cards in array by descending order
  function calcHighCards(playersactive) {

    let sortedList = playersactive.filter(player => player.playingCardsNums.sort((a, b) => b-a))
    sortedList.forEach(player => {
      player.winningCards = [];
      player.playingCardsNums.filter(card => { 
        if (player.winningCards.length === 5) {
          return;
        }
        player.winningCards.push(card);
    })
    })
    return sortedList;
   }


 // Look for the highest of the remaining cards and put it in the array. It repeats the proccess until array length reaches 5
 // EX. if the result is three of a king it put the next 2 highest cards in the array 
 function calcRemainingHighCards(playersactive) {

   playersactive.forEach(player => {
     if (player.winningCards.length === 0) {
       return;
     }
     player.playingCardsNums.filter(card => { 
      if (player.winningCards.length === 5) {
        return;
      }
      if (!player.winningCards.includes(card)) {
        player.winningCards.push(card);
      }
     })  
     })
 }
  


 /// 8. CHECKING WINNERS

 // function that checks results. It starts from the strongest hand in poker and if finds result returns the winner/winners.
 // when nothing is found it continues all the way down until the high card option as a weekest option in poker
 function selectWinner(players) {
  
    let winners = straightDecider(players, calcStraightFlush);
    if (winners) {
      winners.filter(player => player.winningCards[0] === 14).forEach(player => player.winnerInfo = `ROYAL FLUSH`);
      winners.filter(player => player.winningCards[0] !== 14).forEach(player => player.winnerInfo = `STRAIGHT FLUSH`);
      return winners;
    }
    winners = pokerDecider(players);
    if (winners) {
      winners.forEach(player => player.winnerInfo = `POKER`);
      return winners;
    }
    winners = fullDecider(players);  
    if (winners) {
      winners.forEach(player => player.winnerInfo = `FULLHOUSE`);
      return winners;
    }
    winners = flushDecider(players);
    if (winners) {
      winners.forEach(player => player.winnerInfo = `FLUSH`);
      return winners;
    }
    winners = straightDecider(players, calcStraight);
    if (winners) {
      winners.forEach(player => player.winnerInfo = `STRAIGHT`);
      return winners;
    }
    winners = threeDecider(players);
    if (winners) {
      winners.forEach(player => player.winnerInfo = `THREE OF A KIND`);
      return winners;
    }
    winners = twoPairsDecider(players);
    if (winners) {
      winners.forEach(player => player.winnerInfo = `TWO PAIRS`);
      return winners;
    }
    winners = pairDecider(players);
    if (winners) {
      winners.forEach(player => player.winnerInfo = `PAIR`);
      return winners;
    }
    winners = highCardDecider(players);
      winners.forEach(player => player.winnerInfo = `HIGH CARD`);
      return winners;
  }
 


// Decider functions check which player has better hand if their result is equal. (same hand)
// EX. if two player have three of a kind, first checks which player has the stronger three of a kind
// if there is more than one, then looks for the next high card. If 5 cards are equal then players with those cards are returned as winners
function straightDecider(players, func) {
  
  let straightFlushPlayers = func(players);
  if (straightFlushPlayers.length === 0) {
    return;
  }
    let winnerPLayer = findNextHigherCard(straightFlushPlayers, 0);
    return winnerPLayer;
}


function flushDecider(players) {
  
  let flushPlayers = calcFlush(players);
  if (flushPlayers.length === 0) {
    return;
  }
    let winnerPlayer = findNextHigherCard(flushPlayers, 0);
    return winnerPlayer;
}


function pokerDecider(players) {
  
  let pokerPlayers = calcSameKindCards(players, 4);
  if (pokerPlayers.length === 0) {
    return;
  }
  let winnerPlayer = findNextHigherCard(pokerPlayers, 0);
  return winnerPlayer;
}



function fullDecider(players) {

  let fullPlayers = calcFullOrTwoPairs(players, 3);
  if (fullPlayers.length === 0) {
    return;
  }
  let winnerPlayer = findNextHigherCard(fullPlayers, 0);
  return winnerPlayer;
}


function twoPairsDecider(players) {

  let twoPairsPlayers = calcFullOrTwoPairs(players, 2);
  if (twoPairsPlayers.length === 0) {
    return;
  }
  let winnerPlayer = findNextHigherCard(twoPairsPlayers, 0);
  return winnerPlayer;
}



function threeDecider(players) {
  
  let threePlayers = calcSameKindCards(players, 3);
  if (threePlayers.length === 0) {
    return;
  }
  let winnerPlayer = findNextHigherCard(threePlayers, 0);
  return winnerPlayer;
}



function pairDecider(players) {
  
  let pairPlayers = calcSameKindCards(players, 2);
  if (pairPlayers.length === 0) {
    return;
  }
  let winnerPlayer = findNextHigherCard(pairPlayers, 0);
  return winnerPlayer;
}



function highCardDecider(players) {
  
  let highCardPlayers = calcHighCards(players);
  let winnerPlayer = findNextHigherCard(highCardPlayers, 0);
  return winnerPlayer;
}



// Helper function that compares the winning cards, looks for highest card starting from the first one
// because winning cards are already sorted. If it finds one player with highest card on specific index it returns that player
// if it doesn't find a single winner until index 4(5th card), it means there is more than one final winner
function findNextHigherCard(players, index) {

  let numbersChecked = []; 
  players.forEach(player => {
    numbersChecked.push(player.winningCards[index])
  })
  numbersChecked.sort((a, b) => b -a);
  if (index === 4) {
    let winner = players.filter(player => player.winningCards[index] === numbersChecked[0]).map(player => player);
    return winner;
  }
  let sortedPlayers = players.filter(player => player.winningCards[index] === numbersChecked[0]);
  if (sortedPlayers.length === 1) {
    let winner = players.filter(player => player.winningCards[index] === numbersChecked[0]).map(player => player);
    return winner;
  } else {
    return findNextHigherCard(sortedPlayers, index+1);
  }
}


/// 9. MONEY DISTRIBUTION

// winners collect money from first pot until their pot comes on turn. function is repeated if money are left on table 
// new winner is selected among players that have higher bets then the previous winner
 function transferMoney(playersAct) {

  let allPlayersSorted = allPlayers.sort((a, b) => a.betPerRound < b.betPerRound);
  while (gameParams.totalBets > 0) {
    let winners = selectWinner(playersAct);
domClasses.winnetText.innerText = `${winners[0].winnerInfo}`;
winners.forEach(player => {
  document.querySelector(`.player_${player.id}`).style.border = "none";
  document.querySelector(`.player_${player.id}`).style.border = "5px solid black";
  document.querySelector(`.player_${player.id}`).style.opacity = "1";
})
    let winnerToRemove = []; 
    let lastTotalBet = 0;
    let listOfWinnersIds = winners.map(player => player.id);
    for (let i = 0; i < allPlayersSorted.length; i++) {
      for (let j = 0; j < winners.length; j++) {
          winners[j].totalCash += allPlayersSorted[i].pot / winners.length;
          checkIfIntegerText(document.querySelector(`.player${winners[j].id}_cash`), winners[j].totalCash);        
          gameParams.totalBets -= allPlayersSorted[i].pot / winners.length;
          checkIfIntegerHTML(domClasses.totalBets, gameParams.totalBets);
          if (winners[j].id === allPlayersSorted[i].id) {
            winnerToRemove.push(winners[j])
          }
          lastTotalBet = winners[j].betPerRound;
      }
      if (winnerToRemove.length > 0) {
        winnerToRemove.forEach(player => {
          let index = winners.indexOf(player);
          if (index >= 0) {
            winners.splice(index, 1);
          }
        })
      }
      if (allPlayersSorted[i].betPerRound <= lastTotalBet) {
        allPlayersSorted[i].pot = 0;
      }   
    }
    let activePlayersLeft = [];
    playersAct.forEach(player => {
      if ((!listOfWinnersIds.includes(player.id)) && player.betPerRound > lastTotalBet) {   
        activePlayersLeft.push(player);
      }
    })
    playersAct = [...activePlayersLeft];
}
}


// pot is created for every player from the lowest to highest bet. 
// pot presents maximum amount that player can get if he is the winner
function calcPlayerPot(players) {

  let sortedBySmallestBet = players.sort((a, b) => a.betPerRound - b.betPerRound)
  sortedBySmallestBet[0].pot = sortedBySmallestBet[0].betPerRound * players.length;
  for (i = 1; i < sortedBySmallestBet.length; i++) {
    let filteredList = sortedBySmallestBet.filter(player => player.betPerRound >= sortedBySmallestBet[i].betPerRound);
      sortedBySmallestBet[i].pot = (sortedBySmallestBet[i].betPerRound - sortedBySmallestBet[i-1].betPerRound) * filteredList.length;
  }
}

