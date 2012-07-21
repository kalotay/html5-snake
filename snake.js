Snake = {};
Snake.init = function (width, height) {
    var moves = new Snake.Moves(width, height),
        snake = new Snake.Snake(5, [4, 3, 2, 1], "right"),
        arena = Snake.createArena(width, height),
        intervalId;

    Snake.paintSnake(snake);
    window.onkeydown = Snake.makeKeyDownListener(snake);
    arena.addEventListener("died", function() {
        window.clearInterval(intervalId);
    });
    intervalId = window.setInterval(Snake.moveAndRepaintSnake, 200, snake, moves);
};

Snake.reset = function(snake) {
    var arena = document.getElementById("arena");

    snake.trail = snake.trail.concat(snake.tail);
    snake.trail.push(snake.head);
    snake.direction = "right";
    snake.tail = [4, 3, 2, 1];
    snake.head = 5;
    Snake.paintSnake(snake);
};

Snake.createArena = function (width, height) {
    var arena = document.getElementById("arena"),
        index = width * height,
        div;

    while (index-- > 0) {
        div = document.createElement("div");
        arena.appendChild(div);
    }
    return arena;
};

Snake.Snake = function (head, tail, direction) {
    this.head = head;
    this.trail = [];
    this.direction = direction;
    this.tail = tail;
    this.length = tail.length;
};

Snake.paintSnake = function (snake) {
    var tiles = document.getElementById("arena").children;
    function changeClass(index, className) {
        tiles[index].className = className;
    }
    changeClass(snake.head, "head");
    snake.tail.forEach(function (tailIndex) {
        changeClass(tailIndex, "tail");
    });
    snake.trail.forEach(function (trailIndex) {
        changeClass(trailIndex, "trail");
    });
};

Snake.moveSnake = function (snake, moves) {
    var move = moves[snake.direction],
        head = snake.head,
        tail = snake.tail;

    if (snake.length <= tail.length) {
        snake.trail = [tail.pop()];
    }
    tail.unshift(head);
    snake.head = move(head);
    if (tail.indexOf(snake.head) !== -1) {
        document.getElementById("arena").dispatchEvent(new CustomEvent("died"));
    }
};

Snake.moveAndRepaintSnake = function (snake, moves) {
    Snake.moveSnake(snake, moves);
    Snake.paintSnake(snake);
};

Snake.mod = function (lhs, rhs) {
    var result = lhs % rhs;

    if (result < 0) {
        result = rhs + result;
    }
    return result;
};

Snake.Moves = function (width, height) {
    function indexToRowCol(index) {
        var column = index % width,
            row = (index - column) / width;

        return {
            "column": column,
            "row": row
        };
    }

    function rowColToIndex(row, column) {
        return row * width + column;
    }

    this.right = function moveRight(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(rowCol.row, Snake.mod((rowCol.column + 1), width));
    };

    this.left = function moveLeft(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(rowCol.row, Snake.mod((rowCol.column - 1), width));
    };

    this.up = function moveUp(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(Snake.mod((rowCol.row - 1), height), rowCol.column);
    };

    this.down = function moveDown(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(Snake.mod((rowCol.row + 1), height), rowCol.column);
    };
};

Snake.makeKeyDownListener = function (snake) {
    return function onKeyDown(keyEvent) {
        var keyCode = keyEvent.keyCode,
            transitionTable = Snake.transitionTables[snake.direction],
            plannedAction;

        if (!(keyCode in Snake.keyTable)) {
            return;
        }
        plannedAction = Snake.keyTable[keyCode];
        if (plannedAction in transitionTable) {
            plannedAction = transitionTable[plannedAction];
        }
        Snake.actions(snake, plannedAction);
    };
};

Snake.keyTable = {
    "37": "left",
    "38": "up",
    "39": "right",
    "40": "down",
    "32": "reset"
};

Snake.transitionTables = {
    "up": {
        "down": "up"
    },
    "down": {
        "up": "down"
    },
    "left": {
        "right": "left"
    },
    "right": {
        "left": "right"
    }
};

Snake.actions = function (snake, action) {
    if (action === "reset") {
        Snake.reset(snake);
    } else {
        snake.direction = action;
    }
};
