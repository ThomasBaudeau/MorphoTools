/* 
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
fonctions de chargement et blockage des bouttons
*/

function loadStart(function_name){
    //toggle download bar
    document.querySelector('#download_symbol').style.display = 'block';
    document.querySelector('#loading_div').style.display = 'block';
    document.getElementById('loading_message').innerHTML = function_name;
    blocking_buttons();
}
    
function loadEnd(){
    document.querySelector('#download_symbol').style.display = 'none';
    document.querySelector('#loading_div').style.display = 'none';
    document.getElementById('loading_message').innerHTML = "";
    activating_buttons();

}

function loadEnd_witness(){
    //fin du chargement
    document.querySelector('#end-loading_div').style.display = 'block';
    setTimeout(function(){
        document.querySelector('#end-loading_div').style.display = 'none';
    },2000)
}

function blocking_buttons(){
    $(':button').prop('disabled', true);
    $('input').prop('disabled', true);
}

function activating_buttons(){
    $(':button').prop('disabled', false);
    $('input').prop('disabled', false);
}