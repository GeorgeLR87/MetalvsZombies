// Traer los Elementos del DOM (canvas).
const $canvas = document.querySelector("canvas");
const $button = document.querySelector(".button")
const ctx = $canvas.getContext("2d");


//Variables  Globales.
let intervalId;
let frames = 0;
// Valor de la friccion
const friction = 0.85;
//Objecto creado para guardar las teclas que se van presionando
const keys = {};
// arreglo para los enemigos
const zombies = [];
// arreglo para los enemigos
const zombieBoss = [];
// arreglo para las balas
const bullets = [];
// arreglo para los enemigos
const powers = [];
//variable de las vidas
let lives = 3;
// const lives = [];

const livesoldier = [];
//Variable Puntos
let points = 0;



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
        //vamos a implementar la friccion eje horizontal
        this.vx *= friction;

        this.y += this.vy;
        //vamos a implementar la friccion eje vertical
        this.vy *= friction;

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

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
    // Metodo para moverse para arriba
    moveUp() {
        this.vy --;
	}
    // Metodo para moverse para abajo
	moveDown() {
        this.vy ++;
	}
    // Metodo para moverse para izquierda
	moveLeft() {
        this.vx --;
	}
    // Metodo para moverse para derecha
	moveRight() {
        this.vx ++;
	}
    // Metodo para detener el personaje
    stop(){
        this.vx = 0;
        this.vy = 0;
    }
    // codigo para generara coliciones
    isTouching(obstacle) {
        return (
            // si toca con la parte derecha de nuestro obstaculo
            this.x < obstacle.x + obstacle.width &&
            // si toca con la parte izquierda de nuestro obstaculo
            this.x + this.width > obstacle.x &&
            // si toca con la parte inferior de nuestro obstaculo
            this.y < obstacle.y + obstacle.height &&
            // si toca con la parte superior de nuestro obstaculo
            this.y + this.height > obstacle.y
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
            // si toca con la parte derecha de nuestro obstaculo
            this.x < obstacle.x + obstacle.width &&
            // si toca con la parte izquierda de nuestro obstaculo
            this.x + this.width > obstacle.x &&
            // si toca con la parte inferior de nuestro obstaculo
            this.y < obstacle.y + obstacle.height &&
            // si toca con la parte superior de nuestro obstaculo
            this.y + this.height > obstacle.y
        )
    }
}

//5Clase Enemigos
class Zombie extends GameAsset {
    constructor(y, width, height, img) {
        super($canvas.width, y, width, height, img);
    }
    draw() {
        //Para que salgan de la derecha hacia la izquierda
        this.x--;
        // Se delimito el area inferior en la que el soldado va a poder moverse
        if(this.y > $canvas.height - 78){
            this.y = $canvas.height- 78;
        }
        // Se delimito el area superio en la que el soldado va a poder moverse
        if(this.y < 5){
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
       //Para que caigan
       //this.y++;

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
};

//6Clase Vidas
class Points extends GameAsset {
    constructor(x, y, width, height) {
        super(x, y, width, height, '');
    }
   draw() {
        ctx.fillText(points, 460, 20) 
    }
};




// Instancias de las clases.

//se crea una constancia para cargar la imagen y que la instancia quede mas limpia.
const boardImage = "/img/1Background1.jpg";
const soldierImage = "/img/2Soldado1.png";
const bulletImage = "/img/4Bullet.png";
const zombieImage = "/img/3Zombie1.png";
const zombie2Image = "/img/8Zombie2.png";
const powerImage = "/img/5HongoPoder.png"
const liveImage = "/img/7Soldado2.png"

//Instancia de escenario
const board = new Board(0, 0, $canvas.width, $canvas.height, boardImage);
//Instancia de personaje
const solider = new Character(200, $canvas.height / 2, 70, 70, soldierImage);
//Instancia de live
const live = new Live(750, 10, 30, 30, liveImage)
//Instancia de Puntos
const point = new Points()



// Funciones principales.
function start() {
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
    gameOver();
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
    point.draw();

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
        zombieBoss.push(zombie2)
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

           (points++) ;
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
 function gameOver(){
    if(lives === 0){
        clearInterval(intervalId);
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
    // un for each para recorrer el arreglo y mandar llamar su metedo de impresion por cada una de las balas
    bullets.forEach((bullet) => bullet.draw());
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
    /* if(keys.s && frames % 40 === 0) {
        //Instancia de mi bala
        const bullet = new Bullet(solider.x + 55, solider.y + 35 , 10, 10, bulletImage);
        // la vamos a ingresar en nuestro arreglo que ya habiamos creado.
        bullets.push(bullet);
   } */
 }

 // Cuando alguien deje de precionar la tecla que se detenga

document.onkeyup = (event) => {
    //Si alguien deja de precionar la tecla vuelvela falso
    keys[event.key] = false;
    //si se deja de precionar la tecla deneter el soldado
    solider.stop();
};



// Funciones de interacción con el usuario.
document.onkeydown = (event) => {
    //formula para detertar multiples tecalas al mismo tiempo (ej arriba izquierda)
    //aasignar a la propiedad del objeto keys una llave con el nombre de la tecla
    keys[event.key] = true

    //Codigo para imprimir balas cada vez que se precione la tecla e
    // se va poner el meteodo para las balas en esta zona para que suceda cada que se preciona la tecla e y no se generen si se deja precionado.
     if(event.key === "s") {
        const bullet = new Bullet(solider.x + 55, solider.y + 35 , 10, 10, bulletImage);
        // la vamos a ingresar en nuestro arreglo que ya habiamos creado.
        bullets.push(bullet);
    } 
};


 $button.onclick = start();

// $button.addEventListener ("click",event => {
//     start();
// })