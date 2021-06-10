/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
handle display of projects within the DB
*/

//call addData() whenever a formulary is submited.
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

form.onsubmit = addData;

function addData(e) {
    console.log(nameInput.value)
    e.preventDefault();
    if (document.getElementById("error_message") !== null) {
        var error = document.getElementById("error_message");
        error.parentNode.removeChild(error);
    }

    //check if files exist
    if (nameInput.value.length == 0) {
        let window = document.querySelector('form');;
        let error = document.createElement('p');
        error.setAttribute('id', "error_message");
        error.innerHTML = "Project should have a name";
        window.appendChild(error);
    }
    
    else {
        //stock values within the formulary to the DB
        let newItem = { name: nameInput.value, abstract: abstractInput.value };
        let transaction = db.transaction(['projects'], 'readwrite');
        let objectStore = transaction.objectStore('projects');
        var request = objectStore.add(newItem);

        request.onsuccess = function () {
            //empty the formulary
            nameInput.value = '';
            abstractInput.value = '';
            // close window
            document.querySelector('.bg-modal').style.display = 'none';
        };
        transaction.oncomplete = function () {
            console.log('Transaction completed.');
            //update display
            displayData();
        };

        transaction.onerror = function () {
            console.log('Transaction not opened due to error');
        };
    }

    //Attente de la fin de la transaction
};

//Définit la fonction displayData()
function displayData() {
    //Vide le contenu de la liste à chaque mise à jour pour eviter les duplicats
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    //Ouvre la table projects puis récupère un curseur - qui va nous permettre d'itérer
    //sur les entrées de notre table
    let objectStore = db.transaction(['projects'], 'readwrite').objectStore('projects');
    objectStore.openCursor().onsuccess = function (e) {
        //Récupère une référence au curseur
        let cursor = e.target.result;
        if (cursor) {
            //Crée un li, h3, et p pour mettre les données de l'entrée puis les ajouter à la liste
            let listItem = document.createElement('li');
            let h3 = document.createElement('h3');
            let para = document.createElement('p');
            para.setAttribute("id", "description")
            listItem.appendChild(h3);
            listItem.appendChild(para);
            list.appendChild(listItem);
            //Récupère les données à partir du curseur et les ajoutes dans le h3 et p
            h3.textContent = cursor.value.name;
            para.textContent = cursor.value.abstract;
            //Met l'ID de l'entrée dans un attribut du li, pour savoir à quelle entrée il correspond
            //Ce sera utile plus tard pour pouvoir supprimer des entrées
            listItem.setAttribute('data-project-id', cursor.value.id);
            //Crée un bouton et le place dans le li
            let deleteBtn = document.createElement('button');
            deleteBtn.setAttribute("id", "deletion")
            listItem.appendChild(deleteBtn);
            deleteBtn.textContent = 'Delete';
            //Définit un gestionnaire d'événement pour appeler deleteItem()
            //quand le bouton supprimer est cliqué
            deleteBtn.onclick = deleteItem;
            //Continue l'itération vers la prochaine entrée du curseur
            cursor.continue();
        } else {
            //Si la liste est vide, affiche un message "Aucun projet n'existe"
            if (!list.firstChild) {
                let listItem = document.createElement('li');
                listItem.textContent = 'No registered projects';
                list.appendChild(listItem);
            }
            console.log('Projects all displayed');
        };
    };
};

//Définit la fonction deleteItem()
function deleteItem(e) {
    //Récupère l'id de l'entrée que l'on veut supprimer
    let projectId = Number(e.target.parentNode.getAttribute('data-project-id'));
    deleteImport(projectId);
    //Ouvre une transaction et supprime la projet ayant l'id récupéré ci-dessus
    let transaction = db.transaction(['projects'], 'readwrite');
    let objectStore = transaction.objectStore('projects');
    let request = objectStore.delete(projectId);

    //Indique à l'utilisateur que l'entrée a été supprimée
    transaction.oncomplete = function () {
        //Supprime l'élément parent du bouton
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        console.log('Project ' + projectId + ' deleted.');

        if (!list.firstChild) {
            let listItem = document.createElement('li');
            listItem.textContent = 'No registered projects';
            list.appendChild(listItem);
        };
    };
};
  
function deleteImport(project_id)
{
    console.log('id');
    let objectStore = db.transaction(['imports'], 'readwrite').objectStore('imports');
    let test = objectStore.openCursor();
    objectStore.openCursor().onsuccess =function(e){
        let cursor = e.target.result;
        if (cursor) {
            let id = cursor.value.project_id;
            let key = cursor.key;
            console.log(id);
            console.log(key);
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
