//fin features

//Stockage temporaire de l'url d'une image dans session storage
function transformImport(file) {
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
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
    var files = document.querySelector("input[type=file]").files;
    if (files) {
        [].forEach.call(files, transformImport);
    }
    let connection = window.indexedDB.open('morphotools', 3);
    connection.onerror = function (e) {
        console.error('Unable to open database.');
    }
    connection.onsuccess = (e) => {
        d_b = e.target.result;
        console.log('DB opened');
        let select_id = sessionStorage.getItem('selected_project')
        let transaction = d_b.transaction(['imports'], 'readwrite');
        let objectStore = transaction.objectStore('imports');
        for (let i = 0; i < files.length; i++) {
            //Add un champs patch_name ou créer une table d'import par projet 
            let myData = sessionStorage.getItem('patch_' + files[i].name);
            let newItem = { project_id: select_id, data: myData };
            objectStore.add(newItem);
        }
        transaction.oncomplete = function () {
            console.log('Transaction completed !');
        };
        transaction.onerror = function () {
            console.log('Transaction not opened due to error');
        };
    };
};