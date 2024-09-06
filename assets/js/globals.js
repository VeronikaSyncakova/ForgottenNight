//canvas 
const canvas = document.getElementById("the_canvas")
const context = canvas.getContext("2d");

//form things, date and player name
let currentDate=new Date();
let day=-1; //no day by default
let month;
let playerName;
let previousDay=0;
let previousMonth=0;
let hour=21; //hour for previous night
let minute=0; //minute for previous night

let mobile=false; //if device is mobile

let gameLoopCall=0; //to call game loop just once

let frameCount=0; //frame count for animation

let gameState="Form"; 
canvas.style.display="none";

let save=false; //if data should be saved

let pressed=0; //if buttons were pressed


class Position
{//coordinates
    x;
    y;
}

let mouse = new Position(); //mouse coordinates

class GameObj
{//general object in a game
    position= new Position();
    width;
    height;
    sprite;
    constructor(image,t_width,t_height,t_x,t_y)
    {
        this.sprite=image;
        this.width=t_width;
        this.height=t_height;
        this.position.x=t_x;
        this.position.y=t_y;
    }

    collisionPoint(x,y)
    {//collision with mouse or touch
        //console.log(y);
        //console.log(this.position.y);
        if(this.position.x<=x && this.position.x+this.width>=x &&
            this.position.y<=y && this.position.y+this.height>=y)
        {
            return true;
        }
        else 
        {
            return false;
        }
    }
}

class Button
{//button, circular
    position= new Position();
    positionMiddle=new Position(); //middle of the circle
    radius;
    sprite;
    diameter;
    pressed;
    coolDown;
    unusedRounds;
    constructor(image,t_r,t_x,t_y,t_coolDown)
    {
        this.sprite=image;
        this.radius=t_r;
        this.position.x=t_x;
        this.position.y=t_y;
        this.positionMiddle.x=t_x+this.radius;
        this.positionMiddle.y=t_y+this.radius;
        this.diameter=2*this.radius;
        this.pressed=0;
        this.coolDown=t_coolDown;
        this.unusedRounds=0;
    }

    checkState()
    {//updates button image
        //console.log("unused rounds: ",this.unusedRounds);
        if(!this.canUse() && this.pressed!==1)
        {
            if(this.unusedRounds===0)
            {
                this.pressed=2;
            }
            else if(this.unusedRounds===1)
            {
                this.pressed=3;
            }
        }
        else if(this.pressed===1)
        {
            this.pressed=1;
        }
        else
        {
            this.pressed=0;
        }
    }

    canUse()
    {//if button is active after cooldown
        //console.log("unused rounds: ",this.unusedRounds);
        if(this.unusedRounds>=this.coolDown)
        {
            return true;
        }
        return false;
    }

    collisionPoint(x,y)
    {//collision with touch or mouse
        let distance= Math.sqrt((x-this.positionMiddle.x)*(x-this.positionMiddle.x)+(y-this.positionMiddle.y)*(y-this.positionMiddle.y));
        //console.log("distance: ",distance);
        if(distance<=this.radius)
        {
            //console.log("collision");
            return true;
        }
        else
        {
            return false;
        }
    }
}

class Joystick
{//joystick class
    sprite;
    radius;
    position=new Position();
    positionMiddle=new Position();
    diameter;
    pressed;
    outerRadius; //to keep the moving part inside

    constructor(t_image,t_x,t_y,t_radius)
    {
        this.radius=t_radius;
        this.position.x=t_x;
        this.position.y=t_y;
        this.positionMiddle.x=t_x+this.radius;
        this.positionMiddle.y=t_y+this.radius;
        this.sprite=t_image;
        this.diameter=t_radius*2;
        this.pressed=0;
        this.outerRadius=t_radius;
    }

    setPosition(t_x,t_y)
    {//sets potition on canvas
        this.position.x=t_x-this.radius;
        this.position.y=t_y-this.radius;
        this.positionMiddle.x=this.position.x;
        this.positionMiddle.y=this.position.y;
    }
    
    collisionPointJ(x,y)
    {//collision with touch (or mouse)
        //console.log("touchX: ",x);
        //console.log("touchY: ",y);
        let distance= Math.sqrt((x-this.positionMiddle.x)*(x-this.positionMiddle.x)+(y-this.positionMiddle.y)*(y-this.positionMiddle.y));
       // console.log("distance w touch: ",distance);
        if(distance<=this.radius)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    collisionOuterRadius(x,y)
    {//collision check to stay within radius when moving with finger
        let distance= Math.sqrt((x-this.positionMiddle.x)*(x-this.positionMiddle.x)+(y-this.positionMiddle.y)*(y-this.positionMiddle.y));
        if(distance<=this.outerRadius)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    followMouse(x,y)
    {//follow finger
        let displacementX=x-this.position.x;
        let displacementY=y-this.position.y;
        displacementX /= Math.sqrt(displacementX*displacementX + displacementY*displacementY);
        displacementY /= Math.sqrt(displacementX*displacementX + displacementY*displacementY);
        displacementX*=3 //(speed)
        displacementY*=3 //(speed)
        //make sure it stays inside the moving radius
        if(this.collisionOuterRadius(this.position.x+displacementX,this.position.y))
        {
            this.position.x+=displacementX;
        }
        if(this.collisionOuterRadius(this.position.x,this.position.y+displacementY))
        {
            this.position.y+=displacementY;
        }
    }
}

class Timer
{//timers and bars
    constructor(t_x,t_y)
    {
        this.width = 100;
        this.height = 20;
        this.max = 100;
        this.val = 100; //value that changes
        this.x=t_x;
        this.y=t_y;
    }


    drawTimer() {          
    // Draw the background
    context.fillStyle = "#000000";
    context.fillRect(this.x, this.y, this.width, this.height);
  
    // Draw the fill, green
    context.fillStyle = "#00FF00";
    var fillVal = Math.min(Math.max(this.val / this.max, 0), 1); //calculates the bar value
    context.fillRect(this.x, this.y, fillVal * this.width, this.height); //turns the bar value into pixel value and draws it
  }
}