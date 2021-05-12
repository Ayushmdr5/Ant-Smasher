var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = innerWidth - 10;
canvas.height = innerHeight - 10;

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var mouse = {
  x: 0,
  y: 0,
};

canvas.addEventListener("mousedown", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

canvas.addEventListener("resize", () => {
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  init();
});

canvas.addEventListener("mouseup", function () {
  mouse.x = -1;
  mouse.y = -1;
});

function Ant(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.mass = 1;

  this.velocity = {
    x: (Math.random() - 0.5) * 5,
    y: (Math.random() - 0.5) * 5,
  };

  this.update = function () {
    var actualX = this.x + this.radius / 2;
    var actualY = this.y + this.radius / 2;
    this.draw();
    for (var i = 0; i < antArray.length; i++) {
      if (this === antArray[i]) continue;
      if (
        getDistance(
          actualX,
          actualY,
          antArray[i].x + antArray[i].radius / 2,
          antArray[i].y + antArray[i].radius / 2
        ) -
          (this.radius + antArray[i].radius) / 2 <
        0
      ) {
        resolveCollision(this, antArray[i]);
      }
    }
    if (actualX - this.radius / 2 < 0 || this.x + this.radius > canvasWidth) {
      this.velocity.x = -this.velocity.x;
    }
    if (actualY - this.radius / 2 < 0 || this.y + this.radius > canvasHeight) {
      this.velocity.y = -this.velocity.y;
    }

    if (getDistance(mouse.x, mouse.y, actualX, actualY) < this.radius / 2) {
      kill(this);
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };

  this.draw = function () {
    var img = document.querySelector(".antImg");
    c.drawImage(img, this.x, this.y, this.radius, this.radius);
  };
}

let antArray;
function init() {
  antArray = [];

  for (let i = 0; i < 20; i++) {
    var radius = randomNumFromRange(40, 80);
    var x = randomNumFromRange(radius, canvasWidth - radius);
    var y = randomNumFromRange(radius, canvasHeight - radius);
    if (i !== 0) {
      for (var j = 0; j < antArray.length; j++) {
        if (
          getDistance(x, y, antArray[j].x, antArray[j].y) -
            (radius + antArray[j].radius) <
          0
        ) {
          var x = randomNumFromRange(radius, canvasWidth - radius);
          var y = randomNumFromRange(radius, canvasHeight - radius);
          j = -1;
        }
      }
    }
    antArray.push(new Ant(x, y, radius));
  }
}

function kill(ant) {
  var index = antArray.indexOf(ant);
  if (index > -1) {
    antArray.splice(index, 1);
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  antArray.forEach((ant) => {
    ant.update();
  });
}

init();
animate();

