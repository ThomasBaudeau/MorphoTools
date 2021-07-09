/*
Thomas Baudeau / Gregory Bordier / Valentin Gonay / JACQUES Patrick
css_condition.js : Screen size gestion 
July 9 2021
Version 1.5.0
*/



function resizing_left_container(){
    if (window.innerHeight < 700){
        //left container gestion
        $(".left-container").css('min-height','700px');

        //cy display window gestion
        $("#cy").css('height','700px');

        //loading display
        $("#loading_div").css('height','700px');

        //pop-up window background
        $(".import-modal").css('height','770px');
        $(".type_choice-modal").css('height','770px');
        $(".choose-modal").css('height','770px');
    }
}

window.addEventListener('load', resizing_left_container);


