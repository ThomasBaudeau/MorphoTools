/*
Thomas Baudeau / Gregory Bordier / Valentin Gonay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément
slider.js : display a slider with informations for each plugin within Morphotools
Version 1.5.0
*/

'use strict'

let slides = document.querySelectorAll('.slide');
let btns = document.querySelectorAll('.nav-btn');
let active = 1;

//manual
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

//auto
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