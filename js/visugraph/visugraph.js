/*
Thomas Baudeau / Gregory Bordier / Valentin Gonay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément / Cecilia Ostertag
visugraph.js : Main functions of Visugraph
Version 1.5.0
*/

/*
The following five variables are used to simplify the restoration process after filtering
*/
var allGraph; // Var to stock all the original elements of the graph
var removedE; // Var to stock all the edges removed by thesholding
var removedN; // Var to stock all the nodes removed through filtering
var deleted_nodes = []; // List of deleted nodes
var restoredE;

var const_labels = 0; // Constant for the 'Show/Hide labels' button
var const_edges = 0; // Constant for the 'Show/Hide edges' button

var fileURIs = new Map(); // Stock names and ref of pictures given by the user

// Initialisation of the cytoscape graph
var cy = cytoscape({
    container: document.getElementById('cy'),
    boxSelectionEnabled: false,
    autounselectify: true,
    style: cytoscape.stylesheet()
        .selector('node')
        .css({
            'height': 10,
            'width': 10,
            'shape': 'rectangle',
            'background-fit': 'none',
            'border-color': '#000',
            'border-width': 0,
            'border-opacity': 0.5
        })
        .selector('edge')
        .css({
            'width': 0.1,
            'target-arrow-shape': 'triangle',
            'arrow-scale': 0.1,
            'line-color': '#000',
            'target-arrow-color': '#000'
        })
});

function savegraphelement(){
    allGraph=cy.elements()
}

async function showFile(cy) {
    loadStart('retrieving images')
    var nameList = [];
    var fileInput = document.getElementById('ii');
    if (fileInput.files.length!=0)
    {
        var count2=0;
        for (var i = 0; i < fileInput.files.length; i++) {
            var reader = new FileReader();
            reader.fileName = fileInput.files[i].name;
            reader.onload = function (readerEvent) {
                var url = readerEvent.target.result;
                var name = readerEvent.target.fileName;
                nameList.push(name);
                fileURIs.set(name.slice(0, -4), url);
                count2++
                if (count2 == sessionStorage.getItem('numberImage')){
                    let dicImg = checknames(nameList);
                    console.log(dicImg);
                    loadEnd();
                    imageinit(cy); 
                }

            }
            reader.readAsDataURL(fileInput.files[i]);
        }
    }
    else {
        var count=0;
        // Connection to the database
        let connection = window.indexedDB.open(sessionStorage.getItem('selected_project'), 3);
        // in case of error
        connection.onerror = function (e) {
            console.error('Unable to open database.');
        }
        // on connection successful :
        connection.onsuccess = (e) => {
            let db = e.target.result;
            // connection to the store
            let objectStore = db.transaction(['imports'], 'readwrite').objectStore('imports');
            // cration of the cursor
            objectStore.openCursor().onsuccess = function (e) {
                let cursor = e.target.result;
                if (cursor) {
                    image=[]
                    let name = cursor.value.type_file;
                    nameList.push(name);
                    if ( /\.(jpe?g|png|gif)$/i.test(name)) {
                        fileURIs.set(name.slice(0, -4),'data:image/jpeg;base64,'+btoa(cursor.value.data) )
                        count++;
                        if(count==sessionStorage.getItem('numberImage')){
                            let dicImg = checknames(nameList);
                            loadEnd()
                            imageinit(cy)}
                        }
                    cursor.continue();
                }
                else{
                    console.log('end')
                }
            }
        }
    }
}

function checknames(list){
    /* Group together all the names that share the same common elements, assuming that
    they would be the recto, verso, and IR images of the same fragment*/
    var finMat = [];
    for (let y=0; y<list.length; y++) {
        var nameImg = list[y];
        var smolArr = [nameImg];
        /* names length are variables but the fragment' ID is always found 
        before the first "_", so look for this char position*/
        var idx = nameImg.indexOf("_");
        var ID = nameImg.slice(idx);
        if (idx != -1) {
            // if there was no error, look for other names in the list with the same ID
            for (let i=0; i<list.length; i++) {
                // careful not to compare the name with itself
                if (i != y) {
                    let IDmaybe = list[i].slice(idx);
                    let n = ID.localeCompare(IDmaybe);
                    if (n == 0) {
                        // if n = 0, it means both strings are identical
                        smolArr.push(list[i]);
                        list.splice(i);
                    }
                }
            }
        }
        finMat.push(smolArr);
        list.splice(y);
        console.log("finMat",finMat);
    }
    return finMat;
}

function initGraph(cy, lyt){
    // Initialization of the graph visualization with the choice of the layout
    var check_bool = sessionStorage.getItem('loading_check') // Var of matrix import verification
    dies_verification(check_bool);
    if(check_bool !== 'false'){
        document.getElementById('cy').style.visibility = 'visible';
        if (lyt === '1') {
            layout = cy.layout({ name: 'preset', directed: true, padding: 10 });
        };
        if (lyt === '2') {
            layout = cy.layout({ name: 'cola', directed: true, padding: 10 });
        };
        if (lyt === '3') {
            layout = cy.layout({ name: 'cose', directed: true, padding: 10 });
        };
        if (lyt === '4') {
            layout = cy.layout({ name: 'circle', directed: true, padding: 10 });
        };

        // Possible to add more layouts

        layout.run();
        cy.minZoom(0.5);
        cy.maxZoom(1e-50);
        cy.center();
    }
}

function imageinit(cy){
    // Initialization of the graph according to the chosen images
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if(check_bool === 'true'){
        loadStart('loading images')
        var count = 0;
        var nodes = cy.nodes();
        for (var j = 0; j < nodes.length; j++) {
            var id = nodes[j].data("id");
            nodes[j].style("background-image", fileURIs.get(id));
            count++
            if (count == nodes.length) {
                loadEnd();
                savegraphelement()
            }
        }
    }
}


function Showhide_edges(cy) {
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if(check_bool === 'true'){ 
        if (const_edges == 0) {
            expandGraph(cy);
            const_edges++;
        }
        else {
            retractGraph(cy);
            const_edges--;
        }
    }
}


function retn(cy){
    // Function to undelete an edge
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if(check_bool === 'true'){ 
        cy.add(deleted_nodes[0]);
        deleted_nodes.shift(deleted_nodes[0])
        if (deleted_nodes.length == 0){
            document.querySelector('#backward').style.display = 'none';
        }
    }
}


function expandGraph(cy) {
    // Function to observe edges and their information
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if(check_bool === 'true'){ 
        dismiss_borderColor(cy);
        display_labels();
        layout = cy.layout({ name: 'preset', directed: true, padding: 10 });
        layout.run();
        shift_superposition(cy);
        console.log("expanded");

        cy.edges().on('click', function(evt) { // Function to delete an edge
            cy.remove(evt.target);
            deleted_nodes.unshift(evt.target);
            document.querySelector('#backward').style.display = 'block';
        });

        if(const_labels==0){
            cy.edges().on('mouseover', function(event) {
                let edge = event.target;
                edge.style('text-opacity', 0.5);
                setTimeout(function(){
                edge.style('text-opacity',0);
                },2500);
            });
            cy.nodes().on('mouseover', function(event) {
                let node = event.target;
                node.style('text-opacity', 1);
                setTimeout(function(){
                node.style('text-opacity',0);
                },2500);
            });
        }
    }
}


function viewProbs(cy){
    // Observation of the probabilities of each edge
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if(check_bool === 'true'){ 
        edges = cy.edges();
        nodes = cy.nodes();
        if (const_labels==0){
            display_labels();
            edges.style('text-opacity',0.5);
            nodes.style('text-opacity',1);
            const_labels++;
        } else {
            edges.style('text-opacity',0);
            nodes.style('text-opacity',0);
            edges.style('target-arrow-color','black');
            edges.style('color', 'black');
            nodes.style('target-arrow-color','black');
            nodes.style('color', 'black');
            const_labels--;
        }
    }
}


function display_labels() {
    nodes = cy.nodes();
    nodes.style('height', 5);
    nodes.style('width', 5);
    nodes.style('text-opacity', 0);
    nodes.style('color', '#256474');
    nodes.style('font-size', 1.5);
    nodes.style('text-halign', 'center');
    nodes.style('text-valign', 'bottom');

    for (var j = 0; j < nodes.length; j++) {
        nodes[j].style('label', nodes[j].data('id'));
        H = 0;
        B = 0;
        G = 0;
        D = 0;
        out_edges = nodes[j].outgoers('edge');
        for (var k = 0; k < out_edges.length; k++) {
            out_edge = out_edges[k];
            if (out_edge.data('label') == "H") {
                H += 1;
            } else if (out_edge.data('label') == "B") {
                B += 1;
            } else if (out_edge.data('label') == "G") {
                G += 1;
            } else if (out_edge.data('label') == "D") {
                D += 1;
            }
        }
        if (H > 1 || B > 1 || G > 1 || D > 1) {
            // conflict in pairwise assembly
            nodes[j].style('border-width', 0.1);
            nodes[j].style('border-color', 'red');
        } else {
            nodes[j].style('border-width', 0);
            nodes[j].style('border-color', 'black');
        }
    }

    edges = cy.edges();
    edges.style('text-opacity', 0.5);
    edges.style('width', 0.1);
    edges.style('arrow-scale', 0.1);
    edges.style('font-size', 1);
    edges.style('curve-style', 'bezier');
    edges.style('control-point-step-size', 4);
    for (var j = 0; j < edges.length; j++) {
        if (edges[j].data('proba') >= 0.9){
            edges[j].data('line-color','green'),
            edges[j].style('target-arrow-color','green'),
            edges[j].style('color', 'green')
        }
        else if (edges[j].data('proba') < 0.9 && edges[j].data('proba') >= 0.6){
            edges[j].data('line-color','orange'),
            edges[j].style('target-arrow-color','orange'),
            edges[j].style('color', 'orange')
        }
        else{
            edges[j].data('line-color','red'),
            edges[j].style('target-arrow-color','red'),
            edges[j].style('color', 'red')
        }
        edges[j].style('label', function() {
            if (edges[j].data('label') === ''){
                return edges[j].data('proba');
            }
            else {
                return edges[j].data('label') + ' : ' + edges[j].data('proba');
            }
        });
        document.querySelector('#legend').style.display = 'block';
    }
}



function retractGraph(cy) {
    // Function to remove all edges
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if(check_bool === 'true'){ 
        dismiss_borderColor(cy);
        nodes = cy.nodes();
        nodes.style('height', 10);
        nodes.style('width', 10);
        nodes.style('text-opacity', 0);

        edges = cy.edges();
        edges.style('text-opacity', 0);
        edges.style('width', 0);
        edges.style('arrow-scale', 0);

        layout = cy.layout({ name: 'preset', directed: true, padding: 10 });
        layout.run();

        document.querySelector('#legend').style.display = 'none';
        console.log("retracted");
    }
}

function filterEdges(cy) {
    // Function to filter edges and display some of them according to a threshold
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if(check_bool === 'true'){ 
        const min = sessionStorage.getItem("min_similitude");
        const max = sessionStorage.getItem("max_similitude")
        var thr = prompt("Threshold for edge filtering? (" + min + " to " + max + ")");
        
        // Reloading the json and reimporting the images
        if (thr===null)
            {return}
        try{
            restoredE.restore()
        }
        catch{
            allGraph.restore()
        }
        if (removedN != undefined){
            removedN.restore();
        }
        if (removedE!=undefined){
            removedE.restore();
        }
        if (thr.search('-')!=-1){
            loadStart('filtering edges')
            removedE =cy.remove('edge[proba > ' + thr.slice(1) + ']');
            removedN = cy.remove(cy.nodes().filter(node => node.connectedEdges().size() === 0));
            try {
                cy.remove(restoredE)
            }
            catch {
                console.log('error')
            }
            loadEnd();
            loadEnd_witness();
            console.log("filtered");
        }
        else{
            loadStart('filtering edges')
            removedE=cy.remove('edge[proba < ' + thr + ']');
            nodes = cy.nodes();
            removedN = cy.remove(cy.nodes().filter(node => node.connectedEdges().size() === 0));
            try {
                cy.remove(restoredE)
            }
            catch {
                console.log('error')
            }
            loadEnd();
            loadEnd_witness();
            console.log("filtered");
        }
    }
}

function nodePositions(cy) {
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if(check_bool === 'true'){ 
        elements = cy.elements();
        components = elements.components();
        nodes = cy.nodes();
        origin_pos = { 'x': 0, 'y': 0 };
        for (i = 0; i < components.length; i++) {
            component = components[i];
            root = component[0];
            dps = component.depthFirstSearch({
                roots: root,
                visit: function(v, e, u, i, depth) {
                    if (v == root) {
                        v.position(origin_pos);
                        origin_pos['x'] += 50;
                    } else if (e.source() == u) {
                        pos = u.position();
                        x = pos['x'];
                        y = pos['y'];
                        if (e.data('label') == "H") {
                            v.position({ 'x': x, 'y': y - 10 });
                        } else if (e.data('label') == "B") {
                            v.position({ 'x': x, 'y': y + 10 });
                        } else if (e.data('label') == "G") {
                            v.position({ 'x': x - 10, 'y': y });
                        } else if (e.data('label') == "D") {
                            v.position({ 'x': x + 10, 'y': y });
                        }
                    } else if (e.source() == v) {
                        pos = u.position();
                        x = pos['x'];
                        y = pos['y'];
                        if (e.data('label') == "H") {
                            v.position({ 'x': x, 'y': y + 10 });
                        } else if (e.data('label') == "B") {
                            v.position({ 'x': x, 'y': y - 10 });
                        } else if (e.data('label') == "G") {
                            v.position({ 'x': x + 10, 'y': y });
                        } else if (e.data('label') == "D") {
                            v.position({ 'x': x - 10, 'y': y });
                        }
                    }
                },
                directed: false
            });
        }
        dismiss_borderColor(cy);
        show_superposition(cy);
        cy.center();
        console.log("positions recomputed");
    }
}


function zm_in() {
    let zm= cy.zoom();
    cy.zoom(zm + 1);
    cy.center();
}

function zm_out() {
    let zm= cy.zoom();
    cy.zoom(zm - 1);
    cy.center();
}


document.getElementById('send_img').addEventListener('click',
    function () {
    if (sessionStorage.getItem('choix') == 'CH') {
        delimage(cy);
        document.querySelector('.choose-modal').style.display = 'none';
        }
    else{
        checkedgroup()
        document.querySelector('.choose-modal').style.display = 'none';
    }
    });


function delimage(cy) {
    // Removal of images not selected by the user
    var check_bool = sessionStorage.getItem('loading_check')
    dies_verification(check_bool);
    if (check_bool === 'true') {
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
        else{
            if(restoredE!=undefined){
                try {
                    removedN.restore();
                    removedE.restore();
                }
                catch {
                    allGraph.restore();
                }
                restoredE.restore();
                
            }
            restoredE=(cy.remove(cy.nodes().filter(function (node) {
                let select = document.getElementsByName('select[]');
                var arrayselect = [];
                for (let i = 0; i < select.length; i++) {
                    if (!select[i].checked) {
                    }
                    else {
                        arrayselect.push(select[i].id.slice(0, -4))
                    }
                }
                return (!arrayselect.includes(node.id()))
            })))
            try {
                cy.remove(removedE);
                cy.remove(removedN);
            }
            catch {
                console.log('error')
            }
            
        console.log("refreshing position...")
        }
    }
}