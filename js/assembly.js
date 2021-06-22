/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*

*/
var li_nodes=[];

function choose_grp(cy) {
    document.querySelector('#assemble_div').style.display = 'block';
    setTimeout(function(){
        document.querySelector('#assemble_div').style.display = 'block';
    },1000)

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