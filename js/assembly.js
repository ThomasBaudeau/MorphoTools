/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*

*/
var groups=new Map();
var li_nodes=[];

function choose_grp(cy) {
    document.querySelector('#check').style.display = 'block';
    cy.nodes().on('click', function(evt) {
            var node=new Node(evt.target.id(),[evt.target.renderedPosition("x"),evt.target.renderedPosition("y")]);
            evt.target.connectedEdges().forEach(function(elmt){
                if (elmt.data().source==evt.target.id()){
                    node.AddEdge(elmt.data().target,elmt.data().proba)};
                });
            li_nodes.push(node);
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
    AddEdge(id,prob){
        this.link.push({'id':id,'prob':prob});
    }
    SetLabel(e,id){
        for(let l =0;l<this.link.length;l++){
            if (l.id==id){
                this.link[l]={'id':this.link[l].id,'prob':this.link[l].prob,'label':e}
            }
        }       
    }
    Getid(){
        return this.id;
    }
    Getposx(){
        return this.pos[0];
    }
    Getposy(){
        return this.pos[1];
    }
    Getedges(){
        return this.link;
    }
}

class Assembly{
    constructor(name,nodes){
        this.nodes=nodes;
        this.name=name
    }
    makeJson(){
            var json = 
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
        let data = {
            "data":{
                "id": this.name,
                "label": this.name,
            },
            "position":{"x":0,"y":0},
            "group":"nodes",
            "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
            };
            json.elements.nodes.push(data);
        var existent_node=[];
        for (let i=0;i<this.nodes.length;i++){
            existent_node.push(this.nodes[i].Getid());
            let data = {
                "data":{
                    "id": this.nodes[i].Getid(),
                    "label": '',
                    "parent":this.name
                },
                "position":{"x":this.nodes[i].Getposx(),"y":this.nodes[i].Getposy()},
                "group":"nodes",
                "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
                };
                json.elements.nodes.push(data);
            }
        var cpt=0;
        for (let y=0;y<this.nodes.length;y++){
            var link=this.nodes[y].Getedges();
            for(let j=0;j<link.length;j++){
                if (existent_node.includes(link[j].id)){
                    let id = 'E' + cpt;
                    cpt++;
                    let data = {
                        "data":{
                        "id": id,
                        "label":link[j].label,
                        "proba":link[j].prob,
                        "source":this.nodes[y].Getid(),
                        "target":link[j].id
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
    makemultiJson(assemblies){
        var existent_node=[];
        var cpt=0;
        var json = 
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
        let data = {
            "data":{
                "id": this.name,
                "label": this.name,
            },
            "position":{"x":0,"y":0},
            "group":"nodes",
            "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
            };
            json.elements.nodes.push(data);
        for (let i=0;i<this.nodes.length;i++){
            existent_node.push(this.nodes[i].Getid());
            let data = {
                "data":{
                    "id": this.nodes[i].Getid(),
                    "label": '',
                    "parent":this.name
                },
                "position":{"x":this.nodes[i].Getposx(),"y":this.nodes[i].Getposy()},
                "group":"nodes",
                "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
                };
                json.elements.nodes.push(data);
            }
        for (let i=0;i<assemblies.length;i++){
            let data = {
                "data":{
                    "id": assemblies[i].getname(),
                    "label": assemblies[i].getname(),
                },
                "position":{"x":0,"y":0},
                "group":"nodes",
                "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
                };
                json.elements.nodes.push(data);
                let nodes=assemblies[i].getNodes();
                var name= assemblies[i].getname();
                for (let i=0;i<nodes.length;i++){
                    existent_node.push(nodes[i].Getid());
                    let data = {
                        "data":{
                            "id": nodes[i].Getid(),
                            "label": '',
                            "parent":name
                        },
                        "position":{"x":nodes[i].Getposx(),"y":nodes[i].Getposy()},
                        "group":"nodes",
                        "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
                        };
                        json.elements.nodes.push(data);
                    }
                for (let y=0;y<nodes.length;y++){
                    var link=nodes[y].Getedges();
                    for(let j=0;j<link.length;j++){
                        if (existent_node.includes(link[j].id)){
                            let id = 'E' + cpt;
                            cpt++;
                            let data = {
                                "data":{
                                "id": id,
                                "label":link[j].label,
                                "proba":link[j].prob,
                                "source":nodes[y].Getid(),
                                "target":link[j].id
                                },
                                "position":{"x":0,"y":0},
                                "group":"edges",
                                "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""
                            };
                            json.elements.edges.push(data);
                        }
                    }
                }
            }
            for (let y=0;y<this.nodes.length;y++){
                var link=this.nodes[y].Getedges();
                for(let j=0;j<link.length;j++){
                    if (existent_node.includes(link[j].id)){
                        let id = 'E' + cpt;
                        cpt++;
                        let data = {
                            "data":{
                            "id": id,
                            "label":link[j].label,
                            "proba":link[j].prob,
                            "source":this.nodes[y].Getid(),
                            "target":link[j].id
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
    getNodes(){
        return this.nodes;
    }
    addNodes(linodes){
        for (let node in linodes){
            this.nodes.push(node);
        }
    }
    getname(){
        return this.name;
    }
    setlabelPosition(){
        var array=this.nodes
        for(let i=0; i<this.nodes.length;i++){
            var slct_node= array.shift();
            slct_node.Getedges().forEach(function(edge){
                array.forEach(function(node){
                    if (node.Getid()==edge.id){
                        let tx=node.Getposx;
                        let ty=node.Getposy;
                        let sy=slct_node.Getposy;
                        let sx=slct_node.Getposx;
                        if(Math.abs(sx-tx)<Math.abs(sy-ty)){
                            if(sy<ty){
                                slct_node.SetLabel('H',edge.id);
                            }
                            else{
                                slct_node.SetLabel('B',edge.id);
                            }
                        }
                        else{
                            if(sx<tx){
                                slct_node.SetLabel('D',edge.id);
                            }
                            else{
                                slct_node.SetLabel('G',edge.id);
                            }
                        }
                    }
                })
            })
        }
    }
}





///////////////////////////////////////

function check_grp(cy) {
    var id_grp= prompt("Name the group");
    if (id_grp){
        var grp = new Assembly(id_grp, li_nodes);
        li_nodes=[];
        groups.set(id_grp,grp);
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
    for (const key of groups.keys()) {
        let grp_name= key;
        let table = document.getElementById('choose_group');
        let line = document.createElement('tr');
        let column = document.createElement('td');
        let checkbox = document.createElement('input');
        let check=document.getElementById(grp_name)
        if (check==null){
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('id', grp_name);
            checkbox.setAttribute('name','select_grp[]')
            let label = document.createElement('label');
            label.setAttribute('for', grp_name);
            label.textContent = grp_name;
            column.appendChild(checkbox);
            column.appendChild(label)
            line.appendChild(column);
            table.appendChild(line);
        }
        count++;
        if (count == groups.size) {
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
            let select = document.getElementsByName('select_grp[]');
            var arrayselect=[];
            for (let i = 0; i < select.length; i++) {
                    if(select[i].id!='box-1' && select[i].checked){
                        let lastgroup=groups.get(select[i].id);
                        lastgroup.setlabelPosition();
                        arrayselect.push(lastgroup);
                    }
                    
                }
            }
            assembly=arrayselect[0];
            if (arrayselect.length>1){
                arrayselect.shift();
                var data= assembly.makemultiJson(arrayselect);
                    
                }
            else{
                var data=assembly.makeJson();
            }
            
        console.log(JSON.parse(data));
        cy.json(JSON.parse(data));
        layout = cy.layout({ name: 'preset', directed: true, padding: 10 });
        layout.run();
        cy.center();
        }
    }
