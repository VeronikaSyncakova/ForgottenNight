//sprites declaration
let buttonImg= new Image();
buttonImg.src="assets/img/endButton.png";
let playButton= new Button(buttonImg,50,450,350,0);

let backgroundEnd=new Image();
backgroundEnd.src="assets/img/gameOver.png";

//game over screen
function endScreen()
{
    //draw screen
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(backgroundEnd,0,0);
    context.drawImage(playButton.sprite,playButton.pressed*playButton.diameter,0,playButton.diameter,playButton.diameter,playButton.position.x,playButton.position.y,playButton.diameter,playButton.diameter);
    if (playerM.action==="Winning")
    {//player won
        context.beginPath();
        context.font= '35px Arial';
        context.fillText("You remembered everything!!!",300,300);
        context.stroke();
    }
    else 
    {//player lost
        context.beginPath();
        context.font= '35px Arial';
        context.fillText("Memory lost!!!",400,300);
        context.stroke();
    }
    //player pressed restart button, restart the game
    if (playButton.collisionPoint(mouse.x,mouse.y))
    {
        playButton.pressed=1;
        gameState="Intro";
        playerM.restart(100,150);
        playerM.shots=0;
        enemy.restart(enemySprite,160,200, 600,150);
        gameLoopCall=0;
        soberMeter.val=100;
        updateHealthBar();
        buttonK.unusedRounds=0;
        buttonB.unusedRounds=0;
        buttonS.unusedRounds=0;
        
        arrowClicked=-1;
        arrow.sprite=arrowSprite;
        arrow.width=350;
        arrow.height=200;
        arrow.position.x=100;
        arrow.position.y=300;
    }
}