/* 
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
Import/export of the graph in JSON format
*/

// variable de verif, false si pas de matrice load, true si matrice load
sessionStorage.setItem('loading_check',false);


function checkimport(fileName){
  return fileName.includes(".json")
}

//load json in cytoscape
function singleImportJSON(cy){
  sessionStorage.setItem('stop', true)//just in case 
  document.getElementById('cy').style.visibility = 'hidden';//hide cytoscape graph
  loadStart("retrieving dies");// start loading
  console.log("retieve Json files");
  const fileInput = $('#ij')[0].files[0];
  var data;
  if (fileInput!=undefined){//check if json is in the import menu
    var reader = new FileReader();
    reader.fileName = fileInput.name;
    // if JSON
    if (checkimport(reader.fileName)) {
      reader.readAsText(fileInput);
      reader.onload = function (readerEvent) {
        data= JSON.parse(readerEvent.target.result); //parsing du json
        findMinMax(data);
        cy.json(data);
        cy.one('render',function(e){
          if (sessionStorage.getItem('stop')){
            sessionStorage.setItem('stop', false)
            loadEnd();
            showFile(cy)
          }
        })
        loadEnd_witness();
      };
    }
    // if CSV
    else {
      var obj_csv = []
      reader.readAsBinaryString(fileInput);
      reader.onload = function (readerEvent) {
        obj_csv = readerEvent.target.result;
        let array = parseData(obj_csv);
        let data = CSV_to_JSON(array);
        data = JSON.parse(data);
        findMinMax(data);
        cy.json(data);
        cy.one('render', function (e) {
          if(sessionStorage.getItem('stop')){
            console.log('PROBLEMAS')
            sessionStorage.setItem('stop', false)
            loadEnd();
            showFile(cy)
          }            
        })
        loadEnd_witness();
      }
    }
    

  }
  else{//if json not in the import window check in the bd
    let connection = window.indexedDB.open(sessionStorage.getItem('selected_project'), 3);//open the db
    connection.onerror = function (e) {
      console.error('Unable to open database.');
      }
    connection.onsuccess = (e) => {
      let db = e.target.result;
      let objectStore = db.transaction(['imports'], 'readwrite').objectStore('imports');
      objectStore.openCursor().onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {//browse the db
          let name = cursor.value.type_file;
          if (name.search('json') != -1) {// if Json is find so it's parse
            let file = JSON.parse(cursor.value.data);
            try{// for an unknow reason some json file must be parsed two time so we did it 
              file=JSON.parse(file);
              if (file.length < 16) {
                file=JSON.parse(cursor.value.data)
                }
            }
            catch{
              file=JSON.parse(cursor.value.data)
            }
            cy.json(file);
            cy.one('render', function (e) {
              if (sessionStorage.getItem('stop')){
                sessionStorage.setItem('stop', false)
                loadEnd();
                showFile(cy)
              }
            })
            loadEnd_witness();
          }
          cursor.continue();
        }
      }
    }
  }
  // dies is loaded, setting check var to true
  console.log("loading_check devient true");
  sessionStorage.setItem('loading_check',true);
}

// convertion of csv (string) into an array
function parseData(csv_data){
  let word = "";
  let char = 0;
  let array = [];
  let line = [];
  let line_nb = 1;
  while (char < csv_data.length){
    if (csv_data[char] == ','){
      line.push(word);
      word = "";
    }
    else if (csv_data[char] == "\n" || csv_data[char] == "\r"){
      line.push(word);
      array.push(line);
      word = "";
      line = [];
      line_nb ++;
    }
    else{
      word += csv_data[char];
    }
    char ++;
  }
  return array;
}

// convertion array into json (cytoscape)
function CSV_to_JSON(array){
  let cpt = 0;
  
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

  //console.log("Width :" + window.screen.width);
  //console.log("Height :" + window.screen.height);

  //filling nodes
  for(let node = 1 ; node < array[0].length ; node++){
    let val_x = getRandomArbitrary(0, window.screen.width) - 250;
    let val_y = getRandomArbitrary(0, window.screen.height) - 70;
    let data = {
      "data":{
        "id": array[0][node],
        "label": node-1
      },
      "position":{"x":val_x,"y":val_y},
      "group":"nodes",
      "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
    };
    json.elements.nodes.push(data);
  }
  //filling edges
  for(let line = 1 ; line < array.length ; line++){
    for(let col = line ; col < array[line].length ; col++){
      let prob= parseFloat(array[line][col]);
      if (array[line][col]!='1' && prob>=0.1 && array[line][col].includes('e')===false){  
        let id = 'E' + cpt;
        cpt++;
        let data = {
          "data":{
            "id": id,
            "label":"",
            "proba":prob,
            "source":array[line][0],
            "target":array[0][col]
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

function exportGraphJSON(cy){
    var a = document.createElement("a");
    document.body.appendChild(a);
    const file = new Blob(
        [JSON.stringify(cy.json())], 
        { type: 'application/json' }
      );
    const fileURL = window.URL.createObjectURL(file);
    a.href = fileURL;
    a.download = "Graph.json";
    a.click();
    window.URL.revokeObjectURL(fileURL);
    console.log("save json ok");
}


  
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//find min and max JSON (call dans ImportsImageFunction 118)
function findMinMax(data){
  //data au format json 
  //=> value dans data['elements']['edges'][i]['data']['proba']
  var min = 1;
  var max = 0;
  //parcour tout les edges pour comparer les proba
  for (let i = 0 ; i < data['elements']['edges'].length ; i++){
    let value = data['elements']['edges'][i]['data']['proba']
    if (value > max){
      max = value;
    }
    if (value < min){
      min = value;
    }
  }
  console.log("max proba = " + max);
  console.log("min proba = " + min);
  sessionStorage.setItem('max_similitude', max);
  sessionStorage.setItem('min_similitude', min);
}