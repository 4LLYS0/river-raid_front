const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let fuel = 100; // Combustível inicial
let lives = 3;
let batX = canvas.width / 2 - 25; 
let batY = canvas.height - 60; 
const bullets = [];
const nets = []; 
const fuelTanks = []; // Para armazenar os tanques de combustível

const batWidth = 50; 
const batHeight = 50; 
const bulletSpeed = 5;
const netWidth = 30; 
const netHeight = 30; 
const fuelTankWidth = 30; 
const fuelTankHeight = 30; 
const fuelTankSpeed = 2; 

let gameActive = false; 
let netSpeed = 2; 

function drawBat() {
    ctx.font = "30px Arial"; 
    ctx.fillText("🦇", batX, batY + 0.1); 
}

function drawTeeth() {
    bullets.forEach((bullet, bulletIndex) => {
        ctx.fillStyle = 'purple'; // Altera a cor da bolinha para roxa
        ctx.fillRect(bullet.x, bullet.y, 10, 5); 
        bullet.y -= bulletSpeed; 

        if (bullet.y < 0) {
            bullets.splice(bulletIndex, 1);
        }
    });
}

function drawNets() {
    nets.forEach((net, netIndex) => {
        ctx.fillStyle = 'blue'; 
        ctx.fillText("🕸️", net.x, net.y); 
        net.y += netSpeed; 

        if (net.y > canvas.height) {
            nets.splice(netIndex, 1);
            score += 10; 
        }

        // Verificação de colisão (morcego sobre a rede)
        if (batX < net.x + netWidth &&
            batX + batWidth > net.x &&
            batY + batHeight > net.y && // O morcego deve estar acima da rede
            batY < net.y + netHeight) { // O morcego deve estar abaixo da rede
            // A colisão ocorre apenas quando o morcego está sobre a rede
            alert("Você encostou em uma rede! O jogo parou.");
            gameActive = false; 
            resetGame(); 
        }
    });
}

function drawFuelTanks() {
    fuelTanks.forEach((tank, tankIndex) => {
        ctx.fillStyle = 'red'; 
        ctx.fillText("🩸", tank.x, tank.y); 
        tank.y += fuelTankSpeed; 

        if (tank.y > canvas.height) {
            fuelTanks.splice(tankIndex, 1);
        }

        if (batX < tank.x + fuelTankWidth &&
            batX + batWidth > tank.x &&
            batY < tank.y + fuelTankHeight &&
            batY + batHeight > tank.y) {
            fuel = Math.min(fuel + 20, 100); 
            fuelTanks.splice(tankIndex, 1); 
        }
    });
}

function generateNets() {
    const netX = Math.random() * (canvas.width - netWidth);
    nets.push({ x: netX, y: -netHeight }); 
}

function generateFuelTanks() {
    const tankX = Math.random() * (canvas.width - fuelTankWidth);
    fuelTanks.push({ x: tankX, y: -fuelTankHeight }); 
}

function checkBulletCollision() {
    for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
        const bullet = bullets[bulletIndex];

        for (let netIndex = nets.length - 1; netIndex >= 0; netIndex--) {
            const net = nets[netIndex];

            // Verificação de colisão entre a bolinha roxa e a rede
            if (bullet.x < net.x + netWidth &&
                bullet.x + 10 > net.x && 
                bullet.y < net.y + netHeight &&
                bullet.y + 5 > net.y) {
                
                // Remove a rede e a bolinha
                nets.splice(netIndex, 1); 
                bullets.splice(bulletIndex, 1); 
                score += 20; 
                break; // Para evitar verificar mais de uma rede para a mesma bolinha
            }
        }
    }
}

function updateInfoDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('fuel').textContent = `${fuel.toFixed(1)}%`;
    document.getElementById('lives').textContent = lives;
}

function updateGame() {
    if (!gameActive) return; 

    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawBat(); 
    drawTeeth(); 
    drawNets(); 
    drawFuelTanks(); 

    checkBulletCollision(); 

    updateInfoDisplay();

    if (fuel > 0) {
        fuel -= 0.1; 
    } else {
        lives -= 1; 
        fuel = 100; 
        if (lives <= 0) {
            alert("Game Over!");
            resetGame();
        }
    }

    requestAnimationFrame(updateGame); 
}

function startGame() {
    gameActive = true; 
    score = 0; 
    fuel = 100; 
    lives = 3; 
    batX = canvas.width / 2 - 25; 
    batY = canvas.height - 60; 
    nets.length = 0; 
    fuelTanks.length = 0; 
    netSpeed = 2; 
    updateGame(); 
    setInterval(generateNets, 1000); 
    setInterval(generateFuelTanks, 1500); 
}

function resetGame() {
    gameActive = false; 
    score = 0; 
    fuel = 100; 
    lives = 3; 
    bullets.length = 0; 
    nets.length = 0; 
    fuelTanks.length = 0; 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    updateInfoDisplay(); 
}

// Controle do movimento do morcego
const batSpeed = 7; 
document.addEventListener('keydown', (event) => {
    if (event.key === 'a' && batX > 0) { // Move para a esquerda com 'A'
        batX -= batSpeed; 
    } else if (event.key === 'd' && batX < canvas.width - batWidth) { // Move para a direita com 'D'
        batX += batSpeed; 
    } else if (event.key === ' ') { // Atira com a barra de espaço
        bullets.push({ x: batX + batWidth / 2 - 5, y: batY }); 
    }
});

// Eventos de clique nos botões
document.getElementById('start').addEventListener('click', startGame);
document.getElementById('reset').addEventListener('click', resetGame);
