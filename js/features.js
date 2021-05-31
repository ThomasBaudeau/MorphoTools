/* 
SAUVESTRE Clément / JACQUES Patrick / GOMES Enzo
Foncitonnalités de notre page d'acceuil
*/

'use strict'

//Responsive menu


//Fenêtre de création de projet
document.getElementById('create').addEventListener('click',
function() {
  document.querySelector('.bg-modal').style.display = 'flex';
});
document.querySelector('.close').addEventListener('click',
function() {
  document.querySelector('.bg-modal').style.display = 'none';
});

//Sélection et stockage du project sur lequel l'utilisateur va travailler liens vers projet .html
document.addEventListener("DOMContentLoaded", () => {
    var ul = document.querySelector('ul');
    
   
    ul.onclick = function(event) {
        var under = document.querySelectorAll( ":hover" );
        var projectId;
        if(under[under.length-1].id !== "deletion"){
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
        }
    };
});



//obtenir le nom l'abstract et l'id et les transmettre vers la seconde page
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
            console.log("No more key");
            
        }
       
    }
}




