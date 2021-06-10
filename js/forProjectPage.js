/* 
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
informations display on the project page
*/

function check_tool(){
    let tl = document.getElementsByName("tools");
    for (let i = 0; i<tl.length; i++){
        if (tl[i].checked){
            let tlc = tl[i].attributes[3].value;
            return tlc;
        }
    }   
    return null;
}

document.getElementById('btn_run').addEventListener('click',function(){
    let tl = check_tool();
    if (tl == "VISU"){
        document.getElementById("visu_titre").textContent = sessionStorage.getItem('name_project');
        document.querySelector('.visu').style.display ='flex';
        document.querySelector('#menu_general').style.display = 'none';
        document.querySelector('#menu_visu').style.display = 'block';
        document.querySelector('#display_window').style.display = 'block';
    }
})

document.getElementById('back_visu').addEventListener('click',function(){
    document.querySelector('#menu_general').style.display = 'block';
    document.querySelector('#menu_visu').style.display = 'none';
    document.querySelector('#display_window').style.display = 'none';
})
function loadStart(function_name){
//toggle download bar
    document.querySelector('#download_symbol').style.display = 'block';
    document.querySelector('#loading_div').style.display = 'block';
    document.getElementById('loading_message').innerHTML = function_name;

}
function loadEnd(){
    document.querySelector('#download_symbol').style.display = 'none';
    document.querySelector('#loading_div').style.display = 'none';
    document.getElementById('loading_message').innerHTML = "";
 
}