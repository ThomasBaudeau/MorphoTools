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

    //Bouton de validation => ajouter vérification de nombre d'import
document.getElementById('Validation').addEventListener('click',
    function(){
        document.querySelector('.import-modal').style.display = 'none';
    });

document.addEventListener("DOMContentLoaded",function(){
    document.getElementById("titre").textContent = sessionStorage.getItem('name_project');
    document.getElementById("ok").textContent = sessionStorage.getItem('abstract_project');
});