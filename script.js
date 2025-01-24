// draw background with night vibes

const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Helper function to draw a rectangle for "pixels"
function drawPixel(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

// Flood fill algorithm for the background
function floodFill(x, y, size, getColor) {
  const stack = [[x, y]];
  const visited = new Set();

  while (stack.length) {
    const [currentX, currentY] = stack.pop();
    const key = `${currentX},${currentY}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const color = getColor(currentX, currentY);
    if (color) drawPixel(currentX, currentY, size, color);

    const neighbors = [
      [currentX - size, currentY],
      [currentX + size, currentY],
      [currentX, currentY - size],
      [currentX, currentY + size],
    ];

    for (const [nx, ny] of neighbors) {
      if (
        nx >= 0 &&
        nx < canvas.width &&
        ny >= 0 &&
        ny < canvas.height &&
        !visited.has(`${nx},${ny}`)
      ) {
        stack.push([nx, ny]);
      }
    }
  }
}

// Background color function for a black sky
function blackSkyColor() {
  return "#000000"; // Black background for the night sky
}

// Moon drawing
function drawMoon(x, y, radius, size) {
  floodFill(x, y, size, (px, py) => {
    const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
    if (distance <= radius) {
      const intensity = 1 - distance / radius;
      return `rgba(255, 255, 200, ${intensity})`;
    }
    return null;
  });
}

// Star drawing
function drawStar(x, y, size) {
  drawPixel(x, y, size, "white");
}

// Pixelated birds
function drawBird(x, y, size) {
  const birdPattern = [
    [0, 1],
    [1, 0],
    [2, 1],
  ];
  birdPattern.forEach(([dx, dy]) => {
    drawPixel(x + dx * size, y + dy * size, size, "#FFFFFF"); // White birds
  });
}

// Main draw function
function draw() {
  const pixelSize = 2;

  // Fill the background with black sky
  floodFill(0, 0, pixelSize, blackSkyColor);

  // Draw the moon
  drawMoon(canvas.width * 0.8, canvas.height * 0.2, 80, pixelSize);

  // Draw stars
  for (let i = 0; i < 30; i++) {
    const starX = Math.random() * canvas.width;
    const starY = Math.random() * canvas.height * 0.4;
    drawStar(starX, starY, pixelSize);
  }

  // Draw birds
  const birdPositions = [
    [100, 150],
    [200, 100],
    [300, 120],
    [400, 140],
    [500, 90],
  ];
  birdPositions.forEach(([x, y]) => drawBird(x, y, pixelSize));
}

draw();

// play opennning mario classic
// const audio = document.getElementById("mario");
// document.addEventListener("click", () => {
//   audio.play();
// });

window.onload = () => {
  setTimeout(() => {
    document.querySelector(".blur").classList.remove("hidden");
  }, 1000);

  function playGame() {
    // display highscore
    const highscore = localStorage.getItem("highScore") || 0;
    document.querySelector(
      "#highScore"
    ).textContent = `High Score : ${highscore}`;
    // load sounds
    let coinSound = new Audio("./sounds/coin-sound.mp3");
    let budgieSound = new Audio("./sounds/budgie-sound.mp3");
    let natureSound = new Audio("./sounds/nature-sound.mp3");
    let chillMusic = new Audio("./sounds/chill-music.mp3");
    let gameOverSound = new Audio("./sounds/budgie-game-over-sound.mp3");

    // create canvas and setup
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    let canvasSize = 1000;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // player, size, position
    let playerSize = 150;
    let x = canvasSize / 2 - playerSize / 2;
    let y = canvasSize / 2 - playerSize / 2;
    let player = new Image();
    player.src = "./images/mario.png";

    // player speed
    let t = Date.now();
    let speed = 500;

    // coin, size, position
    let coinSize = 50;
    let coinX = Math.random() * (canvasSize - coinSize);
    let coinY = Math.random() * (canvasSize - coinSize);
    let coin = new Image();
    coin.src = "./images/coin.gif";

    // score
    let score = 0;
    const displayScore = document.getElementById("displayScore");
    displayScore.innerHTML = "Score: " + score;

    // play sound first time player eats coin
    if (score > 0 && score < 2) {
      budgieSound.play();

      natureSound.loop = true;
      natureSound.play();
      chillMusic.loop = true;
      chillMusic.play();
    }

    budgieSound.play();

    natureSound.loop = true;
    natureSound.play();
    chillMusic.loop = true;
    chillMusic.play();

    //////// HANDLE USER INPUT FOR PLAYER DIRECTION ////////
    let direction = "stop";
    const up = document.getElementById("up");
    const down = document.getElementById("down");
    const left = document.getElementById("left");
    const right = document.getElementById("right");

    document.addEventListener("swiped-up", function (e) {
      e.preventDefault();
      direction = "up";
    });
    document.addEventListener("swiped-down", function (e) {
      e.preventDefault();
      direction = "down";
    });
    document.addEventListener("swiped-left", function (e) {
      e.preventDefault();
      direction = "left";
    });
    document.addEventListener("swiped-right", function (e) {
      e.preventDefault();
      direction = "right";
    });

    // handle physical wasd and arrow keys input
    document.addEventListener("keydown", (e) => {
      e = e || window.event;

      if (e.keyCode == "38" || e.keyCode == "87") {
        direction = "up";
      } else if (e.keyCode == "40" || e.keyCode == "83") {
        direction = "down";
      } else if (e.keyCode == "37" || e.keyCode == "65") {
        direction = "left";
      } else if (e.keyCode == "39" || e.keyCode == "68") {
        direction = "right";
      }
    });
    // document.addEventListener('keyup', () => {
    //     direction = 'stop'
    // })

    function draw() {
      // fps calculation
      var timePassed = (Date.now() - t) / 1000;
      t = Date.now();
      var fps = Math.round(1 / timePassed);

      // clear screen at the start of game loop
      context.clearRect(0, 0, canvasSize, canvasSize);

      // draw player
      context.beginPath();
      context.drawImage(player, x, y, playerSize, playerSize);

      // draw
      context.fill();

      // draw coin
      context.beginPath();
      context.drawImage(coin, coinX, coinY, coinSize, coinSize);
      // context.rect(coinX, coinY, coinSize, coinSize)
      // context.fillStyle = 'yellow'
      // context.fill()

      // bind movement speed relative to frame rate
      if (direction == "right") {
        if (x + playerSize < canvasSize) {
          x += speed * timePassed;
        }
      } else if (direction == "left") {
        if (x > 0) {
          x -= speed * timePassed;
        }
      } else if (direction == "down") {
        if (y + playerSize < canvasSize) {
          y += speed * timePassed;
        }
      } else if (direction == "up") {
        if (y > 0) {
          y -= speed * timePassed;
        }
      }

      // player and coin collision detection and score update
      if (
        coinX <= x + playerSize &&
        x <= coinX + coinSize &&
        coinY <= y + playerSize &&
        y <= coinY + coinSize
      ) {
        // score + 1
        score++;

        // // play sound first time player eats coin
        // if (score >= 0 && score < 2) {
        //     budgieSound.play()

        //     natureSound.loop = true
        //     natureSound.play()
        //     chillMusic.loop = true
        //     chillMusic.play()
        // }

        // increase game speed
        speed = speed + score / 8;
        // display score
        displayScore.innerHTML = "Score: " + score;
        // play sound
        coinSound.play();
        // relocate new coin
        coinX = Math.random() * (canvasSize - coinSize);
        coinY = Math.random() * (canvasSize - coinSize);
      }

      // GAME OVER HANDLING
      const gameOver = document.getElementById("gameOver");
      gameOver.style.display = "none";

      function stuffToDoWhenGameOver() {
        // clear canvas
        context.clearRect(0, 0, canvasSize, canvasSize);
        const highScore = localStorage.getItem("highScore") || 0;
        console.log(highScore);
        if (score > +highScore) localStorage.setItem("highScore", score);
        console.log(+highScore);
        document.querySelector("#highScore").textContent = `High score: ${
          score > +highScore ? score : highScore
        }`;
        // display game over
        gameOver.style.display = "flex";
        // play bugie game over sound
        gameOverSound.play();
        // stop background sounds
        natureSound.pause();
        chillMusic.pause();
      }

      // player walls collision detection
      if (x + playerSize > canvasSize) {
        stuffToDoWhenGameOver();
        return;
      } else if (x < 0) {
        stuffToDoWhenGameOver();
        return;
      } else if (y + playerSize > canvasSize) {
        stuffToDoWhenGameOver();
        return;
      } else if (y < 0) {
        stuffToDoWhenGameOver();
        return;
      }

      // RUN GAME LOOP (setInterval alternative)
      window.requestAnimationFrame(draw);
    }

    draw();
  }

  // PLAY GAME BUTTON
  const playButton = document.getElementById("play");
  playButton.addEventListener("click", () => {
    // audio.pause();
    document.querySelector(".canvas-container").classList.remove("hidden");
    document.querySelector(".main").classList.add("hidden");
    playGame();
  });

  const replay = document.getElementById("replay");
  replay.addEventListener("click", () => {
    playGame();
  });

  const main = document.getElementById("menu");
  main.addEventListener("click", () => {
    // audio.play();
    document.querySelector(".canvas-container").classList.add("hidden");
    document.querySelector(".main").classList.remove("hidden");
  });

  // play game on when user clicks enter/return on keyboard
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      playGame();
    }
  });
};
