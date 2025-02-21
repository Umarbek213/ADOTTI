const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

document.title = "Number Collision Game";

const WHITE = "#FFFFFF";
const BLUE = "#0000FF";
const GRAY = "#C8C8C8";

let playerSize = 50;
let playerX = canvas.width / 2 - playerSize / 2;
let playerY = canvas.height - playerSize - 20;
let playerSpeed = 7;
let playerNumber = 5;

let enemies = [];
function generateEnemy() {
    let number = Math.random() < 0.8 
        ? Math.floor(Math.random() * 15) + (playerNumber + 1) 
        : Math.floor(Math.random() * (playerNumber - 1)) + 1;
    return {
        x: Math.random() * (canvas.width - playerSize),
        y: Math.random() * -600 - 50,
        size: Math.random() * 30 + 30,
        speed: Math.random() * 4 + 4,
        number: number
    };
}
for (let i = 0; i < 12; i++) {
    enemies.push(generateEnemy());
}

let gameOver = false;
let paused = false;

document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        paused = !paused;
    }
});

function update() {
    if (!paused && !gameOver) {
        if (keys["ArrowLeft"] && playerX > 0) {
            playerX -= playerSpeed;
        }
        if (keys["ArrowRight"] && playerX < canvas.width - playerSize) {
            playerX += playerSpeed;
        }

        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            enemy.y += enemy.speed;
            if (enemy.y > canvas.height) {
                enemies[i] = generateEnemy();
            }
            if (
                Math.abs(playerX - enemy.x) < enemy.size &&
                Math.abs(playerY - enemy.y) < enemy.size
            ) {
                if (enemy.number > playerNumber) {
                    gameOver = true;
                } else {
                    playerNumber += enemy.number;
                    enemies[i] = generateEnemy();
                }
            }
        }
    }
}

let keys = {};
document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});
document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

function draw() {
    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = BLUE;
    ctx.fillRect(playerX, playerY, playerSize, playerSize);
    
    ctx.fillStyle = GRAY;
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    });
    
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
