/* 
SAUVESTRE Clément / JACQUES Patrick / GOMES Enzo
Création de projet via un formulaire et initialisation de notre base de donnée
*/

'use strict'

const list = document.querySelector('ul');
const nameInput = document.querySelector('#name');
const abstractInput = document.querySelector('#abstract');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');


//Objet db pour stocker la BDD ouverte
let db;

window.onload = function() {
  let request = window.indexedDB.open('morphotools', 3);

  //La base de données n'a pas pu être ouverte avec succès
  request.onerror = function(event) {
    console.log('Database error : ' + event.target.errorCode);
  };

  //La base de données a été ouverte avec succès
  request.onsuccess = function() {
    console.log('Database opened successfully');
    //Stocke la base de données ouverte dans la variable db.
    db = request.result;
    //Exécute la fonction displayData() pour afficher les projets qui sont dans la BDD
    displayData();
  };

  //Spécifie les tables de la BDD si ce n'est pas déjà pas fait
  request.onupgradeneeded = function(e) { 
    //Récupère une référence à la BDD ouverte
    let db = e.target.result;

    //Crée une table pour stocker nos projets avec un champ qui s'auto-incrémente comme clé
    let objectStore = db.createObjectStore('projects', { keyPath: 'id', autoIncrement:true });
    //Définition des autres champs
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('abstract', 'abstract', { unique: false });
    
    //Crée la table qui stocke les fichiers qui vont être importés par l'utilisateur
    objectStore = db.createObjectStore('imports', { keyPath: 'id', autoIncrement:true });
    objectStore.createIndex('data', 'data', { unique: false });
    objectStore.createIndex('project_id', 'project_id', { unique: false});
  };

  //Crée un gestionnaire onsubmit pour appeler la fonction addData() quand le formulaire est soumis
  form.onsubmit = addData;

  //Définit la fonction addData()
  function addData(e) {
    e.preventDefault();
    //Récupérent les valeurs entrées dans les champs du formulaire
    //et les stockent dans un objet qui sera inséré en BDD 
    let newItem = { name: nameInput.value, abstract: abstractInput.value };
    //Ouvre une transaction en lecture/écriture sur notre table projects
    let transaction = db.transaction(['projects'], 'readwrite');
    //Récupére la table de la base de données qui a été ouvert avec la transaction
    let objectStore = transaction.objectStore('projects');
    //Demande l'ajout de notre nouvel objet à la table
    var request = objectStore.add(newItem);
    
    request.onsuccess = function() {
      //Vide le formulaire, pour qu'il soit prêt pour un nouvel ajout
      nameInput.value = '';
      abstractInput.value = '';
      // On ferme la fenetre qui a été ouverte
      document.querySelector('.bg-modal').style.display = 'none';
    };

    //Attente de la fin de la transaction
    transaction.oncomplete = function() {
      console.log('Transaction completed.');
      //Met à jour l'affichage pour montrer le nouvel item en exécutant displayData()
      displayData();
    };

    transaction.onerror = function() {
      console.log('Transaction not opened due to error');
    };
  };

  //Définit la fonction displayData()
  function displayData() {
    //Vide le contenu de la liste à chaque mise à jour pour eviter les duplicats
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    //Ouvre la table projects puis récupère un curseur - qui va nous permettre d'itérer
    //sur les entrées de notre table
    let objectStore = db.transaction(['projects'],'readwrite').objectStore('projects');
    objectStore.openCursor().onsuccess = function(e) {
      //Récupère une référence au curseur
      let cursor = e.target.result;
      if(cursor) {
        //Crée un li, h3, et p pour mettre les données de l'entrée puis les ajouter à la liste
        let listItem = document.createElement('li');
        let h3 = document.createElement('h3');
        let para = document.createElement('p');
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
        listItem.appendChild(deleteBtn);
        deleteBtn.textContent = 'Delete';
        //Définit un gestionnaire d'événement pour appeler deleteItem()
        //quand le bouton supprimer est cliqué
        deleteBtn.onclick = deleteItem;
        //Continue l'itération vers la prochaine entrée du curseur
        cursor.continue();
      } else {
        //Si la liste est vide, affiche un message "Aucun projet n'existe"
        if(!list.firstChild) {
          let listItem = document.createElement('li');
          listItem.textContent = 'Aucun projet enregistré.';
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
    //Ouvre une transaction et supprime la projet ayant l'id récupéré ci-dessus
    let transaction = db.transaction(['projects'], 'readwrite');
    let objectStore = transaction.objectStore('projects');
    let request = objectStore.delete(projectId);

    //Indique à l'utilisateur que l'entrée a été supprimée
    transaction.oncomplete = function() {
      //Supprime l'élément parent du bouton
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
      console.log('Project ' + projectId + ' deleted.');
      
      if(!list.firstChild) {
        let listItem = document.createElement('li');
        listItem.textContent = 'Aucun projet enregistré.';in localhost
        list.appendChild(listItem);
      };
    };
  };
  
};

