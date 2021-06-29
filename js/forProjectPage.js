/* 
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
informations display on the project page
*/
// function for loading screen
async function chargement(texte, nbr, multi) {
    loadStart(texte)
    await delay(nbr * multi)
    loadEnd()
}
// function for loading screen
function delay(n) {
    n = n || 2000;
    return new Promise(done => {
        setTimeout(() => {
            done();
        }, n);
    });
}

// checking wich tool have been selected and return his value
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

// button run for start visugraph or other tool
document.getElementById('btn_run').addEventListener('click',function(){
    let tl = check_tool();//check wich tool have been selected
    if (tl == "VISU"){
        if (sessionStorage.getItem('numberJson') == 0) {//check if files have been loaded
            displayerror();
            return;
        }
        document.getElementById("visu_titre").textContent = sessionStorage.getItem('name_project');
        document.querySelector('.visu').style.display ='flex';
        document.querySelector('#menu_general').style.display = 'none';
        document.querySelector('#menu_visu').style.display = 'block';
        document.querySelector('#display_window').style.display = 'block';
        setTimeout(singleImportJSON(cy),500)
    }
    else{
        {
            displayerror();
            return;
        }
    }
})

document.getElementById('back_visu').addEventListener('click',function(){
    document.querySelector('#menu_general').style.display = 'block';
    document.querySelector('#menu_visu').style.display = 'none';
    document.querySelector('#display_window').style.display = 'none';
})

