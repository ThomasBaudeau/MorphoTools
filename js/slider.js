/* 
SAUVESTRE Clément / JACQUES Patrick / GOMES Enzo
Affiche un slider contenant des informations pour chaque 
plugin de la boite à outils
*/

'use strict'

let slides = document.querySelectorAll('.slide');
let btns = document.querySelectorAll('.nav-btn');
let active = 1;

//Navigation manuel
let manualNav = function(manual){
    slides.forEach((slide) => {
        slide.classList.remove('active');
    });
    btns.forEach((btn) => {
        btn.classList.remove('active');
    });
    slides[manual].classList.add('active');
    btns[manual].classList.add('active');
}

btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        manualNav(i);
        counter = i;
    });
});

//Navigation automatique
let repeat = function(activeClass){
    let active = document.getElementsByClassName('active');
    let i = 1;

    var repeater = () => {
        setTimeout(function(){
            [...active].forEach((counter) => {
                counter.classList.remove('active');
            });

            slides[i].classList.add('active');
            btns[i].classList.add('active');
            i++;

            if(slides.length == i){
                i = 0;
            };
            if(i >= slides.length){
                return;
            };
            repeater();
        }, 15000);
    };
    repeater();
};
repeat();