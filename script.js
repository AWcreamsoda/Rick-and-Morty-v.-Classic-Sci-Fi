let player = {
    left: 330,
    top: 610
}
let enemies = [];
let portals = [];
let score = 0;
let level = 1;
let bossHealth = 100;

generateLevel();

setTimeout(function(){
    document.getElementById('background').load();
    document.getElementById('background').play();
}, 2000);

function drawPlayer() {
    let content = "<div class='player' style='left:" + player.left + "px; top:" + player.top + "px'></div>";
    document.getElementById('players').innerHTML = content;
}

function drawEnemies() {
    let content = "";
    for (let idx = 0; idx < enemies.length; idx++) {
        if (enemies[idx].boss !== true) {
            content += "<div class='enemy" + enemies[idx].ship + "' style='left:" + enemies[idx].left + "px; top:" + enemies[idx].top + "px; background-image: url(enemy" + enemies[idx].ship + ".png)'></div>";
        } else {
            content += "<div class='enemy" + enemies[idx].ship + "' id='boss' style='left:" + enemies[idx].left + "px; top:" + enemies[idx].top + "px; background-image: url(enemy" + enemies[idx].ship + ".png)'></div>";
        }
    }
    document.getElementById('enemies').innerHTML = content;
}

function moveEnemies() {
    for (let idx = 0; idx < enemies.length; idx++) {
        if (enemies[idx].top < 630) {
            if (enemies[idx].ship === 1) {
                enemies[idx].top += 2;
            }
            else if (enemies[idx].ship === 2) {
                enemies[idx].top += 1;
            }
        } else {
            enemies[idx].top = 0;
        }
    }
}

function firePortal() {
    portals.push({ left: player.left + 19, top: player.top - 45 })
}

function drawPortals() {
    let content = "";
    for (let n = portals.length - 1; n >= 0; n--) {
        if (portals[n].top < -30) {
            portals.splice(n, 1);
        }
    }
    for (let idx = 0; idx < portals.length; idx++) {
        content += "<div class='portal' style='left:" + portals[idx].left + "px; top:" + portals[idx].top + "px'></div>";
    }
    document.getElementById('portals').innerHTML = content;
    portals.forEach(x => {
        x.top -= 5;
    });
}

document.onkeydown = function (e) {
    if (e.keyCode == 37) { //left
        movePlayer('left');

    }
    else if (e.keyCode == 39) { //right
        movePlayer('right');
    }
    else if (e.keyCode == 40) { // down
        if (player.top < 660) {
            movePlayer('down');
        }
    }
    else if (e.keyCode == 38) { // up
        if (player.top > 430) {
            movePlayer('up');
        }
    }
    else if (e.keyCode == 32) { //spacebar
        firePortal();
    }
    else if (e.keyCode == 27) { //escape
        pauseGame();
    }
}

function movePlayer(direction) {
    if (direction === "left") {
        let num = 1;
        setInterval(function () {
            if (num < 51) {
                if (player.left > 10) {
                    player.left -= 1;
                }
                num++;
            } else {
                clearInterval(this);
            }
        }, 1);
    }
    else if (direction === "right") {
        let num = 1;
        setInterval(function () {
            if (num < 51) {
                if (player.left < 820) {
                    player.left += 1;
                }
                num++;
            } else {
                clearInterval(this);
            }
        }, 1);
    }
    else if (direction === "up") {
        let num = 1;
        setInterval(function () {
            if (num < 51) {
                if (player.top > 430) {
                    player.top -= 1;
                }
                num++;
            } else {
                clearInterval(this);
            }
        }, 1);
    }
    else if (direction === "down") {
        let num = 1;
        setInterval(function () {
            if (num < 51) {
                if (player.top < 660) {
                    player.top += 1;
                }
                num++;
            } else {
                clearInterval(this);
            }
        }, 1);
    }
}

let pauseStatus = false;
function pauseGame() {
    if (pauseStatus === false) {
        clearTimeout(startTime);
        pauseStatus = true;
        document.getElementById('pause').style.display = "block";
    }
    else if (pauseStatus === true) {
        pauseStatus = false;
        document.getElementById('pause').style.display = "none";
        gameLoop();
    }
}

function collisionCheck() {
    // checks for collision between enemy ships and player
    for (let enemy = enemies.length - 1; enemy >= 0; enemy--) {
        if ((player.top >= enemies[enemy].top - 45) && (player.top <= enemies[enemy].top + 55) && (player.left >= enemies[enemy].left - 75) && (player.left <= enemies[enemy].left + 60)) {
            gameOver();
        }
    }
    // checks for collision between portals and enemy ships
    for (let enemy = enemies.length - 1; enemy >= 0; enemy--) {
        if (enemies[enemy].boss !== true) {
            for (let idx = portals.length - 1; idx >= 0; idx--) {
                if ((portals[idx].top >= enemies[enemy].top - 50) && (portals[idx].top <= enemies[enemy].top + 30) && (portals[idx].left >= enemies[enemy].left - 30) && (portals[idx].left <= enemies[enemy].left + 60)) {
                    explodeShip(enemies[enemy].top, enemies[enemy].left);
                    if (enemies[enemy].ship === 1) {
                        score += 100;
                    }
                    else if (enemies[enemy].ship === 2) {
                        score += 50;
                    }
                    enemies.splice(enemy, 1);
                    portals.splice(idx, 1);
                    playSound();
                    break;
                }
            }
        } else {
            for (let idx = portals.length - 1; idx >= 0; idx--) {
                if ((portals[idx].top >= enemies[enemy].top - 28) && (portals[idx].top <= enemies[enemy].top + 223) && (portals[idx].left >= enemies[enemy].left + 175) && (portals[idx].left <= enemies[enemy].left + 630)) {
                    explodeShip(portals[idx].top, portals[idx].left);
                    playSound();
                    portals.splice(idx,1);
                    bossDamage();
                    score += 1000;
                    break;
                }
            }
        }
    }
}

function bossDamage() {
    bossHealth -= 1;
    document.getElementById('boss-health').style.width = (bossHealth * 2.4) + "px";
    document.getElementById('boss').style.filter = 'contrast(0%)';
    setTimeout(function(){
        document.getElementById('boss').style.filter = 'contrast(100%)';
    },400)
    if (bossHealth < 1) {
        for (let enemy = enemies.length - 1; enemy >= 0; enemy--) {
            if (enemies[enemy].boss === true) {
                enemies.splice(enemy, 1);
                clearInterval(bossInterval);
                document.getElementById('boss-music').pause();
                document.getElementById('background').muted = false;
                break;
            }
        }
    }
}

function playSound() {
    document.getElementById('boomer').load();
    document.getElementById('boomer').volume = 0.1;
    document.getElementById('boomer').play();
}

function explodeShip(top, left) {
    document.getElementById('boom').hidden = false;
    let content = "<div class='boom' style='left:" + left + "px; top:" + top + "px'></div>";
    document.getElementById('boom').innerHTML = content;
    setTimeout(function () {
        document.getElementById('boom').hidden = true;
    }, 1000)

}

function gameOver() {
    document.getElementById('gameover').style.display = "block";
        clearTimeout(startTime);
}

function updateScore() {
    document.getElementById('score').innerText = "Score: " + score + "";
    document.getElementById('level').innerText = "Level: " + level + "";
}



function levelUpdate() {    
    if (enemies.length === 0) {
        level += 1;
        generateLevel();
    }
}

function generateLevel() {
    if (level % 5 === 0) {
        document.getElementById('background').muted = true;
        document.getElementById('boss-music').load();
        document.getElementById('boss-music').play();
        enemies.push({
            left: 30,
            top: -325,
            ship: 3,
            boss: true
        });
        setTimeout(function () {
            document.getElementById('boss-health').hidden = false;
        }, 4000);
        let num = 0;
        setInterval(function() {
            if (num < 326) {
                enemies[0].top += 1;
                num++
            } else {
                clearInterval(this);
            }
        }, 10);

        setTimeout(function() {
            bossInterval = setInterval(function() {
                let left = Math.floor((Math.random() * 266) + 1) + 284;
                let top = Math.floor((Math.random() * 156) + 1) + 34;
                let ship = Math.floor((Math.random() * 2) + 1);
                enemies.push({
                    left: left,
                    top: top,
                    ship: ship
                });
            }, 1000);
        }, 4500);

    } else {
        let enemyNum = level + 5;
        for (let idx = 0; idx < enemyNum; idx++) {
            let left = Math.floor((Math.random() * 700) + 1) + 100;
            let top = Math.floor((Math.random() * 135) + 1) + 90;
            let ship = Math.floor((Math.random() * 2) + 1);
            enemies.push({
                left: left,
                top: top,
                ship: ship
            });
        }
    }
}

let startTime;
let bossInterval;
function gameLoop() {
    drawPlayer();
    drawEnemies();
    drawPortals();
    moveEnemies();
    collisionCheck();
    updateScore();
    levelUpdate();
    startTime = setTimeout(gameLoop, 10);
}
gameLoop();