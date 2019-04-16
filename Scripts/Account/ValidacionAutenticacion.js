var vecesErroneas = localStorage.getItem('vecesErroneas');


function AutenticacionFallida() {

    var intentosConfigurados = parseInt($('#intentosCaptchaConfig').val().toString());

    vecesErroneas++;
    if (vecesErroneas >= intentosConfigurados)
    {
        $('#dvCaptcha').removeClass('hidden');
        $('#ValidacionCaptcha').val('true');
    }
    else
    {
        $('#ValidacionCaptcha').val('false');
    }
       

    localStorage.setItem('vecesErroneas', vecesErroneas);

    

    $('#mensajeResultadosContainer').addClass('hidden');
}