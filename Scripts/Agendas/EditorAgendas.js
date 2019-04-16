//Variables
var fechasCalendario; //Lista de fechas en el control del calendario
var fechaInicial; //Fecha inicial del calendario
var fechaFinal; //Fecha final del calendario
var fechaActual; //Fecha actual del calendario
var indiceDiaActual = 0; //Indice del dia actual
var meses = new Array("ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"); //Lista de nombres de los meses
var dias = new Array("dom", "lun", "mar", "mie", "jue", "vie", "sab"); //Lista de nombres de los días
var opcionesFiltroProfesionales; //filtro autocompletar de profesionales de la salud
var acProfesionalSalud; //Autocompletar profesionales de la salud
var acProfesionalSaludSeleccionado; //Item seleccionado del autocompletar de los profesionales de la salud
var topInicial, topFinal; //Top inicial y final del fragmento en creación
var topInicialTemporal; //Top temporal
var dibujando = false; //Está creandose un fragmento
var editando = false; //Se está editando un fragmento
var moviendo = false; //Se está moviendo un fragmento
var fragmentoActual; //Fragmento en edición
var ultimaPosicion; //Ultima posición del puntero del mouse
var alto; // Alto actual del fragmento en edición
var delta; //Diferencia de movimiento del mouse
var ultimoId; //Id del último fragmento modificado
var fragmentoEliminando; //Fragmento que se está eliminando
var horaInicioTP, horaFinTP;  //Time pickers de Hora de inicio y hora final
var fragmentoGuardando; //Fragmento que se está guardando
var consultorios; //Lista de consultorios
var primerFragmento = "";

var PormedAutonomo =
{
    Web: {
        Agendas: {
            ObtenerAgendaUrl: "",
            EliminarFragmentoAgendaUrl: "",
            CrearFragmentoAgendaUrl: "",
            ActualizarFragmentoAgendaUrl: "",
            ObtenerConsultoriosUrl: "",
            Desde: new Date(),
            Hasta: new Date(),
            Franja: 15
        }
    }
};

//Objeto dia calendario
function diaCalendario(fecha, idHtml) {
    this.fecha = fecha;
    this.idHtml = idHtml;

}

//Evento jquery de documento cargado
$(document).ready(function () {

    meses = new Array($("#lb_Enero").text(), $("#lb_Febrero").text(), $("#lb_Marzo").text(), $("#lb_Abril").text(), $("#lb_Mayo").text(), $("#lb_Junio").text(), $("#lb_Julio").text(), $("#lb_Agosto").text(), $("#lb_Septiembre").text(), $("#lb_Octubre").text(), $("#lb_Noviembre").text(), $("#lb_Diciembre").text());
    dias = new Array($("#lb_Domingo").text(), $("#lb_Lunes").text(), $("#lb_Martes").text(), $("#lb_Miercoles").text(), $("#lb_Jueves").text(), $("#lb_Viernes").text(), $("#lb_Sabado").text());


    cargarControlesKendo();

    cargarCalendario();
    $('#loadingImg').removeClass('hidden');
    $.getJSON(PormedAutonomo.Web.Agendas.ObtenerAgendaUrl)
                                               .done(OnExitoCargarAgenda)
                                               .fail(OnFalloCargarAgenda)
                                               .complete(function () {
                                                   $('#loadingImg').addClass('hidden');
                                               });

});
//Éxito en la obtención de los datos de la agenda
function OnExitoCargarAgenda(result) {
    var agenda = result;
    if (agenda.Exitoso) {

        var lstfrAgenda = Enumerable.From(agenda.Resultado.FragmentosAgenda);
        agenda.Resultado.FragmentosAgenda =  lstfrAgenda.OrderBy(function (x) { return x.Desde }).ToArray();

        for (var i = 0; i < agenda.Resultado.FragmentosAgenda.length; i++) {
            agregarFragmento(agenda.Resultado.FragmentosAgenda[i]);

        }

        fragmentoActual = primerFragmento;
        toogleTooltip(fragmentoActual, false, null);


        $('#loadingImg').removeClass('hidden');
        $.getJSON(PormedAutonomo.Web.Agendas.ObtenerConsultoriosUrl.replace("-sedeId-", agenda.Resultado.SedeId))
                                               .done(OnExitoCargarConsultorios)
                                               .fail(OnFalloCargarConsultorios)
                                               .complete(function () {
                                                   $('#loadingImg').addClass('hidden');
                                               });
        $("html, body").animate({ scrollTop: $('#ContenedorCalendario').offset().top - 20 }, 1000);
    } else {
        $("#mensajeResultados").text(agenda.mensaje);
        $("#mensajeResultadosContainer").removeClass("hidden");
    }
}

//Falla en la obtención  de los datos  de la agenda
function OnFalloCargarAgenda(error) {

    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

}
//Éxito en la obtención de los consultorios de la sede
function OnExitoCargarConsultorios(result) {
    var consultoriosResult = result;

    if (consultoriosResult.Exitoso) {
        var dataSource = new kendo.data.DataSource({
            data: consultoriosResult.Resultado.Resultados
        });
        $("#cbConsultorios").data("kendoComboBox").setDataSource(dataSource);
    } else {

        $("#mensajeResultados").text(consultoriosResult.Mensaje);
        $("#mensajeResultadosContainer").removeClass("hidden");

    }
}

//Falla en la obtención  de los datos  de la agenda
function OnFalloCargarConsultorios(error) {
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

}
//Declaración de controles kendo
function cargarControlesKendo() {
    $("#cbConsultorios").kendoComboBox({
        dataTextField: "Nombre",
        dataValueField: "ConsultorioId",
        filter: "contains",
        dataSource: [],
        // template: $("#profesionalSaludcbTemplate").html(),
        //  change: function (e) {
        //      seleccionarColorProfesional(this);
        //  },
        suggest: true
    });
    //acProfesionalSalud = $("#acProfesionalSalud").kendoAutoComplete({
    //
    //    dataTextField: "NombreCompleto",
    //    filter: "contains",
    //    minLength: 3,
    //    select: function (e) {
    //        var dataItem = this.dataItem(e.item.index());
    //        acProfesionalSaludSeleccionado = dataItem.ProfesionalSaludId;
    //
    //    },
    //    dataSource: {
    //        type: "json",
    //        serverFiltering: true,
    //        transport: {
    //            read: function (options) {
    //                acProfesionalSaludSeleccionado = null;
    //                opcionesFiltroProfesionales = options;
    //
    //PageMethods.ObtenerProfesionales(options.data.filter.filters[0].value, OnExitoObtenerProfesionales, OnFalloObtenerProfesionales);

    //            }
    //        }
    //    }
    //});
    // $('#windowFragmento').kendoWindow({
    //     width: "auto",
    //     title: "--",
    //     actions: [
    //         "Close"
    //     ],
    //     modal: false,
    //     visible: false
    // });
    //$('#windowProfesionalSalud').kendoWindow({
    //    width: "auto",
    //    title: "",
    //    draggable: false,
    //    modal: true,
    //    visible: $("#ContentPlaceHolder1_lbProfesionalId").text() == '0',
    //    actions: [
    //    ],
    //});
    // $("#windowProfesionalSalud").data("kendoWindow").center();
    horaInicioTP = $("#HoraInicioTP").kendoTimePicker({

        change: HoraInicioTPChange,
        interval: 1,
        max: new Date(2000, 0, 1, 23, 58, 0)
    }).data("kendoTimePicker");
    horaFinTP = $("#HoraFinTP").kendoTimePicker({
        change: HoraFinTPChange,
        interval: 1,
        max: new Date(2000, 0, 1, 23, 59, 0)
    }).data("kendoTimePicker");

    $("#cbRepetir").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: $("#lb_Nunca").text(), value: "1" },
            { text: $("#lb_Diariamente").text(), value: "2" },
            { text: $("#lb_Semanalmente").text(), value: "3" }

        ],
        filter: "contains",
        suggest: true,
        index: 0,
        change: function (e) {
            switch (this.value()) {
                case '1': //Nunca
                    $("#opcRecurrenciaCont").addClass("hidden");
                    break;
                case '2': //Diario
                    $("#opcRecurrenciaCont").removeClass("hidden");
                    $("#cbRepetirCadaCont").removeClass("hidden");
                    $("#cbsRepetirEnCont").addClass("hidden");
                    break;
                case '3': // Semanal
                    $("#opcRecurrenciaCont").removeClass("hidden");
                    $("#cbRepetirCadaCont").addClass("hidden");
                    $("#cbsRepetirEnCont").removeClass("hidden");
                    break;
                default:
                    $("#opcRecurrenciaCont").addClass("hidden");
                    break;
            }
        }
    });

    $("#cbRepetirCada").kendoNumericTextBox({
        min: 1,
        step: 1,
        decimals: 0
    });
    $("#franjaNUD").kendoNumericTextBox({
        min: 1,
        step: 1,
        decimals: 0,
        value: PormedAutonomo.Web.Agendas.Franja
    });

    $("#cbFinalizar").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: $("#lb_Nunca").text(), value: "1" },
            { text: $("#lb_DespuesDe").text(), value: "2" },
            { text: $("#lb_EnLaFecha").text(), value: "3" }
        ],
        filter: "contains",
        suggest: true,
        index: 0,
        change: function (e) {
            switch (this.value()) {
                case '1': //Nunca
                    $("#cbOcurrenciasCont").addClass("hidden");
                    $("#dbFinalizarCont").addClass("hidden");
                    break;
                case '2': //Después de
                    $("#cbOcurrenciasCont").removeClass("hidden");
                    $("#dbFinalizarCont").addClass("hidden");
                    break;
                case '3': // en la fecha
                    $("#cbOcurrenciasCont").addClass("hidden");
                    $("#dbFinalizarCont").removeClass("hidden");
                    break;
                default:
                    $("#cbOcurrenciasCont").addClass("hidden");
                    $("#dbFinalizarCont").addClass("hidden");
                    break;
            }
        }
    });

    $("#dpFinalizar").kendoDatePicker(
        {
            value: new Date(),
            format: "yyyy/MM/dd"
        });
    $("#cbOcurrencias").kendoNumericTextBox({
        min: 1,
        step: 1,
        decimals: 1
    });
}

//Crear calendario
function cargarCalendario() {
    if ($('#lbAgendaId').text() == '0') {
        $("#ContenedorCalendario").addClass("hidden");
    }
    try {
        fechasCalendario = new Array();
        var fechaInicial = PormedAutonomo.Web.Agendas.Desde;
        var fechaFinal = PormedAutonomo.Web.Agendas.Hasta;
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
            if (fechasCalendario[i].fecha < PormedAutonomo.Web.Agendas.Desde || fechasCalendario[i].fecha > PormedAutonomo.Web.Agendas.Hasta) {
                classColumnas += " gris_dia";
            }
            $('#ListaFechas').append('<li style="width:' + liWidth.toString() + '%;">' +
                '<div id="' +
                    fechasCalendario[i].idHtml + '" class="columnas ' + classColumnas + '">' +
                    '<div class="dia_columna ' + classColumnas + '">' +
                        '<h1>' + dias[fechasCalendario[i].fecha.getDay()] + '</h1>' +
                        '<p>' + fechasCalendario[i].fecha.getUTCDate() + '</p>' +
                    '</div>' +
                    '<div class="content_barra"' +
                            'onmousedown="diaCalendarioMouseDown(this,event); return false;" ' +
                            'onmouseup="diaCalendarioMouseUp(this,event); return false;" ' +
                            'onmousemove="diaCalendarioMouseMove(this,event);return false;"> ' +
                    '</div>' +
                '</div>' +
                '</li>');
        }
        siguienteFechaCalendario(indiceDiaActual);

    } catch (e) {

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
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

}


//Agregar fragmento al calendario
function agregarFragmento(fragmento) {
    fragmento.Desde = new Date(parseInt(fragmento.Desde.replace("/Date(", "").replace(")/", ""), 10));
    fragmento.Hasta = new Date(parseInt(fragmento.Hasta.replace("/Date(", "").replace(")/", ""), 10));
    var startTime = fragmento.Desde;
    var endTime = fragmento.Hasta;
    var diaCalendario = $(document.getElementById(startTime.getDate().toString() + '-' + startTime.getMonth().toString() + '-' + startTime.getFullYear().toString())).children().get(1);
    topInicial = ObtenerValor(startTime.getMinutes() + startTime.getHours() * 60, $(diaCalendario).height());
    var alto = ObtenerValor(endTime.getMinutes() + endTime.getHours() * 60, $(diaCalendario).height()) - topInicial;
    var minutosInicio = ObtenerMinutos(topInicial, $(diaCalendario).height());
    var minutosFin = ObtenerMinutos(topInicial + alto, $(diaCalendario).height());
    dibujarFragmento($(diaCalendario), minutosInicio, minutosFin, topInicial, alto, 'frag' + fragmento.FragmentoAgendaId, fragmento.ConsultorioId);
}

//Evento de botón del ratón abajo en un dia del calendario
function diaCalendarioMouseDown(diaCalendario, event) {
    borrarFragmentosPendientes();
    try {
        $('#fragmentoTemporal').remove();

    } catch (e) { }
    horaFinTP.min(new Date(0, 0, 0, 0, 0, 0, 0));
    horaInicioTP.max(new Date(0, 0, 0, 23, 59, 0, 0));
    offset = $(diaCalendario).offset().top - $(document).scrollTop();
    topInicial = parseInt(event.clientY);
    ultimoId = '';
    var minutosInicio = ObtenerMinutos(topInicial, $(diaCalendario).height());
    var minutosFin = ObtenerMinutos(topInicial + 20, $(diaCalendario).height());
    var fragmentoTemporal = '<div id="fragmentoTemporal" class="barra fragmentoCalendario"  style="top:' +
                            +(topInicial - offset) +
                             'px;min-height:20px; height:' +
                            20 +
                             'px" ' +
                             'onmousedown="fragmentoCalendarioMouseDown(this.parentElement ,event); return false;" ' +
                             'onmousedown="fragmentoCalendarioMouseUp(this.parentElement ,event); return false;" ' +
                                'onclick="toogleTooltip(this ,event); return false;" ' +
                              '>' +
                                '<div class="desplazar_tool" onmousedown="fragmentoCalendarioMoveMouseDown(this.parentElement ,event); return false;" >' +
                                    '<img src="../../Content/Imagenes/im_agendas_arrastre.png" />' +
                                '</div>' +
                                '<div class="expand_tool" onmousedown="fragmentoCalendarioResizeMouseDown(this.parentElement ,event); return false;">' +
                                    '<img src="../../Content/Imagenes/im_agendas_expand.png" />' +
                                '</div>' +
                                '<div class="nativo horas_tool_tip hidden">' +
                                    '<div class="triangulo_horas">' +
                                    '</div>' +
                                    '<p>' +
                                        '<img src="../../Content/Imagenes/im_agendas_reloj_lleno.png" />' + $('#lb_RangoHoras')[0].innerText + '</p>' +
                                    '<div class="horas_modulo horaFragmento">' +
                                      MinutosAHHMM(minutosInicio) + ' - ' + MinutosAHHMM(minutosFin) +
                                    '</div>' +
                                '</div>' +
                            '</div>';
    $(diaCalendario).append(fragmentoTemporal);
    toogleTooltip($('#fragmentoTemporal'), null);
    //$(diaCalendario).append('<div id="fragmentoTemporal" class="fragmentoCalendario" style="top:' + (topInicial - offset) + 'px;min-height:20px; height:' + 20 + 'px">' + '<span class="horaFragmento" style="margin-left:20px">' + MinutosAHHMM(minutosInicio) + ' - ' + MinutosAHHMM(minutosFin) + '</span>' + '</div>');
    dibujando = true;
    ultimaPosicion = topInicial;
}

//Eliminar del calendario los fragmentos no guardados
function borrarFragmentosPendientes() {
    try {

        var fragmentosNoGuardados = $('.fragmentoCalendarioCreado');
        for (var i = 0; i < fragmentosNoGuardados.length; i++) {
            if ($(fragmentosNoGuardados[i]).attr('id') == null || $(fragmentosNoGuardados[i]).attr('id') == '') {
                $(fragmentosNoGuardados[i]).remove();
            }
        }
        var fragmentoPerdido = $('#fragmentoTemporal');
        if (fragmentoPerdido != null) {
            $(fragmentoPerdido).remove();
        }

    } catch (e) { }
}

function toogleTooltip(fragmento, actualizarFormulario, e) {
    var tooltip = $(fragmento).find(".horas_tool_tip");
    if (tooltip.hasClass("hidden")) {

        $(".horas_tool_tip").addClass("hidden");
        $(".fragmentoCalendarioCreado").css('zIndex', '1');
        tooltip.removeClass("hidden");
        $(fragmento).css('zIndex', '1000');
    } else {
        tooltip.addClass("hidden");
        $(fragmento).css('zIndex', '1');
    }
    if (actualizarFormulario) {
        var horasFragmento = $(fragmento).find('.horaFragmento')[0].innerText;
        var inicio = horasFragmento.split('-')[0];
        var fin = horasFragmento.split('-')[1];
        var minutosInicio = parseInt(inicio.split(':')[0]) * 60 + parseInt(inicio.split(':')[1]);
        var minutosFin = parseInt(fin.split(':')[0]) * 60 + parseInt(fin.split(':')[1]);
        mapearFormulario(minutosInicio, minutosFin, $(fragmento).attr('id'), $(fragmento).parent(), $(fragmento).data('consultorio'));
    }
}

//Evento de botón del ratón que se mueve en un dia del calendario
function diaCalendarioMouseMove(diaCalendario, event) {
    if (dibujando) {
        if (!moviendo) {
            alto = parseInt($('#fragmentoTemporal').css("height"));
            delta = parseInt(event.clientY) - ultimaPosicion;
            alto = alto + delta;
            ultimaPosicion = parseInt(event.clientY);
            if (alto + parseInt($('#fragmentoTemporal').css("top")) <= $(diaCalendario).height()) {
                var minutosInicio = ObtenerMinutos(parseInt($('#fragmentoTemporal').css("top")), $(diaCalendario).height());
                var minutosFin = ObtenerMinutos(parseInt($('#fragmentoTemporal').css("top")) + alto, $(diaCalendario).height());
                if (minutosFin < 1440) {
                    $('#fragmentoTemporal .horaFragmento').text(MinutosAHHMM(minutosInicio) + ' - ' + MinutosAHHMM(minutosFin));
                    $('#fragmentoTemporal').css("height", alto);
                }
            }

        } else {
            alto = parseInt($('#fragmentoTemporal').css("top"));
            delta = parseInt(event.clientY) - ultimaPosicion;
            alto = alto + delta;
            ultimaPosicion = parseInt(event.clientY);
            if (alto + parseInt($('#fragmentoTemporal').css("height")) <= $(diaCalendario).height()) {
                var minutosInicio = ObtenerMinutos(alto, $(diaCalendario).height());
                var minutosFin = ObtenerMinutos(parseInt($('#fragmentoTemporal').css("height")) + alto, $(diaCalendario).height());
                if (minutosFin < 1440) {
                    $('#fragmentoTemporal .horaFragmento').text(MinutosAHHMM(minutosInicio) + ' - ' + MinutosAHHMM(minutosFin));
                    $('#fragmentoTemporal').css("top", alto);
                }
            }
        }
    }
}

//Evento de botón del ratón arriba en un dia del calendario
function diaCalendarioMouseUp(diaCalendario, event) {
    if (dibujando) {
        dibujando = false;
        moviendo = false;
        topInicial = parseInt($('#fragmentoTemporal').css("top"));
        var alto = parseInt($('#fragmentoTemporal').css("height"));
        var minutosInicio = ObtenerMinutos(topInicial, $(diaCalendario).height());
        var minutosFin = ObtenerMinutos(topInicial + alto, $(diaCalendario).height());
        var consultorio = $('#fragmentoTemporal').data('consultorio');
        $('#fragmentoTemporal').remove();
        dibujarFragmento(diaCalendario, minutosInicio, minutosFin, topInicial, alto, ultimoId, consultorio);
        mapearFormulario(minutosInicio, minutosFin, ultimoId, diaCalendario, consultorio);
        //  $('#windowFragmento').data("kendoWindow").open();
    }
}

function mapearFormulario(minutosInicio, minutosFin, ultimoId, diaCalendario, idConsultorio) {
    var inicio = new Date(0, 0, 0, minutosInicio / 60, minutosInicio % 60, 0, 0);
    var fin = new Date(0, 0, 0, minutosFin / 60, minutosFin % 60, 0, 0);
    horaFinTP.min(inicio);
    horaInicioTP.max(fin);
    horaFinTP.value(fin);
    horaInicioTP.value(inicio);
    if (idConsultorio != null) {
        $("#cbConsultorios").data("kendoComboBox").value(idConsultorio);
    } else {
        $("#cbConsultorios").data("kendoComboBox").value(null);
    }

    mostrarEsconderOpcionesRecurrencia(ultimoId);
    var fechaCalendario = $(diaCalendario).parent().attr('id').split("-");
    $("#dpFinalizar").data("kendoDatePicker").value(new Date(parseInt(fechaCalendario[2]), parseInt(fechaCalendario[1]), parseInt(fechaCalendario[0]), 0, 0, 0, 0));

}
//Muestra u oculta las opciones de recurrencia
function mostrarEsconderOpcionesRecurrencia(id) {
    if (id == '' || id == null) {
        $("#recurrenciaContainer").removeClass("hidden");
    } else {
        $("#recurrenciaContainer").addClass("hidden");
    }
}
//Evento de botón del ratón abajo en un fragmento del calendario
function fragmentoCalendarioMouseDown(diaCalendario, event) {
    event.stopPropagation();

}

//Evento de botón del ratón arriba en un fragmento del calendario
function fragmentoCalendarioMouseUp(diaCalendario, event) {

}

//Evento de botón del ratón que se mueve en un area de resize de un fragmento del calendario
function fragmentoCalendarioResizeMouseDown(diaCalendario, event) {
    event.stopPropagation();
    offset = $(diaCalendario).parent().offset().top - $(document).scrollTop();
    topInicial = parseInt($(diaCalendario).css("top"));
    $(diaCalendario).removeClass("fragmentoCalendarioCreado");
    $(diaCalendario).addClass("fragmentoCalendario");
    ultimoId = $(diaCalendario).attr('id');
    $(diaCalendario).attr('id', 'fragmentoTemporal');
    ultimaPosicion = topInicial + offset + parseInt($(diaCalendario).css("height"));
    dibujando = true;
}

//Evento de botón del ratón abajo en un fragmento del calendario
function fragmentoCalendarioMoveMouseDown(diaCalendario, event) {
    event.stopPropagation();
    offset = $(diaCalendario).parent().offset().top - $(document).scrollTop();
    topInicial = parseInt($(diaCalendario).css("top"));
    $(diaCalendario).removeClass("fragmentoCalendarioCreado");
    $(diaCalendario).addClass("fragmentoCalendario");
    ultimoId = $(diaCalendario).attr('id');
    $(diaCalendario).attr('id', 'fragmentoTemporal');
    ultimaPosicion = topInicial + offset;
    dibujando = true;
    moviendo = true;
}

//Evento de botón de eliminanción de un fragmento del calendario
function fragmentoCalendarioBorraClick(diaCalendario, event) {
    event.stopPropagation();
    try {
        var id = $(diaCalendario).attr('id').replace('frag', '');
        fragmentoEliminando = diaCalendario;
        $('#loadingImg').removeClass('hidden');
        $.getJSON(PormedAutonomo.Web.Agendas.EliminarFragmentoAgendaUrl.replace("-id-", id))
                                                    .done(OnExitoEliminarFragmentoAgenda)
                                                    .fail(OnFalloEliminarFragmentoAgenda)
                                                    .complete(function () {
                                                        $('#loadingImg').addClass('hidden');
                                                    });
    } catch (e) {
        $(diaCalendario).remove();
        //  $('#windowFragmento').data("kendoWindow").close();
    }


}

//Éxito en la eliminación de un fragmento del calendario
function OnExitoEliminarFragmentoAgenda(result) {
    var respuesta = result;
    if (respuesta.Exitoso && respuesta.Resultado) {
        $(fragmentoEliminando).remove();
        $("#mensajeResultados").text(respuesta.Mensaje);
        $("#mensajeResultadosContainer").removeClass("hidden");


        // $('#windowFragmento').data("kendoWindow").close();
    } else {
        $("#mensajeResultados").text(respuesta.Mensaje);
        $("#mensajeResultadosContainer").removeClass("hidden");
    }
}

//Falla en la eliminación de un fragmento del calendario
function OnFalloEliminarFragmentoAgenda(error) {
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

}

//Dibujar un fragmento en el calendario
function dibujarFragmento(diaCalendario, minutosInicio, minutosFin, top, alto, id, idConsultorio) {
    var idstr = '';
    if (id != '' && id != null) {
        idstr = 'id="' + id + '"';
    }
    var idConsultorioStr = '';
    if (idConsultorio != null) {
        idConsultorioStr = ' data-consultorio = "' + idConsultorio + '" ';
    }
    var claseEspacio = obtenerClaseCarrilFragmento(top, alto, diaCalendario);
    var fragmentStr = '<div class="barra fragmentoCalendarioCreado ' + claseEspacio + '" ' + idstr + idConsultorioStr + ' style="top:' +
                             top +
                             'px;min-height:20px; height:' +
                            alto +
                             'px" ' +
                             'onmousedown="fragmentoCalendarioMouseDown(this.parentElement ,event); return false;" ' +
                             'onmousedown="fragmentoCalendarioMouseUp(this.parentElement ,event); return false;" ' +
                              'onclick="toogleTooltip(this ,true, event); return false;" ' +
                              '>' +
                                '<div class="desplazar_tool" onmousedown="fragmentoCalendarioMoveMouseDown(this.parentElement ,event); return false;" >' +
                                    '<img src="../../Content/Imagenes/im_agendas_arrastre.png" />' +
                                '</div>' +
                                '<div class="expand_tool" onmousedown="fragmentoCalendarioResizeMouseDown(this.parentElement ,event); return false;">' +
                                    '<img src="../../Content/Imagenes/im_agendas_expand.png" />' +
                                '</div>' +
                                '<div class="nativo horas_tool_tip hidden ">' +
                                    '<div class="triangulo_horas">' +
                                    '</div>' +
                                    '<p>' +
                                      '<span ' + 'onclick="fragmentoCalendarioBorraClick(this.parentElement.parentElement.parentElement ,event); return false;" ' +
                                      '  class="glyphicon glyphicon-trash pull-right" style="margin-right:5px"></span>' +
                                        '</p>' +
                                    '<p>' +
                                        '<img src="../../Content/Imagenes/im_agendas_reloj_lleno.png" />' + $('#lb_RangoHoras')[0].innerText + '</p>' +
                                    '<div class="horas_modulo horaFragmento">' +
                                      MinutosAHHMM(minutosInicio) + ' - ' + MinutosAHHMM(minutosFin) +
                                    '</div>' +
                                '</div>' +
                            '</div>';


    fragmentoActual = $(diaCalendario).append(fragmentStr).children().last();
    toogleTooltip(fragmentoActual, false, null);

    if (primerFragmento == "") {
        primerFragmento = fragmentoActual;
    }

}

function obtenerClaseCarrilFragmento(top, height, diaCalendario) {
    try {
        var fragmentos = $(diaCalendario).children('.fragmentoCalendarioCreado');
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
                if (!$(fragmentos[i]).hasClass("space")) {
                    clase = "space";
                }
                break;
            }
        }
        return clase;
    } catch (e) {
        return "";
    }
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

//Evento de cambio de fecha del timepicker de hora de inicio
function HoraInicioTPChange() {
    realizarCambioHora();
}

//Evento de cambio de fecha del timepicker de hora final
function HoraFinTPChange() {
    realizarCambioHora();
}

//Actualizar el fragmento en el calendario
function realizarCambioHora() {
    var startTime = horaInicioTP.value();
    var endTime = horaFinTP.value();
    if (startTime && endTime) {
        startTime = new Date(startTime);
        endTime = new Date(endTime);
        topInicial = parseInt($(fragmentoActual).css("top"));
        var alto = parseInt($(fragmentoActual).css("height"));
        topInicial = ObtenerValor(startTime.getMinutes() + startTime.getHours() * 60, $(fragmentoActual).parent().height());
        alto = ObtenerValor(endTime.getMinutes() + endTime.getHours() * 60, $(fragmentoActual).parent().height()) - topInicial;
        var minutosInicio = ObtenerMinutos(topInicial, $(fragmentoActual).parent().height());
        var minutosFin = ObtenerMinutos(topInicial + alto, $(fragmentoActual).parent().height());
        var diaCalendario = $(fragmentoActual).parent();
        var id = $(fragmentoActual).attr('id');
        if (id == null) {
            id = '';
        }
        $(fragmentoActual).remove();
        dibujarFragmento(diaCalendario, minutosInicio, minutosFin, topInicial, alto, id);
        horaInicioTP.max(endTime);
        horaFinTP.min(startTime);
    }
}

//Evento del botón de guardar fragmento
function btGuardarFragmentoOnClick() {
    debugger
    fragmentoGuardando = fragmentoActual;
    if ($(fragmentoGuardando).parent().parent().attr('id') != undefined) {
        var fecha = $(fragmentoGuardando).parent().parent().attr('id').split("-");
        var startTime = horaInicioTP.value();
        startTime.setDate(parseInt(fecha[0]));
        startTime.setMonth(parseInt(fecha[1]));
        startTime.setFullYear(parseInt(fecha[2]));
        var endTime = horaFinTP.value();
        endTime.setDate(parseInt(fecha[0]));
        endTime.setMonth(parseInt(fecha[1]));
        endTime.setFullYear(parseInt(fecha[2]));
        var id = $(fragmentoGuardando).attr('id');
        var consultorio = $("#cbConsultorios").data("kendoComboBox").value();
        if (id == null) {
            //Crear fragmento
            var nuevoFragmentoAgenda = {
                AgendaId: $('#lbAgendaId').text(),
                Desde: startTime.toISOString(),
                Hasta: endTime.toISOString(),
                FragmentoAgendaId: 0,
                Franja: parseInt($("#franjaNUD").data("kendoNumericTextBox").value()),
                ConsultorioId: (consultorio == '' ? null : consultorio)
            };
            var body = {
                fragmentoAgenda: nuevoFragmentoAgenda,
                recurrencia: obtenerObjetoRecurrencia()
            }
            $('#loadingImg').removeClass('hidden');
            $.post(PormedAutonomo.Web.Agendas.CrearFragmentoAgendaUrl, body)
                                                       .done(OnExitoCrearFragmentoAgenda)
                                                       .fail(OnFalloCrearFragmentoAgenda)
                                                        .complete(function () {
                                                            $('#loadingImg').addClass('hidden');
                                                        });
        } else {
            //Editar fragmento
            var nuevoFragmentoAgenda = {
                AgendaId: $('#lbAgendaId').text(),
                Desde: startTime.toISOString(),
                Hasta: endTime.toISOString(),
                FragmentoAgendaId: id.replace('frag', ''),
                Franja: parseInt($("#franjaNUD").data("kendoNumericTextBox").value()),
                ConsultorioId: (consultorio == '' ? null : consultorio)
            };

            var body = {
                fragmentoAgenda: nuevoFragmentoAgenda
            }
            $('#loadingImg').removeClass('hidden');
            $.post(PormedAutonomo.Web.Agendas.ActualizarFragmentoAgendaUrl, body)
                                                      .done(OnExitoActualizarFragmentoAgenda)
                                                      .fail(OnFalloActualizarFragmentoAgenda)
                                                       .complete(function () {
                                                           $('#loadingImg').addClass('hidden');
                                                       });
        }

    }
    else
    {
        OnFalloActualizarFragmentoAgenda("");
    }

}

//Éxito en la creación del fragmento de agenda
function OnExitoCrearFragmentoAgenda(result) {
    $(fragmentoGuardando).remove();
    var respuesta = result;
    if (respuesta.Exitoso) {
        for (var i = 0; i < respuesta.Resultado.length; i++) {
            agregarFragmento(respuesta.Resultado[i]);

        }
        $("#mensajeResultados").text(respuesta.Mensaje);
        $("#mensajeResultadosContainer").removeClass("hidden");

    } else {
        $("#mensajeResultados").text(respuesta.Mensaje);
        $("#mensajeResultadosContainer").removeClass("hidden");
    }
    mostrarEsconderOpcionesRecurrencia('-');
    $("#cbRepetir").data("kendoComboBox").value(1);
    $("#opcRecurrenciaCont").addClass("hidden");
}

//Falla en la creación del fragmento de agenda
function OnFalloCrearFragmentoAgenda(error) {
    $(fragmentoGuardando).remove();
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

    $("#cbRepetir").data("kendoComboBox").value(1);
    $("#opcRecurrenciaCont").addClass("hidden");
}

//Éxito en la actualización del fragmento de agenda
function OnExitoActualizarFragmentoAgenda(result) {
    var respuesta = result;
    if (respuesta.Exitoso) {
        $(fragmentoGuardando).remove();
        agregarFragmento(respuesta.Resultado);
        $("#mensajeResultados").text(respuesta.Mensaje);
        $("#mensajeResultadosContainer").removeClass("hidden");


    } else {
        $("#mensajeResultados").text(respuesta.Mensaje);
        $("#mensajeResultadosContainer").removeClass("hidden");
    }
    $("#cbRepetir").data("kendoComboBox").value(1);
    $("#opcRecurrenciaCont").addClass("hidden");
}

//Falla en la actualización del fragmento de agenda
function OnFalloActualizarFragmentoAgenda(error) {
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

    $("#cbRepetir").data("kendoComboBox").value(1);
    $("#opcRecurrenciaCont").addClass("hidden");
}

//Evento de clic del botón de seleccionar profesional de la salud
function btSeleccionarProfesionalOnClick() {
    var url = document.location.href;
    url = url.split("?")[0].split("#")[0];
    MostrarLoading();
    document.location.href = url + "?profesionalSaludId=" + acProfesionalSaludSeleccionado;
}

//Arma el objeto JSON de la recurrencia seleccionada
function obtenerObjetoRecurrencia() {

    var repetirEn = new Array();
    RepetirEnCbs = $("#cbsRepetirEn input:checked");
    for (var i = 0; i < RepetirEnCbs.length; i++) {

        repetirEn.push($(RepetirEnCbs[i]).val());


    }
    var recurrencia = {
        TipoRecurrencia: parseInt($("#cbRepetir").data("kendoComboBox").value()),
        RepetirCada: parseInt($("#cbRepetirCada").data("kendoNumericTextBox").value()),
        RepetirEn: repetirEn,
        ParametrosFinalizacion: {
            FechaHasta: $("#dpFinalizar").data("kendoDatePicker").value().toISOString(),
            NumeroOcurrencias: parseInt($("#cbOcurrencias").data("kendoNumericTextBox").value()),
            TipoFinRecurrencia: parseInt($("#cbFinalizar").data("kendoComboBox").value())
        }
    };
    return recurrencia;
}

//Cambiar de profesional de la salud
function cambiarProfesionalSalud() {
    var url = document.location.href;
    url = url.split("?")[0].split("#")[0];
    MostrarLoading();
    document.location.href = url;
}

//Crear una nueva agenda al profesional de la salud
function crearNuevaAgenda() {
    var url = document.location.href;
    url = url.split("?")[0].split("#")[0];
    MostrarLoading();
    document.location.href = url + "?profesionalSaludId=" + $('#ContentPlaceHolder1_lbProfesionalId').text();
}