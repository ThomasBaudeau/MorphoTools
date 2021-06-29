/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
avoid or reveal superposition of pictures
*/

function show_superposition(cy){
// Add a small orange outline to stacked nodes
  let nodes = cy.nodes();
    for (var i = 0; i < nodes.length; i++) {
      for (var j = 0; j < nodes.length; j++) {
        if (i != j){
          if (check_position(nodes[i],nodes[j])){
            nodes[i].style('border-width', 0.1);
            nodes[i].style('border-color', 'orange');
          }
        }
      }
    }
}
  
function shift_superposition(cy){
// slightly move away from each others nodes within a stack
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
}

function dismiss_borderColor(cy){
// remove the colored outline
  let nodes = cy.nodes();
  for (var i = 0; i < nodes.length; i++){
    if (!(nodes[i].style('border-color','#000'))){
      nodes[i].style('border-color', '#000');
      nodes[i].style('border-width', 0);
    }
  }
}

function check_position(node_1,node_2){
// take the rendered position of two nodes and check that they are not superposed
  var x_1 = Math.round(node_1.renderedPosition().x);
  var y_1 = Math.round(node_1.renderedPosition().y);
  var x_2 = Math.round(node_2.renderedPosition().x);
  var y_2 = Math.round(node_2.renderedPosition().y);
  if ((x_1 == x_2 ) && (y_1 == y_2)){
    return true;
  }
  return false;
}