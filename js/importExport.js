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
        cy.json(data)
    };
    reader.readAsText(fileInput);
  }
  else {
    console.log("dans le else")
    console.log(reader)
    // TODO conversion csv -> JSON
    var obj_csv = {
      size:0,
      dataFile:[]
    };
    reader.readAsBinaryString(fileInput);
    reader.onload = function (readerEvent) {
      console.log("dans le onload")
      console.log(readerEvent);
      obj_csv.size = readerEvent.total;
      obj_csv.dataFile = readerEvent.target.result
      console.log(obj_csv.dataFile)
      //parseData(obj_csv.dataFile)   
    }
  }
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