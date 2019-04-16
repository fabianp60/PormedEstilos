var PormedAutonomo =
{
    Web: {
        AtencionCitas: {
            URLFiltrarMedicamento: "",
            URLFiltrarViasAdministracion: "",
            URLFiltrarFormasFarmaceuticas: "",
            URLFiltrarTiposDosis: "",
            URLFiltrarMedicamentosPaciente: ""
        }
    }
};


function otroMedicamentoChange(e) {
    if ($(e).is(':checked')) {
        $('#otroMedicamentoContainer').show("slow");
    } else {
        $('#otroMedicamentoContainer').hide("slow");
    }
}
function sinDuracionChange(e) {
    if ($(e).is(':checked')) {
        $('#sinDuracionContainer').hide("slow");
    } else {
        $('#sinDuracionContainer').show("slow");
    }
}

function ActualizarValorMedicamento(valor) {
    $("#medicamentoIdInp").val(valor);

}
$(document).ready(function () {
    CargarControles();

});

var opcionesFiltroMedicamento;
var medicamentosPacienteDataSource;
function CargarControles() {

    $("#medicamentoIdAC").kendoAutoComplete({

        dataTextField: "Producto",
        filter: "contains",
        minLength: 3,
        template: kendo.template($("#medicamentoItemTemplate").html()),
        select: function (e) {
            var dataItem = this.dataItem(e.item.index());
            ActualizarValorMedicamento(dataItem.MedicamentoId);

        },
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: function (options) {
                    ActualizarValorMedicamento(0);
                    opcionesFiltroMedicamento = options;
                    $.getJSON(PormedAutonomo.Web.AtencionCitas.URLFiltrarMedicamento.replace("-filtro-", options.data.filter.filters[0].value))
                                            .done(OnExitoObtenerMedicamentos)
                                            .fail(OnFalloObtenerMedicamentos);
                }
            }
        }
    });
    $("#viaAdministracionIdCB").kendoComboBox({
        dataTextField: "Nombre",
        dataValueField: "ViaAdministracionId",
        dataSource: {
            type: "json",
            serverFiltering: false,
            transport: {
                read: {
                    url: PormedAutonomo.Web.AtencionCitas.URLFiltrarViasAdministracion,
                    contentType: "application/json; charset=utf-8",
                    type: "GET",
                    dataType: "json",
                }
            },
            schema: {
                data: function (response) {
                    return response.Items;
                }
            }
        },
        filter: "contains",
        suggest: true,
        index: 3,
        change: function () {

        }
    });
    $("#formaFarmaceuticaIdCB").kendoComboBox({
        dataTextField: "Nombre",
        dataValueField: "FormaFarmaceuticaId",
        dataSource: {
            type: "json",
            serverFiltering: false,
            transport: {
                read: {
                    url: PormedAutonomo.Web.AtencionCitas.URLFiltrarFormasFarmaceuticas,
                    contentType: "application/json; charset=utf-8",
                    type: "GET",
                    dataType: "json",
                }
            },
            schema: {
                data: function (response) {
                    return response.Items;
                }
            }
        },
        filter: "contains",
        suggest: true,
        index: 3,
        change: function () {

        }
    });
    $("#tipoDosisIdCB").kendoComboBox({
        dataTextField: "Nombre",
        dataValueField: "TipoDosisId",
        dataSource: {
            type: "json",
            serverFiltering: false,
            transport: {
                read: {
                    url: PormedAutonomo.Web.AtencionCitas.URLFiltrarTiposDosis,
                    contentType: "application/json; charset=utf-8",
                    type: "GET",
                    dataType: "json",
                }
            },
            schema: {
                data: function (response) {
                    return response.Items;
                }
            }
        },
        filter: "contains",
        suggest: true,
        index: 3,
        change: function () {

        }
    });

    $("#DosisNUP").kendoNumericTextBox({
        min: 1,
        step: 0.5
    });
    $("#HorasDiaNUP").kendoNumericTextBox({
        min: 1,
        step: 1
    });
    $("#DuracionNUP").kendoNumericTextBox({
        min: 1,
        step: 1
    });

    //var PacienteId = PormedAutonomo.Web.AtencionCitas.PacienteId;
    //medicamentosPacienteDataSource = new kendo.data.DataSource({
    //    serverPaging: true,
    //    schema: {
    //        total: "Total",
    //        data: "Items",
    //        errors: "Mensaje"
    //    },
    //    transport: {
    //        read: {
    //            url: PormedAutonomo.Web.AtencionCitas.URLFiltrarMedicamentosPaciente,
    //            dataType: "json",
    //            data: function (e) {
    //                return {
    //                    pacienteId: PacienteId
    //                }
    //            }
    //        }
    //    },
    //    pageSize: 3
    //});

    //$("#medicamentosPacientePager").kendoPager({
    //    dataSource: medicamentosPacienteDataSource,
    //    messages: {
    //        display: $('#Etiqueta_PaginacionKendo').text(),
    //        empty: $('#Etiqueta_PaginacionVacioKendo').text()
    //    }
    //});

    //$("#medicamentosPacienteLV").kendoListView({
    //    dataSource: medicamentosPacienteDataSource,
    //    template: kendo.template($("#medicamentosPacienteItemTemplate").html())
    //});

    //$(".VecesDiaNUP").kendoNumericTextBox({
    //    min: 1,
    //    step: 1

    //});
    //$(".VecesDiaHipertensionNUP").kendoNumericTextBox({
    //    min: 1,
    //    step: 1

    //});


}
function OnExitoObtenerMedicamentos(result) {
    opcionesFiltroMedicamento.success(result.Items);
}

//Falla en  la obtención de especialidades
function OnFalloObtenerMedicamentos(error) {

}

function errorActualizandoMedicamentoPaciente(request, status, error) {
    alert(error);
}

function daydiff(first, second) {
    var desde = new Date(parseInt(first.replace("/Date(", "").replace(")/", ""), 10));
    var hasta = new Date(parseInt(second.replace("/Date(", "").replace(")/", ""), 10));
    return Math.round((hasta - desde) / (1000 * 60 * 60 * 24));
}

function printPageArea(areaID) {
    var printContent = document.getElementById(areaID);
    var WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write(printContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
}

function seguimientoAgregado(request, status, descripcion) {
    if (status == 'success') {
        document.location.href = document.location.href;
    }
}

function seguimientoActualizado(request, status, descripcion) {
    if (status == 'success') {
        document.location.href = document.location.href;
    }
}

function limpiarActualizarMedicamentoPaciente() {
    $("#clearPrescripcionMedica").click();
    $('#sinDuracionContainer').show("slow");
    $('#otroMedicamentoContainer').hide("slow");
    $("#medicamentosPacienteLV").data("kendoListView").dataSource.read();

}


