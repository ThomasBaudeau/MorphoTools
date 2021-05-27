'use strict'

$('#titre').mouseover(
    function(){
        document.querySelector('.infobulle').style.display='flex';
    })
$('#titre').mouseout(
    function(){
        document.querySelector('.infobulle').style.display='none';
    })