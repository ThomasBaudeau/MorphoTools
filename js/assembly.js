/*
    Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*
    Creating groups of images
*/
var groups=new Map(); // Dictionary to record the different groups
var li_nodes=[]; // Array to save selected images
var li_color=new Map(); // Dictionary to record the selected color for each group

function delete_group(container) {
    // Function to delete a group
    groups.delete(container.attributes.getNamedItem('value').value)
    container.parentNode.parentNode.parentNode.removeChild(container.parentNode.parentNode)
}

function choose_grp(cy) {
    if (document.getElementById('cy').style.visibility!="hidden"){
    // Selection and recording of images to create a group 
    document.querySelector('#check').style.display = 'block';
    document.querySelector('#cancel').style.display = 'block';
    cy.nodes().on('click', function(evt) {
        var node = new Node(evt.target.id(), [evt.target.renderedPosition("x"), evt.target.renderedPosition("y")], evt.target.style("background-image"));
            evt.target.connectedEdges().forEach(function(elmt){
                if (elmt.data().source==evt.target.id()){
                    node.AddEdge(elmt.data().target,elmt.data().proba)};
                });
            li_nodes.push(node);
            // Selected image will be circled in red
            evt.target.style('borderWidth',1);
            evt.target.style('borderColor','red');
    });
    }
    else{
        chooseImage();
    }
    
}

function checkedgroup(){
        if (document.getElementById("error_message") !== null) {
            var error = document.getElementById("error_message");
            error.parentNode.removeChild(error);
        }
        // Verification of cy loading
        if (cy === undefined) {
            let window = document.getElementById('choose-mc');
            let error = document.createElement('p');
            error.setAttribute('id', "error_message");
            error.innerHTML = "Error, matrix must be imported";
            window.appendChild(error);
        }
        let select = document.getElementsByName('select[]');
        var nodes=cy.nodes()
        for (let i = 0; i < select.length; i++) {
            if (select[i].checked) {
                var node = new Node(nodes.getElementById(select[i].id.slice(0, -4)).id(), [nodes.getElementById(select[i].id.slice(0, -4)).renderedPosition("x"), nodes.getElementById(select[i].id.slice(0, -4)).renderedPosition("y")], nodes.getElementById(select[i].id.slice(0, -4)).style("background-image"));
                nodes.getElementById(select[i].id.slice(0, -4)).connectedEdges().forEach(function (elmt) {
                    if (elmt.data().source == nodes.getElementById(select[i].id.slice(0, -4)).id()) {
                        node.AddEdge(elmt.data().target, elmt.data().proba)
                    };
                });
                li_nodes.push(node);
            }
        }
    var id_grp = prompt("Name the group");
    if (id_grp) {
        var grp = new Assembly(id_grp, li_nodes);
        li_nodes = [];
        groups.set(id_grp, grp);
    }
}
// -------------- Class --------------

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

// -------------- Choice of images to create a group --------------

function check_grp(cy) {
    // Registration of the group (with its name and images)
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
    // Remove a group
    document.querySelector('#check').style.display = 'none';
    cy.nodes().off('click');
    cy.nodes().style('borderWidth',0);
    document.querySelector('#cancel').style.display = 'none';
}

// -------------- Choice of the group(s) to be displayed --------------

document.getElementById('grp').addEventListener('click',
function () {
    chooseGroup();
});

function chooseGroup() {
    // Creation of the checkbox for the choice of the group or groups to display
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
        let check=document.getElementById(grp_name);

        //Closing_cross
        let container = document.createElement('div');
        container.setAttribute('class', 'close-container');
        container.setAttribute('value', grp_name);
        container.setAttribute('onclick', "delete_group(this)");

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
        container2.setAttribute('onclick','display_node_list(this)')
        container2.setAttribute('value',grp_name)

        let lr_div2 = document.createElement('span');
        lr_div2.setAttribute('class', 'dot');
        container2.appendChild(lr_div2);
        let lr_div3 = document.createElement('span');
        lr_div3.setAttribute('class', 'dot');
        container2.appendChild(lr_div3);
        let lr_div4 = document.createElement('span');
        lr_div4.setAttribute('class', 'dot');
        container2.appendChild(lr_div4);
        
        //Selected color
        let colorWell = document.createElement('input');
        colorWell.setAttribute('type','color');
        colorWell.setAttribute('value','#C1C1C1');
        colorWell.setAttribute('id','colorWell');
        colorWell.setAttribute('onchange','startup(this)');

        if (check==null){
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

            column4.setAttribute('value',grp_name);
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
        select_grp();
        document.querySelector('.choose-group').style.display = 'none';
    });

function select_grp() {
    // Retrieval and display of selected groups
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if (check_bool === 'true') {
        if (document.getElementById("error_message") !== null) {
            var error = document.getElementById("error_message");
            error.parentNode.removeChild(error);
        }
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
        reloadStyle()
        layout = cy.layout({ name: 'preset', directed: true, padding: 10 });
        layout.run();
        cy.center();
        }
    }

function reloadStyle(){
    nodes=cy.nodes();
    for (let i=0;i<nodes.length;i++){
        if (nodes[i].style("background-image")=='none'&& nodes[i].data().label==''){
            let ungroupe=groups.get(nodes[i].data().parent);
            nodes[i].style("background-image",ungroupe.FindNodeStyle(nodes[i].data().id));
        }
        else if (nodes[i].data().label != ''){
            nodes[i].style('background-color',li_color.get(nodes[i].data().id));
        }
    }
}

// -------------- Group color --------------

function startup(elmt) {
    // Choice and saving of the group color
    let color = elmt.value;
    let id = elmt.parentNode.attributes.getNamedItem('value').value;
    console.log(id + ' ' + color);
    li_color.set(id,color);
}

// -------------- Node List --------------

document.getElementById('disp-nodes-close').addEventListener('click',
    function () {
        document.querySelector('.display_nodes').style.display = 'none';
    });

function display_node_list(container){
    // Display of the list of images contained in the group
    nodes=groups.get(container.attributes.getNamedItem('value').value).getNodes();
    let table = document.getElementById('list_nodes');
    while(table.lastChild){
        table.removeChild(table.lastChild);
    }
    console.log('il y a ',nodes.length,' noeud(s)')
    for(let i=0;i<nodes.length;i++){
        let line='';
        line = document.createElement('tr');
        line.innerHTML=nodes[i].Getid();
        table.appendChild(line);
    }
    document.querySelector('.display_nodes').style.display = 'flex';
}