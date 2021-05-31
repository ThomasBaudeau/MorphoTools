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