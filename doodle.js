// board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = (boardHeight * 7) / 8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
  img: undefined,
  x: doodlerX,
  y: doodlerY,
  width: doodlerWidth,
  height: doodlerHeight,
};

//physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

// plarforms
let platformsArray = [];
let platformWidth = 60;
let plaformHeight = 18;
let platformImg;

//score
let score = 0;
let maxScore = 0;

//game over
let gameOver;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //load image
  doodlerRightImg = new Image();
  doodlerRightImg.src = "./doodler-right.png";
  doodler.img = doodlerRightImg;

  doodlerRightImg.onload = function () {
    context.drawImage(
      doodler.img,
      doodler.x,
      doodler.y,
      doodler.width,
      doodler.height
    );
  };

  doodlerLeftImg = new Image();
  doodlerLeftImg.src = "./doodler-left.png";

  platformImg = new Image();
  platformImg.src = "./platform.png";

  velocityY = initialVelocityY;
  placePlatforms();
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveDoodler);
};

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  // update doodle location based on movement
  doodler.x += velocityX;

  // board movement wrapping
  if (doodler.x > boardWidth) {
    doodler.x = 0 - doodler.width;
  } else if (doodler.x + doodler.width < 0) {
    doodler.x = boardWidth;
  }

  // gravity
  velocityY += gravity;
  doodler.y += velocityY;

  //game over
  if (doodler.y > board.height) {
    gameOver = true;
    context.fillText(
      "Game Over: Press Spacebar to restart",
      boardWidth / 7,
      (boardHeight * 7) / 8
    );
  }

  // draw doodler
  context.drawImage(
    doodler.img,
    doodler.x,
    doodler.y,
    doodler.width,
    doodler.height
  );

  //platforms
  platformsArray.forEach((platform) => {
    if (velocityY < 0 && doodler.y < (boardHeight * 3) / 4) {
      platform.y -= initialVelocityY;
    }
    if (detectCollision(doodler, platform) && velocityY >= 0) {
      velocityY = initialVelocityY;
    }
    context.drawImage(
      platform.img,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
  });

  while (platformsArray.length > 0 && platformsArray[0].y > boardHeight) {
    platformsArray.shift();
    newPlatform();
  }

  updateScore();
  context.fillStyle = "black";
  context.font = "16px sans-serif";
  context.fillText(score, 5, 20);
}

function updateScore() {
  let points = 50;
  if (velocityY < 0) {
    maxScore += points;
    if (score < maxScore) {
      score = maxScore;
    }
  } else if (velocityY >= 0) {
    maxScore -= points;
  }
}

function moveDoodler(e) {
  if (e.code == "ArrowRight") {
    velocityX = 4;
    doodler.img = doodlerRightImg;
  } else if (e.code == "ArrowLeft") {
    velocityX = -4;
    doodler.img = doodlerLeftImg;
  } else if (e.code == "Space" && gameOver) {
    //restart
    doodler = {
      img: doodlerRightImg,
      x: doodlerX,
      y: doodlerY,
      width: doodlerWidth,
      height: doodlerHeight,
    };
    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
  }
}

function placePlatforms() {
  platformsArray = [];

  let platform = {
    img: platformImg,
    x: boardWidth / 2,
    y: boardHeight - 50,
    width: platformWidth,
    height: plaformHeight,
  };

  platformsArray.push(platform);

  for (let i = 0; i < 6; i++) {
    let randomX = Math.floor((Math.random() * boardWidth * 3) / 4);
    platform = {
      img: platformImg,
      x: randomX,
      y: boardHeight - 75 * i - 150,
      width: platformWidth,
      height: plaformHeight,
    };
    platformsArray.push(platform);
  }
}

function newPlatform() {
  let randomX = Math.floor((Math.random() * boardWidth * 3) / 4);
  platform = {
    img: platformImg,
    x: randomX,
    y: -plaformHeight,
    width: platformWidth,
    height: plaformHeight,
  };
  platformsArray.push(platform);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && // a top right doesn't reach b top right
    a.x + a.width > b.x && // a top right passes b top left corner
    a.y < b.y + b.height && // a top left doesnt reach b bottom left
    a.y + a.height > b.y // a bottom left passes b top left
  );
}
