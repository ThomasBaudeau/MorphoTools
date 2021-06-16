/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
scrollbar in projet.html
*/
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
    chooseImage();
});


document.getElementById('choose-close').addEventListener('click',
    function () {
        document.querySelector('.choose-modal').style.display = 'none';
    });


document.getElementById('Validation').addEventListener('click',
    function(){
        //delete old messages
        if(document.getElementById("error_message") !== null){
            var error = document.getElementById("error_message");
            error.parentNode.removeChild(error);
        }

        //check files existence
        if (document.getElementById('ii').files.length == 0 || document.getElementById('ij').files.length == 0){
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
            deleteImport();
            //addImport();
        }
    });

document.addEventListener("DOMContentLoaded",function(){
    document.getElementById("titre").textContent = sessionStorage.getItem('name_project');
    document.getElementById("ok").textContent = sessionStorage.getItem('abstract_project');
});


document.addEventListener("DOMContentLoaded",function(){
    NumberImage()
    document.getElementById("titre").textContent = sessionStorage.getItem('name_project');
    document.getElementById("ok").textContent = sessionStorage.getItem('abstract_project');
});



function NumberImage()
{
    let numberJson=0;
    let numberImage=0;
    let connection = window.indexedDB.open('morphotools', 3);
    connection.onerror = function (e) {
        console.error('Unable to open database.');
    }
    connection.onsuccess = (e) => {
        let db = e.target.result;
        console.log('DB opened');
        let project_id = sessionStorage.getItem('selected_project');
        let objectStore = db.transaction(['imports'], 'readwrite').objectStore('imports');
        
        objectStore.openCursor().onsuccess =function(e){
            let cursor = e.target.result;
            if (cursor) {
                let id = cursor.value.project_id;
                let key = cursor.key;
                let name= cursor.value.type_file;
                if (id == project_id) {
                    if (name.search('json') !=-1 ){
                        numberJson++;
                    }
                    else if (name.search('jpg') != -1 || name.search('png') || name.search('jpeg') || name.search('gif')){
                        numberImage++;
                    }
                }

                cursor.continue();
            }
            else {
                console.log("No more key");
                document.getElementById("nb_photo").innerHTML = "Number of imported photos : " + numberImage;
                document.getElementById("nb_matrice").innerHTML = "Number of imported dies : " + numberJson;
                sessionStorage.setItem('numberImage',numberImage)
            }
        }
    
    }
    
} 




function selectAll(ch) {
	var tab = document.getElementsByTagName("input"); 
	for (var i = 0; i < tab.length; i++) { 
		if (tab[i].type == "checkbox")
			tab[i].checked = ch.checked;
	}
}

function chooseImage() {
    let select = document.getElementsByName('select[]');
    var count=0;
    if(select.length>1){
        document.querySelector('.choose-modal').style.display = 'flex';
        return
    }
    loadStart('loading images')
    // Open DB
    let request = indexedDB.open('morphotools', 3);
    
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
            let project_id = sessionStorage.getItem("selected_project");
            let cursor = e.target.result;
            if (cursor) {
                let id = cursor.value.project_id;
                console.log("id ", id);
                let name = cursor.value.type_file;
                console.log("name ",name);
                if ((id == project_id) &&  /\.(jpe?g|png|gif)$/i.test(name)) {
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
                        loadEnd()
                        document.querySelector('.choose-modal').style.display = 'flex';
                    }
                }
                cursor.continue();
            }
        }
        console.log(cy.json());
    }
}
