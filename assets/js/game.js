//background
let BackgroundGame=new Image();
BackgroundGame.src="assets/img/unfocused-tavern.png";
//healthbar
let healthBarImg=new Image();
healthBarImg.src="assets/img/health-bar.png";
let healthBar= new GameObj(healthBarImg,1000,100,0,0);
//amount of shots
let shotsImg=new Image();
shotsImg.src="assets/img/shots.png";
let shots=new GameObj(shotsImg,50,50,healthBar.width/2-125,40);

//timers
let playerHealthBar= new Timer(70,25);
let enemyHealthBar= new Timer(830,25);
let soberMeter= new Timer(70,62);

//buttons
let punch = new Image();
punch.src="assets/img/punch.png";
let buttonP= new Button(punch,50,870,270,0);

let block= new Image();
block.src="assets/img/block.png";
let buttonB=new Button(block,50,740,270,1);

let kick= new Image();
kick.src="assets/img/kick.png";
let buttonK=new Button(kick,50,805,170,2);

let shot=new Image();
shot.src="assets/img/shot.png";
let buttonS=new Button(shot,50,805,370,1);

//joystick
let joystickImg=new Image();
joystickImg.src="assets/img/joystick.png";
let joystickStatic=new Joystick(joystickImg,20,307,50);
let joystickMoving= new Joystick(joystickImg,20,307,30);
joystickMoving.setPosition(joystickStatic.positionMiddle.x,joystickStatic.positionMiddle.y);
joystickMoving.outerRadius=joystickStatic.radius+(joystickMoving.radius/2);

//enemy
let enemySprite=new Image();
enemySprite.src="assets/img/baraSpritesheet.png";
let enemy= new Enemy(enemySprite,160,200,600,150);

//player
let playerSpritesheet1=new Image();
playerSpritesheet1.src="assets/img/baraSpritesheetL.png";
let playerM=new Player(playerSpritesheet1,160,200,100,150);

//restore saved data
function restoredData()
{
    console.log("restored");
    playerM.health=parseInt(localStorage.getItem('playerHealth'));
    enemy.health=parseInt(localStorage.getItem('enemyHealth'));
    playerM.shots=parseInt(localStorage.getItem('shots'));
    gameState=localStorage.getItem('gameState');
    day=localStorage.getItem('day');
    month=localStorage.getItem('month');
    playerName=localStorage.getItem('username');
    hour=localStorage.getItem('hour');
    minute=localStorage.getItem('minute');
    if(day>-1) //user is using current date
    {
        previousDay=localStorage.getItem('previousDay');
        previousMonth=localStorage.getItem('previousMonth');
    }
    updateHealthBar();

    save=true;
}

//save data to local storage
function saveData()
{
    if(save)
    {
    localStorage.setItem('playerHealth', playerM.health);
    localStorage.setItem('enemyHealth', enemy.health);
    localStorage.setItem('shots',playerM.shots);
    localStorage.setItem('gameState',gameState);
    localStorage.setItem('username',playerName);
    localStorage.setItem('day',day);
    localStorage.setItem('month',month);
    localStorage.setItem('previousDay',previousDay);
    localStorage.setItem('previousMonth',previousMonth);
    localStorage.setItem('hour',hour);
    localStorage.setItem('minute',minute);
    }
}

//player is within short distance with enemy
function canSeeEnemy()
{
    if(playerM.position.x+playerM.width>=enemy.position.x || enemy.followPlayer) 
    {
        enemy.followPlayer=true;
        return true;
    }
    return false;
}

//updates healthbars according to their health
function updateHealthBar()
{
    if(playerM.health>100)
    {
        playerM.health=100;
    }
    if(enemy.health>100)
    {
        enemy.health=100;
    }
    playerHealthBar.val=playerM.health;
    enemyHealthBar.val=enemy.health;
}

function processAction()
{
    //enemy choosing fight action
    if (playerM.action !=="None")
    {
        enemy.chooseAction();
    }
    else{
        enemy.action="None";
    }

    //console.log("Player action: ",playerM.action);
    //console.log("Enemy action :",enemy.action);

    //processing the fight actions and updating their health
    if(playerM.action==="Punch")
    {
        if (enemy.action==="Punch")
        {
            playerM.health-=20;
            enemy.health-=20;
        }
        else if(enemy.action==="Block")
        {
            playerM.health+=10;
        }
        else if(enemy.action==="Kick")
        {
            playerM.health-=30;
        }
    }
    else if(playerM.action==="Kick")
    {
        if (enemy.action==="Punch")
        {
            playerM.health+=20;
        }
        else if(enemy.action==="Block")
        {
            playerM.health+=30;
        }
        else if(enemy.action==="Kick")
        {
            playerM.health-=10;
            enemy.health-=10;
        }
    }
    else if(playerM.action==="Block")
    {
        if (enemy.action==="Punch")
        {
            playerM.health+=10;
        }
        else if(enemy.action==="Block")
        {
            playerM.health-=10;
            enemy.health-=10;
        }
        else if(enemy.action==="Kick")
        {
            playerM.health-=30;
        }
    }

    updateHealthBar();

    //check if player and enemy are still alive
    if(playerM.isDead())
    {
        playerM.action="Dead";
    }
    else if(enemy.isDead())
    {
        enemy.action="Dead";
        buttonS.unusedRounds++;
    }

}

//check which button was touched by the user
function checkButtonsStart()
{
    if(buttonP.collisionPoint(mouse.x,mouse.y))
    {//Punch
        console.log("punch button pressed");
        buttonP.pressed=1;
        playerM.action="Punch";
        buttonB.unusedRounds++;
        buttonK.unusedRounds++;
        playerM.currentAction=4;
    }
    else if(buttonB.collisionPoint(mouse.x,mouse.y) && buttonB.canUse())
    {//Block
        console.log("block button pressed");
        buttonB.pressed=1;
        playerM.action="Block";
        buttonB.unusedRounds=0;
        buttonK.unusedRounds++;
        playerM.currentAction=3;
    }
    else if(buttonK.collisionPoint(mouse.x,mouse.y) && buttonK.canUse())
    {//Kick
        console.log("kick button pressed");
        buttonK.pressed=1;
        playerM.action="Kick";
        buttonK.unusedRounds=0;
        buttonB.unusedRounds++;
        playerM.currentAction=5;
    }
    else if(buttonS.collisionPoint(mouse.x,mouse.y) && buttonS.canUse())
    {//Shot
        console.log("shot button pressed");
        buttonS.pressed=1;
        playerM.action="ClaimShot";
        buttonK.unusedRounds=0;
        buttonB.unusedRounds=0;
        buttonS.unusedRounds=0;
        playerM.currentAction=0;
        enemy.restart(enemySprite, 160,200, 600, 150); //killed enemy
        playerM.restart(100,150);
        updateHealthBar();
        playerM.shots++;
        soberMeter.val=100;
        //check if player won
        if (playerM.shots===5)
        {
            playerM.action="Winning";
            gameState="EndScreen";
        }
    }
    else
    {//default
        playerM.action="None";
        playerM.currentAction=0;
    }
}

//end of touch
function checkButtonsEnd()
{
    buttonP.pressed=0;
    buttonB.pressed=0;
    buttonK.pressed=0;
    buttonS.pressed=0;
    if (enemy.followPlayer && playerM.action!=="Walk")
    {
        processAction();
    }

}

//move player using joystick
function movePlayer()
{
    if(joystickMoving.position.x+(joystickMoving.radius/2)>joystickStatic.positionMiddle.x)
    {
        playerM.moveRight();
    }
    else if(joystickMoving.position.x+(joystickMoving.radius/2)<joystickStatic.positionMiddle.x)
    {
        playerM.moveLeft();
    }

    //set right row for walk animation
    if (playerM.currentAction<1 || playerM.currentAction>2)
    {
        playerM.currentAction=1;
    }
    playerM.action="Walk";
}

//joystick actions
function checkJoystick()
{
    //console.log("checking joystick");
    if(pressed===0)
    {//inactive joystick
        joystickMoving.pressed=0;
        joystickMoving.setPosition(joystickStatic.positionMiddle.x,joystickStatic.positionMiddle.y);
        if(playerM.action==="Walk")
        {
            playerM.action="None";
            if (enemy.followPlayer)
            {
                enemy.action="None";
            }
        }
    }
    else if(joystickStatic.collisionPointJ(mouse.x,mouse.y))
    {//active joystick
        joystickMoving.pressed=1;
    }
    if(joystickMoving.pressed)
    {//follow finger
        joystickMoving.followMouse(mouse.x,mouse.y);
        movePlayer();
        if(canSeeEnemy())
        {//move enemy towards player
            //console.log(enemy.followPlayer);
            enemy.move(playerM);
            enemy.action="Walk";
        }
    }
}

//animation
function animate()
{
    frameCount++;
    if (frameCount < 10) {
        return;
    }
    frameCount = 0;
    //console.log("player action",playerM.action);
    playerM.animate();
    enemy.animate();
}

//updates button sprites
function checkButtonState()
{
    buttonB.checkState();
    buttonK.checkState();
    buttonS.checkState();
}

//draw message to the screen
function drawText()
{
    let message;
    if(day>-1)
    {
        if (minute<10)
        {
            message=playerName+" on "+previousDay+"/"+previousMonth+" at "+hour+":0"+minute;
        }
        else
        {
            message=playerName+" on "+previousDay+"/"+previousMonth+" at "+hour+":"+minute;
        }
    }
    else
    {
        if (minute<10)
        {
            message=playerName+" at "+hour+":0"+minute;
        }
        else
        {
            message=playerName+" at "+hour+":"+minute;
        }
    }
    context.beginPath();
    context.fillStyle = "#000000";
    context.font= '15px Arial';
    context.fillText(message,healthBar.width/2-125,30);
    context.stroke();
}

//draw buttons, joystick and ui on canvas
function drawButtons()
{
    checkButtonState();
    context.drawImage(buttonP.sprite,buttonP.pressed*buttonP.diameter,0,buttonP.diameter,buttonP.diameter, buttonP.position.x,buttonP.position.y,buttonP.diameter,buttonP.diameter);
    context.drawImage(buttonB.sprite,buttonB.pressed*buttonB.diameter,0,buttonB.diameter,buttonB.diameter, buttonB.position.x,buttonB.position.y,buttonB.diameter,buttonB.diameter);
    context.drawImage(buttonK.sprite,buttonK.pressed*buttonK.diameter,0,buttonK.diameter,buttonK.diameter, buttonK.position.x,buttonK.position.y,buttonK.diameter,buttonK.diameter);
    context.drawImage(buttonS.sprite,buttonS.pressed*buttonS.diameter,0,buttonS.diameter,buttonS.diameter, buttonS.position.x,buttonS.position.y,buttonS.diameter,buttonS.diameter);

    context.drawImage(joystickStatic.sprite,joystickStatic.position.x,joystickStatic.position.y,joystickStatic.diameter,joystickStatic.diameter);
    context.drawImage(joystickMoving.sprite,joystickMoving.position.x,joystickMoving.position.y,joystickMoving.diameter,joystickMoving.diameter);

    context.drawImage(healthBar.sprite,healthBar.position.x,healthBar.position.y,healthBar.width,healthBar.height);
    context.drawImage(shots.sprite,0,0,playerM.shots*shots.width,shots.height,shots.position.x,shots.position.y,playerM.shots*shots.width,shots.height);
}

//draw on canvas
function drawGame()
{
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(BackgroundGame,0,0);
    drawButtons();
    context.drawImage(playerM.sprite,playerM.currentFrame*playerM.width,playerM.currentAction*playerM.height,playerM.width,playerM.height, playerM.position.x,playerM.position.y,playerM.width,playerM.height);
    context.drawImage(enemy.sprite,enemy.currentFrame*enemy.width,enemy.currentAction*enemy.height,enemy.width,enemy.height, enemy.position.x,enemy.position.y,enemy.width,enemy.height);
    //timers
    playerHealthBar.drawTimer();
    enemyHealthBar.drawTimer();
    soberMeter.drawTimer();
    drawText();
    //console.log("pressed: ",pressed);
}

//updates minutes
setInterval(function(){
    if(minute<60)
    {
        minute++;
    }
    else{
        minute=0;
        hour++;
    }
}, 60000);

//updates sober meter timer
setInterval(function(){
    if(gameState==="GamePlay")
    {
        soberMeter.val--;
        if(soberMeter.val<0)
        {
            playerM.action="Dead";
        }
    }
}, 250);

//gameloop
function gameLoop()
{
    animate();
    drawGame();

    if (mobile)
    {
        checkJoystick();
    }

    saveData();
    
    if(gameState==="GamePlay")
    {
        window.requestAnimationFrame(gameLoop);
    }
}