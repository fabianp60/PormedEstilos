var PormedAutonomo =
{
    Web: {
        AtencionCitas: {
            URLFiltrarRegistrosGlucosa: ""
        }
    }
};
$(document).ready(function () {
    try {

        CargarControlesSeguimientoDiabetes();

    } catch (e) {

    }
});

var opcionesGlucosaChart;
var glucosaDataSource;
var glucosaXFecha;
function CargarControlesSeguimientoDiabetes() {
    //$("#seguimientoDiabetesTopPane").kendoSplitter({
    //    orientation: "horizontal",
    //    panes: [
    //        { collapsible: true },
    //        { collapsible: false }
    //    ]
    //});
    $('#SeguimientoDiabetesContainer').on('shown.bs.modal', function () {
        $("#glucosaChart").data('kendoChart').refresh();
        // $("#glucosaGrid").data("kendoGrid").refresh();
    })
    glucosaDataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: function (options) {
                opcionesGlucosaChart = options;
                $.getJSON(PormedAutonomo.Web.AtencionCitas.URLFiltrarRegistrosGlucosa)
                                        .done(OnExitoObtenerRegistrosGlucosa)
                                        .fail(OnFalloObtenerRegistrosGlucosa);
            }
        }
    });
    $("#glucosaChart").kendoChart({
        dataSource: glucosaDataSource,
        title: {
            text: "Glucosa (mg/dl)"
        },
        legend: {
            position: "top"
        },
        seriesDefaults: {
            type: "line"
        },
        series: [{
            field: "Item.Valor",
            name: "Glucosa",
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
            field: "ReferenciaMaxima",
            name: "Referencia máxima",
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
            field: "ReferenciaMinima",
            name: "Referencia mínima",
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

            sharedTemplate: kendo.template($("#glucosaChartTittleTooltipTemplate").html())
        }
    });
    // $("#glucosaGrid").kendoGrid({
    //     dataSource: glucosaDataSource,
    //     columns: [{
    //         template: "#=ObtenerFechaLabel(Item.Fecha) #",
    //         field: "Item.Fecha",
    //         title: "Fecha",
    //         width: 240
    //     }, {
    //         field: "Item.Valor",
    //         title: "Glucosa"
    //     }]
    // });

    $("#glucosaNUP").kendoNumericTextBox({
        min: 1,
        step: 1
    });
}
var tomasGlucosa;
var tomasGlucosaXFecha;
function OnExitoObtenerRegistrosGlucosa(result) {
    var tomasGlucosa = result.Items;
    for (var i = 0; i < tomasGlucosa.length; i++) {
        tomasGlucosa[i].Item.FechaParsed = new Date(parseInt(tomasGlucosa[i].Item.Fecha.replace("/Date(", "").replace(")/", ""), 10));

        tomasGlucosa[i].Dia = new Date(tomasGlucosa[i].Item.FechaParsed.getFullYear(), tomasGlucosa[i].Item.FechaParsed.getMonth(), tomasGlucosa[i].Item.FechaParsed.getDate(), 0, 0, 0, 0);
    }
    opcionesGlucosaChart.success(tomasGlucosa);
    tomasGlucosaXFecha = Enumerable.From(tomasGlucosa)
    .GroupBy(
        "{dia: $.Dia.getDate(),mes: $.Dia.getMonth() ,anio: $.Dia.getFullYear()}",
        "",
        "{ Dia: $, Tomas: $$ }", "$.dia+ '-' + $.mes + '-' + $.year")
    .ToArray();
    refrescarTabla();
}
function refrescarTabla() {
    $("#glucosaGridItems").empty();
    var template = kendo.template($("#glucosaGridItemTemplate").html());
    for (var i = 0; i < tomasGlucosaXFecha.length; i++) {
        $("#glucosaGridItems").append(template(tomasGlucosaXFecha[i]));
    }

}
function obtenerValorAntesDesayuno(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 1 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }

}
function obtenerValorDespuesDesayuno(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 2 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }
}
function obtenerValorAntesMediasNueves(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 3 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }

}
function obtenerValorDespuesMediasNueves(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 4 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }
}
function obtenerValorAntesAlmuerzo(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 5 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }
}
function obtenerValorDespuesAlmuerzo(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 6 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }
}
function obtenerValorAntesOnces(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 7 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }

}
function obtenerValorDespuesOnces(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 8 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }
}
function obtenerValorAntesComida(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 9 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }
}
function obtenerValorDespuesComida(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 10 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }
}

function obtenerValorLevantarse(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 11 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="../../Content/Imagenes/diabetes_seguimiento.png" />';
    }
}
function obtenerValorNoche(tomas) {
    var item = Enumerable.From(tomas.source).Where(function (x) { return x.Item.Momento == 12 }).FirstOrDefault();
    if (item != null) {
        return item.Item.Valor;
    } else {
        return ' <img src="~/Content/Imagenes/diabetes_seguimiento.png" />a si';
    }
}
//Falla en  la obtención de especialidades
function OnFalloObtenerRegistrosGlucosa(error) {

}

function ObtenerFechaLabel(date) {
    var fecha = new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
    return kendo.toString(fecha, "dd/MM/yyyy HH:mm");
}
function ObtenerObservacionesDiabetes(valor) {
    return valor[0].dataItem.Item.Observaciones;
}

function ObtenerJustificacionesDiabetes(valor) {
    return Enumerable.From(valor[0].dataItem.Item.Justificaciones).Select(function (x) {
        if (x.TipoJustificacion != null) {
            return x.TipoJustificacion.Nombre;
        } else {
            return x.JustificacionMedicionId;
        }

    }).ToArray().join();
}
function ObtenerMomentoDiabetes(valor) {
    var momento = "";
    switch (valor[0].dataItem.Item.Momento) {
        case 1:
            momento = "Antes del desayuno";
            break;
        case 2:
            momento = "Después del desayuno";
            break;
        case 3:
            momento = "Antes de las medias nueves";
            break;
        case 4:
            momento = "Después de las medias nueves";
            break;
        case 5:
            momento = "Antes del almuerzo";
            break;
        case 6:
            momento = "Después del almuerzo";
            break;
        case 7:
            momento = "Antes de las onces";
            break;
        case 8:
            momento = "Después de las onces";
            break;
        case 9:
            momento = "Antes de la cena";
            break;
        case 10:
            momento = "Después de la cena";
            break;
        case 11:
            momento = "Al levantarse";
            break;
        case 12:
            momento = "Noche";
            break;
        default:
            break;
    }
    return momento;
}
function toggleSeguimiento(button) {
    if ($(button).data("showingchart")) {
        $($(button).data("chartid")).hide();
        $($(button).data("gridid")).show("slow", function () {
            try {
                $("#hipertensionGrid").data("kendoGrid").refresh();
            } catch (e) {

            }
        });
        $(button).data("showingchart", false);
        $(button).find("span").removeClass("glyphicon-th-list");
        $(button).find("span").addClass("glyphicon-stats");

    } else {
        $($(button).data("gridid")).hide();
        $($(button).data("chartid")).show("slow");
        $(button).data("showingchart", true);
        $(button).find("span").removeClass("glyphicon-stats");
        $(button).find("span").addClass("glyphicon-th-list");
    };
}

function toggleFormSeguimiento(button) {
    if ($(button).data("showingdata")) {
        $($(button).data("datacontainerid")).hide();
        $($(button).data("formcontainer")).show("slow");
        $(button).data("showingdata", false);
        $(button).find("span").removeClass("glyphicon-plus");
        $(button).find("span").addClass("glyphicon-arrow-left");
        $($(button).data("databutton")).hide();
    } else {
        $($(button).data("formcontainer")).hide();
        $($(button).data("datacontainerid")).show("slow");
        $(button).data("showingdata", true);
        $(button).find("span").removeClass("glyphicon-arrow-left");
        $(button).find("span").addClass("glyphicon-plus");
        $($(button).data("databutton")).show();
    };
}
function registroDiabetesCompletado(resultado) {
    if (resultado.Exitoso) {
        glucosaDataSource.read();
        // $("#glucosaGrid").data("kendoGrid").refresh();
        $("#glucosaChart").data("kendoChart").refresh();
        $("#toggleRegistroDiabetesBtn").click();
        $("#mensajeResultadosAtencionCita").text("Registro añadido");
        $("#mensajeResultadosAtencionCitaContainer").removeClass("hidden");
    } else {
        $("#registroDiabetesMensaje").text(resultado.Mensaje);
    }
}
