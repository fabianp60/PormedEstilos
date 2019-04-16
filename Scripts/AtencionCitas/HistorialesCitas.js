var PormedAutonomo =
{
    Web: {
        AtencionCitas: {
            URLFiltrarHistorialPorEspecialidad:  "",
            URLFiltrarHistorialPaciente: "",
            EspecialidadId:0,
            PacienteId:0
        }
    }
};

$(document).ready(function () {
    var EspecialidadId =PormedAutonomo.Web.AtencionCitas.EspecialidadId ;
    var PacienteId = PormedAutonomo.Web.AtencionCitas.PacienteId;
    var historialXEspecialidadDataSource = new kendo.data.DataSource({
        serverPaging: true,
        schema: {
            total: "Total" ,
            data: "Items",
            errors: "Mensaje"
        },
        transport: {
            read: {
                url: PormedAutonomo.Web.AtencionCitas.URLFiltrarHistorialPorEspecialidad ,
                dataType: "json",
                data: function (e) {
                    return { especialidadId:EspecialidadId ,
                        pacienteId:PacienteId
                    }
                }
            }
        },
        pageSize: 3
    });

    $("#historialXEspecialidadPager").kendoPager({
        dataSource: historialXEspecialidadDataSource,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        }
    });

    $("#historialXEspecialidadLV").kendoListView({
        dataSource: historialXEspecialidadDataSource,
        template: kendo.template($("#historialXEspecialidadItemTemplate").html())
    });

    var historialGlobalDataSource = new kendo.data.DataSource({
        serverPaging: true,
        schema: {
            total: "Total" ,
            data: "Items",
            errors: "Mensaje"
        },
        transport: {
            read: {
                url: PormedAutonomo.Web.AtencionCitas.URLFiltrarHistorialPaciente,
                dataType: "json",
                data: function (e) {
                    return {
                        pacienteId:PacienteId
                    }
                }
            }
        },
        pageSize: 3
    });

    $("#historialGlobalPager").kendoPager({
        dataSource: historialGlobalDataSource,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        }
    });

    $("#historialGlobalLV").kendoListView({
        dataSource: historialGlobalDataSource,
        template: kendo.template($("#historialGlobalItemTemplate").html())
    });


});
function CargarDetalleHistorialCita(historialCita)
{
    $("#historialCitaIdInp").val($(historialCita).data("historialcitaid"));
    $("#historialCitaBtn").click();
}
function limpiarPopUp()
{
    var popup = document.getElementById("ContenedorReservaCita");
    if (popup!=null) {
        popup.innerHTML =("<div id='loadingDetalleHistorial' class=' aletr ' style='display:none'><h5><img src='" + PormedAutonomo.Web.AgendarCita.UrlImagenLoading + "' />@PormedAutonomo.Infraestructura.Transversal.Global.Recursos.Language.Mensaje_Reservando</h5></div>");
    }
}
function mostrarModalHistorial() {
    limpiarPopUp();
    $("#detalleHistorialModal").modal('show');
}
