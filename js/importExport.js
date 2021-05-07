/*
SAUVESTRE Clément / JACQUES Patrick / GOMES Enzo
Importation et exportation du graphe sous format JSON
*/

function singleImportJSON(cy){
  const fileInput = $('#ij')[0].files[0];
  console.log(fileInput);
  var reader = new FileReader();
  reader.fileName = fileInput.name;
  console.log(reader);
  reader.onload = function(readerEvent){
      console.log(readerEvent.target.result);
      var data = JSON.parse(readerEvent.target.result);
      console.log(data);
      cy.json(data)
  };
  reader.readAsText(fileInput);
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