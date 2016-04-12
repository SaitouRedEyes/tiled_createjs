function VictoryScreen()
{
	this.Draw = function()
	{
		var victoryScreen = new createjs.Bitmap(queue.getResult("victoryScreen"));	
			
		var text = new createjs.Text("Press Enter to Restart", "30px Arial", "#FF0000");
		text.x = 200;
		text.y = 250;
		
		stage.addChild(victoryScreen);
		stage.addChild(text);
		stage.addChild(fade);
	}
}