/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
scrollbar.js : scrollbar in projet.html
Version 1.5.0
*/
'use strict'

//Show abstract when mouse hover the title
$('#titre').mouseover(
    function(){
        document.querySelector('.infobulle').style.display='flex';
    })
$('#titre').mouseout(
    function(){
        document.querySelector('.infobulle').style.display='none';
    })
//-----------------------------------------------------------//
//file import window
document.getElementById('import').addEventListener('click',
    function () {
        document.querySelector('.import-modal').style.display = 'flex';
    });

document.getElementById('import-close').addEventListener('click',
    function () {
        document.querySelector('.import-modal').style.display = 'none';
    });

document.getElementById('choose').addEventListener('click',
function () {
    sessionStorage.setItem('choix','CH');
    chooseImage();
});

document.getElementById('choose-close').addEventListener('click',
function () {
    document.querySelector('.choose-modal').style.display = 'none';
});

document.getElementById('input_type-close').addEventListener('click',
function () {
    document.querySelector('.type_choice-modal').style.display = 'none';
});


document.getElementById('Validation').addEventListener('click',
    function(){
        //delete old messages
        if(document.getElementById("error_message") !== null){
            var error = document.getElementById("error_message");
            error.parentNode.removeChild(error);
        }

        //check files existence
        if ((document.getElementById('ii').files.length == 0 && document.getElementById('ij').files.length == 0)){ //||+
        // (document.getElementById('iv').files.length == 0 && document.getElementById('ij').files.length == 0)||+
        // (document.getElementById('ir').files.length == 0 && document.getElementById('ij').files.length == 0)||+
        // (document.getElementById('is').files.length == 0 && document.getElementById('ij').files.length == 0)){
            let window = document.getElementById('import-mc');
            let error = document.createElement('p');
            error.setAttribute('id',"error_message");
            error.innerHTML = "Error, you must import images and a matrix.";
            window.appendChild(error);
        }

        //close window and add infos to the left
        else{
            document.querySelector('.import-modal').style.display = 'none';
            document.getElementById("nb_photo").innerHTML = "Number of imported photos : " + document.getElementById('ii').files.length;
            sessionStorage.setItem('numberImage', document.getElementById('ii').files.length);
            document.getElementById("nb_matrice").innerHTML = "Number of imported dies : " + document.getElementById('ij').files.length;
            sessionStorage.setItem('numberJson',document.getElementById('ij').files.length);
            deleteImport();
            //addImport();
        }
    });
//-----------------------------------------------------------//
//load title and abstract
document.addEventListener("DOMContentLoaded",function(){
    NumberImage()
    document.getElementById("titre").textContent = sessionStorage.getItem('name_project');
    document.getElementById("info_bulle").textContent = sessionStorage.getItem('abstract_project');
});


//Calculated numbers of images 
function NumberImage()
{
    let numberJson=0;
    let numberImage=0;
    let connection = window.indexedDB.open(sessionStorage.getItem('selected_project'), 3);//conection to the database:
    connection.onerror = function (e) {
        console.error('Unable to open database.');
    }
    connection.onsuccess = (e) => {
        let db = e.target.result;
        console.log('DB opened');
        let objectStore = db.transaction(['imports'], 'readwrite').objectStore('imports');
        
        objectStore.openCursor().onsuccess =function(e){
            let cursor = e.target.result;
            if (cursor) {
                let key = cursor.key;
                let name= cursor.value.type_file;
                if (name.search('json') !=-1){
                   numberJson++;
                }
                else if (name.search('jpg') != -1 || name.search('png') || name.search('jpeg') || name.search('gif')){
                    numberImage++;
                }
                cursor.continue();
            }
            else {
                console.log("No more key");
                document.getElementById("nb_photo").innerHTML = "Number of imported photos : " + numberImage;
                document.getElementById("nb_matrice").innerHTML = "Number of imported dies : " + numberJson;
                sessionStorage.setItem('numberImage',numberImage);
                sessionStorage.setItem('numberJson',numberJson);
            }
        }
    
    }  
}



//Select all checkbox when all is checked.
function selectAll(ch) {
	var tab = document.getElementsByTagName("input"); 
	for (var i = 0; i < tab.length; i++) { 
		if (tab[i].type == "checkbox")
			tab[i].checked = ch.checked;
	}
}

//Load the window for selecting images to display
function chooseImage() {
    let select = document.getElementsByName('select[]');
    var count=0;
    //check if the window have been previously loaded if yes stop the function
    if(select.length>1){
        document.querySelector('.choose-modal').style.display = 'flex';
        return
    }
    loadStart('loading images');//start loading function
    if (document.getElementById('ii').files.length!=0){//check if images is localy loaded if not check in the database
        var fileInput = document.getElementById('ii');
        for(let i=0;i<fileInput.files.length;i++){
            var reader = new FileReader();
            reader.readAsDataURL(fileInput.files[i]);
            reader.fileName = fileInput.files[i].name;
            reader.onload = function (readerEvent) {
                var url = readerEvent.target.result;
                var name = readerEvent.target.fileName;
                if (/\.(jpe?g|png|gif)$/i.test(name)) {//creating line and checkboxe for each image
                    let data = url;
                    let table = document.getElementById('choose_image');
                    let line = document.createElement('tr');
                    let column = document.createElement('td');
                    let checkbox = document.createElement('input');
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.setAttribute('id', name);
                    checkbox.setAttribute('name', 'select[]');
                    checkbox.setAttribute('value', 'image_' + name);
                    let label = document.createElement('label');
                    label.setAttribute('for', name);
                    label.textContent = name;
                    let column2 = document.createElement('td');
                    let image = document.createElement('img');
                    image.setAttribute('src', data);
                    image.setAttribute('style', 'opacity:1')
                    image.setAttribute('width', '100px')
                    image.setAttribute('height', '100px')
                    column.appendChild(checkbox);
                    column.appendChild(label)
                    column2.appendChild(image)
                    line.appendChild(column);
                    line.appendChild(column2)
                    table.appendChild(line);
                    count++;
                    if (count == sessionStorage.getItem('numberImage')) {
                        loadEnd();//stop loading function if all images have been process
                        document.querySelector('.choose-modal').style.display = 'flex';
                    }
                }
            
            }
        }
    }
    else{// check images in the database
    // Open DB
        let request = indexedDB.open(sessionStorage.getItem('selected_project'), 3);
    
    // if an error occur :
    request.onerror = function (e) {
        console.error('Unable to open database.');
    }
    // if nothing happen : start interacting with the DB
    request.onsuccess = function (e) {
        let db = e.target.result;
        console.log('db opened');

        //the request to read and write within the DB
        let trans = db.transaction(['imports'], 'readwrite');
        // ref for the store
        let store = trans.objectStore('imports');

        // if another error occur :
        db.onerror = function(e) {
            console.log("ERROR" + e.target.errorCode);
        }
        //cursor
        store.openCursor().onsuccess = function(e){
            let cursor = e.target.result;
            if (cursor) {
                let name = cursor.value.type_file;
                if (/\.(jpe?g|png|gif)$/i.test(name)) {//creating line and checkboxe for each image
                    let data = cursor.value.data;
                    let table=document.getElementById('choose_image');
                    let line=document.createElement('tr');
                    let column=document.createElement('td');
                    let checkbox=document.createElement('input');
                    checkbox.setAttribute('type','checkbox');
                    checkbox.setAttribute('id',name);
                    checkbox.setAttribute('name','select[]');
                    checkbox.setAttribute('value','image_'+name);
                    let label=document.createElement('label');
                    label.setAttribute('for',name);
                    label.textContent=name;
                    let column2=document.createElement('td');
                    let image=document.createElement('img');
                    image.setAttribute('src','data:image/jpeg;base64,' + btoa(data));
                    image.setAttribute('style','opacity:1')
                    image.setAttribute('width','100px')
                    image.setAttribute('height','100px')
                    column.appendChild(checkbox);
                    column.appendChild(label)
                    column2.appendChild(image)
                    line.appendChild(column);
                    line.appendChild(column2)
                    table.appendChild(line);
                    count++;
                    if (count==sessionStorage.getItem('numberImage'))
                    {
                        loadEnd()//stop loading function if all images have been process
                        document.querySelector('.choose-modal').style.display = 'flex';
                    }
                }
                cursor.continue();
            }
        }
    }
    }
}
