var dataSourceEncuestas; // DataSource Encuestas
var dataSourceTiposPreguntas; // DataSource Tipos de preguntas
var lvEncuestas; //List view Encuestas
var encuestas; //Lista de tipos de secciones del sistema
var encuestaSeleccionado; //Tipo de seccion seleccionada previamente
var dataSourcePreguntas; //DataSource Preguntas
var lstTipoPreguntas //Lista de Tipos de preguntas
var dataSourceOpcionesRespuesta //DataSource opciones respuesta
var estaHabilitadoEdicion = false; //Indica si el formulario esta en modo edición
var adicionandoOpciones = false; //Indica si se estan adicionando opciones de respuesta
var resultadoConsultaEncuestas; //Resultado obtenido al consultar las encuestas del sistema

//Evento jquery de documento cargado
$(document).ready(function () {

    PageMethods.set_path('/Encuestas/Index');
    Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(PageLoaded);
    cargarControlesKendo();

});

//Evento de página cargada
function PageLoaded(sender, args) {
    inicializar();
}

//Inicializa
function inicializar() {
    estaHabilitadoEdicion = false;
    MostrarLoading();
    //PageMethods.ObtenerTipoPreguntas(OnExitoTipoPreguntas, OnFallo);
    //PageMethods.ObtenerEncuestas(OnExitoEncuestas, OnFallo);
    $.getJSON(URLConsultarDatosPaciente).done(OnExitoTipoPreguntas)
                                    .fail(OnFallo);

    $.getJSON(URLObtenerTipoPreguntas).done(OnExitoEncuestas)
                                    .fail(OnFallo);

}

//Declaración de controles kendo
function cargarControlesKendo() {

    dataSourceEncuestas = new kendo.data.DataSource({
        data: new Array(),
        schema: {
            model: {
                id: "EncuestaId",
                fields: {
                    EncuestaId: { editable: false, nullable: true },
                    Titulo: { type: "string" },
                    Descripcion: { type: "string" },
                    FechaCreacion: { type: "date", format: "{0:dd/MM/yyyy}" },
                    FechaActualizacion: { type: "date", format: "{0:dd/MM/yyyy}", defaultValue: null },
                    EdicionHabilitada: { type: "boolean" },
                    PreguntasEncuesta: "PreguntasEncuesta"
                }
            }
        }, pageSize: 1
    });

    dataSourcePreguntas = new kendo.data.DataSource({
        data: new Array(),
        schema: {
            model: {
                id: "PreguntaEncuestaId",
                fields: {
                    PreguntaEncuestaId: { editable: false, nullable: true },
                    Obligatoriedad: { type: "string" },
                    Consecutivo: { type: "string" },
                    Pregunta: { type: "string" },
                    TipoPreguntaNombre: { type: "string", },
                    ObligatoriaValor: { type: "string" },
                    TipoPregunta: { type: "number", defaultValue: 2 },
                    EdicionHabilitada: { type: "boolean" },
                    Obligatoria: { type: "number" },
                    ObligatoriaCh: { type: "boolean" },
                    ObligatoriaCh: { type: "Array" },

                }
            }
        },
    });

    dataSourcePreguntas2 = new kendo.data.DataSource({
        data: new Array(),
        schema: {
            model: {
                id: "OpcionRespuestaId",
                fields: {
                    OpcionRespuestaId: { editable: false, nullable: true },
                    Descripcion: { type: "string", nullable: false },
                    SeleccionMultiple: { type: "boolean", defaultValue: false },
                    EdicionHabilitada: { type: "boolean", defaultValue: false },
                }
            }
        },
    });



    dataSourceTiposPreguntas = new kendo.data.DataSource({
        data: new Array(),
        schema: {
            model: { id: "TipoPreguntaId" }
        },
    });



    lvEncuestas = $("#lstEncuestas").kendoListView({
        dataSource: dataSourceEncuestas,
        template: kendo.template($("#encuestaTemplate").html()),
        editTemplate: kendo.template($("#encuestaEdicionTemplate").html()),
        dataBound: function (e) {
            InstanciarPreguntas();
            AsignarRecursos();
        },
        edit: function (e) {
            InstanciarPreguntas();
            HabilitarEdicionEncuesta();
            AsignarRecursos();
        },

    }).data("kendoListView");


    $("#pager").kendoPager({
        dataSource: dataSourceEncuestas,
        previousNext: true,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        },
        change: function (e) {
            encuestaItemChange(dataSourceEncuestas._data[e.sender.dataSource._page - 1].EncuestaId);
        }

    });


}

//Éxito en la obtención de los tipos de pregunta
function OnExitoTipoPreguntas(result) {
    OcultarLoading();
    if (result.Exitoso) {
        if (result.Resultado.length > 0) {

            lstTipoPreguntas = Enumerable.From(result.Resultado);

            var aTipoPreguntas = lstTipoPreguntas.ToArray();
            dataSourceTiposPreguntas.data([]);

            for (var i = 0; i < aTipoPreguntas.length; i++) {
                dataSourceTiposPreguntas.add(aTipoPreguntas[i]);
            }
        }
    }
    else {
        mostrarNotificacion({
            titulo: "Error",
            mensaje: result.Mensaje,
            tipo: "error"
        });
    }

}

//Éxito en la obtención de las encuestas creadas en el sistema
function OnExitoEncuestas(result) {
    OcultarLoading();
    resultadoConsultaEncuestas = result;
    if (result.Exitoso) {
        if (result.Resultado.Resultados.length > 0) {

            encuestas = Enumerable.From(result.Resultado.Resultados).ToArray();

            dataSourceEncuestas.data([]);

            for (var i = 0; i < encuestas.length; i++) {
                encuestas[i].EdicionHabilitada = false;
                dataSourceEncuestas.add(encuestas[i]);

            }

            var verEncuestaId = encuestas[0].EncuestaId;
            if ((encuestaSeleccionado != undefined) && (verEncuestaId != 0) && (verEncuestaId != null) && (dataSourceEncuestas.get(encuestaSeleccionado.EncuestaId) != undefined)) {

                verEncuestaId = encuestaSeleccionado.EncuestaId;
            }

            //lvEncuestas.dataSource._currentRangeStart
            if (dataSourceEncuestas._data[lvEncuestas.dataSource._page - 1].EncuestaId != verEncuestaId) {
                verEncuestaId = dataSourceEncuestas._data[lvEncuestas.dataSource._page - 1].EncuestaId;
            }

            encuestaItemChange(verEncuestaId);
        }
        else {
            $("#btsAccionEdicion").addClass('hidden');
            $("#btsAccionDetalle").addClass('hidden');
        }
    }
    else {
        mostrarNotificacion({
            titulo: "Error",
            mensaje: result.Mensaje,
            tipo: "error"
        });
    }

}

//Falla en la ejecución de web methods
function OnFallo(error) {

    mostrarNotificacion({
        titulo: "Error",
        mensaje: $("#lbErrorConexion")[0].innerText, //TODO patabrca
        tipo: "error"
    });
    OcultarLoading();
}

//Evento onclick para Nueva encuesta 
function NuevaEncuesta() {
    if (!estaHabilitadoEdicion) {
        dataSourcePreguntas.data([]);
        lvEncuestas.add();
        encuestaItemChange(null);
        HabilitarEdicionEncuesta();
    }
}

//  Habilita la edición de la encuesta actual
function HabilitarEdicionEncuesta() {
    estaHabilitadoEdicion = true;

    $("#btsAccionEdicion").removeClass('hidden');
    $("#btsAccionDetalle").addClass('hidden');
    $("#btAdPregunta").removeClass('hidden');
    $("#pager").addClass('NoEditable');


    var preguntas = dataSourcePreguntas._data;
    for (var i = 0; i < preguntas.length; i++) {
        preguntas[i].EdicionHabilitada = estaHabilitadoEdicion;
        $("#divEdiPR" + preguntas[i].PreguntaEncuestaId).removeClass('hidden');
        $("#btAdOpcion" + preguntas[i].PreguntaEncuestaId).removeClass('hidden');

        var opciones = preguntas[i].dsOpcionesRespuesta._data;
        for (var j = 0; j < opciones.length; j++) {
            opciones[j].EdicionHabilitada = estaHabilitadoEdicion;
            $("#divEdiOR" + opciones[j].OpcionRespuestaId).removeClass('hidden');
        }
    }
    estaHabilitadoEdicion.EdicionHabilitada = estaHabilitadoEdicion;
    if (encuestaSeleccionado != undefined) {
        $("#divEdiEnc" + encuestaSeleccionado.EncuestaId).removeClass('hidden');
    }
    else {
        $("#divEdiEnc" + null).removeClass('hidden');
    }
}

// Permite la cancelación de la edición de una encuesta
function CancelarEdicionEncuesta() {
    estaHabilitadoEdicion = false;
    $("#btsAccionEdicion").addClass('hidden');
    $("#btsAccionDetalle").removeClass('hidden');
    $("#btAdPregunta").addClass('hidden');
    $("#btAdOpcion").addClass('hidden');
    $("#pager").removeClass('NoEditable');

    var encuestas = dataSourceEncuestas._data;
    for (var i = 0; i < encuestas.length; i++) {
        encuestas[i].EdicionHabilitada = estaHabilitadoEdicion;
        $("#divEdiEnc" + encuestas[i].EncuestaId).addClass('hidden');
        if ((encuestas[i].EncuestaId == null) || (encuestas[i].EncuestaId == 0)) {
            dataSourceEncuestas._data.remove(encuestas[i]);
            i = i - 1; //TODO patabrca: 
        }
    }


    var preguntas = dataSourcePreguntas._data;
    for (var i = 0; i < preguntas.length; i++) {
        preguntas[i].EdicionHabilitada = estaHabilitadoEdicion;
        $("#divEdiPR" + preguntas[i].PreguntaEncuestaId).addClass('hidden');
        var opciones = preguntas[i].dsOpcionesRespuesta._data;
        for (var j = 0; j < opciones.length; j++) {
            opciones[j].EdicionHabilitada = estaHabilitadoEdicion;
            $("#divEdiOR" + opciones[j].OpcionRespuestaId).addClass('hidden');
        }
    }


    //Deshaciendo las nuevas preguntas que no se quieren almacenar
    for (var i = 0; i < preguntas.length; i++) {
        if ((preguntas[i].PreguntaEncuestaId == null) || (preguntas[i].PreguntaEncuestaId == 0)) {
            dataSourcePreguntas._data.remove(preguntas[i]);
            i = i - 1; //TODO patabrca: 
        }
        else {
            //Deshaciendo las nuevas opciones que no se quieren almacenar
            var opciones = preguntas[i].dsOpcionesRespuesta._data;
            for (var j = 0; j < opciones.length; j++) {
                if ((opciones[j].OpcionRespuestaId == null) || (opciones[j].OpcionRespuestaId == 0)) {
                    preguntas[i].dsOpcionesRespuesta._data.remove(opciones[j]);
                    j = j - 1;
                }
            }
        }

    }

    OnExitoEncuestas(resultadoConsultaEncuestas);

}

// Guarda los cambios realizados
function GuardarCambiosEncuesta() {
    estaHabilitadoEdicion = false;
    $("#btsAccionEdicion").addClass('hidden');
    $("#btsAccionDetalle").removeClass('hidden');
    $("#btAdPregunta").addClass('hidden');
    $("#btAdOpcion").addClass('hidden');
    $("#pager").removeClass('NoEditable');


    var encuestas = dataSourceEncuestas._data;
    for (var i = 0; i < encuestas.length; i++) {
        encuestas[i].EdicionHabilitada = estaHabilitadoEdicion;
        $("#divEdiEnc" + encuestas[i].EncuestaId).addClass('hidden');
    }


    var preguntas = dataSourcePreguntas._data;
    for (var i = 0; i < preguntas.length; i++) {
        if (preguntas[i].PreguntaEncuestaId == null) {
            preguntas[i].PreguntaEncuestaId = 0;
        }
        preguntas[i].EdicionHabilitada = estaHabilitadoEdicion;
        $("#divEdiPR" + preguntas[i].PreguntaEncuestaId).addClass('hidden');
        var opciones = preguntas[i].dsOpcionesRespuesta._data;

        for (var j = 0; j < opciones.length; j++) {
            if (opciones[j].OpcionRespuestaId == null) {
                opciones[j].OpcionRespuestaId = 0;
            }
            opciones[j].EdicionHabilitada = estaHabilitadoEdicion;
            $("#divEdiOR" + opciones[j].OpcionRespuestaId).addClass('hidden');
        }
        preguntas[i].OpcionesRespuesta = opciones;
    }
    MostrarLoading();

    encuestaSeleccionado.PreguntasEncuesta = preguntas;

    //ActualizarEncuesta
    if (encuestaSeleccionado.EncuestaId != null) {
        PageMethods.ActualizarEncuesta(mapearEncuesta(encuestaSeleccionado), OnExitoActualizarEncuesta, OnFallo);
    }
    else {
        encuestaSeleccionado.EncuestaId = 0;
        PageMethods.AdicionarEncuesta(mapearEncuesta(encuestaSeleccionado), OnExitoActualizarEncuesta, OnFallo);
    }
}

// Evento onChange del paginado de la encuesta
function encuestaItemChange(encuestaId) {
    MostrarLoading();
    encuestaSeleccionado = dataSourceEncuestas.get(encuestaId);

    dataSourcePreguntas.data([]);

    for (var j = 0; j < encuestaSeleccionado.PreguntasEncuesta.length; j++) {
        var detalleTipoPregunta = lstTipoPreguntas.Where(function (x)
        { return encuestaSeleccionado.PreguntasEncuesta[j].TipoPregunta == x.TipoPreguntaId }).FirstOrDefault();
        encuestaSeleccionado.PreguntasEncuesta[j].Consecutivo = j + 1;
        encuestaSeleccionado.PreguntasEncuesta[j].Obligatoriedad = toCaracter(encuestaSeleccionado.PreguntasEncuesta[j].Obligatoria);
        encuestaSeleccionado.PreguntasEncuesta[j].ObligatoriaValor = toBoolean(encuestaSeleccionado.PreguntasEncuesta[j].Obligatoria);
        encuestaSeleccionado.PreguntasEncuesta[j].ObligatoriaCh = toBooleanCh(encuestaSeleccionado.PreguntasEncuesta[j].Obligatoria);
        encuestaSeleccionado.PreguntasEncuesta[j].TipoPreguntaNombre = detalleTipoPregunta.Atributos.Nombre;
        encuestaSeleccionado.PreguntasEncuesta[j].EdicionHabilitada = estaHabilitadoEdicion;
        dataSourcePreguntas.add(encuestaSeleccionado.PreguntasEncuesta[j]);

    }

    $("#btsAccionEdicion").addClass('hidden');
    $("#btsAccionDetalle").removeClass('hidden');
    $("#btAdPropiedad").addClass('hidden');
    encuestaSeleccionado.EdicionHabilitada = estaHabilitadoEdicion;
    $("#divEdiEnc" + encuestaSeleccionado.TipoSeccionId).addClass('hidden');

    OcultarLoading();
}

// Evento de inicialización de actualización
function InicioActualizacion(encuestaId, esEncuesta) {

}


// De acuerdo a la obligatoriedad se retorna el caracter
function toCaracter(obligatoriedad) {
    if (obligatoriedad == 1) {
        return "*";
    }
    else
        return "";

}

// Permite la conversión a un valor valido para controles de tipo checkbox
function toBoolean(value) {
    if ((value == 1) || (value == "checked")) {
        return "checked";
    }
    else {
        return "uncheked";
    }
}

// Permite la conversión a un valor valido para controles de tipo checkbox
function toBooleanCh(value) {
    if ((value == 1) || (value == "checked")) {
        return true;
    }
    else {
        return false;
    }
}

// Permite la obtencion del recurso de acuerdo al valor seleccionado
function getRecurso(value) {
    if ((value == 1) || (value == "checked") || (value == true)) {
        return $('#lb_EstadoActiva').text();
    }
    else {
        return $('#lb_EstadoInactiva').text();
    }
}

// Permite la obtencion del valor de acuerdo a la opción seleccionada
function getValor(value) {
    if ((value == 1) || (value == "checked") || (value == true)) {
        return 1;
    }
    else {
        return 0;
    }
}

// Inicializa el listado de opciones de respuesta por pregunta
function InicializarOpcionesRespuesta() {
    try {
        var preguntas = dataSourcePreguntas._data;
        var dsOpciones;


        for (var i = 0; i < preguntas.length; i++) {
            var detalleTipoPregunta = lstTipoPreguntas.Where(function (x)
            { return preguntas[i].TipoPregunta == x.TipoPreguntaId }).FirstOrDefault();

            preguntas[i].dsOpcionesRespuesta = new kendo.data.DataSource({
                data: new Array(),
                schema: {
                    model: {
                        id: "OpcionRespuestaId",
                        fields: {
                            OpcionRespuestaId: { editable: false, nullable: true },
                            Descripcion: { type: "string", nullable: false },
                            SeleccionMultiple: { type: "boolean", defaultValue: false },
                            EdicionHabilitada: { type: "boolean", defaultValue: false },
                        }
                    }
                },
            });

            if (adicionandoOpciones) {
                preguntas[i].OpcionesRespuesta = preguntas[i].lvOpcionesRespuesta.dataSource._data;
            }



            if (preguntas[i].OpcionesRespuesta == undefined) {
                preguntas[i].OpcionesRespuesta = new Array();
            }

            for (var j = 0; j < preguntas[i].OpcionesRespuesta.length; j++) {
                preguntas[i].OpcionesRespuesta[j].SeleccionMultiple = detalleTipoPregunta.Atributos.SeleccionMultiple;
                preguntas[i].OpcionesRespuesta[j].EdicionHabilitada = estaHabilitadoEdicion;
                preguntas[i].dsOpcionesRespuesta.add(preguntas[i].OpcionesRespuesta[j]);
            }

            preguntas[i].lvOpcionesRespuesta = $(".lstOpcionesRespuesta" + preguntas[i].PreguntaEncuestaId).kendoListView({
                dataSource: preguntas[i].dsOpcionesRespuesta,
                template: kendo.template($("#OpcionRespuestaTemplate").html()),
                editTemplate: kendo.template($("#OpcionRespuestaEdicionTemplate").html()),
            }).data("kendoListView");




            $(".btAdOpcion").click(function (e) {
                adicionandoOpciones = true;
                var preguntaActualId = e.toElement.accessKey;
                if (e.toElement.accessKey != "null") {
                    preguntaActualId = parseInt(e.toElement.accessKey);
                }
                else {
                    preguntaActualId = null;
                }

                var preguntaActual = dataSourcePreguntas.get(preguntaActualId);

                if (preguntaActual.PreguntaEncuestaId == null)
                    preguntaActual.PreguntaEncuestaId = dataSourcePreguntas._data.length;

                preguntaActual.lvOpcionesRespuesta.add();
                e.preventDefault();
                HabilitarEdicionEncuesta();
            });

        }
        adicionandoOpciones = false;

    } catch (e) {
        alert(e.message);
    }


}

// Evento de finalización de actualización de encuesta
function FinActualizacion(identificador, esEncuesta) {
    if (!esEncuesta) {
        HabilitarEdicionEncuesta();
    }
}

// Evento de onChange del tipo 
function cbTipoPreguntaOnChange(value, preguntaId) {
    if (value != "") {
        var tipoPreguntaSeleccionada = lstTipoPreguntas.Where(function (x)
        { return parseInt(value) == x.TipoPreguntaId }).FirstOrDefault();

        var pregunta = dataSourcePreguntas.get(preguntaId);
        pregunta.TipoPreguntaNombre = tipoPreguntaSeleccionada.Atributos.Nombre;
        pregunta.TipoPregunta = parseInt(value);

        var opciones = $(".lstOpcionesRespuesta" + preguntaId).data().kendoListView.dataSource;
        for (var i = 0; i < opciones.length; i++) {
            opciones[i].SeleccionMultiple = tipoPreguntaSeleccionada.Atributos.SeleccionMultiple;
        }

    }
}

//Inicializa el listado de preguntas de una encuesta
function InstanciarPreguntas() {
    var lvPreguntas = $("#lstPreguntas").kendoListView({
        dataSource: dataSourcePreguntas,
        template: kendo.template($("#PreguntaTemplate").html()),
        editTemplate: kendo.template($("#PreguntaEdicionTemplate").html()),
        dataBound: function (e) {
            InicializarOpcionesRespuesta();
        },
        edit: function (e) {
            InicializarOpcionesRespuesta();
            $('.cbTipoPreguntas').kendoComboBox({
                dataTextField: "Atributos.Nombre",
                dataValueField: "TipoPreguntaId",
                dataSource: dataSourceTiposPreguntas,
                suggest: true,
                index: 1,
                dataBound: function (e) {
                    $('.cbTipoPreguntas').trigger("change");
                }


            });
            HabilitarEdicionEncuesta();
        },


    }).data("kendoListView");

    $("#btAdPregunta").click(function (e) {
        adicionandoOpciones = false;
        lvPreguntas.add();
        e.preventDefault();
        HabilitarEdicionEncuesta();
    });
}

//Evento de OnExito al actualizar una encuesta
function OnExitoActualizarEncuesta(result) {
    OcultarLoading();
    if (result.Exitoso) {
        estaHabilitadoEdicion = false;
        datosActualizados = true;
        mostrarNotificacion({
            titulo: "",
            mensaje: result.Mensaje,
            tipo: "info"
        });
        OnExitoEncuestas(result);

    }
    else {
        HabilitarEdicionEncuesta();
        mostrarNotificacion({
            titulo: "Error",
            mensaje: result.Mensaje,
            tipo: "error"
        });
    }
}

// Permite el mapeo de una encuesta
function mapearEncuesta(encuesta) {
    var encuestaMapeada = new Object;
    encuestaMapeada = encuesta;
    delete encuestaMapeada['__type'];

    return JSON.stringify(encuesta);
}

//Evento de OnChange de obligatoriedad
function obligatoriaItemChange(chObligatorio, preguntaEncuestaId) {
    var pregunta = dataSourcePreguntas.get(preguntaEncuestaId);
    pregunta.ObligatoriaValor = toBoolean(chObligatorio.checked);
    pregunta.Obligatoriedad = toCaracter(chObligatorio.checked);
    pregunta.Obligatoria = getValor(chObligatorio.checked);
}

// Asigna los recursos de idioma
function AsignarRecursos() {

    $('.lblTitulo').text("*" + $('#lb_Titulo').text() + ":");
    $('.lblDescripcionObli').text("*" + $('#lb_Descripcion').text() + ":");
    $('.inDescripcionObli').attr("placeholder", $('#lb_Descripcion').text());
    $('.inDescripcionObli').attr("validationMessage", $('#lb_DescripcioRequired').text());
    $('.inTitulo').attr("placeholder", $('#lb_Titulo').text());
    $('.inTitulo').attr("validationMessage", $('#lb_TituloRequired').text());
    $('.inOpcionRespuesta').attr("placeholder", $('#lb_OpcionRespuesta').text());
    $('.inOpcionRespuesta').attr("validationMessage", $('#lb_OpcionRespuestaRequired').text());
    if ($('.lblFechaActualizacion').text() != undefined) {
        var lblFechaActualizacionText = $('.lblFechaActualizacion').text();
        lblFechaActualizacionText = lblFechaActualizacionText.replace("FechaUpd", $('#lb_FechaActualizacion').text());
        $('.lblFechaActualizacion').text(lblFechaActualizacionText);
    }
}