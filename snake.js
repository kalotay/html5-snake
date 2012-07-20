var Snake = (function() {
    function createArena() {
        var arena = document.getElementById("arena"),
            index = WIDTH * HEIGHT,
            div;
            
        while (index-- > 0) {
            div = document.createElement("div");
            arena.appendChild(div);
        }
    }
    var WIDTH = 40,
        HEIGHT = 20;
    
    return {
        "createArena": createArena
    };
})();
