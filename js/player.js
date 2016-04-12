function Player()
{
	this.bitmap;
	this.moveRight = false;
	this.moveLeft = false;
	this.moveUp = false;
	this.speedX = 2;
	this.onGround = false;
	this.collisionOffset = 10;
	this.jumping = false;
	
	this.Draw = function(n, m)
	{
		var spritesheetData = { images: [queue.getResult("player")],
			frames: {
				width:map.layers[n].objects[m].properties['spritewidth'], 
				height:map.layers[n].objects[m].height,
				count:8
			},
			animations: {
				stand:{frames:[0]},
				run:{frames:[0,1,2,3,4,5,6,7], frequency:4}					
			}
		};

		var spritesheet = new createjs.SpriteSheet(spritesheetData);
		this.bitmap = new createjs.BitmapAnimation(spritesheet);
		this.bitmap.gotoAndStop("stand");
		
		this.bitmap.regX = spritesheetData.frames.width / 2;
		this.bitmap.regY = spritesheetData.frames.height / 2;
		this.bitmap.x = map.layers[n].objects[m].x + this.bitmap.regX;
		this.bitmap.y = map.layers[n].objects[m].y + this.bitmap.regY;
		
		view.addChild(this.bitmap);
	}
	
	this.Update = function()
	{
		if(!this.onGround)
		{
			this.bitmap.y += gravity;
		}
		
		if(this.moveUp && this.onGround) 
		{
			this.jumping = true;
			this.onGround = false;
			
			createjs.Sound.play("jumpSound");
			createjs.Tween.get(this.bitmap).to({y:this.bitmap.y - (this.bitmap.regY * 4)}, 250).call(this.Fall);
		}
		
		if(this.moveLeft)
		{
			this.bitmap.x -= this.speedX;
			this.bitmap.scaleX = -1;
			this.PlayerRunAnimationControl();
		}
		else if(this.moveRight)
		{
			this.bitmap.x += this.speedX;
			this.bitmap.scaleX = 1; 
			this.PlayerRunAnimationControl();
		}
		
		for(i = 0; i < coins.length; i++)
		{
			if(ImageObjectCollision(this.bitmap, coins[i], this.collisionOffset))
			{
				createjs.Sound.play("coinSound");
				view.removeChild(coins[i]);
				coins.splice(i, 1);
				guiManager.UpdateScore(currentScore += 10)
				break;
			}
		}
		
		if(JSONObjectCollision(this.bitmap, transitionObject, this.collisionOffset) && !fadeTransition)
		{
			FadeOut();
		}
		
		for(i = 0; i < collisionTiles.length; i++)
		{
			if(this.bitmap != null && collisionTiles[i].bitmap != null && collisionTiles[i].type == 0 && 
			   ImageObjectCollision(this.bitmap, collisionTiles[i].bitmap, this.collisionOffset)) //solid
			{		
				//collisionTiles[i].bitmap.alpha = 0.5;
				
				//----Ground----
				if(this.bitmap.y < collisionTiles[i].bitmap.y && this.bitmap.y + this.bitmap.regY < collisionTiles[i].bitmap.y) 
				{
					//console.log("ground");
					this.onGround = true;
					break;
				}
				//----Wall Left----
				else if(this.bitmap.x > collisionTiles[i].bitmap.x && this.bitmap.y < collisionTiles[i].bitmap.y + collisionTiles[i].bitmap.regY) 
				{
					//console.log("wallLeft");
					this.bitmap.x += this.speedX;
				}
				//----Wall Right----
				else if(this.bitmap.x < collisionTiles[i].bitmap.x && this.bitmap.y < collisionTiles[i].bitmap.y + collisionTiles[i].bitmap.regY) 
				{
					//console.log("wallRight");
					this.bitmap.x -= this.speedX;
				}
				//----Ceiling----
				else if(this.jumping && this.bitmap.y > collisionTiles[i].bitmap.y && 
				Math.abs(this.bitmap.y - this.bitmap.regY) < (collisionTiles[i].bitmap.y + collisionTiles[i].bitmap.regY) + this.collisionOffset &&
				Math.abs(this.bitmap.x - collisionTiles[i].bitmap.x) + this.collisionOffset < (this.bitmap.regX + collisionTiles[i].bitmap.regX) - this.collisionOffset) 
				{
					//console.log("ceiling");
					createjs.Tween.removeTweens(this.bitmap);
					this.jumping = false;
				}
			}
			else if(this.bitmap != null && collisionTiles[i].bitmap != null && collisionTiles[i].type == 1 && 
			ImageObjectCollision(this.bitmap, collisionTiles[i].bitmap, this.collisionOffset)) //platform
			{	
				if(this.bitmap.y < collisionTiles[i].bitmap.y && this.bitmap.y + this.bitmap.regY < collisionTiles[i].bitmap.y)
				{
					//console.log("platform");
					this.onGround = true;
					break;
				}
			}
			else //não colide
			{	
				//collisionTiles[i].bitmap.alpha = 1;
				
				if(i >= collisionTiles.length - 1) // passei por todos os tiles e não colidi com nenhum;
				{
					this.jumping = this.onGround = false;
				}
			}
		}
	}
	
	this.PlayerRunAnimationControl = function()
	{
		if(this.bitmap.paused)
		{
			this.bitmap.gotoAndPlay("run");
		}
	}
	
	this.Fall = function()
	{
		player.jumping = false;
	}
}