function createArena() {
    var arena = document.getElementById("arena"),
        index = WIDTH * HEIGHT,
        div;
        
    while (index-- > 0) {
        div = document.createElement("div");
        arena.appendChild(div);
    }
    snake.paint();
    window.onkeydown = onKeyDown;
    window.setInterval(snake.moveAndRepaint.bind(snake), 200);
}

function Snake(width, height, length, mover) {
    var startingIndex = (height / 2) * width,
        tail = [];

    this.head = startingIndex + length;
    this.dead = -1;
    this.mover = mover;
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
    this.head = this.mover.mover(this.head);
};

Snake.prototype.moveAndRepaint = function moveAndRepaintSnake() {
    this.move();
    this.paint();
};

function indexToRowCol(index) {
    var column = index % WIDTH,
        row = (index - column) / WIDTH;

    return {
        "column": column,
        "row": row
    };
}

function mod(lhs, rhs) {
    var result = lhs % rhs;
    if (result < 0) {
        result = rhs + result;
    }
    return result;
}

function rowColToIndex(row, column) {
    return row * WIDTH + column;
}

function moveRight(snakeHead) {
    var rowCol = indexToRowCol(snakeHead);
    return rowColToIndex(rowCol.row, mod((rowCol.column + 1), WIDTH));
}

function moveLeft(snakeHead) {
    var rowCol = indexToRowCol(snakeHead);
    return rowColToIndex(rowCol.row, mod((rowCol.column - 1), WIDTH));
}

function moveUp(snakeHead) {
    var rowCol = indexToRowCol(snakeHead);
    return rowColToIndex(mod((rowCol.row - 1), HEIGHT), rowCol.column);
}

function moveDown(snakeHead) {
    var rowCol = indexToRowCol(snakeHead);
    return rowColToIndex(mod((rowCol.row + 1), HEIGHT), rowCol.column);
}

function onKeyDown(keyEvent) {
    var key = keyTable[keyEvent.keyCode],
        currentMover = snake.mover;

    if (key === currentMover.opposite) {
        return;
    }
    snake.mover = movers[key];
}

var WIDTH = 40,
    HEIGHT = 20,
    movers = {
        "up": {
            "mover": moveUp,
            "opposite": "down"
        },
        "down": {
            "mover": moveDown,
            "opposite": "up"
        },
        "left": {
            "mover": moveLeft,
            "opposite": "right"
        },
        "right": {
            "mover": moveRight,
            "opposite": "left"
        }
    },
    snake = new Snake(WIDTH, HEIGHT, 5, movers.right),
    keyTable = {
        "37": "left",
        "38": "up",
        "39": "right",
        "40": "down"
    };
