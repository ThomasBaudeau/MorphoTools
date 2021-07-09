/*
    Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
    assembly.js : Creating groups of images
    Version 1.5.0
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
    for(let i=0;i<nodes.length;i++){
        let line='';
        line = document.createElement('tr');
        line.innerHTML=nodes[i].Getid();
        table.appendChild(line);
    }
    document.querySelector('.display_nodes').style.display = 'flex';
}