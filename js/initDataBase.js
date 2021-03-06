/*
Thomas Baudeau / Gregory Bordier / Valentin Gonay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*
initDataBase.js : project creation and init of the DB
July 9 2021
Version 1.5.0
*/

'use strict'


const list = document.querySelector('ul');
const nameInput = document.querySelector('#name');
const abstractInput = document.querySelector('#abstract');


/////////////////////////INITIALISATION DB///////////////////////////////

//stock ref db
let db;

// checking DB
window.onload = function() {
  if (!('indexedDB' in window)){
    alert("your browser must support indexedDB if you want to use Morphotools");
  }
  
  let request = window.indexedDB.open('morphotools', 3);

  //the DB couldn't be opened
  request.onerror = function(event) {
    console.log('Database error : ' + event.target.errorCode);
  };

  //the DB is now open
  request.onsuccess = function() {
    console.log('Database opened successfully');
    db = request.result;
    //display projects currently in the DB
    displayData();
  };

  //on update or when DB is created : create the stores
  request.onupgradeneeded = function(e) { 
    let db = e.target.result;

    //project store
    let objectStore = db.createObjectStore('projects', { keyPath: 'id', autoIncrement:true });
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('abstract', 'abstract', { unique: false });
  };
} 
