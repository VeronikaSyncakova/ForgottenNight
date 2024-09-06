
function inputClick() {
    // Take Input from the Player when on pc
    //console.log(event);
    //console.log("Event type: " + event.type);
    // console.log("Keycode: " + event.key);
    console.log(gameState);
    //differentiate between game states
    switch(gameState)
    {
        case "Form":
            canvas.style.display="none";
            break;
        case "Intro":
            canvas.style.display="block";
            introGameLoop();
            processClick(event);
            break;
        case "GamePlay":
            if(gameLoopCall===0)
            {//call it just once
                gameLoop();
                gameLoopCall++;
            }
            processKeys(event);
            processClick(event);
            break;
        case "EndScreen":
            endScreen();
            processClick(event);
            break;
        default:
            break;
    }
    
}

function inputTouch() {
    // Take Input from the Player when on mobile
    //console.log(event);
    //console.log("Event type: " + event.type);
    // console.log("Keycode: " + event.key);
    console.log(gameState);
    switch(gameState)
    {
        case "Form":
            canvas.style.display="none";
            break;
        case "Intro":
            canvas.style.display="block";
            introGameLoop();
            processTouch(event);
            break;
        case "GamePlay":
            if(gameLoopCall===0)
            {
                gameLoop();
                gameLoopCall++;
            }
            processTouchGamePlay(event);
            break;
        case "EndScreen":
            endScreen();
            processTouch(event);
            break;
        default:
            break;
    }
    
}

function processClick(event)
{//get mouse position
    if (event.type==="click")
    {
        mouse.x=(event.clientX-canvas.getBoundingClientRect().x);
        mouse.y=(event.clientY-canvas.getBoundingClientRect().y);
        //console.log(mouse.x);
        //console.log(mouse.y);
    }  
}

function touchStartFunc(event)
{//get touch position
    let posX = event.changedTouches[0].pageX;
    let posY = event.changedTouches[0].pageY;

    mouse.x = posX- canvas.getBoundingClientRect().x ;
    mouse.y= posY- canvas.getBoundingClientRect().y;
    //console.log("mouseX: ",mouse.x);
    //console.log("mouseY: ",mouse.y);
}

function processTouch(event)
{//touch startt vs touch end
    console.log("event type: ",event.type);
    if(event.type==="touchstart")
    {
        touchStartFunc(event);
        pressed=1;
    }
    else if (event.type==="touchend")
    {
        pressed=0;
    }
    //console.log("pressed ",pressed);
}

function processTouchGamePlay(event)
{//touch events during game  play screen
    if (playerM.isDead())
    {//end when player is dead
        return;
    }

    console.log("event type: ",event.type);
    if(event.type==="touchstart")
    {
        touchStartFunc(event);
        pressed=1;
        checkButtonsStart();
    }
    else if (event.type==="touchend")
    {
        //console.log("player state: ", playerM.action);
        pressed=0;
        checkButtonsEnd();
    }
    else if(event.type==="touchmove")
    {//for joystick
        touchStartFunc(event);
    }
}


function processKeys(event)
{
    if (playerM.isDead())
    {//end when player is dead
        return;
    }

    if (event.type === "keyup") {
        switch (event.key) {
            case "ArrowLeft": // Block
                if(buttonB.canUse())
                {
                    playerM.action="Block";
                    buttonB.pressed=0;
                    buttonB.unusedRounds=0;
                    buttonK.unusedRounds++;
                    playerM.currentAction=3;
                }
                else
                {
                    playerM.action="None";
                    playerM.currentAction=0;
                }
                break; 
            case "ArrowUp": // Kick
                if (buttonK.canUse())
                {
                    playerM.action="Kick";
                    buttonK.pressed=0;
                    buttonK.unusedRounds=0;
                    buttonB.unusedRounds++;
                    playerM.currentAction=5;
                }
                else
                {
                    playerM.action="None";
                    playerM.currentAction=0;
                }
                break; 
            case "ArrowRight": // Punch
                playerM.action="Punch";
                buttonP.pressed=0;
                buttonK.unusedRounds++;
                buttonB.unusedRounds++;
                playerM.currentAction=4;
                break; 
            case "ArrowDown": // Claim shot
                if ( buttonS.canUse())
                {
                    playerM.action="ClaimShot";
                    buttonS.pressed=0;
                    buttonB.unusedRounds=0;
                    buttonK.unusedRounds=0;
                    buttonS.unusedRounds=0;
                    playerM.currentAction=1;
                    soberMeter.val=100;
                    enemy.restart(enemySprite, 160,200, 600, 150);
                    playerM.restart(100,150);
                    updateHealthBar();
                    playerM.shots++;
                    //check if player won
                    if (playerM.shots===5)
                    {
                        playerM.action="Winning";
                        gameState="EndScreen";
                    }

                }
                else
                {
                    playerM.action="None";
                    playerM.currentAction=0;
                }
                break; 
            default:
                playerM.action="None";
                playerM.currentAction=0;
        }

        if(enemy.followPlayer)
        {//when player is near the enemy
            processAction();
        }
    } 
    else if (event.type === "keydown"){
        switch (event.key) {
            case "a": // move left
                playerM.moveLeft();
                //correct animation row
                if (playerM.currentAction<1 || playerM.currentAction>2)
                {
                    playerM.currentAction=1;
                }
                playerM.action="Walk";
                break; 
            case "d": // move right
                playerM.moveRight();
                //correct animation row
                if (playerM.currentAction<1 || playerM.currentAction>2)
                {
                    playerM.currentAction=1;
                }
                playerM.action="Walk";
                break; 
            case "ArrowLeft": // Block
                if (buttonB.canUse()){buttonB.pressed=1;}
                break; 
            case "ArrowUp": // Kick
                if (buttonK.canUse()){buttonK.pressed=1;}
                break; 
            case "ArrowRight": // Punch
                buttonP.pressed=1;
                break; 
            case "ArrowDown": // Claim shot
                if (buttonS.canUse()){buttonS.pressed=1;}
                break; 
            default:
                playerM.action="None";
        }
        //move enmy towards player
        if(canSeeEnemy() && playerM.action==="Walk")
        {
            //console.log(enemy.followPlayer);
            enemy.move(playerM);
            enemy.action="Walk";
        }
        
    }
}

//check if user is playing on pc or mobile
let Environment = {
    isAndroid: function() {
        return navigator.userAgent.match(/Android/i);
    },
    isBlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    isIOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    isOpera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    isWindows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    isMobile: function() {
        return (Environment.isAndroid() || Environment.isBlackBerry() || Environment.isIOS() || Environment.isOpera() || Environment.isWindows());
    }
};

//set the device type
if(Environment.isMobile())
{
    //console.log("mobile");
    mobile=true;
    window.addEventListener('touchstart',inputTouch);
    window.addEventListener('touchend',inputTouch);
    window.addEventListener('touchmove',inputTouch);
}
else
{
    //console.log("pc");
    mobile=false;
    window.addEventListener('keydown', inputClick);
    window.addEventListener('keyup', inputClick);
    window.addEventListener('click',inputClick);
}