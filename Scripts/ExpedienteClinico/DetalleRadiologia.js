
var PormedAutonomo =
{
    Web: {
        DetalleRadiologia: {
            ObtenerDetallesRadiologia: ""
        }
    }
};

/// <summary>
/// Evento al terminar de cargar la página
/// </summary>
$(document).ready(function () {
    Inicializar();
});

/// <summary>
/// Inicialización de valores
/// </summary>
function Inicializar() {

    $('#loadingBusqueda').removeClass('hidden');

    ($.getJSON(PormedAutonomo.Web.DetalleRadiologia.ObtenerDetallesRadiologia.replace('-idResultado-', idResultado))
                                           .done(OnExitoObtenerDetallesRadiologia)
                                           .fail(OnFalloObtenerDetallesRadiologia)
                                            .complete(function () {
                                                $('#loadingBusqueda').addClass('hidden');
                                            }));

}

/// <summary>
/// Evento de éxito al obtener archivos desde el controlador
/// </summary>
/// <param name="result">Resultado obtenido en la consulta</param>
function OnExitoObtenerDetallesRadiologia(result) {
    if (result.data[0] != null) {

        $("#ContainerResultados").removeClass('hidden');

        $("#NombreExamen").text(result.data[0].IdVariable);

        $("#Descripcion").text(result.data[0].Resultado);

    }
    else {
        $("#ContainerNoResultados").removeClass('hidden');
    }
}

/// <summary>
/// Evento de error al obtener archivos desde el controlador
/// </summary>
/// <param name="result">Error obtenido en la consulta</param>
function OnFalloObtenerDetallesRadiologia(error) {
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");
}