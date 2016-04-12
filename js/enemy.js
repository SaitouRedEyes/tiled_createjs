function Enemy()
{
	this.bitmap;
	this.moveRight = true;
	this.moveLeft = false;
	this.speedX = 2;
	this.range;
	this.currentRange = 0;
	
	this.Draw = function(n, m)
	{
		var spritesheetData = { images: [queue.getResult("enemy")],
			frames: {
				width:map.layers[n].objects[m].properties['spritewidth'], 
				height:map.layers[n].objects[m].height,
				count:4
			},
			animations: {
				stand:{frames:[0]},
				run:{frames:[0,1,2,3], frequency:4}					
			}
		};

		var spritesheet = new createjs.SpriteSheet(spritesheetData);
		this.bitmap = new createjs.BitmapAnimation(spritesheet);
		this.bitmap.gotoAndStop("stand");
		
		this.bitmap.regX = spritesheetData.frames.width / 2;
		this.bitmap.regY = spritesheetData.frames.height / 2;
		this.bitmap.x = map.layers[n].objects[m].x + this.bitmap.regX;
		this.bitmap.y = map.layers[n].objects[m].y + this.bitmap.regY;
		this.range = map.layers[n].objects[m].width;				
						
		this.bitmap.gotoAndPlay("run");						
								
		view.addChild(this.bitmap);
	}
	
	this.Update = function()
	{
		if(this.moveLeft)
		{
			this.bitmap.x -= this.speedX;
			this.bitmap.scaleX = -1;
			this.currentRange -= this.speedX;
			
			if(this.currentRange <= 0)
			{
				this.moveLeft = false;
				this.moveRight = true;
			}
		}
		else if(this.moveRight)
		{
			this.bitmap.x += this.speedX;
			this.bitmap.scaleX = 1;
			this.currentRange += this.speedX;
			
			if(this.currentRange + (this.bitmap.regX * 2) >= this.range)
			{
				this.moveLeft = true;
				this.moveRight = false;
			}
		}
	}
}