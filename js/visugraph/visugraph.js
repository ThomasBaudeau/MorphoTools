/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
Main functions of Visugraph
*/

var deleted_nodes = [];
var constante = 0;
var constante2 = 0;
var fileURIs = new Map();
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
            'background-fit': 'cover',
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

async function showFile(cy,lyt) {
    loadStart('retrieving images')
    var fileInput = document.getElementById('ii');
    if (fileInput.files.length!=0)
    {
        console.log("je suis ici")
        var count2=0;
        for (var i = 0; i < fileInput.files.length; i++) {
            var reader = new FileReader();
            reader.fileName = fileInput.files[i].name;
            reader.onload = function (readerEvent) {
                var url = readerEvent.target.result;
                var name = readerEvent.target.fileName;
                console.log(name.slice(0, -4));
                console.log(typeof (url))
                fileURIs.set(name.slice(0, -4), url);
                count2++
                if (count2 == sessionStorage.getItem('numberImage'))
                {
                    console.log(fileURIs)
                        loadEnd();
                        imageinit(cy,lyt); }

            }
            reader.readAsDataURL(fileInput.files[i]);
        }

    }
    else {
    var count=0;
    console.log("je suis dans le else")
    console.log('loading files')
    let connection = window.indexedDB.open('morphotools', 3);
    connection.onerror = function (e) {
        console.error('Unable to open database.');
        }
    connection.onsuccess = (e) => {
        let db = e.target.result;
        console.log('DB opened');
        let project_id = sessionStorage.getItem('selected_project');
        let objectStore = db.transaction(['imports'], 'readwrite').objectStore('imports');
        objectStore.openCursor().onsuccess = function (e) {
            let cursor = e.target.result;
            if (cursor) {
                image=[]
                let id = cursor.value.project_id;
                let name = cursor.value.type_file;
                if (id == project_id && /\.(jpe?g|png|gif)$/i.test(name)) {
                    fileURIs.set(name.slice(0, -4),'data:image/jpeg;base64,'+btoa(cursor.value.data) )
                    console.log('1:', name.slice(0, -4), '2:', 'data:image/jpeg;base64,' + btoa(cursor.value.data))
                    count++;
                    if(count==sessionStorage.getItem('numberImage'))
                    {
                        console.log(fileURIs)
                        loadEnd()
                        imageinit(cy,lyt)}
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

function initGraph(cy, lyt){
    showFile(cy, lyt);
}

function imageinit(cy,lyt){
    console.log('ok')
    loadStart('loading images')
    var count = 0;
    var nodes = cy.nodes();
    console.log(nodes.length)
    for (var j = 0; j < nodes.length; j++) {
        var id = nodes[j].data("id");
        nodes[j].style("background-image", fileURIs.get(id));
        count++
        console.log(count);
        if (count == nodes.length) {
            loadEnd();
            document.getElementById('cy').style.visibility = 'visible';
            }
        }
    console.log('a', fileURIs.get(id));
    if (lyt === '1'){
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
    layout.run();
    cy.minZoom(0.5);
    cy.maxZoom(1e-50);
    cy.center();
    console.log("init ok");
}

function Showhide_edges(cy) {
    if (constante2 == 0) {
        expandGraph(cy);
        constante2++;
    }
    else {
        retractGraph(cy);
        constante2--;
    }
}

function expandGraph(cy) {
    dismiss_borderColor(cy);
    display_labels();
    layout = cy.layout({ name: 'preset', directed: true, padding: 10 });
    layout.run();
    shift_superposition(cy);
    console.log("expanded");

    cy.edges().on('click', function(evt) {
        console.log('deleting edge ' + evt.target.id());
        cy.remove(evt.target);
    });

    if(constante==0){
        cy.edges().on('mouseover', function(event) {
            let edge = event.target;
            edge.style('text-opacity', 0.5);
            setTimeout(function(){
              edge.style('text-opacity',0);
            },2500);
        });
        cy.nodes().on('mouseover', function(event) {
            let node = event.target;
            node.style('text-opacity', 0.5);
            setTimeout(function(){
              node.style('text-opacity',0);
            },2500);
        });
    }
}

function viewProbs(cy){
    edges = cy.edges();
    nodes = cy.nodes();
    if (constante==0){
        display_labels();
        edges.style('text-opacity',0.5);
        nodes.style('text-opacity',0.5);
        constante++;
    } else {
        edges.style('text-opacity',0);
        nodes.style('text-opacity',0);
        edges.style('target-arrow-color','black');
        edges.style('color', 'black');
        nodes.style('target-arrow-color','black');
        nodes.style('color', 'black');
        constante--;
    }
}

function display_labels() {
    nodes = cy.nodes();
    nodes.style('height', 5);
    nodes.style('width', 5);
    nodes.style('text-opacity', 0);
    nodes.style('color', 'blue');
    nodes.style('font-size', 1);
    nodes.style('text-halign', 'center');
    nodes.style('text-valign', 'center');

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
    console.log(edges);
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

async function filterEdges(cy) {
    const min = sessionStorage.getItem("min_similitude");
    const max = sessionStorage.getItem("max_similitude")
    var thr = prompt("Threshold for edge filtering? (" + min + " to " + max + ")");
    //recharge du json et réimportation des images
    if (thr==='')
        {return}

    //timeout car le chargement a tendance a se faire après la definition du threshold
    setTimeout(function(){
        if (thr.search('-')!=-1){
            loadStart('filtering edges')
            console.log(thr.slice(1))
            cy.remove('edge[proba > ' + thr.slice(1) + ']');
            nodes = cy.nodes();
            for (var j = 0; j < nodes.length; j++) {
                if (nodes[j].connectedEdges().length == 0) {
                    cy.remove(nodes[j]);
                }
            }
            loadEnd()
            console.log("filtered");

        }
        else{
        cy.remove('edge[proba < ' + thr + ']');
        nodes = cy.nodes();
        for (var j = 0; j < nodes.length; j++) {
            if (nodes[j].connectedEdges().length == 0) {
                cy.remove(nodes[j]);
            }
        }
        console.log("filtered1");
        }
     }, 1000);
     setTimeout(function(){
        console.log("refreshing position...")
        nodePositions(cy);
     }, 1100);

}

function nodePositions(cy) {
    elements = cy.elements();
    components = elements.components();
    console.log(components.length);
    nodes = cy.nodes();
    origin_pos = { 'x': 0, 'y': 0 };
    for (i = 0; i < components.length; i++) {
        component = components[i];
        root = component[0];
        console.log("root ", root.id());
        dps = component.depthFirstSearch({
            roots: root,
            visit: function(v, e, u, i, depth) {
                console.log("v ", v.id());
                if (v == root) {
                    v.position(origin_pos);
                    origin_pos['x'] += 50;
                } else if (e.source() == u) {
                    console.log("S ", e.source().id());
                    console.log("T ", e.target().id());
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
                    console.log("S ", e.source().id());
                    console.log("T ", e.target().id());
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

    //layout = cy.layout({name: 'preset', directed: true, padding: 10});
    //layout.run();
    dismiss_borderColor(cy);
    show_superposition(cy);
    cy.center();
    console.log("positions recomputed");
}


function zm_in() {
    let zm= cy.zoom();
    console.log("Avant :"+ zm)
    cy.zoom(zm + 1);
    console.log("Apres :"+ zm)
    cy.center();
}

function zm_out() {
    let zm= cy.zoom();
    console.log("Avant :"+ zm)
    cy.zoom(zm - 1);
    console.log("Apres :"+ zm)
    cy.center();
}

document.getElementById('send_div').addEventListener('click',
    function () {
        delimage(cy);
        document.querySelector('.choose-modal').style.display = 'none';
    });

function delimage(cy) {
    if (document.getElementById("error_message") !== null) {
        var error = document.getElementById("error_message");
        error.parentNode.removeChild(error);
    }
    //vérif de chargement de cy
    if (cy === undefined) {
        let window = document.getElementById('choose-mc');
        let error = document.createElement('p');
        error.setAttribute('id', "error_message");
        error.innerHTML = "Error, matrix must be imported";
        window.appendChild(error);
    }
    let select = document.getElementsByName('select[]');
    console.log('ok select : ', select);
    for (let i = 0; i < select.length; i++) {
        if (!select[i].checked) {
            if (select[i].id != "box-1") {
                cy.remove(cy.getElementById(select[i].id.slice(0, -4)));
            }
        }
    }
    console.log("refreshing position...")
    nodePositions(cy);
}

cy.on('click', 'node', function (evt) {
    console.log('clicked ' + this.id());
});