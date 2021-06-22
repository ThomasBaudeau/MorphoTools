/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*

*/
var li_nodes=[];

class Node{
    constructor(id,pos){
        this.id=li_nodes;
        this.pos=pos;
        this.link=[];
    }
    static AddEdge(id,prob){
        this.link.push({'id':id,'prob':prob});
    }
}

class Assembly{
    constructor(nodes){
        this.nodes=nodes;
    }
    static makeJson(){
        for (node in this.nodes){
            //construire un JSON
        }
    }
}

///////////////////////////////////////

function choose_grp(cy) {
    cy.nodes().on('click', function(evt) {
            li_nodes.push(evt.target);
            console.log("position" + evt.target.renderedPosition("x"));
            console.log("id : " + evt.target.id());$
            evt.target.connectedEdges().forEach( elmt => console.log(elmt.data()));
            console.log(evt.target);
            console.log(li_nodes);
    });
}

function check_grp(cy) {
    document.querySelector('#check').style.display = 'block';
}

//evt.target.renderedPosition("x")
//console.log(elmt.id())
