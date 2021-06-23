/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*

*/
var groups=[]
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
    static Getposx(){
        return this.pos[0];
    }
    static Getposy(){
        return this.pos[1];
    }
    static Getedges(){
        return this.link;
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
        let existent_node=[];
        existent_node.push(node.Getid());
        let data = {
            "data":{
                "id": node.Getid(),
                "label": node-1
            },
            "position":{"x":node.Getposx(),"y":node.Getposy()},
            "group":"nodes",
            "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
            };
            json.elements.nodes.push(data);
        }
    let cpt=0
    for (node in this.nodes){
        let link=node.Getedges();
        for(let i=0;i<link.length;i++){
            if (existent_node.includes(link[i].id)){
                let id = 'E' + cpt;
                cpt++;
                let data = {
                    "data":{
                      "id": id,
                      "label":"",
                      "proba":link[i].prob,
                      "source":node.Getid(),
                      "target":link[i].id
                    },
                    "position":{"x":0,"y":0},
                    "group":"edges",
                    "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""
                  };
                  json.elements.edges.push(data);
                }
            }   

        }
        return JSON.stringify(json)
    }
}




///////////////////////////////////////

function check_grp(cy) {
    var id_grp= prompt("Name the group");
    if (id_grp){
        var grp = new Assembly(id_grp, li_nodes);
        li_nodes=[];
        groups.push(grp);
        document.querySelector('#check').style.display = 'none';
        cy.nodes().off('click')
    }
    cy.nodes().off('click');
}


//evt.target.renderedPosition("x")
//console.log(elmt.id())

/* Choix du groupe à afficher */

document.getElementById('grp').addEventListener('click',
function () {
    chooseGroup();
});

function chooseGroup() {
    var count=0;
    // if(groups.length>1){
    //     document.querySelector('.choose-group').style.display = 'flex';
    //     return
    // }
    // loadStart('loading groups');
    for (let i=0; i<groups.length; i++) {
        var grp_name= groups[i].name;
        let table = document.getElementById('choose_group');
        let line = document.createElement('tr');
        let column = document.createElement('td');
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', grp_name);
        let label = document.createElement('label');
        label.setAttribute('for', grp_name);
        label.textContent = grp_name;
        column.appendChild(checkbox);
        column.appendChild(label)
        line.appendChild(column);
        table.appendChild(line);
        count++;
        if (count == groups.length) {
            loadEnd();
            document.querySelector('.choose-group').style.display = 'flex';
        }
    }
}

document.getElementById('choose-grp-close').addEventListener('click',
    function () {
        document.querySelector('.choose-group').style.display = 'none';
    });

document.getElementById('send_grp').addEventListener('click',
    function () {
        select_grp();
        document.querySelector('.choose-group').style.display = 'none';
    });


function select_grp() {
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if (check_bool === 'true') {
        if (document.getElementById("error_message") !== null) {
            var error = document.getElementById("error_message");
            error.parentNode.removeChild(error);
        }
        //vérif de chargement de cy
        if (cy === undefined) {
            let window = document.getElementById('choose-grp');
            let error = document.createElement('p');
            error.setAttribute('id', "error_message");
            error.innerHTML = "Error, matrix must be imported";
            window.appendChild(error);
        }
        else{
            let select = document.getElementsByName('select[]');
            var arrayselect = [];
            for (let i = 0; i < select.length; i++) {
                if (select[i].checked) {
                    if (select[i]){
                    }
                }
            }
        }
    }
}