/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
Save graph in session storage as a checkpoint
*/

function shortSave(cy){
    //Save the current graph for the duration of the session. To use before experimenting with the nodes
        window.sessionStorage.setItem("elements", JSON.stringify( cy.json() ));
        console.log("short save done");
    }
    
function loadShortSave(cy){
//load the graph kept in the sessionStorage
    cy.elements().remove();
    cy.json({ elements: JSON.parse( window.sessionStorage.getItem("elements") ).elements }).layout({ name: 'circle' }).run();
    nodes = cy.nodes();
    for (var j = 0; j < nodes.length; j++){
        id = nodes[j].data("id");
        nodes[j].style("background-image", fileURIs.get(id));
    }
    console.log("loaded json");
}