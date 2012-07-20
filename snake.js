var Snake = (function() {
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
    function makeSnake(width, height, length) {
        var startingIndex = (height / 2) * width,
            head = startingIndex + length,
            tail = [];

        while (--length > 0) {
            tail.push(startingIndex + length)
        }
        return {
            "head": head,
            "tail": tail,
            "dead": -1
        };
    }

    var WIDTH = 40,
        HEIGHT = 20,
        snake = makeSnake(WIDTH, HEIGHT, 5);
    
    return {
        "createArena": createArena,
        "paintSnake": paintSnake
    };
})();
