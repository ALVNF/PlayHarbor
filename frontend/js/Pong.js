class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.score1 = 0;
        this.score2 = 0;
        this.paddle1Hits = 0;
        this.paddle2Hits = 0;
        this.startTime = 0;
    }

    preload() {

    }

    create() {
       // Dibujar las líneas del campo
       let graphics = this.add.graphics();
       graphics.lineStyle(2, 0xffffff, 1);
       
       // Dibujar las líneas horizontales
       graphics.moveTo(0, 0);
       graphics.lineTo(this.sys.game.config.width, 0);
       graphics.moveTo(0, this.sys.game.config.height);
       graphics.lineTo(this.sys.game.config.width, this.sys.game.config.height);
       
       // Dibujar las líneas verticales para las porterías
       graphics.moveTo(0, 0);
       graphics.lineTo(0, this.sys.game.config.height);
       graphics.moveTo(this.sys.game.config.width, 0);
       graphics.lineTo(this.sys.game.config.width, this.sys.game.config.height);

       graphics.strokePath();

       // Crear la pelota más pequeña y de color blanco
       this.ball = this.physics.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'ball')
           .setCollideWorldBounds(true)
           .setBounce(1)
           .setDisplaySize(10, 10) // Tamaño más pequeño
           .setTint(0xffffff); // Color blanco
       
       // Crear las paletas más altas y estrechas y de color blanco
       this.paddle1 = this.physics.add.sprite(30, this.sys.game.config.height / 2, 'paddle1')
           .setImmovable(true)
           .setCollideWorldBounds(true)
           .setDisplaySize(10, 80) // Tamaño más alto y estrecho
           .setTint(0xffffff); // Color blanco

       this.paddle2 = this.physics.add.sprite(this.sys.game.config.width - 30, this.sys.game.config.height / 2, 'paddle2')
           .setImmovable(true)
           .setCollideWorldBounds(true)
           .setDisplaySize(10, 80) // Tamaño más alto y estrecho
           .setTint(0xffffff); // Color blanco

       // Añadir colisiones
       this.physics.add.collider(this.paddle1, this.ball);
       this.physics.add.collider(this.paddle2, this.ball);
       this.physics.world.setBounds(5, 5, this.sys.game.config.width - 10, this.sys.game.config.height - 10);
       this.ball.setCollideWorldBounds(true);
       this.ball.setBounce(1);

       // Añadir marcadores
       this.scoreText1 = this.add.text(this.sys.game.config.width * 0.25, 50, '0', { fontSize: '32px', fill: '#FFF' });
       this.scoreText2 = this.add.text(this.sys.game.config.width * 0.75, 50, '0', { fontSize: '32px', fill: '#FFF' });

       // Controles del jugador 1
       this.player1Up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
       this.player1Down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

       // Controles del jugador 2
       this.player2Up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
       this.player2Down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

       // Guardar el tiempo inicial
       this.startTime = Date.now();
       this.launchBall();
    }

    update() {
        // Controlar el movimiento de la paleta del jugador 1
        if (this.player1Up.isDown && this.paddle1.y > this.paddle1.displayHeight / 2) {
            this.paddle1.setVelocityY(-200);
        } else if (this.player1Down.isDown && this.paddle1.y < this.sys.game.config.height - this.paddle1.displayHeight / 2) {
            this.paddle1.setVelocityY(200);
        } else {
            this.paddle1.setVelocityY(0);
        }

        // Controlar el movimiento de la paleta del jugador 2
        if (this.player2Up.isDown && this.paddle2.y > this.paddle2.displayHeight / 2) {
            this.paddle2.setVelocityY(-200);
        } else if (this.player2Down.isDown && this.paddle2.y < this.sys.game.config.height - this.paddle2.displayHeight / 2) {
            this.paddle2.setVelocityY(200);
        } else {
            this.paddle2.setVelocityY(0);
        }

        // Verificar si la pelota ha pasado por donde están las paletas
    if (this.ball.x <= 30) { // Si la pelota pasa por la posición de la paleta izquierda
        this.score2++;
        this.scoreText2.setText(this.score2.toString());
        this.resetBall();
    } else if (this.ball.x >= this.sys.game.config.width - 30) { // Si la pelota pasa por la posición de la paleta derecha
        this.score1++;
        this.scoreText1.setText(this.score1.toString());
        this.resetBall();
    }

        // Finalizar el juego si algún jugador alcanza 10 puntos
        if (this.score1 >= 10 || this.score2 >= 10) {
            this.endGame();
        }
    }

    launchBall() {
        // Hacer que la pelota se mueva hacia el jugador 1 al principio
        this.ball.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height / 2);
        let velocityX = Phaser.Math.Between(-200, -100);
        let velocityY = Phaser.Math.Between(-200, 200);
        this.ball.setVelocity(velocityX, velocityY);
    }

    resetBall() {
        this.ball.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height / 2);
        this.launchBall();
    }

    endGame() {
        this.physics.pause();
        this.ball.setVelocity(0, 0);

        // Calcula el tiempo total de juego
        const totalTime = Date.now() - this.startTime;

        // Envía los datos al backend aquí
        this.sendGameData({
            score1: this.score1,
            score2: this.score2,
            paddle1Hits: this.paddle1Hits,
            paddle2Hits: this.paddle2Hits,
            totalTime: totalTime
        });

        // Muestra un mensaje de fin de juego
        let gameOverText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Game Over', { fontSize: '64px', fill: '#FFF' }).setOrigin(0.5);
    }

    sendGameData(data) {
        // Implementa la lógica para enviar los datos al backend aquí
        console.log('Data sent to server:', data);
        // Ejemplo:
        // fetch('/api/game-data', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // })
        // .then(response => response.json())
        // .then(data => console.log(data))
        // .catch((error) => console.error('Error:', error));
    }
}

const config = {
    type: Phaser.AUTO,
    // Dimensiones que se ajustan a tu diseño
    width: 1000, // Cambia según el ancho disponible
    height: 500, // Cambia según la altura disponible
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);

