/*
SAUVESTRE Clément / JACQUES Patrick / GOMES Enzo
Exportation du graphe sous forme d'image
*/

'use strict'

function exportJPG(cy){
    const canvas = document.getElementById("export_canvas");
    const racine = document.createElement('canvas');
    const ctx = racine.getContext('2d');
    canvas.appendChild(racine);
    racine.setAttribute("width", window.innerWidth/2);
    racine.setAttribute("height", window.innerHeight);
    var a = document.createElement("a");
    let nodes = cy.nodes();
    let maximum = max(nodes);
    let threshold = ThresholdLine(maximum);
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
    a.download = "papyrus.jpg";
    a.click();
    window.URL.revokeObjectURL(dataURL);
    console.log("image placée");

}

function max(nodes){
    let max = 0;
    let nodeMax;
    for (var j = 0; j < nodes.length; j++) {
        let position = nodes[j].relativePosition();
        let y = position.y;
        if(y>max){
            max = y;
            nodeMax = nodes[j];
        }
    }
    console.log("taille max:",nodeMax.height());
    return nodeMax;
}

function ThresholdLine(node_max){
    let threshold = parseInt(node_max.height())/3;
    return Math.floor(threshold);
}

function sortNodesInlines(maximum,threshold,nodes){
    let max_position = maximum.renderedPosition();
    const nbr_l = numberOfLines(maximum,max_position,nodes);
    console.log("nombre de lignes:",nbr_l);
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
    let diff_max = 0;
    for (var i = 0; i < nodes.length; i++) {
        let node_position = nodes[i].relativePosition();
        let diff = max_position.y - node_position.y;
        if (diff > diff_max){diff_max = diff;}
    }
    return Math.ceil(diff_max/parseInt(maximum.height()));
}

function sortLeftRight(line){
    line.sort(function (a, b) {
        return a.x - b.x;
    });
}

function exportJPG2(cy) {
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