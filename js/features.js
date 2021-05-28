/* 
SAUVESTRE Clément / JACQUES Patrick / GOMES Enzo
Foncitonnalités de notre page d'acceuil
*/

'use strict'

//Responsive menu
$('.header_navbar-toggle').click(function(e) {
    e.preventDefault();
    $('.header_navbar').toggleClass('is-open');
})


//Fenêtre de création de projet
document.getElementById('create').addEventListener('click',
function() {
  document.querySelector('.bg-modal').style.display = 'flex';
});
document.querySelector('.close').addEventListener('click',
function() {
  document.querySelector('.bg-modal').style.display = 'none';
});





//Lancement de Visugraph
document.getElementById('visugraph').addEventListener('click',
function() {
  document.querySelector('.visu').style.display = 'flex';
});
//Ajouter un bouton close


//Sélection et stockage du project sur lequel l'utilisateur va travailler
document.addEventListener("DOMContentLoaded", () => {
    var ul = document.querySelector('ul');
    ul.onclick = function(event) {
        var projectId;
        if (event.target.nodeName == "LI"){
            projectId = event.target.attributes["data-project-id"].value;
        }
        else {
            projectId = event.target.parentNode.attributes["data-project-id"].value;
        }
        console.log(projectId);
        sessionStorage.setItem('selected_project',projectId);
        obtainValues(projectId);
        window.location.href="projet.html";
    };
});



//Stockage temporaire de l'url d'une image dans session storage
function transformImport(file){
    if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            let url = e.target.result;
            sessionStorage.setItem('patch_'+file.name, url);
        };
    };
};

//Stockage des images dans le dossier import de notre base de donnée
function addImport(){
    let d_b;
    var files = document.querySelector("input[type=file]").files;
    if(files) {
        [].forEach.call(files, transformImport);
    }
    let connection = window.indexedDB.open('morphotools', 3);
    connection.onerror = function(e) {
        console.error('Unable to open database.');
    }
    connection.onsuccess = (e) => {
        d_b = e.target.result;
        console.log('DB opened');
        let select_id = sessionStorage.getItem('selected_project')
        let transaction = d_b.transaction(['imports'], 'readwrite');
        let objectStore = transaction.objectStore('imports');
        for (let i = 0; i<files.length; i++){
            //Add un champs patch_name ou créer une table d'import par projet 
            let myData = sessionStorage.getItem('patch_'+files[i].name);
            let newItem = { project_id: select_id, data: myData };
            objectStore.add(newItem);
        }     
        transaction.oncomplete = function() {
            console.log('Transaction completed !');
        };
        transaction.onerror = function() {
            console.log('Transaction not opened due to error');
        };
    };
};
function obtainValues(key) {
    //La base de données a été ouverte avec succès
    let objectStore = db.transaction(['projects'], 'readwrite').objectStore('projects');
    objectStore.openCursor().onsuccess = function (e) {
        //Récupère une référence au curseur
        let cursor = e.target.result;
        if (cursor){
            let thename = cursor.value.name;
            let abstract = cursor.value.abstract;
            let id_ = cursor.key;
            console.log(thename,abstract ,id_);
            if (id_ == key) {
                sessionStorage.setItem('name_project', thename);
                sessionStorage.setItem('abstract_project', abstract);
            }
            cursor.continue();
        }
        else{
            console.log("No more key")
            
        }
       
    }
}
//Ajouter une fonction delete + ecraser données existants lorsque on réimport des données




