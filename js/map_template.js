function MapTemplate()
{
	var parallaxBackground1;
	var parallaxBackground2;
	var spriteSheet;
	var spriteSheetCollision;
	
		
	this.Draw = function(d)
	{
		map = d;
		
		player = new Player();
		itemManager = new ItemManager();
		coins = new Array();
		guiManager = new GuiManager();
		collisionTiles = new Array();
		parallaxBackground1 = new Array();
		parallaxBackground2 = new Array();		
		
		view = new createjs.Container();
		
		stage.addChild(view);
		
		var spritesheetData = { images: [queue.getResult("level1Spritesheet")],
			frames: {
				width:map.tilesets[0].tilewidth, 
				height:map.tilesets[0].tileheight
			}
		};
		
		var spritesheetDataCollision = { images: [queue.getResult("spritesheetCollision")],
			frames: {
				width:map.tilesets[1].tilewidth, 
				height:map.tilesets[1].tileheight
			}
		};

		spriteSheet = new createjs.SpriteSheet(spritesheetData);
		spriteSheetCollision = new createjs.SpriteSheet(spritesheetDataCollision);
		
		collisionTilesFGID = map.tilesets[1].firstgid;
		
		this.ProcessLayers();
	}
	
	this.ProcessLayers = function()
	{
		for(n in map.layers)
		{
			if(map.layers[n].type == 'tilelayer' )
			{
				this.AddTiles(n);	
			}
			else if(map.layers[n].type == 'imagelayer' )
			{
				this.AddParallaxBackground(n);	
			}
			else if(map.layers[n].type == 'objectgroup' )
			{
				if(map.layers[n].name == "Entities")
				{
					for(m in map.layers[n].objects)
					{
						if(map.layers[n].objects[m].name == "mainPlayer")
						{
							player.Draw(n, m);
						}
						else if(map.layers[n].objects[m].name == "CoinEntity")
						{
							itemManager.DrawCoin(n, m);
						}
						else if(map.layers[n].objects[m].name == "transition")
						{
							transitionObject = map.layers[n].objects[m];
						}
					}
				}
				else if(map.layers[n].name == "EnemyEntities")
				{
					for(m in map.layers[n].objects)
					{
						if(map.layers[n].objects[m].name == "EnemyEntity")
						{
							enemy.Draw(n, m);
						}
					}
				}
			}
		}
		
		this.AddInterface();
	}
	
	this.AddTiles = function(n)
	{
		var x = 0;
		var y = 0;
		var counter = 0;

		for(i in map.layers[n].data)
		{
			// identifica imagem baseada no tile set
			var tile = new Object();			
			tile.bitmap = map.layers[n].name != "collision" ? new createjs.BitmapAnimation(spriteSheet) : new createjs.BitmapAnimation(spriteSheetCollision);
			
			tile.tid = map.layers[n].data[i];
			tile.bitmap.gotoAndStop(tile.tid - 1);
			tile.bitmap.regX = map.tilewidth / 2;
			tile.bitmap.regY = map.tileheight / 2;
			tile.bitmap.x = x + tile.bitmap.regX;
			tile.bitmap.y = y + tile.bitmap.regY;
			
			if(map.layers[n].name == "collision")
			{
				tile.bitmap.gotoAndStop(tile.tid - collisionTilesFGID);
				tile.type = Math.abs(tile.tid - collisionTilesFGID);
				
				collisionTiles.push(tile);
			}
			
			if(map.layers[n].visible)
			{
				view.addChild(tile.bitmap);
			}
			
			x += map.tilewidth;

			counter ++;
			if(counter >= map.layers[n].width )
			{
				counter = 0;
				y = y + map.tileheight;
				x = 0;
			}
		}
	}

	this.AddParallaxBackground = function(n)
	{
		if(map.layers[n].name == "Parallax1")
		{
			for(i = 0; i < 2; i++)
			{
				parallaxBackground1[i] = new createjs.Bitmap(queue.getResult("backgroundParallax0"));	
				parallaxBackground1[i].x = i * parallaxBackground1[i].image.width;
			
				view.addChild(parallaxBackground1[i]);
			}
		}	
		else if(map.layers[n].name == "Parallax2")
		{
			for(i = 0; i < 2; i++)
			{
				parallaxBackground2[i] = new createjs.Bitmap(queue.getResult("backgroundParallax1"));	
				parallaxBackground2[i].x = i * parallaxBackground2[i].image.width;
			
				view.addChild(parallaxBackground2[i]);
			}
		}
		else if(map.layers[n].name == "Fade")
		{	
			fade.x = (numberOfScreens * fade.image.width) - fade.image.width; 
			fade.alpha = 0;
		
			view.addChild(fade);
		}
	}
	
	this.AddInterface = function()
	{
		guiManager.DrawScore(currentScore);
	}
}