function Snake(width, height) {
    var arena = document.getElementById("arena"),
        elements = {},
        moves = {},
        actions = {},
        interval,
        intervalId;

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
            tiles = arena.children,
            index = tiles.length;

        while (--index >= 0) {
            tiles[index].className = null;
        }
        elements.head = midpoint;
        elements.tail = [midpoint - 1];
        elements.trail = -1; //-1 indicates lack of trail
        elements.length = elements.tail.length;
        elements.direction = "right";
        elements.targetDirection = "right";
        elements.food = midpoint; //seed value. not actual one used
        generateFood();
        paintAll();
        setScore();
        interval = 100;
        window.clearInterval(intervalId);
        intervalId = window.setInterval(moveAndPaintAll, interval);
    }

    function generateFood() {
        var size = width * height;
        //the following line makes sure the food is not generated where the
        //previous one was
        //However the food might be generated in the tail
        //avoiding all parts of the snake might take some effort
        elements.food = (elements.food + Snake.randomInt(1, size)) % size;
    }

    function paintAll() {
        var trail = elements.trail;

        function paint(index, className) {
            arena.children[index].className = className;
        }

        if (trail !== -1) {
            paint(trail, null);
        }
        //paint order matters
        paint(elements.food, "food");
        elements.tail.forEach(function (tailIndex) {
            paint(tailIndex, "tail");
        });
        paint(elements.head, "head");
    }

    function move() {
        var move = moves[elements.targetDirection],
            head = elements.head,
            tail = elements.tail,
            newHead = move(head);

        if (newHead === elements.food) { //food pickup
            elements.length += 1;
            generateFood();
            setScore();
            if (((elements.length % 8) === 0) && (interval > 10)) { //speedup
                window.clearInterval(intervalId);
                interval -= 10;
                intervalId = window.setInterval(moveAndPaintAll, interval);
            }
        }
        elements.direction = elements.targetDirection;
        tail.push(head);
        if (elements.length < tail.length) {
            elements.trail = tail.shift();
        }
        elements.head = newHead;
        if (tail.indexOf(newHead) !== -1) { //collision with tail
            window.clearInterval(intervalId);
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

        if (!(keyCode in Snake.keyTable)) { //key not used
            return;
        }
        plannedAction = Snake.keyTable[keyCode];
        if (plannedAction in transitionTable) { //makes sure reversing is impossible
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
    }

    function setScore() {
        scoreSpan = document.getElementById("score");
        scoreSpan.textContent = "score: " + elements.length;
    }

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
    window.onkeydown = keyDownListener;
    reset();
}

Snake.mod = function (lhs, rhs) {
    //adapts modulo operator so the sign follows the divisor and not the dividend
    return ((lhs % rhs) + rhs) % rhs;
};

Snake.keyTable = {
    "37": "left", //left
    "38": "up", //up
    "39": "right", //right
    "40": "down", //down
    "32": "reset", //space
    "65": "left", //a
    "87": "up", //w
    "68": "right", //d
    "83": "down", //s
    "72": "left", //h
    "75": "up", //k
    "76": "right", //l
    "74": "down" //j
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
    //see Mozilla's docs on Math.random
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

