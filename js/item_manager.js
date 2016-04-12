function ItemManager()
{
	this.DrawCoin = function(n, m)
	{
		var spritesheetData = { images: [queue.getResult("coin")],
			frames: {
				width:map.layers[n].objects[m].properties['spritewidth'], 
				height:map.layers[n].objects[m].height,
				count:8
			},
			animations: {
				rotation:{frames:[0,1,2,3,4,5,6,7], frequency:4}					
			}
		};

		var spritesheet = new createjs.SpriteSheet(spritesheetData);
		var coin = new createjs.BitmapAnimation(spritesheet);
		coin.gotoAndPlay("rotation");
		
		coin.regX = spritesheetData.frames.width / 2;
		coin.regY = spritesheetData.frames.height / 2;
		coin.x = map.layers[n].objects[m].x + coin.regX;
		coin.y = map.layers[n].objects[m].y + coin.regY;
		
		coins.push(coin);
		view.addChild(coin);
	}
}