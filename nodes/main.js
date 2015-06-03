document.oncontextmenu = function() {return false;};
$(document).ready(function() {
    pap = new Paper(1920,1080);
    mouseX=0;
    mouseY=0;
    //alert(-10%1366);
    // Mouse move handler - to detect mouse position
    // $(document).mousemove(function(e) {
    //     mouseX = e.pageX;
    //     mouseY = e.pageY;
    // });
    $('#drawing').mousedown(function(e)
    {
        //var offset = $(this).parent().offset(); 
        var offset =  $(this).offset();
        var relX = e.pageX - offset.left;
        var relY = e.pageY - offset.top;
        var radius = parseFloat($("#radius").val());
        radius = radius == undefined ? 6 : radius;
        switch (e.button)
        {
            case 0: // left button
            r = parseFloat($("#radius").val());
            pap.addNode(relX, relY, r, '#f00');
            break;
            case 2: // right button
            pap.selectNode(relX, relY);
            return false;
            break;
            default: alert('you have a strange mouse');            
        }
    });

    function tick()
    {
        pap.update();
    }

    // Tick
    setInterval(tick, 20);

    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomArbitary(min, max)
    {
      return Math.random() * (max - min) + min;
    }
});
