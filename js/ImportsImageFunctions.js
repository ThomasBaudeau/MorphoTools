/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
functionalities for handling files for Indexed DB
*/

function initDb(){
    let request = indexedDB.open(sessionStorage.getItem('selected_project'), 3);

    request.onerror = function (e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function (e) {
        db = e.target.result;
        console.log('db opened');
    }

    request.onupgradeneeded = function (e) {
        let db = e.target.result;
        db.createObjectStore('imports', {type_file:'.JPG' ,data: 'data'  });
        dbReady = true;
    }
}

function ImportImage(files) {
    var count=0;
    var nbfile=files[0].length;
    loadStart('saving files');
    let request = indexedDB.open(sessionStorage.getItem('selected_project'), 3);

    request.onerror = function (e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = async function (e) {
        console.log('db opened');
        console.log('change event fired for input field');
        for (let i = 0; i < files.length; i++) {
            for (let j = 0; j < files[i].length; j++) {
                if (/\.(jpe?g|png|gif)$/i.test(files[i][j].name)) {
                    db = e.target.result;
                    var reader = new FileReader();
                    reader.readAsBinaryString(files[i][j]);
                    reader.onload = function (e) {
                        let bits = e.target.result;
                        let ob = {
                            type_file: files[i][j].name,
                            data: bits
                        };

                        let trans = db.transaction(['imports'], 'readwrite');
                        let addReq = trans.objectStore('imports').add(ob);

                        addReq.onerror = function (e) {
                            console.log('error storing data');
                            console.error(e);
                        }

                        trans.oncomplete =function (e) {
                            console.log('data stored');
                            count++;
                            if (count===nbfile)
                            {
                                loadEnd();
                            }
                        }
                    }
                    
                }
            }
        }

    }

    
}

function ImportJson(arr,name){
    console.log(arr);
    let request = indexedDB.open(sessionStorage.getItem('selected_project'), 3);

    request.onerror = function (e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function (e) {
        db = e.target.result;
        console.log('db opened');
        let ob = {
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
    ImportImage(files);
}

function deleteImport() {
    let connection = window.indexedDB.open(sessionStorage.getItem('selected_project'), 3);
    connection.onerror = function (e) {
        console.error('Unable to open database.');
    }
    connection.onsuccess = (e) => {
        let db = e.target.result;
        console.log('DB opened');
        let objectStore = db.transaction(['imports'], 'readwrite').objectStore('imports');
        objectStore.openCursor().onsuccess = function (e) {
            let cursor = e.target.result;
            if (cursor) {
                let key = cursor.key;
                cursor.delete(key);
                cursor.continue();
            }
            else {
                console.log("No more key");
            }
        }
    }
}