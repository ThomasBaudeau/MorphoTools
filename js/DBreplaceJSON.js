/*
Thomas Baudeau / Gregory Bordier / Valentin Gonay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*
DBreplaceJSON.js : Add JSON to Indexed DB
July 9 2021
Version 1.5.0
*/

function addJSONtoDB(cy) {
    loadStart('converting CSV to JSON')
    // Open DB
    let request = indexedDB.open(sessionStorage.getItem('selected_project'), 3);
    
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
            let cursor = e.target.result;
            if (cursor) {
                let name = cursor.value.type_file;
                let key = cursor.key;
                if ((name.search('json')!=-1)) {
                    cursor.delete(key);
                    return;
                }
                cursor.continue();
            }
        }
        let thedata=JSON.stringify(cy.json());
        let ob = {
            type_file : 'json',
            data : thedata
        };
        let trans2 = db.transaction(['imports'], 'readwrite');
        // ref for the store
        let store2 = trans2.objectStore('imports').add(ob);
        
        trans2.onerror = function(e) {
            console.log('error new json didnt save');
        }
        trans2.oncomplete = function(e) {
            console.log('new json saved');
            loadEnd();
            loadEnd_witness();
        } 
    } 
}


