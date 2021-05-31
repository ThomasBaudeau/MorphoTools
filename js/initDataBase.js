/* 
SAUVESTRE Clément / JACQUES Patrick / GOMES Enzo
Création de projet via un formulaire et initialisation de notre base de donnée
*/

'use strict'


const list = document.querySelector('ul');
const nameInput = document.querySelector('#name');
const abstractInput = document.querySelector('#abstract');




/////////////////////////INITIALISATION BDD///////////////////////////////

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
} 
