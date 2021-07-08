/* 
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
informations display on the project page
*/

// list of created image input
var input_type_list = []

var error = 0;

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


function choice_input_type(){
    document.getElementById('error_type_input').innerHTML = "";
    error = 0;
    document.querySelector('.type_choice-modal').style.display = 'flex';
}


function create_input_img(type){
    //type: int (0 to 3)
    let find_type = input_type_list.indexOf(type);
    let parent_div = document.getElementById('upload');

    let div = document.createElement('div');
    div.setAttribute('id','import_div');
    
    let label = document.createElement('h3');

    let input = document.createElement('input');
    input.setAttribute('type','file');
    input.setAttribute('multiple','true')
    input.setAttribute('accept','image/*');

    let img = document.createElement('img');
    img.setAttribute('src','images/minus_input.png');
    img.setAttribute('id','minus_input_type');

    if (type === 0 && find_type === -1){
        //recto (color)
        label.innerHTML = "Import recto (color)";

        input.setAttribute('id','ii');

        img.setAttribute('onclick','delete_input_img(0,this)');

        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(img);
        parent_div.appendChild(div);

        input_type_list.push(type);
        document.querySelector('.type_choice-modal').style.display = 'none';
    }

    else if (type === 1 && find_type === -1){
        //verso (color)
        label.innerHTML = "Import verso (color)";
        
        input.setAttribute('id','iv');

        img.setAttribute('onclick','delete_input_img(1,this)');

        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(img);
        parent_div.appendChild(div);

        input_type_list.push(type);
        document.querySelector('.type_choice-modal').style.display = 'none';
    }

    else if (type === 2 && find_type === -1){
        //recto (infrared)
        label.innerHTML = "Import recto (Infrared)";
        
        input.setAttribute('id','ir');

        img.setAttribute('onclick','delete_input_img(2,this)');

        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(img);
        parent_div.appendChild(div);

        input_type_list.push(type);
        document.querySelector('.type_choice-modal').style.display = 'none';
    }   

    else if (type === 3 && find_type === -1){
        //verso (infrared)
        label.innerHTML = "Import verso (Infrared)";
        
        input.setAttribute('id','is');

        img.setAttribute('onclick','delete_input_img(3,this)');

        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(img);
        parent_div.appendChild(div);

        input_type_list.push(type);
        document.querySelector('.type_choice-modal').style.display = 'none';
    }

    else if (error !== 1) {
        document.getElementById('error_type_input').innerHTML = "Error, you can't add the same type of input 2 times";
        error = 1;
    }
}

function delete_input_img(type,self){
    let find_type = input_type_list.indexOf(type);
    input_type_list.splice(find_type,1);
    self.parentNode.parentNode.removeChild(self.parentNode);
}