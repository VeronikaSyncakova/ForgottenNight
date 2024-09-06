//enemy class
class Enemy{
    position= new Position();

    constructor(image,t_width,t_height,t_x,t_y)
    {
        this.health=100;
        this.sprite=image;
        this.width=t_width;
        this.height=t_height;
        this.position.x=t_x;
        this.position.y=t_y;
        this.action="None";
        this.currentAction=0; //row for animation
        this.currentFrame=0; //colum for animation
        this.actions=["Punch","Block","Kick"]; //possible fight actions
        this.followPlayer=false; //if player is close
        this.unusedBlock=1; //block cooldown
        this.unusedKick=2; //kick cooldown
        //dead image 
        this.powImg=new Image();
        this.powImg.src="assets/img/pow_pow.png";
    }

    restart(img,t_width,t_height,t_x,t_y)
    {//restarts the enemy when they are dead
        console.log("restarted, enemy action: ",this.action);
        this.health=100;
        this.position.x=t_x;
        this.position.y=t_y;
        this.action="None";
        this.currentAction=0;
        this.currentFrame=0;
        this.followPlayer=false;
        this.unusedBlock=1;
        this.unusedKick=2;
        this.sprite=img;
        this.width=t_width;
        this.height=t_height;
    }

    isDead()
    {//death check
        if(this.health<=0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    move(player)
    {//move towards player
        let playerPos=player.position.x+player.width;
        //console.log("player posX: ",playerPos);
        //console.log("enemy posX: ", this.position.x);

        if(playerPos<this.position.x && this.position.x>playerPos)
        {//move left
            //console.log("moving left");
            this.position.x-=3;
            if(this.position.x<playerPos)
            {
                this.position.x=playerPos;
            }
        }
        else if(playerPos>this.position.x && this.position.x<600)
        {//move right
            this.position.x+=3;
        }
    }

    chooseAction()
    {//choosing fight action from array according to the action cooldowns
        this.action=this.actions[Math.floor(Math.random() * this.actions.length)];
        if (this.action==="Block")
        {
            //check cooldown
            if(this.unusedBlock<1)
            {
                this.chooseAction();
            }
            else
            {
                this.unusedBlock=0;
                this.unusedKick++;
            }
        }
        else if (this.action==="Kick" )
        {
            //check cooldown
            if (this.unusedKick<2)
            {
                this.chooseAction();
            }
            else 
            {
                this.unusedKick=0;
                this.unusedBlock++;
            }
        }
        else if (this.action==="Punch")
        {
            this.unusedBlock++;
            this.unusedKick++;
        }
    }

    animate()
    {//animate enemy
        switch(this.action)
        {
            case "Walk":
                if (this.currentAction<1 || this.currentAction>2)
                {
                    this.currentAction=1;
                }
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
            case "Dead":
                this.currentAction=0;
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
        this.currentFrame++;
        if (this.currentFrame > 1) 
        {
            this.currentFrame = 0;
        }
    }

    animateDead()
    {
        this.sprite=this.powImg;//change to death image
        this.width=100;
        this.height=100;
        this.deathLoop++; //loop for animation
        if(this.deathLoop<4)
        {
            this.currentFrame=0;
        }
        else if(this.currentFrame<8)
        {
            this.currentFrame=1;
        }
        else
        {
            this.currentFrame=2;
        }
        
    }

    animateWalk()
    {
        this.currentFrame++;
        
        if (this.currentFrame > 1 && this.currentAction===1) {
            this.currentFrame = 0;
            this.currentAction=2;
        }
        else if (this.currentFrame > 1 && this.currentAction===2) {
            this.currentFrame = 0;
            this.currentAction=1;
        }
    }
}