"use strict"

//Инициализируем все элементы из HTML
const startGame = document.querySelector('.start__game'),
		startButton = document.querySelector('.start__button'),
		gameContainer = document.querySelector('.game__container'),
		countSpan = document.querySelector('.count__span'),
		timer = document.querySelector('.game__time'),
		gameCards = document.querySelector('.game__cards'),
		stopGame = document.querySelector('.game__stop'),
		gameResult = document.querySelector('.game__result'),
		resultTime = document.querySelector('.result__time'),
		gameMusic = document.querySelector('.game__music');

//Инициализируем таймер, массив с готовыми рандомными картами, первой карточкой и второй соотвественно
let interval,
	cards,
	firstCard,
	lastCard,
	firstCardData,
	lastCardData;

//Инициализируем размер поля и кол-во карточек соответственно
let sizeField = 16;
let size = 8;

//Массив со всеми карточками
let cardsArray = [
	{name: 'Cherry', image:'Cherry.jpg'},
	{name: 'Dog', image: 'Dog.jpg'},
	{name: 'Dolphin', image: 'Dolphin.jpg'},
	{name: 'Fire', image: 'Fire.jpg'},
	{name: 'Globe', image: 'Globe.jpg'},
	{name: 'Lion', image: 'Lion.jpg'},
	{name: 'Lock1', image: 'Lock1.jpg'},
	{name: 'Party', image: 'Party.jpg'},
	{name: 'Piano', image: 'Piano.jpg'},
	{name: 'Present', image: 'Present.jpg'},
	{name: 'Sunflower', image: 'Sunflower.jpg'},
	{name: 'Target', image: 'Target.jpg'},
	{name: 'Tophat', image: 'Tophat.jpg'},
	{name: 'Umbrella', image: 'Umbrella.jpg'},
];

//Функция таймера
let seconds = 0;
let minutes = 0;

function timeGenerator() {
	seconds++;
	if(seconds >= 60) {
		minutes++;
		seconds = 0;
	}

let secondsInner = seconds < 10 ? `0${seconds}` : `${seconds}`;
let minutesInner = minutes > 10 ? `0${minutes}` : `${minutes}`;
timer.innerHTML = `<p>time <span>${minutesInner}</span>:<span>${secondsInner}</span></p>`;
}

//Счёт попыток
let counter = 0;
let resultCount = 0;
function gameCounter() {
	counter++;
	countSpan.innerHTML = counter;
	return counter;
}

//Функция для музыки
function musicGame() {
	gameMusic.innerHTML = `
		<audio class = "music__audio" autoplay loop preload="auto">
			<source src="audio/audio.mp3">
		</audio>
		`
	let audio = document.querySelector('.music__audio');
	audio.volume = 0.2;
}

//Событие click начало игры
startButton.addEventListener('click', startNewGame);

//Функция запуска игры
function startNewGame() {
	gameContainer.classList.remove('hide');
	startGame.classList.add('hide');
	interval = setInterval(timeGenerator, 1000);
	randomCards(size);
	musicGame();
}

//Создание массива с рандомными картинками
//size = количество карточек в игре
function randomCards (size) {
	//Временный массив
	let temporaryArray = [...cardsArray];
	//Отобранный массив
	let cardIndex = [];
	//cardIndex.push(temporaryArray[randomIndex]);
	for (let i = 0; (i < size) && (i < temporaryArray.length); i++) {
		let randomIndex = Math.floor(Math.random() * (temporaryArray.length - i) + i);
		let card = temporaryArray[randomIndex];
		temporaryArray[randomIndex] = temporaryArray[i];
		temporaryArray[i] = card;
		cardIndex.push(card);
	}
	//Очищаем временный массив
	temporaryArray.splice(0);
   return randomCardInner(cardIndex, sizeField)
}

//Перемешиваем и вносим в html все карточки
function randomCardInner (cardIndex, sizeField) {
	//1 карточка = 1 пара, поэтому копируем 2 раза
	cardIndex = [...cardIndex, ...cardIndex];
	//Перемешиваем рандомом
	cardIndex.sort(() => Math.random() - 0.5);
	//Вносим в html
	for (let i = 0; i < sizeField; i++) {
		gameCards.innerHTML += `
		<div class = "game__card item__${i}" data-name = "${cardIndex[i].name}">
			<div class = "card__before">?</div>
			<div class = "card__after"><img src="image/${cardIndex[i].image}" alt="photo"></div>
		</div>
		`
	}
	return gameLaunch(sizeField);
}

//Задаём логику игры
function gameLaunch (sizeField) {
	let gameCard = document.querySelectorAll('.game__card');
		gameCard.forEach(card => {
			card.addEventListener('click', () => {
				//Проверка на не отгаданную карту
				if (!card.classList.contains('completed')) {
					card.classList.add("flip");
				//Присваение первой карты и второй в случае, если первая выбрана
					if (!firstCard) {
						firstCard = card;
						firstCardData = card.getAttribute('data-name');
					} else {
						gameCounter();
						lastCard = card;
						lastCardData = card.getAttribute('data-name');
						gameCards.classList.add('completed');
						//Сравнение по Data-атрибуту карт
						if (firstCardData === lastCardData) {
							lastCard.classList.add('completed');
							firstCard.classList.add('completed');
							gameCards.classList.remove('completed');
							firstCard = '';
							lastCard = '';
							resultCount++;
								//Завершение игры
								if(resultCount == Math.floor(sizeField / 2)) {
									gameContainer.classList.add('hide');
									gameResult.classList.remove('hide');
									gameResult.innerHTML = `
										<div class = "result">
											<h2>score: ${counter}</h2>
											<h2>guessed cards: ${resultCount}</h2>
											<h2 class = "result__time">time: <span>${minutes}м</span> : <span>${seconds}с</span></h2>
											<button class = "game__restart">Restart Game</button>
										</div>
									`
									//Событие click на рестарт игры
									let gameRestart = document.querySelector('.game__restart');
									gameRestart.addEventListener('click', restartNowGame);
								}
						//Если карты не равны
						} else if (firstCardData !== lastCardData) {
							setTimeout( () => {
								lastCard.classList.remove('flip');
								firstCard.classList.remove('flip');
								firstCard = '';
								lastCard = '';
								gameCards.classList.remove('completed');
							}, 800);
						}
					}
				}	
			})
		})
}
//Событие click кнопки стоп
stopGame.addEventListener('click', stopFinishGame);

//Функция для кнопки стоп
function stopFinishGame() {
	gameContainer.classList.add('hide');
	gameCards.innerHTML = '';
	gameResult.innerHTML = '';
	gameResult.classList.remove('hide');
	gameResult.innerHTML = `
		<div class = "result">
			<h2>You've lost this game</h2>
			<h2>score: ${counter}</h2>
			<button class = "game__restart">Restart Game</button>
		</div>
	`
	//Событие click на рестарт
	let gameRestart = document.querySelector('.game__restart');
	gameRestart.addEventListener('click', restartNowGame);
}

//Функция для рестарта игры 
function restartNowGame() {
	gameMusic.innerHTML = '';
	gameCards.innerHTML = '';
	clearInterval(interval);
	countSpan.innerHTML = '0';
	seconds = 0;
	minutes = 0;
	resultCount = 0;
	counter = 0;
	timeGenerator();
	gameResult.classList.add('hide');
	gameContainer.classList.remove('hide');
	startNewGame();
}



