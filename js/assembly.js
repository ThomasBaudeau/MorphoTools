/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*

*/
var group=[]
var li_nodes=[];

function choose_grp(cy) {
    document.querySelector('#check').style.display = 'block';
    cy.nodes().on('click', function(evt) {
            var node=new Node(evt.target.id(),[evt.target.renderedPosition("x"),evt.target.renderedPosition("y")]);
            evt.target.connectedEdges().forEach( elmt => function(){
                if (elmt.data().source==evt.target.id()){
                    node.AddEdge(elmt.data.target(),elmt.data().proba)};
                } );
            li_nodes.push(node);
            console.log(li_nodes);
    });
}

//evt.target.renderedPosition("x")
//console.log(elmt.id())

class Node{
    constructor(id,pos){
        this.id=id;
        this.pos=pos;
        this.link=[];
    }
    static AddEdge(id,prob){
        this.link.push({'id':id,'prob':prob});
    }
}

class Assembly{
    constructor(name,nodes){
        this.nodes=nodes;
        this.name=name
    }
    static makeJson(){
        for (node in this.nodes){
            //construire un JSON
        }
    }
}

///////////////////////////////////////

function check_grp(cy) {
    var id_grp= prompt("Name the group");
    if (id_grp){
        var grp = new Assembly(id_grp, li_nodes);
        li_nodes=[];
        group.push(grp);
        document.querySelector('#check').style.display = 'none';
    }
}

//evt.target.renderedPosition("x")
//console.log(elmt.id())
