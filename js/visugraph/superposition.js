/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
avoid or reveal superposition of pictures
*/

function show_superposition(cy){
  let nodes = cy.nodes();
    for (var i = 0; i < nodes.length; i++) {
      for (var j = 0; j < nodes.length; j++) {
        if (i != j){
          if (check_position(nodes[i],nodes[j])){
            nodes[i].style('border-width', 0.1);
            nodes[i].style('border-color', 'orange');
            console.log("superposition highlighted");
          }
        }
      }
    }
    console.log("done");
}
  
function shift_superposition(cy){
  let nodes = cy.nodes();
    for (var i = 0; i < nodes.length; i++) {
      for (var j = 0; j < nodes.length; j++) {
        if (i != j){
          if (check_position(nodes[i],nodes[j])){
            var x_1 = nodes[i].renderedPosition().x;
            var y_1 = nodes[i].renderedPosition().y;
            nodes[i].renderedPosition("x",x_1+10);
            nodes[i].renderedPosition("y",y_1-5);
          }
        }
      }
    }
    console.log("done");
}

function dismiss_borderColor(cy){
  let nodes = cy.nodes();
  for (var i = 0; i < nodes.length; i++){
    if (!(nodes[i].style('border-color','#000'))){
      nodes[i].style('border-color', '#000');
      nodes[i].style('border-width', 0);
    }
  }
}

function check_position(node_1,node_2){
  var x_1 = Math.round(node_1.renderedPosition().x);
  var y_1 = Math.round(node_1.renderedPosition().y);
  var x_2 = Math.round(node_2.renderedPosition().x);
  var y_2 = Math.round(node_2.renderedPosition().y);
  if ((x_1 == x_2 ) && (y_1 == y_2)){
    return true;
  }
  return false;
}