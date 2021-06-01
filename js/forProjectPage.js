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
        document.querySelector('.visu').style.display ='flex';
        document.querySelector('#menu_general').style.display = 'none';
        document.querySelector('#menu_visu').style.display = 'block';
    }
})

document.getElementById('back_visu').addEventListener('click',function(){
    document.querySelector('#menu_general').style.display = 'block';
    document.querySelector('#menu_visu').style.display = 'none';
})