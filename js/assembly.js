/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*

*/
var groups=new Map();
var li_nodes=[];

function choose_grp(cy) {
    document.querySelector('#check').style.display = 'block';
    document.querySelector('#cancel').style.display = 'block';
    cy.nodes().on('click', function(evt) {
        var node = new Node(evt.target.id(), [evt.target.renderedPosition("x"), evt.target.renderedPosition("y")], evt.target.style("background-image"));
            evt.target.connectedEdges().forEach(function(elmt){
                if (elmt.data().source==evt.target.id()){
                    node.AddEdge(elmt.data().target,elmt.data().proba)};
                });
            li_nodes.push(node);
            evt.target.style('borderWidth',1);
            evt.target.style('borderColor','red');
    });
}

//evt.target.renderedPosition("x")
//console.log(elmt.id())

class Node{
    constructor(id,pos,style){
        this.id=id;
        this.pos=pos;
        this.link=[];
        this.style=style
    }
    AddEdge(id,prob){
        this.link.push({'id':id,'prob':prob});
    }
    SetLabel(e,id){
        for(let l =0;l<this.link.length;l++){
            if (this.link[l].id==id){
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
    Getstyle() {
        return this.style;
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
        for(let i=0; i<this.nodes.length;i++){
            var slct_node= this.nodes[i];
            var edges=slct_node.Getedges()
            for(let v=0;v<edges.length;v++){
                for(let d=0;d<this.nodes.length;d++){
                    if (this.nodes[d].Getid()==edges[v].id){
                        let tx=this.nodes[d].Getposx();
                        let ty=this.nodes[d].Getposy();
                        let sy=slct_node.Getposy();
                        let sx=slct_node.Getposx();
                        if(Math.abs(sx-tx)<Math.abs(sy-ty)){
                            if(sy<ty){
                                this.nodes[i].SetLabel('H',edges[v].id);
                            }
                            else{
                                this.nodes[i].SetLabel('B',edges[v].id);
                            }
                        }
                        else{
                            if(sx<tx){
                                this.nodes[i].SetLabel('D',edges[v].id);
                            }
                            else{
                                this.nodes[i].SetLabel('G',edges[v].id);
                            }
                        }
                    }
                }
            }
        }
    }

    FindNodeStyle(node){
        for (let i=0;i<this.nodes.length;i++){
            if (this.nodes[i].Getid()==node){
                return this.nodes[i].Getstyle();
            }
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
        document.querySelector('#cancel').style.display = 'none';
        cy.nodes().off('click')
    }
    cy.nodes().off('click');
    cy.nodes().style('borderWidth',0);
}

function cancel_grp(cy) {
    document.querySelector('#check').style.display = 'none';
    cy.nodes().off('click');
    cy.nodes().style('borderWidth',0);
    document.querySelector('#cancel').style.display = 'none';
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
        let column1 = document.createElement('td'); //closing cross
        let column2 = document.createElement('td');
        let column3 = document.createElement('td');
        let column4 = document.createElement('td');
        let checkbox = document.createElement('input');
        let check=document.getElementById(grp_name)

        //Closing_cross
        let container = document.createElement('div');
        container.setAttribute('class', 'close-container');
        
        let lr_div = document.createElement('div');
        lr_div.setAttribute('class','leftright');
        container.appendChild(lr_div);

        let rl_div = document.createElement('div');
        rl_div.setAttribute('class','rightleft');
        container.appendChild(rl_div);

        let del_label = document.createElement('label');
        del_label.setAttribute('class','delet_group');
        del_label.innerHTML = "Delete"
        container.appendChild(del_label);

        //Dots
        let container2 = document.createElement('div');
        container2.setAttribute('class', 'wave');

        let lr_div2 = document.createElement('span');
        lr_div2.setAttribute('class', 'dot');
        container2.appendChild(lr_div2);
        let lr_div3 = document.createElement('span');
        lr_div3.setAttribute('class', 'dot');
        container2.appendChild(lr_div3);
        let lr_div4 = document.createElement('span');
        lr_div4.setAttribute('class', 'dot');
        container2.appendChild(lr_div4);
        
        //Observation couleur sélectionnée
        let colorWell = document.createElement('input');
        colorWell.setAttribute('type','color');
        colorWell.setAttribute('value','#ff0000');
        colorWell.setAttribute('id','colorWell');


        if (check==null){
            let image = document.createElement('img');
            image.setAttribute('id','choice-color');
            image.setAttribute('onclick','color_grp()');
            image.setAttribute('src', 'images/droplet.png');
            image.setAttribute('style', 'opacity:1')
            image.setAttribute('width', '20px')
            image.setAttribute('height', '20px')

            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('id', grp_name);
            checkbox.setAttribute('name','select_grp[]');
            
            let label = document.createElement('label');
            label.setAttribute('for', grp_name);
            label.textContent = grp_name;

            column1.appendChild(container);

            column2.appendChild(checkbox);
            column2.appendChild(label);
            column3.appendChild(container2)

            column4.appendChild(colorWell);

            line.appendChild(column1);
            line.appendChild(column2);
            line.appendChild(column3);
            line.appendChild(column4);
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
        let color = document.querySelector('#colorWell').value;
        console.log(color);
        select_grp(color);
        document.querySelector('.choose-group').style.display = 'none';
    });


function select_grp(color) {
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
                        lastgroup.getNodes().length
                        lastgroup.setlabelPosition();
                        lastgroup.getNodes().length
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
            
        cy.json(JSON.parse(data));
        reloadStyle(color)
        layout = cy.layout({ name: 'preset', directed: true, padding: 10 });
        layout.run();
        cy.center();
        }
    }

function reloadStyle(color){
    nodes=cy.nodes();
    for (let i=0;i<nodes.length;i++){
        if (nodes[i].style("background-image")=='none'&& nodes[i].data().label==''){
            let ungroupe=groups.get(nodes[i].data().parent);
            nodes[i].style("background-image",ungroupe.FindNodeStyle(nodes[i].data().id));
        }
        else {
            nodes[i].style("background-color",color);
        }
    }
}


/*Choisir la couleur du groupe parent*/

function startup() {
    var colorWell;
    var defaultColor = "#0000ff";
    window.addEventListener("load", startup, false);

    colorWell = document.querySelector("#colorWell");
    colorWell.value = defaultColor;
    colorWell.addEventListener("input", updateFirst, false);
    colorWell.addEventListener("change", updateAll, false);
    colorWell.select();
}

function updateFirst(event) {
    var p = document.querySelector("p");
  
    if (p) {
      p.style.color = event.target.value;
    }
  }

function updateAll(event) {
document.querySelectorAll("p").forEach(function(p) {
    p.style.color = event.target.value;
});
}
  