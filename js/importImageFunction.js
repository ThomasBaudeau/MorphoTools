//fin features

//Stockage temporaire de l'url d'une image dans session storage
function transformImport(file) {
    if (/\.(jpe?g|png|gif|json|csv)$/i.test(file.name)) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            let url = e.target.result;
            sessionStorage.setItem('patch_' + file.name, url);
        };
    };
};

//Stockage des images dans le dossier import de notre base de donnée
function addImport() {
    let d_b;
    var photo = document.getElementById("ii").files;
    var json = document.getElementById("ij").files;
    var files = [photo,json];
    if (files) {
        for (let i = 0; i < files.length; i++) {
            [].forEach.call(files[i], transformImport);
        }
    }
    let connection = window.indexedDB.open('morphotools', 3);
    connection.onerror = function (e) {
        console.error('Unable to open database.');
    }
    connection.onsuccess = (e) => {
        d_b = e.target.result;
        console.log('DB opened');
        let select_id = sessionStorage.getItem('selected_project');
        let transaction = d_b.transaction(['imports'], 'readwrite');
        let objectStore = transaction.objectStore('imports');
        
        for (let i = 0; i < files.length; i++) {
            for (let j = 0; j < files[i].length; j++){
                //Add un champs patch_name ou créer une table d'import par projet 
                let myData = sessionStorage.getItem('patch_' + files[i][j].name);
                let newItem = { project_id: select_id, data: myData };
                objectStore.add(newItem);
            }
        }
        transaction.oncomplete = function () {
            console.log('Transaction completed !');
        };
        transaction.onerror = function () {
            console.log('Transaction not opened due to error');
        };
    };
};

function deleteImport()
{
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