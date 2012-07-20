function createArena() {
    var arena = document.getElementById("arena"),
        index = WIDTH * HEIGHT,
        div;
        
    while (index-- > 0) {
        div = document.createElement("div");
        arena.appendChild(div);
    }
    paintSnake();
}

function paintSnake() {
    var tiles = document.getElementById("arena").children;
    tiles[snake.head].className = "head";
    snake.tail.forEach(function (tailIndex) {
        tiles[tailIndex].className = "tail";
    });
    if (snake.dead != -1) {
        tile[snake.dead].className = "";
    }
}

function Snake(width, height, length) {
    var startingIndex = (height / 2) * width,
        tail = [];

    this.head = startingIndex + length;
    this.dead = -1;
    while (--length > 0) {
        tail.push(startingIndex + length)
    }
    this.tail = tail;
}

var WIDTH = 40,
    HEIGHT = 20,
    snake = new Snake(WIDTH, HEIGHT, 5);

