/*
SAUVESTRE Clément / JACQUES Patrick / GOMES Enzo
Sauvegarde du graphe dans le session storage sous format JSON
Permet de réaliser un équivalent d'UNDO à la précédente sauvegarde
*/

function shortSave(cy){
    //Save the current graph for the duration of the session. To use before experimenting with the nodes
        window.sessionStorage.setItem("elements", JSON.stringify( cy.json() ));
        console.log("short save done");
    }
    
function loadShortSave(cy){
//Permet de réaliser un équivalent d'UNDO à la précédente sauvegarde
//load the graph kept in the sessionStorage
    cy.elements().remove();
    cy.json({ elements: JSON.parse( window.sessionStorage.getItem("elements") ).elements }).layout({ name: 'preset' }).run();
    nodes = cy.nodes();
    for (var j = 0; j < nodes.length; j++){
        id = nodes[j].data("id");
        nodes[j].style("background-image", fileURIs.get(id));
    }
    console.log("loaded json");
}