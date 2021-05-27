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
  console.log(fileInput);
  var reader = new FileReader();
  reader.fileName = fileInput.name;
  if (checkimport(reader.fileName)){ // TRUE si JSON
    console.log(reader);
    reader.onload = function(readerEvent){
        console.log(readerEvent.target.result);
        var data = JSON.parse(readerEvent.target.result); //parsing du json
        console.log(data);
        cy.json(data);
    };
    reader.readAsText(fileInput);
  }
  else {
    console.log("dans le else");
    console.log(reader);
    var obj_csv = {
      size:0,
      dataFile:[]
    };
    reader.readAsBinaryString(fileInput);
    reader.onload = function (readerEvent) {
      console.log("dans le onload");
      console.log(readerEvent);
      obj_csv.size = readerEvent.total;
      obj_csv.dataFile = readerEvent.target.result;
      console.log(obj_csv.dataFile);
      let array = parseData(obj_csv.dataFile);
      let json = CSV_to_JSON(array);
    }
  }
}

//FROM imported csv to JSON
function parseData(csv_data){
  let word = "";
  let char = 0;
  let array = [];
  let line = [];
  let line_nb = 1;
  console.log("test du csv" + csv_data[1]);
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
  console.log("1er element " + array[0][0])
  console.log("2eme element " + array[0][1])
  return array;
}

function CSV_to_JSON(array){
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
  //for()

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
    a.download = "papyrusGraph.json";
    a.click();
    window.URL.revokeObjectURL(fileURL);
    console.log("save json ok");
}