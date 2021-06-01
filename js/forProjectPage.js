function replaceTtitle(){
    let name_project = sessionStorage.getItem('name_project');
    let abstract_project = sessionStorage.getItem('abstract_project');
    document.getElementById('titre').innerHTML = name_project;
    document.getElementById('ok').innerHTML = abstract_project;
}

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

function run_tool(){
    let tl = check_tool();
    if (tl == "VISU"){
        document.querySelector('.visu').style.display ='flex';
    }
}

document.getElementById('btn_run').addEventListener('click',run_tool())