var Game = function() {
    this.level_n = 0;
    this.level = levels[0];
    this.degree = 0;
    this.score = 0;
    this.chance = 5;
    this.width = 580;
    this.height = 580;
    this.user = new User;
    this.timeLabel = document.getElementById("time_label");
    this.timeMessageLabel = document.getElementById("time_mesage_label");
    this.requiredColorBoxes = document.getElementById("required_color_boxes");
    this.gameMesageLabel = document.getElementById("game_mesage_label");
    this.scoreLabel = document.getElementById("score_label");
    this.chanceLabel = document.getElementById("chance_label");
    this.board = document.getElementById("game_board");
    this.gameOverMessage = document.getElementById("game_over_message");
    this.passiveElements = document.getElementsByClassName("passive");
    this.activeElements = document.getElementsByClassName("active");
    this.chances = document.getElementsByClassName("chance");
}

Game.prototype.setTime = function(time) {
    var g = this;
    setTimeout(function() {
        g.timeLabel.innerHTML = time;
        if (time == 0) {
            g.level.hideBoard()
            g.showActiveElements()
        }
        else {
            time--;
            g.setTime(time)
        }
    }, 1000);
}

Game.prototype.showPassiveElements = function(level) {
    for (var i = 0; i < this.activeElements.length; i++) {
        this.activeElements[i].classList.add("invisible");
    }
    for (var i = 0; i < this.passiveElements.length; i++) {
        this.passiveElements[i].classList.remove("invisible");
    }
}

Game.prototype.showActiveElements = function(level) {
    for (var i = 0; i < this.activeElements.length; i++) {
        this.activeElements[i].classList.remove("invisible");
    }
    for (var i = 0; i < this.passiveElements.length; i++) {
        this.passiveElements[i].classList.add("invisible");
    }
}

Game.prototype.startLevel = function(level) {
    //alert(level)
    this.level = levels[level];
    this.level.start();
      var time=game.level.time;
      game.timeLabel.innerHTML = time;
      time--
     game.setTime(time)
}

var User = function() {
    this.score = 0;
    this.chance = 5;
}

User.prototype.addScore = function() {
    this.score++
    game.scoreLabel.innerHTML = this.score;
}

User.prototype.removeChance = function(score) {
    this.chance--;
    if (this.chance != 0) {
        var chances = game.chances
        var element = chances[this.chance - 1]
        element.nextElementSibling.remove(element)
    }
    else {
        game.gameOverMessage.classList.remove("invisible");
        game.gameOverMessage.classList.add("dialog_box");
        game.chances[0].classList.add("invisible");
    }

}

var Level = function(widthBoxCount, heightBoxCount, passingDegree, colorLimit, time, stages) {
    this.width_boxCount = widthBoxCount;
    this.height_boxCount = heightBoxCount;
    this.boxCount = widthBoxCount * heightBoxCount;
    this.colorLimit = colorLimit;
    this.passingDegree = passingDegree;
    this.time = time;
    this.stages = stages;
    this.currentStage_n = 0;
    this.stage = 0;
    this.currentStage = this.stages[0];
    this.boxes = [];
    this.colors = [];
}

Level.prototype.setCurrentStage = function(currentStage) {
    this.currentStage = currentStage;

}

Level.prototype.start = function() {

    this.colors = [];
    this.boxes = [];
    game.board.innerHTML = "  "
    console.log(game.level_n + '  ' + this.currentStage_n)
    for (var i = 0; i < this.boxCount; i++) {
        var box = new Box()
        this.colors.push(box.add(this.width_boxCount, this.height_boxCount, this.colorLimit))
        this.boxes.push(box)
    }
    this.currentStage.setRequiredColors(this.colors, this.colorLimit)

}

Level.prototype.hideBoard = function() {
    //alert(this.boxCount)
    for (var i = 0; i < this.boxCount; i++) {
        this.boxes[i].remove()
    }

}

var Box = function() {
    this.color;
    this.html_box;
}
Box.prototype.add = function(bwc, bhc, colorLimit) {
    var box = document.createElement("div");
    game.board.appendChild(box);
    var color = colors[Math.floor((Math.random() * colorLimit))]
    box.className = 'box ';
    box.className += 'color ';
    box.className += color.colorClass;
    box.style.width = game.width / bwc + "px";
    box.style.height = game.height / bhc + "px";
    box.innerHTML = " a "
    this.color = color;
    b = this;
    //box.onclick = function(){b.click()};
    box.onclick = this.click.bind(this, null);
    this.html_box = box;
    return color;
}

Box.prototype.click = function() {
    var reqColors = game.level.currentStage.requiredColors;
    var check = false;
    var rc;
    var n = 0
    for (i = 0; i < reqColors.length; i++) {
        rc = reqColors[i]
        if (this.color.name == rc.name) {
            check = true
            n = i;
            break;
        }
        //console.log(this.color.name+' ====== '+rc.name+' --------- '+check)
    }


    this.html_box.classList.add('color');
    this.html_box.classList.remove('covered');
this.html_box.onclick = null;
    this.color.name = 'llll'
    if (check) {
        rc = reqColors[n]
        rc.box.classList.remove('color');
        reqColors.splice(n, 1);

        game.user.addScore()
        if (reqColors.length == 0) {

            game.showPassiveElements()
            game.level.currentStage_n++;
            console.log(game.level.currentStage_n + ' == ' + game.level.currentStage_n)
            if (game.level.currentStage_n == game.level.stages.length) {
                if(game.level_n!=levels.length-1)
                game.level_n++;
                game.level = levels[game.level_n];
            }
            else {
                game.level.currentStage = game.level.stages[game.level.currentStage_n]
            }
            var time=game.level.time;
      game.timeLabel.innerHTML = time;
      time--
     game.setTime(time)
            game.level.start()
        }
    }
    else {

        game.user.removeChance()
    }
}
Box.prototype.remove = function(bwc, bhc, colorLimit) {
    this.html_box.classList.remove("color");
    this.html_box.classList.add("covered");
}

var Stage = function(rbc) {
    this.requiredBoxCount = rbc;
    this.requiredColors = []
}

Stage.prototype.setRequiredColors = function(colors, colorLimit) {

    game.requiredColorBoxes.innerHTML = "  "
    console.log('rk  ' + this.requiredBoxCount)
    for (var i = 0; i < this.requiredBoxCount; i++) {
        var rand_col = Math.floor((Math.random() * colors.length));
        
        var color = colors[rand_col];
        var box = document.createElement("div");
        box.classList.add('box');
        box.classList.add('color');
        box.classList.add('required_color');
        box.classList.add(color.colorClass);
        box.innerHTML = " a "
        game.requiredColorBoxes.appendChild(box);
        color.box = box;
        this.requiredColors.push(color)
        
        colors.splice(rand_col, 1);
    }
}

var Color = function(name, colorClass) {
    this.name = name;
    this.colorClass = colorClass;
}


var board = document.getElementById("game_board");
var score_label = document.getElementById("score_label");
var chance_label = document.getElementById("chance_label");


var colors = [new Color('red', 'red'),
    new Color('blue', 'blue'),
    new Color('yellow', 'yellow'),
    new Color('purple', 'purple'),
    new Color('aqua', 'aqua'),
    new Color('brown', 'brown'),
    new Color('green', 'green'),
    new Color('aqua', 'aqua'),
    new Color('brown', 'brown'),
    new Color('green', 'green')]
var aStages = [new Stage(1)]
var aaStages = [new Stage(3)]
var bStages = [new Stage(1), new Stage(1)]
var cStages = [new Stage(1), new Stage(2)]
var dStages = [new Stage(1), new Stage(2), new Stage(1)]
var fStages = [new Stage(1), new Stage(2), new Stage(1)]
var eStages = [new Stage(1), new Stage(3), new Stage(1)]
var iStages = [new Stage(1), new Stage(3), new Stage(2)]
var levels = [new Level(2, 2, 4, 6, 5,aStages),
              new Level(3, 3, 6, 7, 7,bStages),
              new Level(3, 3, 6, 7, 5,bStages),
              new Level(4, 4, 6, 7, 10,bStages),
              new Level(5, 5, 8, 7, 7,cStages),
              new Level(5, 5, 8, 7, 5,cStages),
              new Level(5, 5, 8, 7, 5,cStages),
              new Level(5, 5, 11, 7, 5,dStages),
              new Level(6, 6, 14, 7, 5,eStages),
              new Level(6, 6, 17, 7, 5,fStages),
              new Level(6, 6, 14, 7, 3,eStages),
              new Level(6, 6, 17, 7, 3,fStages)]



var game







window.onload = function() {

    game = new Game()
    game.startLevel(0)
};
