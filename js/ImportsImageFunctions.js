/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
functionalities for handling files for Indexed DB
*/

function initDb(){
    let request = indexedDB.open('morphotools', 3);

    request.onerror = function (e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function (e) {
        db = e.target.result;
        console.log('db opened');
    }

    request.onupgradeneeded = function (e) {
        let db = e.target.result;
        db.createObjectStore('imports', { project_id: 'id',type_file:'.JPG' ,data: 'data'  });
        dbReady = true;
    }
}

function ImportImage(file) {

    let request = indexedDB.open('morphotools', 3);

    request.onerror = function (e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function (e) {
        db = e.target.result;
        console.log('db opened');
        console.log('change event fired for input field');
        var reader = new FileReader();
        //reader.readAsDataURL(file);
        reader.readAsBinaryString(file);

        reader.onload = function (e) {
            //alert(e.target.result);
            let bits = e.target.result;
            let ob = {
                project_id: sessionStorage.getItem('selected_project'),
                type_file: file.name,
                data: bits
            };

            let trans = db.transaction(['imports'], 'readwrite');
            let addReq = trans.objectStore('imports').add(ob);

            addReq.onerror = function (e) {
                console.log('error storing data');
                console.error(e);
            }

            trans.oncomplete = function (e) {
                console.log('data stored');
            }
        }
    }

    
}

function ImportJson(arr,name){
    console.log(arr)
    
    let request = indexedDB.open('morphotools', 3);

    request.onerror = function (e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function (e) {
        db = e.target.result;
        console.log('db opened');
        let ob = {
            project_id: sessionStorage.getItem('selected_project'),
            type_file: name,
            data: arr
        };
        let trans = db.transaction(['imports'], 'readwrite');
        let addReq = trans.objectStore('imports').add(ob);
        addReq.onerror = function (e) {
            console.log('error storing data');
            console.error(e);
        }
    
        trans.oncomplete = function (e) {
            console.log('data stored');
        }
    }

    
}
        

function addImport() {
    let d_b;
    initDb();
    var photo = document.getElementById("ii").files;
    var files = [photo];
    const fileInput = $('#ij')[0].files[0];
    console.log("FILE INPUT" + fileInput);
    var reader = new FileReader();
    reader.fileName = fileInput.name;
    // le fichier importé est un JSON
    if (checkimport(reader.fileName)) {
        console.log(reader);
        reader.readAsText(fileInput);
        reader.onload = function (readerEvent) {
            console.log('ok');
            var data = JSON.stringify(readerEvent.target.result); //parsing du json
            ImportJson(data, reader.fileName);
        };
    }
    for (let i = 0; i < files.length; i++) {
        for (let j = 0; j < files[i].length; j++) {
            if (/\.(jpe?g|png|gif)$/i.test(files[i][j].name)) {
                ImportImage(files[i][j]);
            }
        }
    }       
}

function deleteImport() {
    let connection = window.indexedDB.open('morphotools', 3);
    connection.onerror = function (e) {
        console.error('Unable to open database.');
    }
    connection.onsuccess = (e) => {
        let db = e.target.result;
        console.log('DB opened');
        let project_id = sessionStorage.getItem('selected_project');

        let objectStore = db.transaction(['imports'], 'readwrite').objectStore('imports');
        objectStore.openCursor().onsuccess = function (e) {
            let cursor = e.target.result;
            if (cursor) {
                let id = cursor.value.project_id;
                let key = cursor.key;
                if (id == project_id) {
                    cursor.delete(key);
                }

                cursor.continue();
            }
            else {
                console.log("No more key");
            }
        }
    }
}