//permite la accion del click del boton de atencion en linea
function DOMIniciarAtencion() {
    //obtiene los datos del usuario
    $.getJSON(URLConsultarDatosAgente).done(OnExitoObtenerDatosPaciente)
                                    .fail(OnFalloObtenerDatosPaciente);
}

//alamacena los datos del usuario si el proceso fue exitoso
//inicia la conexion a la atencion el linea
var UsuarioJson = "";
function OnExitoObtenerDatosPaciente(result) {

    UsuarioJson = {
        NombreCompleto: result.Item.PrimerNombre + " " + result.Item.PrimerApellido,
        UsuarioId: result.Item.UsuarioId
    }

    obtenerScriptsConexion();
}


//Accion inicial que muestra el PopUp para iniciar la sesion de atencion en linea 
//Emplea metodos con el DOM
function AccionInicialAgente() {

    debugger
    //validar si el popup puede mostrarse de forma automatica
    var Agente = JSON.parse(localStorage.getItem("Agente"));

    //mostrar el inicio de la atencion
    if (Agente == null) {
        $("#SeccionChatCliente").append($('#TemplateIniciarAtencion').html());
    }
    else if (Agente.IdUsuario != UsuarioJson.UsuarioId) {
        localStorage.removeItem("Agente");
        $("#SeccionChatCliente").append($('#TemplateIniciarAtencion').html());
    }
    else if (Agente.Estado == 0) {
        $("#SeccionChatCliente").append($('#TemplateIniciarAtencion').html());
    }
    else {
        $("#datosdoctor").attr('hidden', false);
    }

    //iniciar la atencion con agnete nuevo o sin sesion
    $(".btIniciarSesion").click(function (e) {
        e.preventDefault();
        $("#SeccionChatCliente").empty();
        $("#datosdoctor").attr('hidden', false);
        $("#EstadoConexion").click();

    });

}

//funcion que obtiene los scripts de conexion del servidor
function obtenerScriptsConexion() {
    $.getScript(CentralConexionUrl + "Scripts/SignalrGeneral/Adaptador.js", function () {
        $.getScript(CentralConexionUrl + "Scripts/jquery.signalR-2.2.1.js", function () {
            $.getScript(CentralConexionUrl + "signalr/hubs", function () {
                $.getScript(CentralConexionUrl + "Scripts/SignalrGeneral/ConfiguracionConexion.js", function () {
                    $.getScript(CentralConexionUrl + "Scripts/SignalrClientes/PormedAgenteSignalr.js", function () {
                        AccionInicialAgente();
                        $.getScript(CentralConexionUrl + "Scripts/SignalrGeneral/ConfiguracionGrabacionRTC.js", function () {
                            $.getScript(CentralConexionUrl + "Scripts/SignalrGeneral/MetodosGrabacion.js", function () {


                            });
                        });
                    });
                });
            });
        });
    });
}

//Iniciar eventos cuando carga la pagina de atencion en linea del agente
$(document).ready(function () {

    DOMIniciarAtencion();

});

function mostrarNotificacion(json) {

    $.toaster({ priority: json.tipo, title: json.titulo, message: json.mensaje });
}

function OcultarLoading() {


}
