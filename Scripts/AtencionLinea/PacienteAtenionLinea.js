//permite la accion del click del boton de atencion en linea
function DOMIniciarAtencion() {
    //obtiene los datos del usuario
    $.getJSON(URLConsultarDatosPaciente).done(OnExitoObtenerDatosPaciente)
                                    .fail(OnFalloObtenerDatosPaciente);


}

//alamacena los datos del usuario si el proceso fue exitoso
//inicia la conexion a la atencion el linea
var UsuarioJson = "";
function OnExitoObtenerDatosPaciente(result) {
    
    UsuarioJson = {
        Nombres: result.Item.NombreCompleto,
        UsuarioId: result.Item.UsuarioId,
        NumeroIdentificacion: result.Item.NumeroIdentificacion,
        CorreoElectronico: result.Item.Correo,
        TipoIdentificacion: result.Item.TipoIdentificacion.NombreCorto,
        RecibirCorreo:  Boolean(result.Item.RecibirNotificacionCorreo == 1)
    };
    
    obtenerScriptsConexion();
}

//Falla en  la obtención de especialidades
function OnFalloObtenerDatosPaciente(error) {

}

//metodo que obtiene los datos del usuario en sesion
function obtenerScriptsConexion() {
    $.getScript(CentralConexionUrl + "Scripts/SignalrGeneral/Adaptador.js", function () {
        $.getScript(CentralConexionUrl + "Scripts/jquery.signalR-2.2.1.js", function () {
            $.getScript(CentralConexionUrl + "signalr/hubs", function () {
                $.getScript(CentralConexionUrl + "Scripts/SignalrGeneral/ConfiguracionConexion.js", function () {
                    $.getScript(CentralConexionUrl + "Scripts/SignalrClientes/PormedPacienteSignalr.js", function () {
                       
                    });
                });
            });
        });
    });
}






