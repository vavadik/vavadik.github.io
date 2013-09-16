$(document).ready(function() {
    pap = new Paper(1366,768);
    mouseX=0;
    mouseY=0;
    //alert(-10%1366);
    // Mouse move handler - to detect mouse position
    // $(document).mousemove(function(e) {
    //     mouseX = e.pageX;
    //     mouseY = e.pageY;
    // });
    $('#drawing').click(function(e)
    {
        //var offset = $(this).parent().offset(); 
        var offset =  $(this).offset();
        var relX = e.pageX - offset.left;
        var relY = e.pageY - offset.top;
        switch (e.which)
        {
            case 1: // left button
            r = parseFloat($("#radius").val());
            pap.addNode(relX, relY, r, '#f00');
            break;
            case 2: // middle button
            pap.selectNode(relX, relY);
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