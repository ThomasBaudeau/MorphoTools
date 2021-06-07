
function addJSONtoDB(cy) {

    // Open the DB
    let request = indexedDB.open('morphotools', 3);
    
    // if an error occur :
    request.onerror = function (e) {
        console.error('Unable to open database.');
    }
    // if nothing happen : start interacting with the DB
    request.onsuccess = function (e) {
        db = e.target.result;
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
                let key = cursor.key;
                if ((id == project_id) && (name.search('json'))) {
                    cursor.delete(key);
                    return;
                }
                cursor.continue();
            }
        }
        console.log(cy.json());
        
        let ob = {
            project_id : sessionStorage.getItem('selected_project'),
            type_file : 'json',
            data : JSON.parse(JSON.stringify(cy.json()))
        };
        let addJSON = store.add(ob);
        
        addJSON.onerror = function(e) {
            console.log('error new json didnt save');
        }
        addJSON.oncomplete = function(e) {
            console.log('new json saved');
        } 
    }
}