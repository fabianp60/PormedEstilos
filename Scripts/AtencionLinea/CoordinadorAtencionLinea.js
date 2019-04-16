//permite la accion del click del boton de atencion en linea
function DOMIniciarAtencion() {
    //obtiene los datos del usuario
    $.getJSON(URLConsultarDatosCoordinardor).done(OnExitoObtenerDatosPaciente)
                                    .fail(OnFalloObtenerDatosPaciente);
}
//permite obtener los datos del usuario
var UsuarioJson = "";
function OnExitoObtenerDatosPaciente(result) {

    UsuarioJson = {
        NombreCompleto: result.Item.PrimerNombre + " " + result.Item.PrimerApellido,
        UsuarioId: result.Item.UsuarioId
    }

    obtenerScriptsConexion();
}


//funcion que obtiene los scripts de conexion del servidor
function obtenerScriptsConexion() {
    $.getScript(CentralConexionUrl + "Scripts/SignalrGeneral/Adaptador.js", function () {
        $.getScript(CentralConexionUrl + "Scripts/jquery.signalR-2.2.1.js", function () {
            $.getScript(CentralConexionUrl + "signalr/hubs", function () {
                $.getScript(CentralConexionUrl + "Scripts/SignalrGeneral/ConfiguracionConexion.js", function () {
                    $.getScript(CentralConexionUrl + "Scripts/SignalrClientes/ClinInCoordinadorSignalr.js", function () {


                    });
                });
            });
        });
    });
}

$(document).ready(function () {
    MostrarLoading();

    DOMIniciarAtencion();
});


function mostrarNotificacion(json) {

    $.toaster({ priority: json.tipo, title: json.titulo, message: json.mensaje });
}

function OcultarLoading() {


}


function MostrarLoading() {

}