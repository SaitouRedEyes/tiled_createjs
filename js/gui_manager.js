function GuiManager()
{
	this.textScore;
	
	this.DrawScore = function(score)
	{
		this.textScore = new createjs.Text("Score: " + score, "30px Arial", "#FF0000");
		this.textScore.x = 10;
		this.textScore.y = 10;
		
		stage.addChild(this.textScore);
	}
	
	this.UpdateScore = function(score)
	{
		this.textScore.text = "Score: " + score;
	}
}