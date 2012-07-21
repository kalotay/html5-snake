function Snake(width, height) {
    var arena = document.getElementById("arena"),
        elements = {},
        moves = {},
        actions = {};

    function createArena() {
        var index = width * height,
        div;

        while (index-- > 0) {
            div = document.createElement("div");
            arena.appendChild(div);
        }
    }

    function reset() {
        var midpoint = width * height / 2,
            length = 5,
            tiles = arena.children,
            index = tiles.length;

        while (--index > 0) {
            tiles[index].className = null;
        }
        elements.head = midpoint;
        elements.tail = [];
        while (--length > 0) {
            elements.tail.push(midpoint - length);
        }
        elements.trail = -1;
        elements.length = elements.tail.length;
        elements.direction = "right";
        elements.targetDirection = "right";
        elements.isDead = false;
        generateFood();
        paintAll();
    }

    function generateFood() {
        elements.food = Snake.randomInt(0, width * height);
    }

    function paintAll() {
        var trail = elements.trail;

        function paint(index, className) {
            arena.children[index].className = className;
        }

        if (trail !== -1) {
            paint(trail, null);
        }
        paint(elements.food, "food");
        paint(elements.head, "head");
        elements.tail.forEach(function (tailIndex) {
            paint(tailIndex, "tail");
        });
    }

    function move() {
        var move = moves[elements.targetDirection],
            head = elements.head,
            tail = elements.tail,
            newHead = move(head);

        if (elements.isDead) {
            return;
        }
        if (newHead === elements.food) {
            elements.length += 1;
            generateFood();
        }
        elements.direction = elements.targetDirection;
        if (elements.length <= tail.length) {
            elements.trail = tail.shift();
        }
        tail.push(head);
        elements.head = newHead;
        if (tail.indexOf(newHead) !== -1) {
            elements.isDead = true;
        }
    }

    function moveAndPaintAll() {
        move();
        paintAll();
    };

    function keyDownListener(keyEvent) {
        var keyCode = keyEvent.keyCode,
            transitionTable = Snake.transitionTables[elements.direction],
            plannedAction;

        if (!(keyCode in Snake.keyTable)) {
            return;
        }
        plannedAction = Snake.keyTable[keyCode];
        if (plannedAction in transitionTable) {
            plannedAction = transitionTable[plannedAction];
        }
        actions[plannedAction]();
    }

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

    function makeTargetDirectionSetter(targetDirection) {
        return function () {
            elements.targetDirection = targetDirection;
        };
    };

    moves.right = function moveRight(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(rowCol.row, Snake.mod((rowCol.column + 1), width));
    };
    moves.left = function moveLeft(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(rowCol.row, Snake.mod((rowCol.column - 1), width));
    };
    moves.up = function moveUp(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(Snake.mod((rowCol.row - 1), height), rowCol.column);
    };
    moves.down = function moveDown(snakeHead) {
        var rowCol = indexToRowCol(snakeHead);
        return rowColToIndex(Snake.mod((rowCol.row + 1), height), rowCol.column);
    };
    actions.reset = reset;
    actions.right = makeTargetDirectionSetter("right");
    actions.left = makeTargetDirectionSetter("left");
    actions.up = makeTargetDirectionSetter("up");
    actions.down = makeTargetDirectionSetter("down");
    createArena();
    reset();
    window.onkeydown = keyDownListener;
    window.setInterval(moveAndPaintAll, 100);
}

Snake.mod = function (lhs, rhs) {
    return ((lhs % rhs) + rhs) % rhs;
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

Snake.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

