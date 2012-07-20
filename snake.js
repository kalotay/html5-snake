function createArena() {
    var arena = document.getElementById("arena"),
        index = WIDTH * HEIGHT,
        div;
        
    while (index-- > 0) {
        div = document.createElement("div");
        arena.appendChild(div);
    }
    snake.paint();
    window.setInterval(snake.moveAndRepaint.bind(snake), 100);
}

function Snake(width, height, length) {
    var startingIndex = (height / 2) * width,
        tail = [];

    this.head = startingIndex + length;
    this.dead = -1;
    this.mover = moveRight;
    while (--length > 0) {
        tail.push(startingIndex + length)
    }
    this.tail = tail;
}

Snake.prototype.paint = function paintSnake() {
    var tiles = document.getElementById("arena").children;
    tiles[this.head].className = "head";
    this.tail.forEach(function (tailIndex) {
        tiles[tailIndex].className = "tail";
    });
    if (this.dead != -1) {
        tiles[this.dead].className = "";
    }
};

Snake.prototype.move = function moveSnake() {
    this.dead = this.tail.pop();
    this.tail.unshift(this.head);
    this.head = this.mover(this.head);
};

Snake.prototype.moveAndRepaint = function moveAndRepaintSnake() {
    this.move();
    this.paint();
};

function moveRight(snakeHead) {
    return (snakeHead + 1) % (WIDTH * HEIGHT);
};

var WIDTH = 40,
    HEIGHT = 20,
    snake = new Snake(WIDTH, HEIGHT, 5);

