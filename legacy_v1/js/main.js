// Traer los Elementos del DOM (canvas).
const $canvas = document.querySelector("canvas");
const $button = document.querySelector(".button")
const $buttonReset = document.querySelector(".button-reset")
const ctx = $canvas.getContext("2d");

//Variables  Globales.
let intervalId;
let frames = 0;
const friction = 0.85; // Valor de la friccion
const keys = {}; //Objecto creado para guardar las teclas que se van presionando.
const zombies = []; // arreglo para los enemigos.
const zombieBoss = []; // arreglo para los enemigos.
const bullets = []; // arreglo para las balas.
const powers = [];// arreglo para los enemigos.
let lives = 3; //variable de las vidas.
let points = 0;//Variable Puntos


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
};

//3Clase de mi personaje
class Character extends GameAsset {
    constructor(x, y, width, height, img) {
        super(x, y, width, height, img);
        this.vx = 0;
        this.vy = 0;
    }

    draw() {
        this.x += this.vx;
        this.vx *= friction; //vamos a implementar la friccion eje horizontal

        this.y += this.vy;
        this.vy *= friction;  //vamos a implementar la friccion eje vertical

        if(this.y > $canvas.height - 78){ // Se delimito el area inferior en la que el soldado va a poder moverse
            this.y = $canvas.height- 78;
        }

        if(this.y < 5){ // Se delimito el area superio en la que el soldado va a poder moverse
            this.y = 5;
        }

        if(this.x > $canvas.width - 270){ // Se delimito el area trasera(izquierda) en la que el soldado va a poder moverse
            this.x = $canvas.width- 270;
        }

        if(this.x < 130){ // Se delimito el area delantera (derecha) en la que el soldado va a poder moverse
            this.x = 130;
        }

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

    moveUp() { // Metodo para moverse para arriba
        this.vy --;
	}

	moveDown() {  // Metodo para moverse para abajo
        this.vy ++;
	}

	moveLeft() { // Metodo para moverse para izquierda
        this.vx --;
	}

	moveRight() {  // Metodo para moverse para derecha
        this.vx ++;
	}

    stop() {  // Metodo para detener el personaje
        this.vx = 0;
        this.vy = 0;
    }

    isTouching(obstacle) { // codigo para generara coliciones
        return (
            this.x < obstacle.x + obstacle.width && // si toca con la parte derecha de nuestro obstaculo
            this.x + this.width > obstacle.x && // si toca con la parte izquierda de nuestro obstaculo
            this.y < obstacle.y + obstacle.height && // si toca con la parte inferior de nuestro obstaculo
            this.y + this.height > obstacle.y // si toca con la parte superior de nuestro obstaculo
        )
    }
}

//4Clase Bullet
class Bullet extends GameAsset {
    constructor(x, y, width, height, img) {
        super(x, y, width, height, img);
    }
    draw() {
        this.x ++;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    isTouching(obstacle) {
        return (
            this.x < obstacle.x + obstacle.width &&// si toca con la parte derecha de nuestro obstaculo
            this.x + this.width > obstacle.x && // si toca con la parte izquierda de nuestro obstaculo
            this.y < obstacle.y + obstacle.height && // si toca con la parte inferior de nuestro obstaculo
            this.y + this.height > obstacle.y // si toca con la parte superior de nuestro obstaculo
        )
    }
}

//5Clase Enemigos
class Zombie extends GameAsset {
    constructor(y, width, height, img) {
        super($canvas.width, y, width, height, img);
    }
    draw() {

        this.x--; //Para que salgan de la derecha hacia la izquierda

        if(this.y > $canvas.height - 78){ // Se delimito el area inferior en la que el soldado va a poder moverse
            this.y = $canvas.height- 78;
        }
        if(this.y < 5){ // Se delimito el area superio en la que el soldado va a poder moverse
            this.y = 5;
        }
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
};

//5Clase Poder
class Power extends GameAsset {
    constructor(x, y, width, height, img) {
        super(x, y, width, height, img);
    }
   draw() {
        if(this.y > $canvas.height - 78){ // Se delimito el area inferior en la que el soldado va a poder moverse
            this.y = $canvas.height- 78;
        }
        if(this.y < 5){ // Se delimito el area superio en la que el soldado va a poder moverse
           this.y = 5;
        }
        if(this.x > $canvas.width - 270){ // Se delimito el area trasera(izquierda) en la que el soldado va a poder moverse
            this.x = $canvas.width- 270;
        }
        if(this.x < 130){ // Se delimito el area delantera (derecha) en la que el soldado va a poder moverse
            this.x = 130;
        }
         ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
};

//6Clase Vidas
class Live extends GameAsset {
    constructor(x, y, width, height, img) {
        super(x, y, width, height, img);
    }
   draw() {

        if(lives === 5) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - 50, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - 100, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - 150, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - 200, this.y, this.width, this.height);
        }
        else if( lives === 4){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - 50, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - 100, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - 150, this.y, this.width, this.height);
        }
        else if( lives === 3){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - 50, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - 100, this.y, this.width, this.height);
        }
        else if( lives === 2){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - 50, this.y, this.width, this.height);

        }
        else if( lives === 1){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

    }

        livesText(){
            ctx.font = "50px Yuji Boku, serif";
            ctx.fillText("Lives: ",410,40);
            ctx.fillStyle = "Black"
        }
};

//6Clase Vidas
class Points extends GameAsset {
    constructor(x, y, width, height) {
        super(x, y, width, height, '');
    }
   draw() {

        ctx.fillText(points, 330, 40)
        ctx.font = "50px Yuji Boku, serif";
        ctx.fillText("Points: ",140,40);
        ctx.fillStyle = "Black"
    }
};


//se crea una constancia para cargar la imagen y que la instancia quede mas limpia.
const boardImage = "/img/1Background1.jpg";
const gameOverImage = "/img/13GameOver.png"
const winImage ="/img/15MissionWin.png"
const soldierImage = "/img/2Soldado1.png";
const bulletImage = "/img/4Bullet.png";
const zombieImage = "/img/3Zombie1.png";
const zombie2Image = "/img/8Zombie2.png";
const powerImage = "/img/5HongoPoder.png"
const liveImage = "/img/7Soldado2.png"

// Instancias de las clases.
const board = new Board(0, 0, $canvas.width, $canvas.height, boardImage); //Instancia de escenario
const gameOverBoard = new Board(0, 0, $canvas.width, $canvas.height, gameOverImage);
const winBoard = new Board(0, 0, $canvas.width, $canvas.height, winImage);
const solider = new Character(200, $canvas.height / 2, 70, 70, soldierImage); //Instancia de personaje
const live = new Live(750, 10, 30, 30, liveImage) //Instancia de live
const point = new Points() //Instancia de Puntos


// Funciones principales.
function start() {
    if(intervalId)return
    intervalId = setInterval(() => {
        update();
    }, 1000/60)
};


function update() {

    //1Calcular el Estado

    frames++;
    generateZombies();
    generateBossZombie()
    generatePowers();
    checkCollitions();
    checkKeys();

    //2Limpiar Canvas();
    clearCanvas();

    //3Dibujas
    board.draw();
    solider.draw();
    drawBullets();
    drawZombies();
    drawZombieBoss();
    drawPowers();
    live.draw();
    live.livesText()
    point.draw();
    gameOver();
    win();
}


// Funciones del apoyo.
function clearCanvas(){
     ctx.clearRect(0, 0, $canvas.width, $canvas.height)
 };

 // Funcion de apoyo para parametros aleatorios
 function random(parametro){
     return Math.floor(Math.random() * parametro );
};

// Funcion para instanciar de manera aleatoria los Zombies
 function generateZombies(){
    if (frames % 50 === 0) {
        const limitHeight = $canvas.height;
        //instancia de mi Enemigo
        const zombie1 = new Zombie(random(limitHeight), 70, 70, zombieImage);
        zombies.push(zombie1)
    }
 };

 function generateBossZombie(){
    if (frames % 400 === 0) {
      const limitHeight = $canvas.height;
      //instancia de mi Enemigo
      const zombie2 = new Zombie(random(limitHeight), 90, 90, zombie2Image);
      zombieBoss.push(zombie2);
    }
 };

 // Funcion para instanciar de manera aleatoria los Poderes
 function generatePowers(){
    if (frames % 1500 === 0) {
        const limitWidth = $canvas.width;
        const limitHeight = $canvas.height;
        //instancia de mi Poder
        const power = new Power(random(limitWidth), random(limitHeight), 20, 20,powerImage);
        powers.push(power)
    }
 };

 // funcion para checar las coliciones de los zombies, balas y poderes
 function checkCollitions(){
    // comprobación colisión zombies con soldados
    zombies.forEach(obs => {
         if (solider.isTouching(obs)){
           zombies.splice(0, 1)
          lives--;
       }
        else {
         gameOver()
       }
    })
    // comprobación colisión balas con zombies
    zombies.forEach(obs => {
        bullets.forEach(bull => {
            if(bull.isTouching(obs)){

                zombies.splice(0, 1);
                bullets.splice(0, 1);
                points++;
            }
        })
   })

   // comprobación colisión Boss con soldados
   zombieBoss.forEach(obs => {
    if (solider.isTouching(obs)){
      zombieBoss.splice(0, 1)
     lives--;
  }
   else {
    gameOver()
   }
})

// comprobación colisión balas con zombies
zombieBoss.forEach(obs => {
   bullets.forEach(bull => {
       if(bull.isTouching(obs)){

           zombieBoss.splice(0, 1);
           bullets.splice(0, 1);
           points++ ;
       }
   })
})

   // Comprobación Colisión Soldado Con poderes
   powers.forEach((obs) => {
     if (solider.isTouching(obs)) {
       powers.splice(0, 1);
       lives++;
     }
   });
 }

 // Funcion GameOver
 function win(){
    if(points === 25){
        clearInterval(intervalId);
        clearCanvas();
        winBoard.draw();
    }
}

// Funcion GameOver
 function gameOver(){
    if(lives === 0){
        clearInterval(intervalId);
        clearCanvas();
        gameOverBoard.draw();
    }

}
 // Funcion para imprimir la instancia aleatoria de los zombies
 function drawZombies(){
     zombies.forEach((zombie) => {
         zombie.draw()
     });
 }
 function drawZombieBoss(){
    zombieBoss.forEach((boss) => {
        boss.draw()
    });
}

 // Funcion auxiliar para pintar la bala
 function drawBullets(){
    bullets.forEach((bullet) => bullet.draw()); // un for each para recorrer el arreglo y mandar llamar su metedo de impresion por cada una de las balas
};

// Funcion para imprimir la instancia aleatoria de los poderes
 function drawPowers(){
    powers.forEach((power) => {
        power.draw()
    });
}


 //Funcion auxiliar para detectar las multiples teclas, esta verificando constantemente que teclas estan activas con el if
 function checkKeys(){
   
     if(keys.ArrowLeft) solider.moveLeft();
     if(keys.ArrowRight) solider.moveRight();
     if(keys.ArrowUp) solider.moveUp();
     if(keys.ArrowDown) solider.moveDown();

    //Codigo para imprimir balas si se deja precionada la tecla
     //  Vamos a definir la tecla que se va a utilizar para disparar (creacion de nuestra bala)
    // con el && vamos a limitar la cantidad de balas que vamos a imprimir por ejemplo cada que los frames tenga un multiplo de 16 es las veces que va a disparar
     if(keys.s && frames % 34 === 0) {
        //Instancia de mi bala
        const bullet = new Bullet(solider.x + 55, solider.y + 35 , 10, 10, bulletImage);
        // la vamos a ingresar en nuestro arreglo que ya habiamos creado.
        bullets.push(bullet);
   }
 }

 // Cuando alguien deje de precionar la tecla que se detenga

document.onkeyup = (event) => {
    
    keys[event.key] = false; //Si alguien deja de precionar la tecla vuelvela falso

    solider.stop(); //si se deja de precionar la tecla deneter el soldado
};


// Funciones de interacción con el usuario.
document.onkeydown = (event) => {
    event.preventDefault()
    //formula para detertar multiples tecalas al mismo tiempo (ej arriba izquierda)
    //aasignar a la propiedad del objeto keys una llave con el nombre de la tecla
    keys[event.key] = true
};

// Funcionalidad para el click de start
 $button.onclick = start;


 //Funcionalidad Reset
function buttonReset() {    
    window.location.reload();    
}



