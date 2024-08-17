// Board dimensions
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird properties
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// Pipes properties
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Additional objects: clouds and coins
let cloudArray = [];
let cloudWidth = 128;
let cloudHeight = 64;
let cloudImg;

let coinArray = [];
let coinWidth = 32;
let coinHeight = 32;
let coinImg;

// Physics properties
let velocityX = -1; // Decrease pipe, cloud, and coin speed
let velocityY = 0;
let gravity = 0.2; // Decrease gravity

let gameOver = false;
let score = 0;

window.onload = function () {
  // Initialize board and context
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // Load bird image
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  // Load pipe images
  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";
  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  // Load cloud and coin images
  cloudImg = new Image();
  cloudImg.src = "./cloud.png";
  coinImg = new Image();
  coinImg.src = "./coin.png";

  // Start the game loop and object placements
  requestAnimationFrame(update);
  setInterval(placePipes, 3000); // Place pipes every 3 seconds
  setInterval(placeClouds, 4000); // Place clouds every 4 seconds
  setInterval(placeCoins, 5000); // Place coins every 5 seconds
  document.addEventListener("keydown", moveBird);
  document.addEventListener("click", moveBird); // Bird moves on click
};

// Game update loop
function update() {
  requestAnimationFrame(update);
  if (gameOver) return;

  context.clearRect(0, 0, board.width, board.height);

  // Update bird position
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // Game over condition if bird falls off screen
  if (bird.y > board.height) gameOver = true;

  // Update pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    // Increase score when the bird passes pipes
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    // Detect collision between bird and pipe
    if (detectCollision(bird, pipe)) gameOver = true;
  }

  // Update clouds
  for (let i = 0; i < cloudArray.length; i++) {
    let cloud = cloudArray[i];
    cloud.x += velocityX;
    context.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
  }

  // Update coins
  for (let i = 0; i < coinArray.length; i++) {
    let coin = coinArray[i];
    coin.x += velocityX;
    context.drawImage(coin.img, coin.x, coin.y, coin.width, coin.height);

    // Increase score and remove coin when bird collects it
    if (detectCollision(bird, coin)) {
      score += 1;
      coinArray.splice(i, 1);
      i--;
    }
  }

  // Remove off-screen pipes, clouds, and coins
  pipeArray = pipeArray.filter((pipe) => pipe.x > -pipeWidth);
  cloudArray = cloudArray.filter((cloud) => cloud.x > -cloudWidth);
  coinArray = coinArray.filter((coin) => coin.x > -coinWidth);

  // Display score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  // Display game over message
  if (gameOver) context.fillText("GAME OVER", 5, 90);
}

// Place pipes function
function placePipes() {
  if (gameOver) return;

  // Randomize pipe height
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 3; // Space between top and bottom pipes

  // Top pipe
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  // Bottom pipe
  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

// Place clouds function
function placeClouds() {
  if (gameOver) return;

  // Random cloud position
  let randomCloudY = Math.random() * (board.height / 2);

  let cloud = {
    img: cloudImg,
    x: boardWidth,
    y: randomCloudY,
    width: cloudWidth,
    height: cloudHeight,
  };
  cloudArray.push(cloud);
}

// Place coins function
function placeCoins() {
  if (gameOver) return;

  // Random coin position
  let randomCoinY = Math.random() * (board.height / 2);

  let coin = {
    img: coinImg,
    x: boardWidth,
    y: randomCoinY,
    width: coinWidth,
    height: coinHeight,
  };
  coinArray.push(coin);
}

// Move bird function (on click or key press)
function moveBird(e) {
  if (
    e.type === "click" ||
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "KeyX"
  ) {
    velocityY = -4; // Decrease the jump height

    // Restart game if game is over
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      cloudArray = [];
      coinArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

// Collision detection function
function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
