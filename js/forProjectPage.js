function replaceTtitle(){
    let name_project = sessionStorage.getItem('name_project');
    let abstract_project = sessionStorage.getItem('abstract_project');
    document.getElementById('titre').innerHTML = name_project;
    document.getElementById('ok').innerHTML = abstract_project;
}

function checkClassValue(){
    var elements = document.getElementsByClassName("select-box");
    var value = elements[0].value;
    console.log(value);
}

<<<<<<< HEAD
//Lancement de Visugraph
function visuLaunch(){
    var element = getElementsByClassName("select-box");
    if(element[0].value == 'VISU'){
        document.getElementById('btn_run').addEventListener('click',
        function() {
            document.querySelector('.visu').style.display = 'flex';
        });
    }
}
=======

document.getElementById('btn_run').addEventListener('click',function(){
    let tl = check_tool();
    if (tl == "VISU"){
        document.querySelector('.visu').style.display ='flex';
    }
})
>>>>>>> c884432310182bf555873ded2b06b1d8a47e0c82
