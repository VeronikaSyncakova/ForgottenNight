//player
let playerSpritesheet= new Image();
playerSpritesheet.src="assets/img/baraIntro.png";
let player=new Player(playerSpritesheet,400,550,0,10);
//text boxes
let arrowSprite= new Image();
arrowSprite.src="assets/img/oof.png";
let arrow= new GameObj(arrowSprite,350,200,100,300);
let arrowSprite2= new Image();
arrowSprite2.src="assets/img/maybe.png";
//fairy
let simonFairy=new Image();
simonFairy.src="assets/img/simonFairy.png";
let simonWink=new Image();
simonWink.src="assets/img/simonShot.png";
//background
let backgroundIntro=new Image();
backgroundIntro.src="assets/img/someonesHouse.png";
//to reposition the text box and update canvas
let arrowClicked=0;

function draw()
{//drawing sprites
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(backgroundIntro,0,0);
    context.drawImage(player.sprite,player.position.x,player.position.y,player.width,player.height);

    let message; //message displaying name and time
    if(day===-1)//user doesnt ant to use current date
    {
        message=playerName+" at 9:00";
    }
    else
    {
        message=playerName+" on "+day+"/"+month+" at "+currentDate.getHours()+":"+currentDate.getMinutes();
    }
    context.beginPath();
    context.font= '12px Arial';
    context.fillText(message,10,20);
    context.stroke();

    //update canvas
    if( arrowClicked===1) 
    {
        context.drawImage(simonFairy,550,0,300,400);
    }
    if (arrowClicked===2)
    {
        context.drawImage(simonWink,550,0,400,400);
        gameState="GamePlay";
    }

    context.drawImage(arrow.sprite,arrow.position.x,arrow.position.y,arrow.width,arrow.height);
}

//process mose position
function checkClick()
{
    console.log("check click");
    if(arrow.collisionPoint(mouse.x,mouse.y))
    { //user clicked on the text box
        //console.log("arrow click");
        if(arrowClicked===0)
        {
            arrow.sprite=arrowSprite2;
            arrow.width=250;
            arrow.height=150;
            arrow.position.x=350;
            arrow.position.y=100;
        }
        arrowClicked++;
    }
}

function introGameLoop()
{
    checkClick();
    draw();
    //console.log("draw");
}