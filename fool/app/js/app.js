(function () {
    var app = angular.module("fool", []);

    app.controller('GameController', function () {
        this.gameStarted = false;
        this.playerTurn = true;

        this.player = new Player();
        this.enemy = new Enemy();
        this.cardSet = new CardSet();
        this.desk = new CardDesk();
        this.trump = '';
        this.showButton = true;
        this.selectedCard = false;
        this.selectedKey = false;

        this.trumpText = {
            hearts: 'Черва',
            diamonds: 'Бубна',
            clubs: 'Креста',
            spades: 'Пика'
        };

        this.buttonText = "Ход";
        this.statusText = 'Нажмите "Старт"';

        this.playerMoveCard = function ($event, cardKey, card) {
            if (!this.gameStarted) {
                return;
            }
            if (this.playerTurn) {
                if (this.desk.move(card)) {
                    this.player.cards.splice(cardKey, 1);
                    this.statusText = 'Нажмите "Ход" для завершения хода';
                    this.buttonText = 'Ход';
                    this.buttonAction = this.playerFinishMove;
                }
            } else {
                var cardElement = $($event.currentTarget);
                $('.selected-card').removeClass('selected-card');
                cardElement.addClass('selected-card');
                this.selectedCard = card;
                this.selectedKey = cardKey;
            }
        };

        this.playerStrike = function (key) {
            if(this.playerTurn) {
                return;
            }
            if(this.selectedCard === false || this.selectedKey === false) {
                return;
            }
            if(this.desk.strike(this.selectedCard, key, this.trump)) {
                this.player.cards.splice(this.selectedIndex, 1);
                this.finishTurn();
            }
            this.selectedIndex = false;
            this.selectedCard = false;
        };

        this.playerFinishMove = function () {
            if (!this.gameStarted) {
                return;
            }
            if (!this.playerTurn || !this.desk.cards.length) {
                return;
            }
            this.playerTurn = false;
            this.enemyStrike();
        };

        this.enemyStrike = function () {
            if (!this.gameStarted) {
                return;
            }
            this.enemy.strike(this.desk, this.trump);
            if (this.desk.checkTurnEnd()) {
                this.statusText = 'Отбился! Подкинешь?'
            } else {
                this.statusText = 'Беру! Подкинешь?'
            }
            this.buttonText = 'Завершить ход';
            this.playerTurn = true;
            this.buttonAction = this.finishTurn;
        };

        this.finishTurn = function () {
            if (this.playerTurn) {
                this.player.fillCards(this.cardSet);
                if (this.desk.checkTurnEnd()) {
                    this.playerTurn = false;
                    this.enemy.fillCards(this.cardSet);
                    this.buttonAction = this.finishTurn;
                    this.buttonText = 'Беру =(';
                    this.statusText = 'Бейся!';
                    this.desk.turnEnd();
                    this.enemy.move(this.desk, this.trump);
                } else {
                    this.enemy.addCard(this.desk.getAllCards());
                    this.desk.turnEnd();
                    this.buttonAction = this.playerFinishMove;
                    this.statusText = 'Нажмите "Ход" для завершения хода';
                    this.buttonText = 'Ход';
                }
            } else {
                $('.selected-card').removeClass('selected-card');
                this.selectedCard = false;
                this.selectedKey = false;
                this.enemy.fillCards(this.cardSet);
                if (this.desk.checkTurnEnd()) {
                    this.playerTurn = true;
                    this.player.fillCards(this.cardSet);
                    this.buttonAction = this.playerFinishMove;
                    this.statusText = 'Нажмите "Ход" для завершения хода';
                    this.buttonText = 'Ход';
                    this.desk.turnEnd();
                } else {
                    this.player.addCard(this.desk.getAllCards());
                    this.desk.turnEnd();
                    this.enemy.move(this.desk, this.trump);
                }
            }
            if(!this.enemy.cards.length) {
                this.statusText = 'Ты проиграл!';
                this.buttonAction = this.startNewGame;
                this.buttonText = 'Новая игра';
            } else if(!this.player.cards.length) {
                this.statusText = 'Ты выиграл!';
                this.buttonAction = this.startNewGame;
                this.buttonText = 'Новая игра';
            }
        };

        this.buttonAction = this.playerFinishMove;

        this.startNewGame = function () {
            this.gameStarted = true;
            this.playerTurn = true;
            this.desk.turnEnd();
            this.cardSet.generateCardSet();
            this.cardSet.shuffle();
            this.trump = this.cardSet.getTrump();
            this.player.cards = [];
            this.enemy.cards = [];
            this.player.fillCards(this.cardSet);
            this.enemy.fillCards(this.cardSet);
            this.statusText = 'Выберите карты для хода';
        };
    });
})();
