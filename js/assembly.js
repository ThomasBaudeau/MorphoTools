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
    static Getid(){
        return this.id;
    }
}

class Assembly{
    constructor(name,nodes){
        this.nodes=nodes;
        this.name=name
    }
    static makeJson(){
        let json = 
    {"elements": {
      "nodes" : [],
      "edges" : []
    },
    "style": [
      {"selector":"node","style":{"height":"10px","width":"10px","shape":"rectangle","background-fit":"cover","border-color":"rgb(0,0,0)","border-width":"0px","border-opacity":"0.5"}},
      {"selector":"edge","style":{"width":"0.1px","target-arrow-shape":"triangle","arrow-scale":"0.1","line-color":"rgb(0,0,0)","target-arrow-color":"rgb(0,0,0)"}}
    ],
    "data":{},
    "zoomingEnabled":true,
    "userZoomingEnabled":true,
    "zoom":6.009433962264151,
    "minZoom":1e-50,
    "maxZoom":1e+50,
    "panningEnabled":true,
    "userPanningEnabled":true,
    "pan":{"x":-2357.7169811320755,"y":255},
    "boxSelectionEnabled":false,
    "renderer":{"name":"canvas"}
  };
        for (node in this.nodes){
            let data = {
                "data":{
                  "id": node.Getid(),
                  "label": node-1
                },
                "position":{"x":val_x,"y":val_y},
                "group":"nodes",
                "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
              };
              json.elements.nodes.push(data);
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
        cy.nodes().off('click')
    }
}

//evt.target.renderedPosition("x")
//console.log(elmt.id())
