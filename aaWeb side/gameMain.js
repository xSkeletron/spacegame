///*
//A global timer object used for updating the game.Thanks u/Apalapa
//*/
//GlobalTimer = function() {
//    this.timer = setInterval((function() {this.update();}).bind(this), 30);
//    this.lastUpdate = Date.now();
//
//    /*
//    Gets time passed since last update, and updates now 
//    to last update.
//    */
//    this.getUpdateTime = function() {
//        var passed = Date.now() - this.lastUpdate;
//        this.lastUpdate = Date.now();
//        return passed;
//    }
//
//    /*
//    Function is called by the timer to do all updates in the game.
//    */
//    this.update = function() {
//            //time since last update.
//        var time = this.getUpdateTime();
//    }
//}

var GameEngine = function(canvas, FPS) {
    this.FPS = 1000 / FPS;
    this.canvas = canvas;
    this.context2D = canvas.getContext("2d");
    this.gameObjects = [];
    this.setupCanvas();
}


GameEngine.prototype.setupCanvas = function() {
    this.context2D.textBaseline = "top";
    this.context2D.mouse = {
        x: 0,
        y: 0,
        clicked: false,
        down: false
    };
 
    var engine = this;
 
    this.canvas.addEventListener("mousemove", function(e) {
        engine.context2D.mouse.x = e.offsetX;
        engine.context2D.mouse.y = e.offsetY;
        engine.context2D.mouse.clicked = (e.which == 1 &amp;&amp; !engine.context2D.mouse.down);
        engine.context2D.mouse.down = (e.which == 1);
    });
 
    this.canvas.addEventListener("mousedown", function(e) {
        engine.context2D.mouse.clicked = !engine.context2D.mouse.down;
        engine.context2D.mouse.down = true;
    });
 
    this.canvas.addEventListener("mouseup", function(e) {
        engine.context2D.mouse.down = false;
        engine.context2D.mouse.clicked = false;
    });
}


GameEngine.prototype.run = function() {
    var desiredTime = Date.now() + this.FPS;
 
    this.update();
    this.draw();
 
    var interval = Math.max(0, desiredTime-Date.now());
    setTimeout(_.bind(this.run, this), interval);
}


GameEngine.prototype.update = function() {
    _.each(this.gameObjects, function(obj) {
        obj.update(this.context2D);
    }, this);
}
 
GameEngine.prototype.draw = function() {
    this.context2D.clearRect(0, 0, 600, 400);
    _.each(this.gameObjects, function(obj) {
        obj.draw(this.context2D);
    }, this);
}


var UIObject = {
    intersects: function(obj, mouse) {
        var t = 5; //tolerance
        var xIntersect = (mouse.x + t) /&gt; obj.x &amp;&amp; (mouse.x - t)  obj.y &amp;&amp; (mouse.y - t) &lt; obj.y + obj.height;
        return  xIntersect &amp;&amp; yIntersect;
    },
    updateStats: function(canvas){
        if (this.intersects(this, canvas.mouse)) {
            this.hovered = true;
            if (canvas.mouse.clicked) {
                this.clicked = true;
            }
        } else {
            this.hovered = false;
        }
 
        if (!canvas.mouse.down) {
            this.clicked = false;
        }               
    }
};

var Button = function(text, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clicked = false;
    this.hovered = false;
    this.text = text;
}
 
Button.prototype = _.extend(Button.prototype, UIObject);


Button.prototype.update = function(canvas) {
    var wasNotClicked = !this.clicked;
    this.updateStats(canvas);
 
    if (this.clicked &amp;&amp; wasNotClicked) {
        if (!_.isUndefined(this.handler)) {
            this.handler();
        }
    }
}


Button.prototype.draw = function(canvas) {
    //set color
    if (this.hovered) {
        canvas.setFillColor(0.3, 0.7, 0.6, 1.0);
    } else {
        canvas.setFillColor(0.2, 0.6, 0.5, 1.0);
    }
 
    //draw button
    canvas.fillRect(this.x, this.y, this.width, this.height);
 
    //text options
    var fontSize = 20;
    canvas.setFillColor(1, 1, 1, 1.0);
    canvas.font = fontSize + "px sans-serif";
 
    //text position
    var textSize = canvas.measureText(this.text);
    var textX = this.x + (this.width/2) - (textSize.width / 2);
    var textY = this.y + (this.height/2) - (fontSize/2);
 
    //draw the text
    canvas.fillText(this.text, textX, textY);
}


var engine = new GameEngine(canvasElement, 30);
 
var alertButton = new Button("Alert", 45, 50, 160, 40);
alertButton.timesClicked = 0;
alertButton.handler = function(){
    this.timesClicked++;
    alert("This button has been clicked " + this.timesClicked + " time(s)!");
};
 
engine.gameObjects.push(alertButton);
 
engine.run();


var Slider = function(x, y, width, min, max) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 40;
    this.value = min;
    this.min = min;
    this.max = max;
    this.clicked = false;
    this.hovered = false;
}
 
 
Slider.prototype = _.extend(Slider.prototype, UIObject);


Slider.prototype.update = function(canvas) {
    this.updateStats(canvas);
 
    if (this.clicked) {
        var pos = canvas.mouse.x;
 
        pos = Math.max(pos, this.x);
        pos = Math.min(pos, this.x + this.width);
 
        var range = this.max - this.min;
        var percent = (pos - this.x) / this.width;
 
        this.value = Math.round(this.min + (percent * range));
 
        if (!_.isUndefined(this.handler)) {
            this.handler(this.value);
        }
    }
}


Slider.prototype.draw = function(canvas) {
    //draw the bar
    canvas.setFillColor(0, 0, 0, 1.0);
    canvas.fillRect(this.x, this.y + (this.height/4), this.width, this.height/2);
 
    //set color
    if (this.hovered) {
        canvas.setFillColor(0.3, 0.7, 0.6, 1.0);
    } else {
        canvas.setFillColor(0.2, 0.6, 0.5, 1.0);
    }
 
    //draw the slider handle
    var range = this.max - this.min;
    var percent = (this.value - this.min) / range;
    var pos = this.x + (this.width*percent);
    canvas.fillRect(pos-5, this.y, 10, this.height);
}


var CheckBox = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.checked = false;
    this.clicked = false;
    this.hovered = false;
}
 
CheckBox.prototype = _.extend(CheckBox.prototype, UIObject);


CheckBox.prototype.update = function(canvas) {
    var wasNotClicked = !this.clicked;
    this.updateStats(canvas);
 
    if (this.clicked &amp;&amp; wasNotClicked) {
        this.checked = !this.checked;
 
        if (!_.isUndefined(this.handler)) {
            this.handler(this.checked);
        }
    }
}


var backCheckBox = new CheckBox(45, 250);
backCheckBox.checked = true;
backCheckBox.handler = function(checked){
    var color = (checked) ? "#FFF" : "#E8B70C";
    document.body.style.backgroundColor = color;
}

engine.gameObjects.push(backCheckBox);

