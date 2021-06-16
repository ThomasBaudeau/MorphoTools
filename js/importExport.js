/* 
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
Import/export of the graph in JSON format
*/

function checkimport(fileName){
  return fileName.includes(".json")
}


function singleImportJSON(cy){
  sessionStorage.setItem('stop', true)
  document.getElementById('cy').style.visibility = 'hidden';
  loadStart("retrieving dies");
  console.log("everything start");
  const fileInput = $('#ij')[0].files[0];
  var data;
  if (fileInput!=undefined){
    var reader = new FileReader();
    reader.fileName = fileInput.name;
    // if JSON
    if (checkimport(reader.fileName)) {
      console.log(reader);
      reader.readAsText(fileInput);
      reader.onload = function (readerEvent) {
        console.log(readerEvent.target.result);
        data= JSON.parse(readerEvent.target.result); //parsing du json
        cy.json(data);
        cy.on('render',function(e){
          loadEnd();
        })
      };
    }
    // if CSV
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
        cy.on('render', function (e) {
          
          if(sessionStorage.getItem(stop))
            addJSONtoDB(cy);
            loadEnd();
            sessionStorage.setItem('stop', false)
        })
      }
    }
    

  }
  else{ 
    console.log("autre else")
    
  
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
          let name = cursor.value.type_file;
          if (id == project_id && name.search('json') != -1) {
            let file = JSON.parse(cursor.value.data);
            try{
              file=JSON.parse(file);
              if (file.length < 16) {
                file=JSON.parse(cursor.value.data)
                }
            }
            catch{
              file=JSON.parse(cursor.value.data)
            }
            console.log(file)
            cy.json(file);
            cy.on('render', function (e) {
              loadEnd();
            })
          }
          cursor.continue();
        }
      }
    }
  }
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
      //console.log("line :" + line + "col :" + col);
      let prob= parseFloat(array[line][col]);
      if (array[line][col]!=='1' && prob>=0.1 && array[line][col].includes('e')==false){  
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
        console.log("DATA " + id + " : "+ JSON.stringify(data));
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
    console.log("FILE :" + file);
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