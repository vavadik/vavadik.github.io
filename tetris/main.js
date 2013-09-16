$(document).ready(function()
{
	var game = new Game(300);
	game.start();
})


Game = function(rWidth)
{
	gameField = []
	width = 10;
	height = width * 2;
	field = new Field(rWidth, width);
	speed = 500; // One update per second

	for(var i = -4; i < width + 4; i++)
	{
		gameField[i] = []
		for(var j = 0; j < height; j++)
		{
			gameField[i][j] = 0;
		}
	}

	this.start = function()
	{
		setInterval(update, speed);
		setInterval(draw, 20);
	}

	function update()
	{
		Figure.update();
	}

	function draw()
	{
		for(var i = 0; i < width; i++)
		{
			for(var j = 0; j < height; j++)
			{
				field.setCellStatus(i, j, gameField[i][j]);
			}
		}
	}

	Figure = 
	{
		position: [3, -3],
		form: [[1, 1, 1, 1],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]],

		create: function()
		{

		},

		update: function()
		{
			stop = !this.act('down');
			if(stop)
			{
				for(var i = 0; i < 4; i++)
				{
					for(var j = 0; j < 4; j++)
					{
						gameField[this.position[0] + i][this.position[1] + j] = 
							gameField[this.position[0] + i][this.position[1] + j] == 1 ? 2 : 
							gameField[this.position[0] + i][this.position[1] + j];
					}
				}
				this.position = [3,-4];
				stop = false;
				return;
			}
			this.clear();
			this.draw();
		},

		draw: function()
		{
			for(var i = 0; i < 4; i++)
			{
				for(var j = 0; j < 4; j++)
				{
					if(this.form[j][i] == 1)
					{
						gameField[this.position[0] + i][this.position[1] + j] = this.form[j][i];
					}
				}
			}
		},

		act: function(direction)
		{
			this.clear();
			switch(direction)
			{
				case 'left':
					for(var i = 0; i < 4; i++)
					{
						for(var j = 0; j < 4; j++)
						{
							if(this.form[j][i] == 1 && (this.position[0] + i == 0 || gameField[this.position[0] + i - 1][this.position[1] + j] == 2))
							{
								this.draw();
								return false;
							}
						}
					}
					this.position[0]--;
				break;
				case 'right':
					for(var i = 0; i < 4; i++)
					{
						for(var j = 0; j < 4; j++)
						{
							if(this.form[j][i] == 1 && (this.position[0] + i >= width - 1 || gameField[this.position[0] + i + 1][this.position[1] + j] == 2))
							{
								this.draw();
								return false;
							}
						}
					}
					this.position[0]++;
				break;
				case 'down': 
					for(var i = 0; i < 4; i++)
					{
						for(var j = 0; j < 4; j++)
						{
							if(this.form[j][i] == 1 && (this.position[1] + j + 1 == height || gameField[this.position[0] + i][this.position[1] + j + 1] == 2))
							{
								this.draw();
								return false;
							}
						}
					}
					this.position[1]++;
				break;
				case 'up':
					this.rotate();
				break;
				default: break;
			}
			this.draw();
			return true;
		},

		clear: function()
		{
			for(var i = 0; i < 4; i++)
			{
				for(var j = 0; j < 4; j++)
				{
					if(this.position[0] + i < width && gameField[this.position[0] + i][this.position[1] + j] == 1)
					{
						gameField[this.position[0] + i][this.position[1] + j] = 0;
					}
				}
			}
		},

		rotate: function()
		{
			newForm = [];
			n = this.form.length;
			for(var i = 0; i < n; i++)
			{
				newForm[i] = [];
				for(var j = 0; j < n; j++)	
				{
					newForm[i][j] = this.form[j][n - i - 1];
				}
			}
			this.form = newForm;
			console.log(this.form);
		}
	}

	$('body').bind(
		'keydown',
		function(e){
			direction = e.keyCode == 37 ? 'left' :
						e.keyCode == 38 ? 'up' :
						e.keyCode == 39 ? 'right' :
						'down';
			Figure.act(direction);
		}
	);
}

Field = function(rWidth, fWidth)
{
	this.realWidth = rWidth;
	this.realHeight = this.realWidth * 2;
	this.width = fWidth;
	this.height = fWidth * 2;
	this.paper = Raphael(10, 50, this.realWidth, this.realHeight);
	this.wMult = this.realWidth/this.width; 
	this.hMult = this.realHeight/this.height;
	this.fieldArray = [];

	for(var i = 0; i < this.width; i++)
	{
		this.fieldArray[i] = []
		for(var j = 0; j < this.height; j++)
		{
			this.fieldArray[i][j] = this.paper.rect(i * this.wMult, j * this.hMult, this.wMult, this.hMult);
		}
	}

	this.setCellStatus = function(x, y, status)
	{
		if(status == 1)
		{
	 		this.fieldArray[x][y].attr("fill", "#f00");
	 	}
	 	else if(status == 2)
	 	{
	 		this.fieldArray[x][y].attr("fill", "#00f");
	 	}
	 	else
	 	{
	 		this.fieldArray[x][y].attr("fill", "#fff");
	 	}
	}
}