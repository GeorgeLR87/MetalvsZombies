// Traer los Elementos del DOM (canvas).
const $canvas = document.querySelector("canvas");
const $button = document.querySelector("button")
const ctx = $canvas.getContext("2d");


//Variables  Globales.
let intervalId;
let frames = 0;
// const friction = 1.09;


// Definimos las clases.
//1Clase Global
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



//2 Clase de mi escenario
class Board extends GameAsset {
    constructor(x, y, width, height, img) {
        super(x, y, width, height, img);
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

//3Clase de mi personaje 
class Character extends GameAsset {
    constructor(x, y, width, height, img) {
        super(x, y, width, height, img);
         //se utiuliza con el primer metedo para mover las funciones checar si se quita o se queda
        this.move = 15;
        this.vx = 0;
        this.vy = 0;

    }

    draw() {
        // Se delimito el area inferior en la que el soldado va a poder moverse    
        if(this.y > $canvas.height - 78){
            this.y = $canvas.height- 78;
        }
        // Se delimito el area superio en la que el soldado va a poder moverse    
        if(this.y < 5){
            this.y = 5;
        }
        // Se delimito el area trasera(izquierda) en la que el soldado va a poder moverse    
        if(this.x > $canvas.width - 270){
            this.x = $canvas.width- 270;
        }
        // Se delimito el area delantera (derecha) en la que el soldado va a poder moverse    
        if(this.x < 130){
            this.x = 130;
        }

        //this.x += this.vx;
        //vamos a implementar la friccion eje horizontal
        //this.vx *= friction;
        //vamos a implementar la friccion eje vertical
        //this.y += this.vy;
        //this.vy *= friction;

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
    // Metodo para moverse para arriba
    moveUp() {
        // this.move = 15; se utiuliza con el primer metedo para mover las funciones checar si se quita o se queda
		this.y -= this.move;
        //this.vy --;
	}
    // Metodo para moverse para abajo
	moveDown() {
        // this.move = 15; se utiuliza con el primer metedo para mover las funciones checar si se quita o se queda
		this.y += this.move;
        //this.vy ++;
	}
    // Metodo para moverse para izquierda
	moveLeft() {
        // this.move = 15; se utiuliza con el primer metedo para mover las funciones checar si se quita o se queda
		this.x -= this.move;
        //this.vx --;
	}
    // Metodo para moverse para derecha
	moveRight() {
        // this.move = 15; se utiuliza con el primer metedo para mover las funciones checar si se quita o se queda
		this.x += this.move;
        //this.vx ++;
	}

    /* stop(){
        this.vx = 0;
        this.vy = 0;
    } */

}

// Instancias de las clases.

//se crea una constancia para cargar la imagen y que la instancia quede mas limpia.
const boardImage = "/img/1Background1.jpg"
const soldierImage = "/img/2Soldado1.png"
const zombieImage = "/img/3Zombie1.png"

//Instancia de escenario
const board = new Board(0, 0, $canvas.width, $canvas.height, boardImage);
//Instancia de mi personaje
const solider = new Character(200, $canvas.height / 2, 60, 60, soldierImage); 
 
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
    

    //2Limpiar Canvas();
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
        //Iniciamos el Juego precionando la tecla enter
        case "Enter":            
            start();
            break;
        //Funcionalidad de la tecla arriba
        case "ArrowUp":
            solider.moveUp();
            break;
        //Funcionalidad de la tecla abajo
        case "ArrowDown":
            solider.moveDown();
            break;
        //Funcionalidad de la tecla izquierda
        case "ArrowLeft":
            solider.moveLeft();
            break;
        //Funcionalidad de la tecla derecha
        case "ArrowRight":
            solider.moveRight();
            break;

        default:
            break; 
          }
        };
    

//$button.onclick = start();


// Cuando alguien deje de precionar la tecla que se detenga 

/* document.onkeyup = () => {
    solider.stop();
}; */