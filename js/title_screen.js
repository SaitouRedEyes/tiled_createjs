function TitleScreen()
{
	this.Draw = function()
	{
		var titleScreen = new createjs.Bitmap(queue.getResult("titleScreen"));	
			
		var textScore = new createjs.Text("Press Enter to Start", "30px Arial", "#000000");
		textScore.x = 200;
		textScore.y = 250;
		
		stage.addChild(titleScreen);
		stage.addChild(textScore);
		stage.addChild(fade);
	}
}