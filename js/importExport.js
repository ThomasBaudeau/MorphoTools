/*
SAUVESTRE Clément / JACQUES Patrick / GOMES Enzo
Importation et exportation du graphe sous format JSON
*/

function checkimport(fileName){
  console.log("TEST VAL JSON : " + fileName.includes(".json"))
  return fileName.includes(".json")
}


function singleImportJSON(cy){
  const fileInput = $('#ij')[0].files[0];
  var data;
  if (fileInput!=undefined){
    console.log("FILE INPUT" + fileInput);
    var reader = new FileReader();
    reader.fileName = fileInput.name;
    // le fichier importé est un JSON
    if (checkimport(reader.fileName)) {
      console.log(reader);
      reader.onload = function (readerEvent) {
        console.log(readerEvent.target.result);
        data= JSON.parse(readerEvent.target.result); //parsing du json
        console.log('expected: ',data)
        cy.json(data);
      };
    }
    // le fichier importé est un CSV
    else {
      console.log("dans le else");
      console.log(reader);
      var obj_csv = []
      reader.readAsBinaryString(fileInput);
      reader.onload = function (readerEvent) {
        console.log(readerEvent);
        obj_csv = readerEvent.target.result;
        let array = parseData(obj_csv);
        let data = CSV_to_JSON(array);
        data = JSON.parse(data);
        cy.json(data);
      }
    }
    reader.readAsText(fileInput);

  }
  else{
    console.log("autre else")
    LoadJson();
    data=sessionStorage.getItem('Json');
    data=JSON.parse(data)
    console.log(data)
    cy.json(data);
  }
  
}

// convertir le fichier csv (string) en array
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
    else if (csv_data[char] == "\n"){
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

// convertir le fichier csv (array) en json (cytoscape)
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

  //remplissage nodes
  for(let node = 1 ; node < array[0].length ; node++){
    let data = {
      "data":{
        "id": array[0][node],
        "label": node-1
      },
      "position":{"x":500,"y":0},
      "group":"nodes",
      "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
    };
    json.elements.nodes.push(data);
  }
  //remplissage edges
  for(let line = 1 ; line < array.length ; line++){
    for(let col = line ; col < array[line].length ; col++){
      //console.log("line :" + line + "col :" + col);
      if (array[line][col] !== '1'){  
        let id = 'E' + cpt;
        cpt++;
        let data = {
          "data":{
            "id": id,
            "label":"",
            "proba":array[line][col],
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
  console.log(JSON.stringify(json.elements.edges));
  return JSON.stringify(json)
}

function exportGraphJSON(cy){
    var a = document.createElement("a");
    document.body.appendChild(a);
    const file = new Blob(
        [JSON.stringify(cy.json())], 
        { type: 'application/json' }
      );
    console.log("FILE :" + file);
    const fileURL = window.URL.createObjectURL(file);
    a.href = fileURL;
    a.download = "papyrusGraph.json";
    a.click();
    window.URL.revokeObjectURL(fileURL);
    console.log("save json ok");
}


function LoadJson(){
  let project_id = sessionStorage.getItem('selected_project');
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
        let id = cursor.value.project_id;
        let name= cursor.value.type_file;
        if (id == project_id && name.search('json')) {
          var file = JSON.parse(cursor.value.data);
          sessionStorage.setItem('Json',file)
          return
        }
        cursor.continue();
      }
    }
  }
}