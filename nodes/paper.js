// TODO: detect linked by multiply links

function Paper(width, height)
{
    var paper = Raphael("drawing",width,height);
    this.width = width;
    this.height = height;
    var nodes = new Array();
    var links = new Array();
    var selectedOne = undefined, selectedTwo = undefined;
    
    Node = function(paper, x, y, radius, color)
    {
        this.radius = radius;
        this.color = color;
        this.position = $V([x,y]);
        this.speed = $V([0,0]);
        this.circle = paper.circle(x, y, this.radius);
        this.circle.attr("fill", this.color);
        this.circle.attr("stroke", "#000");
        this.circle.attr("class", "circ");

        // Calls on every tick - calculates node position by speed vector, also sets color of node and radius
        this.update = function()
        {
            this.position = this.position.add(this.speed);
            this.circle.attr("fill", this.color);
            this.circle.attr('r', this.radius);
            this.circle.attr('cx', this.position.e(1));
            this.circle.attr('cy', this.position.e(2));
        }
    }

    Link = function(nodes, first, second)
    {
        if(nodes[first] == undefined || nodes[second] == undefined)
        {
            return undefined;
        }
        this.first = first;
        this.second = second;
        this.pathValue = "M" + nodes[this.first].position.e(1) + " " + nodes[this.first].position.e(2) + "L" + nodes[this.second].position.e(1) + " " + nodes[this.second].position.e(2)
        this.energy = nodes[this.first].radius < nodes[this.second].radius ? nodes[this.first].radius : nodes[this.second].radius;
        this.path = paper.path(this.pathValue);
        this.path.attr("stroke-width", this.energy / 10);

        // Calls on every tick - calculates position of link by linked nodes positions
        this.update = function()
        {
            // if(nodes[this.first].radius > nodes[this.second].radius)
            // {
            //     nodes[this.second].radius -= 0.001;
            //     nodes[this.first].radius += 0.001;
            // }
            // else if(nodes[this.first].radius < nodes[this.second].radius)
            // {
            //     nodes[this.second].radius += 0.001;
            //     nodes[this.first].radius -= 0.001;
            // }
            this.pathValue = "M" + nodes[this.first].position.e(1) + " " + nodes[this.first].position.e(2) + "L" + nodes[second].position.e(1) + " " + nodes[second].position.e(2)
            this.path.attr('path', this.pathValue)
        }
    }
    
    this.addNode = function(x, y, radius, color)
    {
        nodes.push(new Node(paper, x, y, radius, color));
    }

    this.addLink = function(first, second)
    {
        for(var i=0; i< links.length; i++)
        {
            if(linked(links, first, second))
            {
                return;
            }
        }
        links.push(new Link(nodes, first, second));
    }

    function linked(links, first, second)
    {
        if(first == second)
        {
            return false;
        }
        for(var i = 0; i < links.length; i++)
        {
            if((links[i].first == first && links[i].second == second) || (links[i].first == second && links[i].second == first))
            {
                return true;
            }
            // else
            // {
            //     return linked(links, links[i].second, second);
            // }
        }
        return false;
    }

    // Update on every tick - calculates interaction of nodes and links
    this.update = function()
    {
        for(var i = 0; i < nodes.length; i++)
        {
            // if(nodes[i].radius < 3)
            // {
            //     nodes[i].circle.remove();
            //     nodes.splice(i,1);
            //     i--;
            //     continue;
            // }
            nodes[i].speed = nodes[i].speed.multiply(0.85); // Gradually decrease speed to add inertion
            //nodes[i].speed = $V([0,0]);
            for(var j = 0; j < nodes.length; j++)
            {
                if (i == j)
                {
                    continue;
                }
                dist = nodes[i].position.distanceFrom(nodes[j].position);
                if(dist <= nodes[i].radius + nodes[j].radius)
                {
                    //alert('link between ' + i + ' and ' + j);
                    this.addLink(i,j);
                    dist = nodes[i].radius + nodes[j].radius;
                }
                // if(dist <= 20)
                // {
                //     dist = 20;
                // }
                // Simplify of initial formula (Coulomb repulsion divided by nodes[i].radius to take into account node "mass")
                speedMult =  50 * nodes[j].radius * nodes[i].radius / (dist * dist);
                speed = $V([nodes[i].position.e(1) - nodes[j].position.e(1), nodes[i].position.e(2) - nodes[j].position.e(2)]);
                if(speed.e(1) == 0 && speed.e(2) == 0)
                {
                    speed = $V([Math.random(),Math.random()]);
                }
                speed = speed.toUnitVector();
                speed = speed.multiply(speedMult);
                if(linked(links,i,j))
                {
                    linkMult = dist / (100);// * nodes[i].radius); // Nodes with large mass (radius) moves slowly
                    linkSpeed = speed.multiply(-1);
                    linkSpeed = linkSpeed.toUnitVector();
                    linkSpeed = linkSpeed.multiply(linkMult);
                    speed = speed.add(linkSpeed);
                }
                nodes[i].speed = nodes[i].speed.add(speed);
            }
            nodes[i].update();
        }
        for(var i = 0; i < links.length; i++)
        {
            // if(nodes[links[i].first] == undefined || nodes[links[i].second] == undefined)
            // {
            //     links[i].path.remove();
            //     links.splice(i,1);
            //     i--;
            //     continue;
            // }
            links[i].update();
        }
    }

    // Get node ID by screen coords (for click-on-node select)
    function getNodeId(x,y)
    {
        for(var i = 0; i<nodes.length; i++)
        {
            if(Math.abs(nodes[i].position.e(1) - x) <= nodes[i].radius && Math.abs(nodes[i].position.e(2) - y) <= nodes[i].radius)
            {
                return i;
            }
        }
        return undefined;
    }

    // defines selectedOne and selectedTwo nodes and add new link between them
    this.selectNode = function(x, y)
    {
        index = getNodeId(x,y);
        if(index == undefined)
        {
            return;
        }
        if(selectedOne == undefined)
        {
            selectedOne = index;
            nodes[selectedOne].color = "#00f";
        }
        else if(selectedTwo == undefined)
        {
            selectedTwo = index;
            nodes[selectedTwo].color = "#00f";
        }
        if(selectedOne != undefined && selectedTwo != undefined)
        {
            this.addLink(selectedOne, selectedTwo);
            nodes[selectedOne].color = "#f00";
            nodes[selectedTwo].color = "#f00";
            selectedOne = undefined;
            selectedTwo = undefined;
        }
    }
}