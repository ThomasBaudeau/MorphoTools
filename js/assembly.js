/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*

*/
var li_nodes=[];

function choose_grp(cy) {
    cy.nodes().on('click', function(evt) {
            li_nodes.push(evt.target);
            console.log("position" + evt.target.renderedPosition("x"));
            console.log("id : " + evt.target.id());$
            evt.target.connectedEdges().forEach( elmt => console.log(elmt.data().proba));
            console.log(evt.target);
            console.log(li_nodes);
    });
}

//evt.target.renderedPosition("x")
//console.log(elmt.id())