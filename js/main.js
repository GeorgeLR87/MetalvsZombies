// Traer los Elementos del DOM (canvas).
const $canvas = document.querySelector("canvas");
const $button = document.querySelector("button")
const ctx = $canvas.getContext("2d");


//Variables  Globales.
let intervalId;
let frames = 0;
const friccion = 0.9;


// Definimos las clases.
class GameAsset {
    constructor(x, y, width, height, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = img;
        

    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}


class Board extends GameAsset {
    constructor(x, y, width, height, img) {
        super(x, y, width, height, img);
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}


class Character extends GameAsset {
    constructor(x, y, width, height, img) {
        super(x, y, width, height, img);
        this.move = 8;
        this.vx = 0;
        this.vy = 0;

    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

    moveUp() {
		this.y -= this.move;
	}
	moveDown() {
		this.y += this.move;
	}
	moveLeft() {
		this.x -= this.move;
	}
	moveRight() {
		this.x += this.move;
	}

}

// Instancias de las clases.

//se crea una constancia para cargar la imagen y que la instancia quede mas limpia.
const boardImage = "/img/1Background1.jpg"
const soldierImage = "/img/2Soldado1.png"
const zombieImage = "/img/3Zombie1.png"


const board = new Board(0, 0, $canvas.width, $canvas.height, boardImage);
const solider = new Character(200, $canvas.height / 2, 60, 60, soldierImage) 
 
// Funciones principales.
function start() {
    if(intervalId) return;
    intervalId = setInterval(() => {
            update();
    }, 1000/60)
}

function update() {
    //1Calcular el Estado
    frames++;
    

    //2clearCanvas();
    clearCanvas();


    //3Dibujas
    board.draw();
    solider.draw()
}




// Funciones del apoyo.
function clearCanvas(){
     ctx.clearRect(0, 0, $canvas.width, $canvas.height)
 }

// Funciones de interacción con el usuario.


document.onkeydown = (event) => {
    switch (event.key) {
        case "Enter":
            //Iniciamos el Juego
            start();
            break;
        case "ArrowUp":
            solider.moveUp();
            break;
        case "ArrowDown":
            solider.moveDown();
            break;
        case "ArrowLeft":
            solider.moveLeft();
            break;
        case "ArrowRight":
            solider.moveRight();
            break;

        default:
            break; 
          }
        };
    

//$button.onclick = start();