Snake = {};
Snake.init = function (width, height) {
    var moves = new Snake.Moves(width, height),
        snake = new Snake.Snake(5, [4, 3, 2, 1], "right"),
        arena = Snake.createArena(width, height),
        food = new Snake.Food(width, height);

    Snake.paintSnake(snake);
    window.onkeydown = Snake.makeKeyDownListener(snake);
    window.setInterval(Snake.moveAndRepaintSnake, 100, snake, moves, food);
};

Snake.reset = function(snake) {
    var arena = document.getElementById("arena");

    snake.trail = snake.trail.concat(snake.tail);
    snake.trail.push(snake.head);
    snake.direction = "right";
    snake.targetDirection = "right";
    snake.tail = [4, 3, 2, 1];
    snake.head = 5;
    snake.isAlive = true;
    snake.length = snake.tail.length;
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
    this.targetDirection = direction;
    this.tail = tail;
    this.length = tail.length;
    this.isAlive = true;
};

Snake.paintSnake = function (snake) {
    var tiles = document.getElementById("arena").children;
    function changeClass(index, className) {
        tiles[index].className = className;
    }
    snake.trail.forEach(function (trailIndex) {
        changeClass(trailIndex, "trail");
    });
    changeClass(snake.head, "head");
    snake.tail.forEach(function (tailIndex) {
        changeClass(tailIndex, "tail");
    });
};

Snake.moveSnake = function (snake, moves, food) {
    var move = moves[snake.targetDirection],
        head = snake.head,
        tail = snake.tail,
        newHead = move(head);

    if (!snake.isAlive) {
        return;
    }
    if (newHead === food.location) {
        snake.length += 1;
        food.generate(food);
    }
    snake.direction = snake.targetDirection;
    if (snake.length <= tail.length) {
        snake.trail = [tail.pop()];
    }
    tail.unshift(head);
    snake.head = newHead;
    if (tail.indexOf(snake.head) !== -1) {
        snake.isAlive = false;
    }
};

Snake.moveAndRepaintSnake = function (snake, moves, food) {
    Snake.moveSnake(snake, moves, food);
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
        snake.targetDirection = action;
    }
};

Snake.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Snake.Food= function (width, height) {
    function foodGenerator(food) {
        food.location = Snake.randomInt(0, width * height);
        Snake.paintFood(food);
    }
    this.location = null;
    this.generate = foodGenerator;
    foodGenerator(this);
};

Snake.paintFood = function (food) {
    var tiles = document.getElementById("arena").children;

    tiles[food.location].className = "food";
};
