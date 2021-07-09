/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
Shortsave.js : Save graph in session storage as a checkpoint
Version 1.5.0
*/

function shortSave(cy){
//Save the current graph for the duration of the session. To use before experimenting with the nodes
    loadStart("Quick saving...");
    window.sessionStorage.setItem("elements", JSON.stringify( cy.json() ));
    loadEnd();
    loadEnd_witness();
}
    
function loadShortSave(cy){
//Load the graph kept in the sessionStorage
    loadStart("Loading quick save...");
    cy.elements().remove();
    cy.json({ elements: JSON.parse( window.sessionStorage.getItem("elements") ).elements }).layout({ name: 'preset', directed: true, padding: 10 }).run();
    nodes = cy.nodes();
    for (var j = 0; j < nodes.length; j++){
        id = nodes[j].data("id");
        nodes[j].style("background-image", fileURIs.get(id));
    }
    cy.center();
    loadEnd();
    loadEnd_witness();
}