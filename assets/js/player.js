//player class
class Player{
    position= new Position();

    constructor(image,t_width,t_height,t_x,t_y)
    {
        this.health=100;
        this.shots=0;
        this.sprite=image;
        this.width=t_width;
        this.height=t_height;
        this.position.x=t_x;
        this.position.y=t_y;
        this.action="None";
        this.currentAction=0; //row animation
        this.currentFrame=1; //colm animation
        this.deathLoop=0; //timer for death animation
    }

    restart(t_x,t_y)
    {//restarts player
        this.health=100;
        this.position.x=t_x;
        this.position.y=t_y;
        this.action="None";
        this.currentAction=0;
        this.currentFrame=1;
        this.deathLoop=0;
    }

    isDead()
    {//checks if player dyied
        if(this.health<=0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    animate()
    {//animates player
        console.log("Plaer action: ",this.action);
        switch(this.action)
        {
            case "Walk":
                this.animateWalk();
                break;
            case "None":
                this.currentAction=0;
                this.animateIdle();
                break;
            case "Punch":
                this.currentAction=4;
                this.animateIdle();
                break;
            case "Block":
                this.currentAction=3;
                this.animateIdle();
                break;
            case "Kick":
                this.currentAction=5;
                this.animateIdle();
                break;
            case "ClaimShot":
                this.currentAction=0;
                this.animateIdle();
                break;
            case "Dead":
                this.currentAction=6;
                this.animateDead();
                break;
            default:
                this.currentAction=0;
                this.animateIdle();
                break;
        }

        
    }

    animateIdle()
    {
        this.currentFrame--;
        if (this.currentFrame < 0) 
        {
            this.currentFrame = 1;
        }
    }

    animateDead()
    {
        this.deathLoop++;
        //dying slow animation
        if(this.deathLoop<7)
        {
            this.currentFrame=1;
        }
        else
        {
            this.currentFrame=0;
        }
        //swith to endscreen
        if(this.deathLoop>14)
        {
            gameState="EndScreen";
            this.health=100;
        }
    }

    animateWalk()
    {
        this.currentFrame--;
        
        if (this.currentFrame < 0 && this.currentAction===1) {
            this.currentFrame = 1;
            this.currentAction=2;
        }
        else if (this.currentFrame < 0 && this.currentAction===2) {
            this.currentFrame = 1;
            this.currentAction=1;
        }
    }

    moveRight()
    {
       // console.log("move right");
        if(this.position.x+this.width <= 600 )
        {
            this.position.x+=3;
        }
    }

    moveLeft()
    {
        //console.log("move left");
        if(this.position.x > 100)
        {
            this.position.x-=3;

        }
        if (this.position.x<100)
        {
            this.position.x=0;
        }
    }
}