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
    }
})