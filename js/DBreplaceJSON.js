function addJSON(){
    request.onsuccess = function(e){
        let db = request.result,
        trans = db.transaction(['imports'],'readwrite'),
        store = trans.objectStore("imports"),
        request = store.put(JSON.stringify( cy.json() ));

        request.onerror = function(e){
            console.log('error storing json');
            console.error(e);
        };
        request.oncomplete = function(e){
            console.log('json saved');
        };
    }
};