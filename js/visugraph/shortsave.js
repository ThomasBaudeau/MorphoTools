/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
Save graph in session storage as a checkpoint
*/

function shortSave(cy){
<<<<<<< HEAD
//Save the current graph for the duration of the session. To use before experimenting with the nodes
    loadStart("Quick saving...");
    window.sessionStorage.setItem("elements", JSON.stringify( cy.json() ));
    console.log("short save done");
    loadEnd();
    loadEnd_witness();
}
=======
    //Save the current graph for the duration of the session. To use before experimenting with the nodes
        window.sessionStorage.setItem("elements", JSON.stringify( cy.json() ));
        console.log("short save done");
        loadEnd_witness();
    }
>>>>>>> 6af9933197ecd375e8b2511164f634c2eb0e4779
    
function loadShortSave(cy){
//load the graph kept in the sessionStorage
    loadStart("Loading quick save...");
    cy.elements().remove();
    cy.json({ elements: JSON.parse( window.sessionStorage.getItem("elements") ).elements }).layout({ name: 'preset', directed: true, padding: 10 }).run();
    nodes = cy.nodes();
    for (var j = 0; j < nodes.length; j++){
        id = nodes[j].data("id");
        nodes[j].style("background-image", fileURIs.get(id));
    }
    cy.center();
    console.log("loaded json");
<<<<<<< HEAD
    loadEnd();
=======
>>>>>>> 6af9933197ecd375e8b2511164f634c2eb0e4779
    loadEnd_witness();
}