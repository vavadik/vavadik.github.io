$(document).ready(function() {
    game = new Game(400,600);
    game.start();
});

Game = function(width, height)
{
    gameField = new Field(width, height);
    grav = 10;
    ball = new Ball(100, 100, 10);

    this.start = function()
    {
        setInterval(update, 20);
    }

    function update()
    {
        ball.update();
    }
    
    function Ball(x, y, radius)
    {
        this.elast = 0.8;
        this.friction = 0.9;
        this.position = $V([x,y]);
        this.speed = $V([1000,0]);
        this.radius = radius;
        this.ro = 1;
        this.mass = Math.PI * this.radius * this.radius * this.ro;
        this.circle = gameField.paper.circle(this.position.e(1), this.position.e(2), this.radius);
        this.gravity = $V([0, grav]);

        this.update = function()
        {
            if(this.position.e(2) >= gameField.realHeight - this.radius)
            {
                this.speed = $V([this.speed.e(1) * this.friction, this.speed.e(2) * -this.elast]);
                this.position = $V([this.position.e(1), gameField.realHeight - this.radius]);
            }
            if(this.position.e(1) >= gameField.realWidth - this.radius)
            {
                console.log('+1');
                this.speed = $V([this.speed.e(1) * - this.elast, this.speed.e(2)]);
                this.position = $V([gameField.realWidth - this.radius, this.position.e(2)]);
            }
            if(this.position.e(1) <= this.radius)
            {
                this.speed = $V([this.speed.e(1) * - this.elast, this.speed.e(2)]);
                this.position = $V([this.radius, this.position.e(2)]);
            }
            this.speed = this.speed.add(this.gravity);
            this.position = this.position.add(this.speed.multiply(1/50));
            this.circle.attr('cx', this.position.e(1));
            this.circle.attr('cy', this.position.e(2));
            console.log(this.speed.modulus());
        }
    }
}

Field = function(rWidth, rHeight)
{
    this.realWidth = rWidth;
    this.realHeight = rHeight;
    this.paper = Raphael(10, 50, this.realWidth, this.realHeight);
    this.fieldArray = [];
}