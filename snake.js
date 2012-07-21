function createArena(width, height) {
    function Snake(head, tail, direction) {
        this.head = head;
        this.trail = -1;
        this.direction = direction;
        this.tail = tail;
        this.length = tail.length;
    }

    function paintSnake(snake) {
        var tiles = document.getElementById("arena").children;
        tiles[snake.head].className = "head";
        snake.tail.forEach(function (tailIndex) {
            tiles[tailIndex].className = "tail";
        });
        if (snake.trail != -1) {
            tiles[snake.trail].className = null;
        }
    }

    function moveSnake(snake, movers) {
        var mover = movers[snake.direction].mover,
            head = snake.head,
            tail = snake.tail;

        if (snake.length <= tail.length) {
            snake.trail = tail.pop();
        }
        tail.unshift(head);
        snake.head = mover(head);
    }

    function moveAndRepaintSnake(snake, movers) {
        moveSnake(snake, movers);
        paintSnake(snake);
    };

    function indexToRowCol(index) {
        var column = index % width,
            row = (index - column) / width;

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
        return row * width + column;
    }

    function moveRight(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(rowCol.row, mod((rowCol.column + 1), width));
    }

    function moveLeft(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(rowCol.row, mod((rowCol.column - 1), width));
    }

    function moveUp(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(mod((rowCol.row - 1), height), rowCol.column);
    }

    function moveDown(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(mod((rowCol.row + 1), height), rowCol.column);
    }


    function KeyDownListener(snake, movers, keyTable) {
        this.snake = snake;
        this.movers = movers;
        this.keyTable = keyTable;
    }

    KeyDownListener.prototype.handleEvent = function onKeyDown(keyEvent) {
        var key = this.keyTable[keyEvent.keyCode],
            currentDirection = this.snake.direction;

        if ((typeof key === "undefined") || 
                (key === this.movers[currentDirection].opposite)) {
            return;
        }
        this.snake.direction = key;
    }

    var arena = document.getElementById("arena"),
        index = width * height,
        div,
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
        keyTable = {
            "37": "left",
            "38": "up",
            "39": "right",
            "40": "down"
        },
        snake = new Snake(5, [4, 3, 2, 1], "right");
        
    while (index-- > 0) {
        div = document.createElement("div");
        arena.appendChild(div);
    }
    paintSnake(snake);
    window.onkeydown = new KeyDownListener(snake, movers, keyTable);
    window.setInterval(moveAndRepaintSnake, 200, snake, movers);
}
