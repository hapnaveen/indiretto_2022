var myGamePiece;

var clicks = 0;
var score;

const boat = 10;
const river = 0.15;

var canvas;
var canvasWidth;
var ctx;

function init() {
  canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");

    window.addEventListener("resize", resizeCanvas, false);
    window.addEventListener("orientationchange", resizeCanvas, false);
    this.canvas.width = window.innerWidth * 0.8;
    this.canvas.height = window.innerHeight * 0.6;
  }
}

var canvasWidth = window.innerWidth * 0.8;
var canvasHeight = window.innerHeight * 0.6;

function startGame() {
  myGameArea.start();
  myGamePiece = new component(
    canvasWidth / 4,
    canvasHeight / 3.5,
    "ship.png",
    canvasWidth / 40,
    canvasHeight / 1.5,
    "image"
  );
  myBackground = new component(
    8000,
    canvasHeight / 2.78,
    "river3.png",
    canvasWidth / 10,
    canvasHeight / 1.3,
    "background"
  );
  myBackground1 = new component(
    8000,
    canvasHeight / 2.78,
    "river2.png",
    canvasWidth / 10,
    canvasHeight / 1.3,
    "background"
  );
  myBackground2 = new component(
    8000,
    canvasHeight / 2.78,
    "river1.png",
    0,
    canvasHeight / 1.2,
    "background"
  );
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = window.innerWidth * 0.8;
    this.canvas.height = window.innerHeight * 0.6;
    this.context = this.canvas.getContext("2d");
    var list = document.getElementById("canvas");
    list.insertBefore(this.canvas, list.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    if (window.innerHeight > window.innerWidth) {
      alert("Please use Landscape mode for best experience !");
    }
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  },
};

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image" || type == "background") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.reverSpeed = river;
  this.boatSpeed = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;
    if (type == "image" || type == "background") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if (type == "background") {
        ctx.drawImage(
          this.image,
          this.x + this.width,
          this.y,
          this.width,
          this.height
        );
      }
    } else if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.type == "background") {
      if (this.x <= -this.width) {
        this.x = 0;
      }
    }
  };
}

function updateGameArea() {
  init();
  myGameArea.clear();

  myBackground.speedX = -1;
  myBackground.newPos();
  myBackground.update();
  myBackground1.speedX = -1.5;
  myBackground1.newPos();
  myBackground1.update();

  if (myGamePiece.x < 5 && myGamePiece.boatSpeed <= 0) {
    myGamePiece.x = 10;
    myGamePiece.reverSpeed = 0;
  } else {
    myGamePiece.reverSpeed = river;
  }

  if (myGamePiece.x >= canvasWidth / 1.25) {
    myGameArea.stop();
    score = parseInt((clicks / (canvasWidth / 1.25)) * 100);
    alert("Your score is " + score);
  }

  myGamePiece.x = myGamePiece.boatSpeed - myGamePiece.reverSpeed;
  myGamePiece.boatSpeed = myGamePiece.boatSpeed - myGamePiece.reverSpeed;

  myGamePiece.newPos();
  myGamePiece.update();

  myBackground2.speedX = -1.8;
  myBackground2.newPos();
  myBackground2.update();
}

function accelerate() {
  clicks++;
  myGamePiece.boatSpeed += boat;
}
