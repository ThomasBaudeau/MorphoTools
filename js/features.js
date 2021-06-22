/* 
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
functionalities for the homepage
*/

'use strict'

//Responsive menu


//project creation window
document.getElementById('create').addEventListener('click',
function() {
  document.querySelector('.bg-modal').style.display = 'flex';
});
document.querySelector('.close').addEventListener('click',
function() {
  document.querySelector('.bg-modal').style.display = 'none';
});

//selection and stockage of the working project. Link to projet.html
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
            sessionStorage.setItem('selected_project',projectId);
            obtainValues(projectId);
            window.location.href="projet.html";
        }
    };
});



//get the id and the abstract for the projet.html
function obtainValues(key) {
    //DB successfully opened
    let request = indexedDB.open('morphotools', 3);
    request.onsuccess = function (e) {
        db = e.target.result;
        let objectStore = db.transaction(['projects'], 'readwrite').objectStore('projects');
        objectStore.openCursor().onsuccess = function (e) {
            //ref to the cursor
            let cursor = e.target.result;
            if (cursor){
                let thename = cursor.value.name;
                let abstract = cursor.value.abstract;
                let id_ = cursor.key;
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
}




