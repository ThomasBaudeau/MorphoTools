/*
Thomas Baudeau / Gregory Bordier / Valentin Gomay / JACQUES Patrick
Gestion des problème d'affichage en cas d'écran au dimention trop petites
*/



function resizing_left_container(){
    if (window.innerHeight < 700){
        //left container gestion
        $(".left-container").css('min-height','700px');

        //cy display window gestion
        $("#cy").css('height','700px');
    }
}

window.addEventListener('load', resizing_left_container)


