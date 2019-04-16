// Enumeración de día de la semana
var diasSemanaEnum;
(function (diasSemanaEnum) {
    diasSemanaEnum[diasSemanaEnum["Lunes"] = 1] = "Lunes";
    diasSemanaEnum[diasSemanaEnum["Martes"] = 2] = "Martes";
    diasSemanaEnum[diasSemanaEnum["Miercoles"] = 3] = "Miercoles";
    diasSemanaEnum[diasSemanaEnum["Jueves"] = 4] = "Jueves";
    diasSemanaEnum[diasSemanaEnum["Viernes"] = 5] = "Viernes";
    diasSemanaEnum[diasSemanaEnum["Sabado"] = 6] = "Sabado";
    diasSemanaEnum[diasSemanaEnum["Domingo"] = 0] = "Domingo";
})(diasSemanaEnum || (diasSemanaEnum = {}));

// Enumeración de los meses
var mesesEnum;
(function (mesesEnum) {
    mesesEnum[mesesEnum["Enero"] = 1] = "Enero";
    mesesEnum[mesesEnum["Febrero"] = 2] = "Febrero";
    mesesEnum[mesesEnum["Marzo"] = 3] = "Marzo";
    mesesEnum[mesesEnum["Abril"] = 4] = "Abril";
    mesesEnum[mesesEnum["Mayo"] = 5] = "Mayo";
    mesesEnum[mesesEnum["Junio"] = 6] = "Junio";
    mesesEnum[mesesEnum["Julio"] = 7] = "Julio";
    mesesEnum[mesesEnum["Agosto"] = 8] = "Agosto";
    mesesEnum[mesesEnum["Septiempre"] = 9] = "Septiempre";
    mesesEnum[mesesEnum["Octubre"] = 10] = "Octubre";
    mesesEnum[mesesEnum["Noviembre"] = 11] = "Noviembre";
    mesesEnum[mesesEnum["Diciembre"] = 12] = "Diciembre";
})(mesesEnum || (mesesEnum = {}));

// Enumeracion del tipo de vista para mostrar la programacion
var vistaProgramacionEnum;
(function (vistaProgramacionEnum) {
    vistaProgramacionEnum[vistaProgramacionEnum["Grilla"] = 0] = "Grilla";
    vistaProgramacionEnum[vistaProgramacionEnum["Semanal"] = 1] = "Semanal";
    vistaProgramacionEnum[vistaProgramacionEnum["Mensual"] = 2] = "Mensual";
})(vistaProgramacionEnum || (vistaProgramacionEnum = {}));


// Fechas a visualizar en el calendario
var fechasCalendario;

// Días de la semana del calendario
var diasSemanaCalendario;

//Meses a visualizar en el calendario
var mesesCalendario;

// Citas del paciente
var citasPacienteEnumerable;

// Vista actual de la visualización de la programación
var vistaProgramacionActual;

// Ruta de la imagen del detalle de la citas
var imagenRutaDetalleCitas;

// Idioma actual
var idiomaActual

// Tamaño horizontal del calendario
var anchoCalendario

// Tamaño horizontal de cada día del calendario
var anchoDia

// Tamaño vertical del calendario
var altoCalendario

// Tamaño vertical de cada día del calendario
var altoDia

// Tamaño vertical de cada hora del calendario
var altoHora
var PormedAutonomo =
{
    Web: {
        HospitalizacionDomiciliaria: {
            UrlMisCitas: "",
            UrlDetalleCitasImagen: "",
            UrlImagenesCliin: ""
        }
    }
};
//Evento jquery de documento cargado
$(document).ready(function () {
    dataSourceCitasDetalle = new kendo.data.DataSource({
        data: [],
        pageSize: 2
    });

    $("#pagerCitasDetalleList").kendoPager({
        dataSource: dataSourceCitasDetalle,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        }
    });

    $("#CitasDetalleList").kendoListView({
        dataSource: dataSourceCitasDetalle,
        template: kendo.template($("#CitasDetalleTemplate").html())
    });

});
function CargarCitas(desde, hasta) {
    LimpiarCalendario();
    $('#loadingCalendario').removeClass('hidden');
    $.getJSON(PormedAutonomo.Web.HospitalizacionDomiciliaria.UrlMisCitas.replace('-desde-', desde).replace('-hasta-', hasta).replace("&amp;", "&"))
                                          .done(OnExitoObtenerCargarCitas)
                                          .fail(OnFalloObtenerCargarCitas)
                                          .complete(function () { $('#loadingCalendario').addClass('hidden'); });
}
var fechaDesde;
var fechaHasta;
function OnExitoObtenerCargarCitas(result) {
   // fechaDesde = new Date(parseInt(result.desde.replace("/Date(", "").replace(")/", "")));
   // fechaHasta = new Date(parseInt(result.hasta.replace("/Date(", "").replace(")/", "")));
    CargarTratamientoPacienteCalendario(result.resultado, "", "es");
}

//Falla en  la obtención de especialidades
function OnFalloObtenerCargarCitas(error) {
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

}

// Inicializa las propiedades del calendario
function InicializarPropiedadesCalendario() {
    mesesCalendario = new Array();

    mesesCalendario.push({ Valor: 1 /* Enero */, Texto: $("#lb_Enero").text() }, { Valor: 2 /* Febrero */, Texto: $("#lb_Febrero").text() }, { Valor: 3 /* Marzo */, Texto: $("#lb_Marzo").text() }, { Valor: 4 /* Abril */, Texto: $("#lb_Abril").text() }, { Valor: 5 /* Mayo */, Texto: $("#lb_Mayo").text() }, { Valor: 6 /* Junio */, Texto: $("#lb_Junio").text() }, { Valor: 7 /* Julio */, Texto: $("#lb_Julio").text() }, { Valor: 8 /* Agosto */, Texto: $("#lb_Agosto").text() }, { Valor: 9 /* Septiempre */, Texto: $("#lb_Septiembre").text() }, { Valor: 10 /* Octubre */, Texto: $("#lb_Octubre").text() }, { Valor: 11 /* Noviembre */, Texto: $("#lb_Noviembre").text() }, { Valor: 12 /* Diciembre */, Texto: $("#lb_Diciembre").text() });

    diasSemanaCalendario = new Array();
    diasSemanaCalendario.push({ Valor: 1 /* Lunes */, Texto: $("#lb_Lunes").text() }, { Valor: 2 /* Martes */, Texto: $("#lb_Martes").text() }, { Valor: 3 /* Miercoles */, Texto: $("#lb_Miercoles").text() }, { Valor: 4 /* Jueves */, Texto: $("#lb_Jueves").text() }, { Valor: 5 /* Viernes */, Texto: $("#lb_Viernes").text() }, { Valor: 6 /* Sabado */, Texto: $("#lb_Sabado").text() }, { Valor: 0 /* Domingo */, Texto: $("#lb_Domingo").text() });
}

// Inicializa el calendario de acuerdo a los rangos de fecha definidos
function InicializarCalendario() {
    InicializarPropiedadesCalendario();

    var fechaActual = fechaDesde;

    fechasCalendario = new Array();
    $('#lbMesActual').text(mesesCalendario[fechaDesde.getMonth()].Texto + " " + fechaDesde.getFullYear(), null, null);

    while (fechaActual <= fechaHasta) {
        fechasCalendario.push({
            IdentificadorHtml: fechaActual.getUTCDate().toString() + '-' + fechaActual.getUTCMonth().toString() + '-' + fechaActual.getUTCFullYear().toString(),
            Fecha: fechaActual
        });

        fechaActual = new Date(fechasCalendario[fechasCalendario.length - 1].Fecha.getFullYear(), fechasCalendario[fechasCalendario.length - 1].Fecha.getMonth(), fechasCalendario[fechasCalendario.length - 1].Fecha.getDate(), 0, 0, 0, 0);
        fechaActual.setDate(fechasCalendario[fechasCalendario.length - 1].Fecha.getDate() + 1);
    }

    // Se establece el tamaño del calendario
    anchoCalendario = ((diasSemanaCalendario.length * 100) / 7);
    anchoDia = 100 / diasSemanaCalendario.length;
    $('.MarcoCalendario').width(anchoCalendario + '%');


    altoDia = "120";
    altoCalendario = parseInt(altoDia) * 5;

    for (var i = 0; i < diasSemanaCalendario.length; i++) {
        var lstDiasId = "ListaDias-" + diasSemanaCalendario[i].Valor;

        $('#ListaFechas').append(function (indice, htmlFecha) {
            return "<li id='" + lstDiasId + "'style='width:" + anchoDia.toString() +
                "%;'><div id='" + diasSemanaCalendario[i].Valor +
                "' class='col-Calendario diasSemanaCabecera'><div class='col-cabecera'><strong>" +
                diasSemanaCalendario[i].Texto + '</strong></div>' +
                '</div>' +
                '</li>';
        }, null, null);
    }

    var diaInicial = fechasCalendario[0].Fecha.getDay();
    diaInicial = diaInicial == 0 ? 7 : diaInicial;
    var diaActual;


    for (var j = 1; j < diaInicial; j++) {
        diaActual = new Date(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate(), 0, 0, 0, 0);
        diaActual.setDate(diaActual.getDate() - (diaInicial - j));

        lstDiasId = "ListaDias-" + j;
        $("#" + lstDiasId).append(function (indice, htmlFecha) {
            return '<ul style="width:100%;"><div class="col-Calendario diasCalendario"><div class="fechasCalendarioContenido diaNoDisponible">' +
                diaActual.getDate() + '</div>'
                + ' <div style="height:' + altoDia +
                'px;" class="fechasCalendario">'
                + '</div>' + '</div>' + '</ul>';
        }, null, null);
    }

    for (var i = 0; i < fechasCalendario.length; i++) {
        var lstDiasId = "ListaDias-" + fechasCalendario[i].Fecha.getDay();

        var a = '<ul style="width:100%;"><div id="' +
            fechasCalendario[i].IdentificadorHtml + "-" + fechasCalendario[i].Fecha.getDay() +
            '" class="col-Calendario diasCalendario"><div class="fechasCalendarioContenido"><strong>' +
            fechasCalendario[i].Fecha.getDate() + '</strong></div>' + ' <div style="height:' +
            altoDia +
            'px;" class="fechasCalendario"' +
            '> ' +
            '<div id="Cita0-' + fechasCalendario[i].IdentificadorHtml + '"></div>' +
            '<div id="Cita1-' + fechasCalendario[i].IdentificadorHtml + '"></div>' +
            '<div id="Cita2-' + fechasCalendario[i].IdentificadorHtml + '"></div>' +
            '<div id="DetalleCitas-' + fechasCalendario[i].IdentificadorHtml + '" class="detalleCitas"></div>' +
            '</div>' +
            '</div>' +
            '</ul>';

        $("#" + lstDiasId).append(function (indice, htmlFecha) {
            return a;
        }, null, null);
    }

    var diaFinal = fechasCalendario[fechasCalendario.length - 1].Fecha.getDay();
    if (diaFinal != 0 /* Domingo */) {
        for (var j = 0; j < 7 - diaFinal; j++) {
            diaActual = new Date(fechaHasta.getFullYear(), fechaHasta.getMonth(), fechaHasta.getDate(), 0, 0, 0, 0);
            diaActual.setDate(diaActual.getDate() + j + 1);

            lstDiasId = "ListaDias-" + diaActual.getDay();
            $("#" + lstDiasId).append(function (indice, htmlFecha) {
                return '<ul style="width:100%;"><div class="col-Calendario diasCalendario"><div class="fechasCalendarioContenido diaNoDisponible">' +
                    diaActual.getDate() +
                    '</div>' +
                    ' <div style="height:' +
                    altoDia +
                    'px;" class="fechasCalendario">' +
                    '</div>' +
                    '</div>' +
                    '</ul>';
            }, null, null);
        }
    }


}



// Limpia el calendario
function LimpiarCalendario() {
    $('#tituloCalendario').text('');
    $("#ListaFechas").empty()
}

// Permite la visualización de la programación del paciente en el calendario
function CargarTratamientoPacienteCalendario(tratamientoPaciente, imagenDetalleCitas, idioma) {

    idiomaActual = idioma;
    imagenRutaDetalleCitas = imagenDetalleCitas;

    InicializarCalendario();

    if (tratamientoPaciente.Exitoso) {
        citasPacienteEnumerable = Enumerable.From(AjustarFormatoFechasJson(tratamientoPaciente.Resultado.CitasAsignadas.Resultados));
        GraficarProgramacionPaciente();
        window.scrollTo(0, 250);
    }

}

// Grafica cada una de las citas agendadas al paciente
function GraficarProgramacionPaciente() {


    var citasPacienteTemp = citasPacienteEnumerable.OrderBy(function (x) { return x.Desde }).ToArray();
    var imagenRuta;
    var tipoProcedimiento;


    var fechaCita = new Date(1900, 1, 1, 0, 0, 0, 0);
    var fechaCitaActual;
    var citasPorFecha;
    var fechaCalendarioId;

    for (var i = 0; i < citasPacienteTemp.length; i++) {

        fechaCitaActual = new Date(citasPacienteTemp[i].Desde.getFullYear(), citasPacienteTemp[i].Desde.getMonth(), citasPacienteTemp[i].Desde.getDate());
        if (fechaCita.valueOf() != fechaCitaActual.valueOf()) {
            fechaCita = fechaCitaActual
            citasPorFecha = citasPacienteEnumerable.Where(function (x) { return (fechaCita.getFullYear() == x.Desde.getFullYear() && fechaCita.getMonth() == x.Desde.getMonth() && fechaCita.getDate() == x.Desde.getDate()) }).ToArray();
            fechaCalendarioId = fechaCita.getUTCDate().toString() + '-' + fechaCita.getUTCMonth().toString() + '-' + fechaCita.getUTCFullYear().toString();
            var numeroCitasMostrar = 3;
            if (citasPorFecha.length < numeroCitasMostrar)
                numeroCitasMostrar = citasPorFecha.length;
            for (var j = 0; j < numeroCitasMostrar; j++) {
                if (j == 0) {
                    //Agregando la opción de detalle de citas por fecha 
                    $("#DetalleCitas-" + fechaCalendarioId).append(function (indice, htmlFecha) {
                        return '<img style="cursor:hand" alt="ver detalles" id="imDetalleCitas-' + fechaCita + '" src="../../content/Imagenes/im_visible_activo.png" onclick="onClick_VerDetalleDiaCalendario(this, event);" >';
                    }, null, null);
                }

                //Validando el tipo de procedimiento
                tipoProcedimiento = citasPorFecha[j].TipoProcedimiento;
                if (tipoProcedimiento == 1 /* HospitalizacionDomiciliaria */) {
                    imagenRuta = PormedAutonomo.Web.HospitalizacionDomiciliaria.UrlImagenesCliin + citasPorFecha[j].Especialidad.RutaImagen.replace('../','');
                }
                else {
                    imagenRuta = PormedAutonomo.Web.HospitalizacionDomiciliaria.UrlImagenesCliin + citasPorFecha[j].TipoProcedimientoRutaImagen.replace('../', '');
                }

                //Adicionando las imagenes asociadas a las citas reservadas por fecha
                $("#Cita" + j + "-" + fechaCalendarioId).append(function (indice, htmlFecha) {
                    return '<img src="' + imagenRuta + '" class="hidden-xs hidden-sm">';
                }, null, null);

            }
        }


    }


}


// Ajusta el formato de fechas de las citas del paciente
function AjustarFormatoFechasJson(citasPaciente) {
    for (var k = 0; k < citasPaciente.length; k++) {
        citasPaciente[k].Desde = new Date(parseInt(citasPaciente[k].Desde.substr(6)));
        citasPaciente[k].Hasta = new Date(parseInt(citasPaciente[k].Hasta.substr(6)));
    }

    return citasPaciente;
}

// Permite obtener el string de la fecha en formato dd/mm/yyyy
Date.prototype.ddmmyyyy = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return (dd[1] ? dd : "0" + dd[0]) + "/" + (mm[1] ? mm : "0" + mm[0]) + "/" + yyyy;
};

// Permite obtener el string de la fecha en formato dd-mm-yyyy
Date.prototype.ddmmyyyyGuion = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return (dd[1] ? dd : "0" + dd[0]) + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + yyyy;
};

// Permite obtener el string de la fecha en formato mm-dd-yyyy
Date.prototype.mmddyyyy = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return mm + "/" + (dd[1] ? dd : "0" + dd[0]) + "/" + yyyy;
};

// Evento de navegación del botón anterior del calendario
function anteriorFechaCalendario() {
   
    var consulta = new Object();
    consulta.Desde = new Date(fechaDesde.getFullYear(), fechaDesde.getMonth() - 1, 1, 0, 0, 0, 0);
    consulta.Hasta = new Date(consulta.Desde.getFullYear(), consulta.Desde.getMonth() + 1, 0, 23, 59, 0, 0);
    fechaDesde = consulta.Desde;
    fechaHasta = consulta.Hasta;

    var desde = (consulta.Desde.ddmmyyyyGuion());
    var hasta = (consulta.Hasta.ddmmyyyyGuion());
    CargarCitas(desde, hasta);
}

// Evento de navegación del botón siguiente del calendario
function siguienteFechaCalendario() {
   
    var consulta = new Object();
    consulta.NumeroIdentificacion = $('#lbPacienteNuIdentificacion').text();
    consulta.NombreCorto = $('#lbPacienteTipoIdentificacion').text();
    consulta.Desde = new Date(fechaDesde.getFullYear(), fechaDesde.getMonth()+1, 1, 0, 0, 0, 0);
    consulta.Hasta = new Date(consulta.Desde.getFullYear(), consulta.Desde.getMonth() + 1, 0, 23, 59, 0, 0);
    fechaDesde = consulta.Desde;
    fechaHasta = consulta.Hasta;

    var desde = (consulta.Desde.ddmmyyyyGuion());
    var hasta = (consulta.Hasta.ddmmyyyyGuion());
    CargarCitas(desde, hasta);

}

// Evento que se dispara cuando se requiere ver el detalle de una fecha del calendario
function onClick_VerDetalleDiaCalendario(fechaCitas) {

    var fechaDesde = new Date(fechaCitas.id.split("imDetalleCitas-")[1]);
    var fechaHasta = new Date(fechaDesde);
    fechaHasta.setDate(fechaHasta.getDate() + 1);
    $('#fechaDetalleLb').text(fechaDesde.mmddyyyy());
    var citasDetalle = citasPacienteEnumerable.Where(function (x) { return (fechaDesde.getFullYear() == x.Desde.getFullYear() && fechaDesde.getMonth() == x.Desde.getMonth() && fechaDesde.getDate() == x.Desde.getDate()) }).ToArray();
    dataSourceCitasDetalle.data(citasDetalle);
    $('#detallesModal').modal('show');
    
}


