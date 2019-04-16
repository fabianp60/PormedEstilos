var PormedAutonomo =
{
    Web: {
        AtencionCitas: {
            URLFiltrarObtenerRegistrosHipertension: ""
        }
    }
};
$(document).ready(function () {
    try {

    CargarControlesSeguimientoHipertension();
    
    } catch (e) {

    }
});

var opcionesHipertensionChart;
var hipertensionDataSource;
function CargarControlesSeguimientoHipertension() {
  
    $('#SeguimientoHipertensionContainer').on('shown.bs.modal', function () {
        $("#hipertensionChart").data('kendoChart').refresh();
        $("#hipertensionGrid").data("kendoGrid").refresh();
    })
     hipertensionDataSource = new kendo.data.DataSource({
       type:"json",
            transport: {
                read: function (options) {
                    opcionesHipertensionChart = options;
                    $.getJSON(PormedAutonomo.Web.AtencionCitas.URLFiltrarObtenerRegistrosHipertension.replace('&amp;', '&').replace('&amp;', '&'))
                                            .done(OnExitoObtenerRegistrosHipertension)
                                            .fail(OnFalloObtenerRegistrosHipertension);
                }
            }
    });
    $("#hipertensionChart").kendoChart({
        dataSource: hipertensionDataSource,
        title: {
            text: "Tensión arterial "
        },
        legend: {
            position: "top"
        },
        seriesDefaults: {
            type: "line"
        },
        series: [
            {
            field: "Item.ValorDiastole",
            name: "Diástole",
            //aggregate: "avg",
            categoryField: "Item.Fecha",
            },
        {
            type: "area",
            area: {
                line: {
                    style: "smooth"
                }
            },
            field: "MaximoDiastole",
            name: "Referencia Máxima Diástole",
            //aggregate: "avg",
            categoryField: "Item.Fecha"
        },
        {
            type: "area",
            area: {
                line: {
                    style: "smooth"
                }
            },
            field: "MinimoDiastole",
            name: "Referencia Mínima Diástole",
            //aggregate: "avg",
            categoryField: "Item.Fecha"
        },
        {
            field: "Item.ValorSistole",
            name: "Sístole",
            //aggregate: "avg",
            categoryField: "Item.Fecha"
        },
        {
            type: "area",
            area: {
                line: {
                    style: "smooth"
                }
            },
            field: "MaximoSistole",
            name: "Referencia Máxima Sístole",
            //aggregate: "avg",
            categoryField: "Item.Fecha"
        },
        {
            type: "area",
            area: {
                line: {
                    style: "smooth"
                }
            },
            field: "MinimoSistole",
            name: "Referencia Mínima Sístole",
            //aggregate: "avg",
            categoryField: "Item.Fecha"
        },
        {
            field: "Item.ValorPPM",
            name: "PPM",
            //aggregate: "avg",
            categoryField: "Item.Fecha"
        },
        {
            type: "area",
            area: {
                line: {
                    style: "smooth"
                }
            },
            field: "MaximoPpm",
            name: "Referencia Máxima PPM",
            //aggregate: "avg",
            categoryField: "Item.Fecha"
        },
        {
            type: "area",
            area: {
                line: {
                    style: "smooth"
                }
            },
            field: "MinimoPpm",
            name: "Referencia Mínima PPM",
            //aggregate: "avg",
            categoryField: "Item.Fecha"
        }],
        categoryAxis: {
            baseUnit: "days",
            labels: {
                rotation: "auto",
                template: "#=ObtenerFechaLabel(value)#"
            }
        },
        valueAxis: {
            labels: {
                format: "N0"
            }
        },
        tooltip: {
            visible: true,
            shared: true,
            format: "N0",
            sharedTemplate: kendo.template($("#hipertensionChartTittleTooltipTemplate").html())
            

        }
    });
    $("#hipertensionGrid").kendoGrid({
        dataSource: {
            transport: {
                read: function (operation) {
                    var data = operation.data.data || [];
                    operation.success(data);
                }
            },
            group: {
                field: "Dia",
                dir: "desc",

            }
        },
        columns: [{
            //template: "#=ObtenerFechaLabel(Item.Fecha) #",
            field: "Hora",
            title: "Hora",
            width: 240
        }, {
            field: "Item.ValorDiastole",
            title: "Diástole"
        }, {
            field: "Item.ValorSistole",
            title: "Sístole"
        }, {
            field: "Item.ValorPPM",
            title: "PPM"
        }, {
            field: "Dia",
            hidden: true,
            groupHeaderTemplate: "#=kendo.toString(value,'dd/MM/yyyy') #"
        }]
    });

    $("#diastoleNUP").kendoNumericTextBox({
        min: 1,
        step: 1
    });
    $("#sistoleNUP").kendoNumericTextBox({
        min: 1,
        step: 1
    });
    $("#ppmNUP").kendoNumericTextBox({
        min: 1,
        step: 1
    });
}
var tomasHipertension;
function OnExitoObtenerRegistrosHipertension(result) {
    var tomasHipertension = result.Items;
    for (var i = 0; i < tomasHipertension.length; i++) {
        tomasHipertension[i].Item.FechaParsed = new Date(parseInt(tomasHipertension[i].Item.Fecha.replace("/Date(", "").replace(")/", ""), 10));
        var parametros = Enumerable.From(tomasHipertension[i].Item.Parametros);
        tomasHipertension[i].Item.ValorDiastole = parametros.Where(function (x) { return x.Parametro == 3 }).FirstOrDefault().Valor;
        tomasHipertension[i].Item.ValorSistole = parametros.Where(function (x) { return x.Parametro == 2 }).FirstOrDefault().Valor;
        tomasHipertension[i].Item.ValorPPM = parametros.Where(function (x) { return x.Parametro == 4 }).FirstOrDefault().Valor;
        tomasHipertension[i].Dia = new Date(tomasHipertension[i].Item.FechaParsed.getFullYear(), tomasHipertension[i].Item.FechaParsed.getMonth(), tomasHipertension[i].Item.FechaParsed.getDate(), 0, 0, 0, 0);
        tomasHipertension[i].Hora = kendo.toString(tomasHipertension[i].Item.FechaParsed, "HH:mm");
    }
    $("#hipertensionGrid").data("kendoGrid").dataSource.read({ data: tomasHipertension });
    opcionesHipertensionChart.success(tomasHipertension);
}

//Falla en  la obtención de especialidades
function OnFalloObtenerRegistrosHipertension(error) {

}

function registroHipertensionCompletado(resultado) {
    if (resultado.Exitoso) {
        hipertensionDataSource.read();
        $("#hipertensionGrid").data("kendoGrid").refresh();
        $("#hipertensionChart").data("kendoChart").refresh();
        $("#toggleRegistroHipertensionBtn").click();
        $("#mensajeResultadosAtencionCita").text("Registro añadido");
        $("#mensajeResultadosAtencionCitaContainer").removeClass("hidden");
    } else {
       $("#registroHipertensionMensaje").text(resultado.Mensaje);
    }
}

function ObtenerObservacionesHipertension(valor) {
    return valor[0].dataItem.Item.Observaciones;
}
function ObtenerJustificacionesHipertension(valor) {
    return Enumerable.From(valor[0].dataItem.Item.Justificaciones).Select(function (x) {
        if (x.TipoJustificacion != null) {
            return x.TipoJustificacion.Nombre;
        } else {
            return x.JustificacionMedicionId;
        }

    }).ToArray().join();
}