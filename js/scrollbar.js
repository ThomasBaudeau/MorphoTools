'use strict'

$('#titre').mouseover(
    function(){
        document.querySelector('.infobulle').style.display='flex';
        //document.getElementById('bulle').style.display='flex';
    })
$('#titre').mouseout(
    function(){
        document.querySelector('.infobulle').style.display='none';
        //document.getElementById('bulle').style.display='none';
    })

//Fenêtre d'importation de fichiers
document.getElementById('import').addEventListener('click',
    function () {
        document.querySelector('.import-modal').style.display = 'flex';
    });

document.getElementById('import-close').addEventListener('click',
    function () {
        document.querySelector('.import-modal').style.display = 'none';
    });


document.getElementById('Validation').addEventListener('click',
    function(){
        //suppression des ancients messages
        if(document.getElementById("error_message") !== null){
            var error = document.getElementById("error_message");
            error.parentNode.removeChild(error);
        }

        //vérif de presence des fichiers
        if (document.getElementById('ii').files.length == 0 || document.getElementById('ij').files.length == 0){
            let window = document.getElementById('import-mc');
            let error = document.createElement('p');
            error.setAttribute('id',"error_message");
            error.innerHTML = "Erreur, vous devez importer des images et une matrice";
            window.appendChild(error);
        }
        // fermeture de la fenetre et ajout info a gauche
        else{
            document.querySelector('.import-modal').style.display = 'none';
            document.getElementById("nb_photo").innerHTML = "Nombre de photos importées : " + document.getElementById('ii').files.length;
            document.getElementById("nb_matrice").innerHTML = "Nombre de matrices importées : " + document.getElementById('ij').files.length;
            deleteImport();
            addImport();
        }
    });

document.addEventListener("DOMContentLoaded",function(){
    document.getElementById("titre").textContent = sessionStorage.getItem('name_project');
    document.getElementById("ok").textContent = sessionStorage.getItem('abstract_project');
});


document.addEventListener("DOMContentLoaded",function(){
    NumberImage()
    document.getElementById("titre").textContent = sessionStorage.getItem('name_project');
    document.getElementById("ok").textContent = sessionStorage.getItem('abstract_project');
});



function NumberImage()
{
    let numberJson=0;
    let numberImage=0;
    let connection = window.indexedDB.open('morphotools', 3);
    connection.onerror = function (e) {
        console.error('Unable to open database.');
    }
    connection.onsuccess = (e) => {
        let db = e.target.result;
        console.log('DB opened');
        let project_id = sessionStorage.getItem('selected_project');
        let objectStore = db.transaction(['imports'], 'readwrite').objectStore('imports');
        
        objectStore.openCursor().onsuccess =function(e){
            let cursor = e.target.result;
            if (cursor) {
                let id = cursor.value.project_id;
                let key = cursor.key;
                let name= cursor.value.type_file;
                if (id == project_id) {
                    if (name.search('json') !=-1 ){
                        numberJson++;
                    }
                    else if (name.search('jpg') != -1 || name.search('png') || name.search('jpeg') || name.search('gif')){
                        numberImage++;
                    }
                }

                cursor.continue();
            }
            else {
                console.log("No more key");
                document.getElementById("nb_photo").innerHTML = "Nombre de photos importées : " + numberImage;
                document.getElementById("nb_matrice").innerHTML = "Nombre de matrices importées : " + numberJson;
            }
        }
    
    }
    
} 