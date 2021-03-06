/*
Thomas Baudeau / Gregory Bordier / Valentin Gonay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
ExportFinalImage.js : Exportation of the graph as a jpg
July 9 2021
Version 1.5.0
*/

'use strict'

function exportJPG(cy){
// Draw and export the picture
    // prepare canvas
    const canvas = document.getElementById("export_canvas");
    const racine = document.createElement('canvas');
    const ctx = racine.getContext('2d');
    canvas.appendChild(racine);
    // set size of the canvas
    racine.setAttribute("width", window.innerWidth/2);
    racine.setAttribute("height", window.innerHeight);
    var a = document.createElement("a");
    let nodes = cy.nodes(); // list of nodes
    let maximum = max(nodes); // maxium y value
    let threshold = ThresholdLine(maximum); // threshold value for lines calculation
    let lines = sortNodesInlines(maximum,threshold,nodes);
    var y = (lines.length*75);
    for (var i = 0; i < lines.length; i++) {
        sortLeftRight(lines[i]);
        var x = 0;
        for(var j = 0; j < lines[i].length; j++) {
            var img = new Image(); 
            let node_img = lines[i][j].style("background-image");
            img.src = node_img;
            ctx.drawImage(img,x,y,75,75);
            x = x + 75;
        }
        y = y - 75;
    }
    var dataURL = racine.toDataURL('image/jpeg', 1.0);
    a.href = dataURL;
    a.download = `${new Date().getTime()}.jpg`;;
    a.click();
    window.URL.revokeObjectURL(dataURL);
}

function max(nodes){
    // compute maximum y value of the graph 
    let max = 0;
    let nodeMax = nodes[0];
    for (var j = 0; j < nodes.length; j++) {
        let position = nodes[j].relativePosition();
        let y = position.y;
        if(y>max){
            max = y;
            nodeMax = nodes[j];
        }
    }
    return nodeMax;
}

function ThresholdLine(node_max){
    // compute threshold value used to calculate the number of lines required
    let threshold = parseInt(node_max.height())/3;
    return Math.floor(threshold);
}

function sortNodesInlines(maximum,threshold,nodes){
    // push nodes in the right line using their on-screen y coordinate
    let max_position = maximum.renderedPosition();
    const nbr_l = numberOfLines(maximum,max_position,nodes);
    let big_array = [];
    for (let i=0;i < nbr_l;i++){
        big_array.push([]);
    }
    for (var i = 0; i < nodes.length; i++) {
        let node_position = nodes[i].relativePosition();
        let diff = max_position.y - node_position.y;
        let position_in_line = Math.floor(diff/parseInt(nodes[i].height()));
        big_array[position_in_line].push(nodes[i]);
    }
    return big_array;
}

function numberOfLines(maximum,max_position,nodes){
    // calculate number of lines of the final image
    let diff_max = 0;
    for (var i = 0; i < nodes.length; i++) {
        let node_position = nodes[i].relativePosition();
        let diff = max_position.y - node_position.y;
        if (diff > diff_max){diff_max = diff;}
    }
    return Math.ceil(diff_max/parseInt(maximum.height()));
}

function sortLeftRight(line){
    // sort images using their on screen x coordinate
    line.sort(function (a, b) {
        return a.x - b.x;
    });
}

function exportJPG2(cy) {
    // export jpg using cytoscape' integrated method
    dismiss_borderColor(cy);
    let blob = cy.jpg({output: 'blob', bg: 'transparent', 
      full: true, scale: 4, quality: 1});
    let aLink = document.createElement('a');
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true);
    aLink.download = `${new Date().getTime()}.jpg`;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
    aLink.click();
}