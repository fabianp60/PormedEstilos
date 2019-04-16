//Variables
var fechasCalendario; //Lista de fechas en el control del calendario
var fechaInicial; //Fecha inicial del calendario
var fechaFinal; //Fecha final del calendario
var fechaActual; //Fecha actual del calendario
var indiceDiaActual = 0; //Indice del dia actual
var meses = new Array("ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"); //Lista de nombres de los meses
var dias = new Array("dom", "lun", "mar", "mie", "jue", "vie", "sab"); //Lista de nombres de los días
var colores = new Array("#ff0000", "#00ff00", "#0000ff", "#ff1000", "#10ff00", "#1000ff", "#ff0010", "#00ff10", "#0010ff", "#ff1010", "#10ff10", "#1010ff");
var opcionesFiltroProfesionales; //filtro autocompletar de profesionales de la salud
var acProfesionalSalud; //Autocompletar profesionales de la salud
var acProfesionalSaludSeleccionado; //Item seleccionado del autocompletar de los profesionales de la salud
var agendasProfesional; //Lista de agendas del profesional
var dataSourceAgendas; // DataSource de la lista de agendas

var citasProfesional; //Lista de citas del profesional


//Objeto dia calendario
function diaCalendario(fecha, idHtml) {
    this.fecha = fecha;
    this.idHtml = idHtml;

}
var PormedAutonomo =
{
    Web: {
        VerAgenda: {
            ObtenerAgendaUrl: "",
          
        }
    }
};
//Evento jquery de documento cargado
$(document).ready(function () {

    meses = new Array($("#lb_Enero").text(), $("#lb_Febrero").text(), $("#lb_Marzo").text(), $("#lb_Abril").text(), $("#lb_Mayo").text(), $("#lb_Junio").text(), $("#lb_Julio").text(), $("#lb_Agosto").text(), $("#lb_Septiembre").text(), $("#lb_Octubre").text(), $("#lb_Noviembre").text(), $("#lb_Diciembre").text());
    dias = new Array($("#lb_Domingo").text(), $("#lb_Lunes").text(), $("#lb_Martes").text(), $("#lb_Miercoles").text(), $("#lb_Jueves").text(), $("#lb_Viernes").text(), $("#lb_Sabado").text());
    cargarControlesKendo();

    if ($('#lbProfesionalId').text() != null && $('lbProfesionalId').text() != '0') {
        MostrarLoading();
        //TODO 
        $.getJSON(PormedAutonomo.Web.VerAgenda.ObtenerAgendaUrl)
                                              .done(OnExitoCargarAgendas)
                                              .fail(OnFalloCargarAgendas)
                                              .complete(function () {
                                                  OcultarLoading();
                                              });
    }

});
function MostrarLoading() {
    $("#loading").removeClass('hidden');
}
function OcultarLoading() {
    $("#loading").addClass('hidden');
}


//Éxito en la obtención de los datos de la agenda
function OnExitoCargarAgendas(result) {
    var agenda = result;
    if (agenda.Exitoso) {
        agendasProfesional = Enumerable.From(agenda.Resultado).OrderBy(function (x) { return x.Desde }).ToArray();
        var indexColores = 0;
        for (var i = 0; i < agendasProfesional.length; i++) {

            agendasProfesional[i].Desde = new Date(parseInt(agendasProfesional[i].Desde.replace("/Date(", "").replace(")/", ""), 10));
            agendasProfesional[i].Hasta = new Date(parseInt(agendasProfesional[i].Hasta.replace("/Date(", "").replace(")/", ""), 10));
            agendasProfesional[i].Color = colores[indexColores];
            agendasProfesional[i].habilitado = true;
            agendasProfesional[i].modificable = agendasProfesional.length == 1 ? 'disabled="disabled" ' : '';
            dataSourceAgendas.add(agendasProfesional[i]);
            indexColores = indexColores + 1;
            if (indexColores == colores.length) {
                indexColores = 0;

            }
        }

        cargarCalendario();
        for (var i = 0; i < agendasProfesional.length; i++) {
            for (var j = 0; j < agendasProfesional[i].FragmentosAgenda.length; j++) {
                agregarFragmento(agendasProfesional[i].FragmentosAgenda[j], agendasProfesional[i].Color);
            }
        }
        MostrarLoading();
        //TODO Agregar en reserva de citas
        //  PageMethods.ObtenerCitasReservadasProfesional($('#ContentPlaceHolder1_lbProfesionalId').text(), JSON.stringify(fechaInicial), JSON.stringify(fechaFinal), OnExitoObtenerCitasReservadasProfesional, OnFalloObtenerCitasReservadasProfesional);

    } else {
        $("#mensajeResultados").text(agenda.Mensaje);
        $("#mensajeResultadosContainer").removeClass("hidden");

    }

}

//Falla en la obtención  de los datos  de la agenda
function OnFalloCargarAgendas(error) {
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");


}

//Éxito en la obtención de las citas reservadas para un profesional
function OnExitoObtenerCitasReservadasProfesional(result) {
    OcultarLoading();
    var citas = result;
    if (citas.Exitoso) {
        citasProfesional = citas.Resultado.Resultados;

        for (var i = 0; i < citasProfesional.length; i++) {
            agregarFragmentoCita(citasProfesional[i]);

        }

    } else {
        mostrarNotificacion({
            titulo: "Error",
            mensaje: citas.Mensaje,
            tipo: "error"
        });
    }

}

//Falla en la obtención  de las citas reservadas para un profesional
function OnFalloObtenerCitasReservadasProfesional(error) {
    mostrarNotificacion({
        titulo: "Error",
        mensaje: $("#lbErrorConexion")[0].innerText,
        tipo: "error"
    });
    OcultarLoading();
}

//Declaración de controles kendo
function cargarControlesKendo() {
    // acProfesionalSalud = $("#acProfesionalSalud").kendoAutoComplete({
    //
    //     dataTextField: "NombreCompleto",
    //     filter: "contains",
    //     minLength: 3,
    //     select: function (e) {
    //         var dataItem = this.dataItem(e.item.index());
    //         acProfesionalSaludSeleccionado = dataItem.ProfesionalSaludId;
    //
    //     },
    //     dataSource: {
    //         type: "json",
    //         serverFiltering: true,
    //         transport: {
    //             read: function (options) {
    //                 acProfesionalSaludSeleccionado = null;
    //                 opcionesFiltroProfesionales = options;
    //                 PageMethods.ObtenerProfesionales(options.data.filter.filters[0].value, OnExitoObtenerProfesionales, OnFalloObtenerProfesionales);
    //
    //             }
    //         }
    //     }
    // });

    // $('#windowProfesionalSalud').kendoWindow({
    //     width: "auto",
    //     title: "",
    //     draggable: false,
    //     modal: true,
    //     visible: $("#ContentPlaceHolder1_lbProfesionalId").text() == '0',
    //     actions: [
    //     ],
    // });
    // $("#windowProfesionalSalud").data("kendoWindow").center();

    dataSourceAgendas = new kendo.data.DataSource({
        data: new Array(),
        schema: {
            model: { id: "AgendaId" }
        }
    });


    $("#lstAgendas").kendoListView({
        dataSource: dataSourceAgendas,
        template: kendo.template($("#agendaTemplate").html()),
    });
}

//Evento de cambio de checkbox de la lista de agendas
function agendaItemChange(checkbox, agendaId) {
    if (checkbox.checked) {
        $(".fragmentoCalendarioCreado[data-agendaid='" + agendaId + "']").removeClass("hidden");
        dataSourceAgendas.get(agendaId).habilitado = true;
    } else {
        $(".fragmentoCalendarioCreado[data-agendaid='" + agendaId + "']").addClass("hidden");
        dataSourceAgendas.get(agendaId).habilitado = false;
    }
    var primeraHabilitada = Enumerable.From(dataSourceAgendas.data()).Where(function (x) { return x.habilitado }).FirstOrDefault();
    if (primeraHabilitada != null) {
        irAPrimerFragmentoAgenda(primeraHabilitada.AgendaId);
    }

}

//Crear calendario
function cargarCalendario() {
    if ($('#lbProfesionalId').text() == '0') {
        $("#ContenedorCalendario").addClass("hidden");
    } else {


        try {
            fechasCalendario = new Array();
            fechaInicial = Enumerable.From(agendasProfesional).First().Desde;
            fechaFinal = Enumerable.From(agendasProfesional).Last().Hasta;
        //    PormedAutonomo.Web.Agendas.Desde = fechaInicial;
        //    PormedAutonomo.Web.Agendas.Hasta = fechaFinal;
            while (fechaInicial.getDay() != 1) {
                fechaActual = new Date(fechaInicial);
                fechaActual.setDate(fechaInicial.getDate() - 1);
                fechaInicial = new Date(fechaActual);
            }
            while (fechaFinal.getDay() != 0) {
                fechaActual = new Date(fechaFinal);
                fechaActual.setDate(fechaFinal.getDate() + 1);
                fechaFinal = new Date(fechaActual);
            }
            fechaActual = fechaInicial;
            while (fechaActual <= fechaFinal) {
                fechasCalendario.push(new diaCalendario(fechaActual, fechaActual.getUTCDate().toString() + '-' + fechaActual.getUTCMonth().toString() + '-' + fechaActual.getUTCFullYear().toString()));
                fechaActual = new Date(fechasCalendario[fechasCalendario.length - 1].fecha);
                fechaActual.setDate(fechasCalendario[fechasCalendario.length - 1].fecha.getDate() + 1);
            }
            var width = ((fechasCalendario.length * 100) / 7);
            var liWidth = 100 / fechasCalendario.length;
            $('.MarcoCalendario').width(width + '%');
            for (var i = 0; i < fechasCalendario.length; i++) {
                var classColumnas = "";
                if (i == 0) {
                    classColumnas += " esquina_redonda_calendar";
                }
                if (fechasCalendario[i].fecha < fechaInicial || fechasCalendario[i].fecha > fechaFinal) {
                    classColumnas += " gris_dia";
                }
                $('#ListaFechas').append('<li style="width:' + liWidth.toString() + '%;">' +
              '<div id="' +
                  fechasCalendario[i].idHtml + '" class="columnas ' + classColumnas + '">' +
                  '<div class="dia_columna ' + classColumnas + '">' +
                      '<h1>' + dias[fechasCalendario[i].fecha.getDay()] + '</h1>' +
                      '<p>' + fechasCalendario[i].fecha.getUTCDate() + '</p>' +
                  '</div>' +
                  '<div class="content_barra">' +
                  '</div>' +
              '</div>' +
              '</li>');
            }
            siguienteFechaCalendario(indiceDiaActual);

        } catch (e) {
            var st = 'error';
        }
    }
}

//Evento botones de navegación de calentario
function siguienteFechaBtClick(e) {

    siguienteFechaCalendario(e.dataset.siguientefecha);
}

//Scroll calendario al día indicado 
function siguienteFechaCalendario(indice) {
    indiceDiaActual = parseInt(indice);
    var calendario = $('#Calendario');
    var fecha = document.getElementById(fechasCalendario[indiceDiaActual].idHtml);
    calendario.animate({
        scrollLeft: calendario.scrollLeft() + $(fecha).offset().left - 3 - calendario.offset().left
    }, 1000);
    $("#tituloMes").text(meses[(fechasCalendario[indiceDiaActual].fecha.getUTCMonth())]);
    $("#tituloAnio").text((fechasCalendario[indiceDiaActual].fecha.getFullYear()));
    if ((indiceDiaActual - 7) >= 0) {
        $("#anteriorFechaBt").removeClass("hidden");
        document.getElementById("anteriorFechaBt").dataset.siguientefecha = (indiceDiaActual - 7);
    } else {
        $("#anteriorFechaBt").addClass("hidden");
    }

    if ((indiceDiaActual + 7) < fechasCalendario.length) {
        $("#siguienteFechaBt").removeClass("hidden");
        document.getElementById("siguienteFechaBt").dataset.siguientefecha = (indiceDiaActual + 7);
    } else {
        $("#siguienteFechaBt").addClass("hidden");
    }
}

//Éxito en la obtención de los datos del profesional de la salud
function OnExitoObtenerProfesionales(result) {
    opcionesFiltroProfesionales.success(result.Resultado.Resultados);
}

//Falla en  la obtención de los datos del profesional de la salud
function OnFalloObtenerProfesionales(error) {
    mostrarNotificacion({
        titulo: "Error",
        mensaje: $("#lbErrorConexion")[0].innerText,
        tipo: "error"
    });
    OcultarLoading();
}

//Agregar fragmento al calendario
function agregarFragmento(fragmento, color) {
    fragmento.Desde = new Date(parseInt(fragmento.Desde.replace("/Date(", "").replace(")/", ""), 10));
    fragmento.Hasta = new Date(parseInt(fragmento.Hasta.replace("/Date(", "").replace(")/", ""), 10));
    var startTime = fragmento.Desde;
    var endTime = fragmento.Hasta;
    var diaCalendario = $(document.getElementById(startTime.getDate().toString() + '-' + startTime.getMonth().toString() + '-' + startTime.getFullYear().toString())).children().get(1);
    topInicial = ObtenerValor(startTime.getMinutes() + startTime.getHours() * 60, $(diaCalendario).height());
    var alto = ObtenerValor(endTime.getMinutes() + endTime.getHours() * 60, $(diaCalendario).height()) - topInicial;
    var minutosInicio = ObtenerMinutos(topInicial, $(diaCalendario).height());
    var minutosFin = ObtenerMinutos(topInicial + alto, $(diaCalendario).height());
    dibujarFragmento($(diaCalendario), minutosInicio, minutosFin, topInicial, alto, 'frag' + fragmento.FragmentoAgendaId, color, fragmento.AgendaId);
}


//Agregar fragmento de cita al calendario
function agregarFragmentoCita(cita) {
    var startTime = cita.Desde;
    var endTime = cita.Hasta;
    var diaCalendario = $(document.getElementById(startTime.getDate().toString() + '-' + startTime.getMonth().toString() + '-' + startTime.getFullYear().toString())).children().get(1);
    topInicial = ObtenerValor(startTime.getMinutes() + startTime.getHours() * 60, $(diaCalendario).height());
    var alto = ObtenerValor(endTime.getMinutes() + endTime.getHours() * 60, $(diaCalendario).height()) - topInicial;
    var minutosInicio = ObtenerMinutos(topInicial, $(diaCalendario).height());
    var minutosFin = ObtenerMinutos(topInicial + alto, $(diaCalendario).height());
    dibujarFragmentoCita($(diaCalendario), minutosInicio, minutosFin, topInicial, alto, 'cita' + cita.CitaReservadaId);
}

//Dibujar un fragmento en el calendario
function dibujarFragmento(diaCalendario, minutosInicio, minutosFin, top, alto, id, color, agendaId) {
    var idstr = '';
    if (id != '' && id != null) {
        idstr = 'id="' + id + '"';
    }
    var claseCarril = obtenerClaseCarrilDisponibilidad(top, alto, diaCalendario);
    var disponibilidadStr = '<div ' + idstr +
                            ' class="barra_disponibilidad fragmentoCalendarioCreado fragmentoCalendarioDisponibilidad ' + claseCarril +
                            '" data-AgendaId="' + agendaId + '" style="top:' +
                                  top +
                                  'px; height:' +
                                 alto +
                                  'px; background-color: ' +
                                   color +
                                   '" ' +
                                 'onmouseout="toogleTooltipDisponibilidad(this ,true, event); return false;" ' +
                                  'onmouseover="toogleTooltipDisponibilidad(this ,true, event); return false;" ' +
                                   '>' +
                                '<div class="nativo azul horas_tool_tip_disponibilidad hidden">' +
                                    '<div class="triangulo_horas azul_claro">' +
                                    '</div>' +
                                    '<p>horas</p>' +
                                    '<div class="horas_modulo horaFragmento">' +
                                         MinutosAHHMM(minutosInicio) + ' - ' + MinutosAHHMM(minutosFin) +
                                    '</div>' +
                                '</div>' +
                            '</div>';

    fragmentoActual = $(diaCalendario).append(disponibilidadStr).children().last();
   // fragmentoActual = $(diaCalendario).append('<div ' + idstr + ' class="fragmentoCalendarioCreado" data-AgendaId="' + agendaId + '" style="top:' +
   //       top +
   //       'px;min-height:20px; height:' +
   //      alto +
   //       'px;  border-color: ' +
   //       color +
   //       '" ' +
   //         '>' +
   //
   //           '<span class="horaFragmento" style="margin-left:20px">' + MinutosAHHMM(minutosInicio) + ' - ' + MinutosAHHMM(minutosFin) + '</span>' +
   //
   //       '</div>').children().last();
}
function obtenerClaseCarrilDisponibilidad(top, height, diaCalendario) {
    try {


        var fragmentos = $(diaCalendario).children('.fragmentoCalendarioDisponibilidad');
        var clase = "";
        var topFinal = top + height;
        var topFragmento = 0;
        var heightFragmento = 0;
        var topFinalFragmento = 0;
        for (var i = 0; i < fragmentos.length; i++) {
            topFragmento = parseInt($(fragmentos[i]).css('top'));
            heightFragmento = parseInt($(fragmentos[i]).css("height"));
            topFinalFragmento = topFragmento + heightFragmento;
            if ((topFragmento >= top && topFragmento <= topFinal) ||
                (topFinalFragmento >= top && topFinalFragmento <= topFinal) ||
                (topFragmento < top && topFinalFragmento > topFinal) ||
                (top < topFragmento && topFinal > topFinalFragmento)) {
                if ($(fragmentos[i]).hasClass("tercera")) {
                    clase = "";
                } else if ($(fragmentos[i]).hasClass("segunda")) {
                    clase = "tercera";
                } else {
                    clase = "segunda";
                }

            }
        }
        return clase;
    } catch (e) {
        return "";
    }
}

function toogleTooltipDisponibilidad(fragmento, actualizarFormulario, e) {
    e.stopPropagation();
    var tooltip = $(fragmento).find(".horas_tool_tip_disponibilidad");
    if (tooltip.hasClass("hidden")) {

        $(".horas_tool_tip_disponibilidad").addClass("hidden");
        //  $(".fragmentoCalendarioCreado").css('zIndex', '1');
        tooltip.removeClass("hidden");
        $(fragmento).css('zIndex', '1000');
    } else {
        tooltip.addClass("hidden");
        $(fragmento).css('zIndex', '1');
    }

}
//Dibujar un fragmento de cita en el calendario
function dibujarFragmentoCita(diaCalendario, minutosInicio, minutosFin, top, alto, id) {
    var idstr = '';
    if (id != '' && id != null) {
        idstr = 'id="' + id + '"';
    }
    fragmentoActual = $(diaCalendario).append('<div ' + idstr + ' class="fragmentoCitaCalendarioCreado"  style="top:' +
          top +
          'px;min-height:20px; height:' +
         alto +
          'px;  " ' +
            '>' +

              '<span class="horaFragmento" style="margin-left:20px">' + MinutosAHHMM(minutosInicio) + ' - ' + MinutosAHHMM(minutosFin) + '</span>' +

          '</div>').children().last();
}

//Obtener el tiempo en minutos a partir del total de pixeles en el día calendario
function ObtenerMinutos(valor, total) {
    return valor * 1440 / total;
}

//Obtener el valor en pixeles a partir del total de minutos
function ObtenerValor(minutos, total) {
    return minutos * total / 1440;
}

//Obtener cadena de texto de hora (HH:mm) a partir del total de minutos
function MinutosAHHMM(valor) {
    var horas = Math.floor(valor / 60);
    var minutos = Math.floor((valor - (horas * 60)));
    if (horas < 10) { horas = "0" + horas; }
    if (minutos < 10) { minutos = "0" + minutos; }
    var tiempo = horas + ':' + minutos;
    return tiempo;
}

//Evento de clic del botón de seleccionar profesional de la salud
function btSeleccionarProfesionalOnClick() {
    var url = document.location.href;
    url = url.split("?")[0].split("#")[0];
    MostrarLoading();
    document.location.href = url + "?profesionalSaludId=" + acProfesionalSaludSeleccionado;
}

//Cambiar de profesional de la salud
function cambiarProfesionalSalud() {
    var url = document.location.href;
    url = url.split("?")[0].split("#")[0];
    MostrarLoading();
    document.location.href = url;
}

//Navega el calendario al primer fragmento de la agenda indicada
function irAPrimerFragmentoAgenda(agendaId) {
    var agenda = dataSourceAgendas.get(agendaId);
    var fecha = agenda.Desde;
    var fragmentos = $(".fragmentoCalendarioCreado[data-agendaid='" + agendaId + "']");
    if (fragmentos.length > 0) {
        var fechaStr = $(fragmentos[0]).parent().parent().attr('id').split("-");
        fecha = new Date(fechaStr[2], fechaStr[1], fechaStr[0], 0, 0, 0, 0);
    }

    var delta = (fecha - fechaInicial) / (1000 * 60 * 60 * 24);
    var indice = parseInt(delta / 7);
    indice = indice * 7;
    siguienteFechaCalendario(indice);
}
