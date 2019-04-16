var PormedAutonomo =
{
    Web: {
        Administracion: {
            URLObtenerSedesParametrizacion: "",
            URLObtenerEspecialidadesXSedeParametrizacion: "",
            URLObtenerProfesionalesXEspecialidadesXParametrizacion: "",
            URLObtenerActivarProfesionalesXEspecialidadesXSedesParametrizacion: "",
            URLObtenerActivarEspecialidadXSedeParametrizacion: "",
            URLObtenerActivarSedeParametrizacion: "",

        }
    }
};

var filtroActual = "";
var especialidadIdActual = "";

var lastEspecialidadSelected = null;
var dataSourceSedesParametrizacion, dataSourceEspecialidadesXSedeParametrizacion, dataSourceProfesionalesXEspecialidadesXSedeParametrizacion;
var requestSedesParametrizacion = new Array();
function finalizarRequests() {
    for (var i = 0; i < requestSedesParametrizacion.length; i++) {
        try {
            requestSedesParametrizacion[i].abort();
        } catch (e) {

        }
    }
}

function inicializarControlesSedesParametrizacion() {
    dataSourceSedesParametrizacion = new kendo.data.DataSource({
        data: [],
        pageSize: 10
    });

    $("#pagerSedesList").kendoPager({
        dataSource: dataSourceSedesParametrizacion,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        }
    });

    $("#SedesList").kendoListView({
        dataSource: dataSourceSedesParametrizacion,
        selectable: 'selectable',
        template: kendo.template($("#SedesParametrizacionTemplate").html()),
        change: function (e) {
            CargarEspecialidadesXSedeParametrizacion();
        }
    });

    dataSourceEspecialidadesXSedeParametrizacion = new kendo.data.DataSource({
        data: [],
        pageSize: 10
    });

    $("#pagerEspecialidadesList").kendoPager({
        dataSource: dataSourceEspecialidadesXSedeParametrizacion,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        }
    });

    $("#EspecialidadesList").kendoListView({
        dataSource: dataSourceEspecialidadesXSedeParametrizacion,
        selectable: 'selectable',
        template: kendo.template($("#EspecialidadesParametrizacionTemplate").html()),
        change: function (e) {
            CargarProfesionalesEspecialidadesXSedeParametrizacion();
        }
    });

    dataSourceProfesionalesXEspecialidadesXSedeParametrizacion = new kendo.data.DataSource({
        data: [],
        pageSize: 10
    });

    $("#pagerProfesionalesList").kendoPager({
        dataSource: dataSourceProfesionalesXEspecialidadesXSedeParametrizacion,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        }
    });

    $("#ProfesionalesList").kendoListView({
        dataSource: dataSourceProfesionalesXEspecialidadesXSedeParametrizacion,
        template: kendo.template($("#ProfesionalesParametrizacionTemplate").html()),

    });
    $("#inpBusqueda").keyup(function (e) {

        if ($(this).val().length > 2) {
            CargarSedesParametrizacion();
        } else if (e.keyCode == 8 || e.keyCode == 46) {
            $(this).val('');
            CargarSedesParametrizacion();
        }
    });
    CargarSedesParametrizacion();
}
function CargarSedesParametrizacion() {
    finalizarRequests();
    var body = {
        filtro: $('#inpBusqueda').val()
    }

    filtroActual = body.filtro;

    $('#loadingSedesParametrizacion').removeClass('hidden');
    limpiarDatosSedesParametrizacion();
    limpiarDatosEspecialidadesXSedeParametrizacion();
    limpiarDatosProfesionalesXEspecialidadXSedeParametrizacion(false);
    $.post(PormedAutonomo.Web.Administracion.URLObtenerSedesParametrizacion, body)
                                                              .done(OnExitoCargarSedesParametrizacion)
                                                              .fail(OnFalloCargarSedesParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingSedesParametrizacion').addClass('hidden');
                                                               });

}

function limpiarDatosSedesParametrizacion() {
    dataSourceSedesParametrizacion.data(new Array());
}
function OnExitoCargarSedesParametrizacion(result) {
    if (result.Exitoso) {
        dataSourceSedesParametrizacion.data(result.Resultado.Resultados);
        if (result.Resultado.Resultados.length > 0) {
            var listView = $("#SedesList").data("kendoListView");
            if (sedeIdActivando != null) {
                var index = -1;
                for (var i = 0; i < listView.element.children().length ; i++) {
                    if (dataSourceSedesParametrizacion.view()[i].SedeId == sedeIdActivando) {
                        index = i;
                    }
                }
                if (index != -1) {
                    listView.select(listView.element.children()[index]);
                } else {
                    listView.select(listView.element.children().first());
                }
                sedeIdActivando = null;
            } else {
                listView.select(listView.element.children().first());
            }

        }
        $("#SedesList").find('.ActivarSedeBtn').click(ActivarSedesParametrizacion);
        $("#SedesList").find('.DesActivarSedeBtn').click(DesActivarSedesParametrizacion);

    }
}

function OnFalloCargarSedesParametrizacion(result) {
}

function CargarEspecialidadesXSedeParametrizacion() {
    finalizarRequests();
    $('#loadingSedesParametrizacion').removeClass('hidden');
    var id = $.map($("#SedesList").data("kendoListView").select(), function (item) {
        return dataSourceSedesParametrizacion.view()[$(item).index()].SedeId;
    });
    limpiarDatosEspecialidadesXSedeParametrizacion();
    limpiarDatosProfesionalesXEspecialidadXSedeParametrizacion(false);
    var urlConsultarEspecialidadesXSedeParametrizacion = PormedAutonomo.Web.Administracion.URLObtenerEspecialidadesXSedeParametrizacion.replace('-id-', id).replace("-filtro-", filtroActual).replace('&amp;', '&');

    $.get(urlConsultarEspecialidadesXSedeParametrizacion).done(OnExitoCargarEspecialidadesXSedeParametrizacion)
                                                              .fail(OnFalloCargarEspecialidadesXSedeParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingSedesParametrizacion').addClass('hidden');
                                                               });

}

function limpiarDatosEspecialidadesXSedeParametrizacion() {
    dataSourceEspecialidadesXSedeParametrizacion.data(new Array());
}
function OnExitoCargarEspecialidadesXSedeParametrizacion(result) {
    if (result.Exitoso) {
        dataSourceEspecialidadesXSedeParametrizacion.data(result.Resultado);
        if (result.Resultado.length > 0) {
            var listView = $("#EspecialidadesList").data("kendoListView");
            // selects first list view item
            if (especialidadIdActivando != null) {
                var index = -1;
                for (var i = 0; i < listView.element.children().length ; i++) {
                    if (dataSourceEspecialidadesXSedeParametrizacion.view()[i].EspecialidadId == especialidadIdActivando) {
                        index = i;
                    }
                }
                if (index != -1) {
                    listView.select(listView.element.children()[index]);
                } else {
                    listView.select(listView.element.children().first());
                }
                especialidadIdActivando = null;
            } else {
                listView.select(listView.element.children().first());
            }

        }
        $("#EspecialidadesList").find('.ActivarEspecialidadBtn').click(ActivarEspecialidadSedesParametrizacion);
        $("#EspecialidadesList").find('.DesActivarEspecialidadBtn').click(DesActivarEspecialidadSedesParametrizacion);
    }
}

function OnFalloCargarEspecialidadesXSedeParametrizacion(result) {
}

function CargarProfesionalesEspecialidadesXSedeParametrizacion() {
    finalizarRequests();
    $('#loadingSedesParametrizacion').removeClass('hidden');
    var idSede = $.map($("#SedesList").data("kendoListView").select(), function (item) {
        return dataSourceSedesParametrizacion.view()[$(item).index()].SedeId;
    });
    var idEspecialidad = $.map($("#EspecialidadesList").data("kendoListView").select(), function (item) {
        return dataSourceEspecialidadesXSedeParametrizacion.view()[$(item).index()].EspecialidadId;
    });

    var diferente = false;
    if (idEspecialidad[0] != especialidadIdActual) {
        diferente = true;
    }

    especialidadIdActual = idEspecialidad[0];
    lastEspecialidadSelected = idEspecialidad[0];
    limpiarDatosProfesionalesXEspecialidadXSedeParametrizacion(diferente);
    var urlProfEspe = PormedAutonomo.Web.Administracion.URLObtenerProfesionalesXEspecialidadesXParametrizacion.replace('-idSede-', idSede).replace('-idEspecialidad-', idEspecialidad).replace('&amp;', '&').replace('-filtro-', filtroActual).replace('&amp;', '&');

    $.get(urlProfEspe).done(OnExitoCargarProfesionalesXEspecialidadXSedeParametrizacion)
                                                              .fail(OnFalloCargarProfesionalesXEspecialidadXSedeParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingSedesParametrizacion').addClass('hidden');
                                                               });

}
function limpiarDatosProfesionalesXEspecialidadXSedeParametrizacion(reiniciarPaginacion) {
    dataSourceProfesionalesXEspecialidadesXSedeParametrizacion.data(new Array());
    if (reiniciarPaginacion) {
        dataSourceProfesionalesXEspecialidadesXSedeParametrizacion.page(1);
    }
   
}

function OnExitoCargarProfesionalesXEspecialidadXSedeParametrizacion(result) {
    if (result.Exitoso) {

        dataSourceProfesionalesXEspecialidadesXSedeParametrizacion.data(result.Resultado);
        //$("#ProfesionalesList").find('.VisibleUsuarioProfesionalCB').change(toogleProfesionalSedesParametrizacion);

    }
}

function OnFalloCargarProfesionalesXEspecialidadXSedeParametrizacion(result) {
}


function toogleProfesionalSedesParametrizacion() {
    var idSede = $.map($("#SedesList").data("kendoListView").select(), function (item) {
        return dataSourceSedesParametrizacion.view()[$(item).index()].SedeId;
    });
    var idEspecialidad = $.map($("#EspecialidadesList").data("kendoListView").select(), function (item) {
        return dataSourceEspecialidadesXSedeParametrizacion.view()[$(item).index()].EspecialidadId;
    });
    var idProfesional = parseInt($(this).data('profesionalsaludid'));
    var body = {
        relacion: {
            ProfesionalSaludId: idProfesional,
            EspecialidadId: idEspecialidad,
            SedeId: idSede
        },
        visibleUsuario: $(this).is(':checked')
    }

    $('#loadingSedesParametrizacion').removeClass('hidden');

    $.post(PormedAutonomo.Web.Administracion.URLObtenerActivarProfesionalesXEspecialidadesXSedesParametrizacion, body)
                                                              .done(OnExitotoogleProfesionalSedesParametrizacion)
                                                              .fail(OnFallotoogleProfesionalSedesParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingSedesParametrizacion').addClass('hidden');
                                                               });

}

function OnExitotoogleProfesionalSedesParametrizacion(result) {
    CargarProfesionalesEspecialidadesXSedeParametrizacion();
}


function OnFallotoogleProfesionalSedesParametrizacion(result) {
    CargarProfesionalesEspecialidadesXSedeParametrizacion();
}
var especialidadIdActivando = null;
var sedeIdActivando = null;
function ActivarEspecialidadSedesParametrizacion(e) {
    e.stopPropagation();
    var idSede = $.map($("#SedesList").data("kendoListView").select(), function (item) {
        return dataSourceSedesParametrizacion.view()[$(item).index()].SedeId;
    });
    var idEspecialidad = parseInt($(this).data('especialidadid'));
    especialidadIdActivando = idEspecialidad;
    var body = {
        relacion: {
            ProfesionalSaludId: 0,
            EspecialidadId: idEspecialidad,
            SedeId: idSede
        },
        visibleUsuario: true
    }

    $('#loadingSedesParametrizacion').removeClass('hidden');

    $.post(PormedAutonomo.Web.Administracion.URLObtenerActivarEspecialidadXSedeParametrizacion, body)
                                                              .done(OnExitotoogleEspeciadlidadXSedesParametrizacion)
                                                              .fail(OnFallotoogleEspeciadlidadXSedesParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingSedesParametrizacion').addClass('hidden');
                                                               });
   
}
function DesActivarEspecialidadSedesParametrizacion(e) {
    e.stopPropagation();
    var idSede = $.map($("#SedesList").data("kendoListView").select(), function (item) {
        return dataSourceSedesParametrizacion.view()[$(item).index()].SedeId;
    });
    var idEspecialidad = parseInt($(this).data('especialidadid'));
    especialidadIdActivando = idEspecialidad;
    var body = {
        relacion: {
            ProfesionalSaludId: 0,
            EspecialidadId: idEspecialidad,
            SedeId: idSede
        },
        visibleUsuario: false
    }

    $('#loadingSedesParametrizacion').removeClass('hidden');

    $.post(PormedAutonomo.Web.Administracion.URLObtenerActivarEspecialidadXSedeParametrizacion, body)
                                                              .done(OnExitotoogleEspeciadlidadXSedesParametrizacion)
                                                              .fail(OnFallotoogleEspeciadlidadXSedesParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingSedesParametrizacion').addClass('hidden');
                                                               });
    return false;
}
function OnExitotoogleEspeciadlidadXSedesParametrizacion(result) {
    CargarEspecialidadesXSedeParametrizacion();
}
function OnFallotoogleEspeciadlidadXSedesParametrizacion(result) {
    CargarEspecialidadesXSedeParametrizacion();
}



function ActivarSedesParametrizacion(e) {
    e.stopPropagation();
    var idSede = parseInt($(this).data('sedeid'));
    sedeIdActivando = idSede;
    especialidadIdActivando = lastEspecialidadSelected;
    var body = {
        relacion: {
            ProfesionalSaludId: 0,
            EspecialidadId: 0,
            SedeId: idSede
        },
        visibleUsuario: true
    }

    $('#loadingSedesParametrizacion').removeClass('hidden');

    $.post(PormedAutonomo.Web.Administracion.URLObtenerActivarSedeParametrizacion, body)
                                                              .done(OnExitotoogleSedeParametrizacion)
                                                              .fail(OnFallotoogleSedeParametrizacion)
                     
}
function DesActivarSedesParametrizacion(e) {
    e.stopPropagation();
    var idSede = parseInt($(this).data('sedeid'));
    sedeIdActivando = idSede;
    especialidadIdActivando = lastEspecialidadSelected;
    var body = {
        relacion: {
            ProfesionalSaludId: 0,
            EspecialidadId: 0,
            SedeId: idSede
        },
        visibleUsuario: false
    }

    $('#loadingSedesParametrizacion').removeClass('hidden');

    $.post(PormedAutonomo.Web.Administracion.URLObtenerActivarSedeParametrizacion, body)
                                                              .done(OnExitotoogleSedeParametrizacion)
                                                              .fail(OnFallotoogleSedeParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingSedesParametrizacion').addClass('hidden');
                                                               });
  

}
function OnExitotoogleSedeParametrizacion(result) {
    CargarSedesParametrizacion();
}
function OnFallotoogleSedeParametrizacion(result) {
    CargarSedesParametrizacion();
}

function visibleItemChange(estado, profesionalId) {
    var idSede = $.map($("#SedesList").data("kendoListView").select(), function (item) {
        return dataSourceSedesParametrizacion.view()[$(item).index()].SedeId;
    });
    var idEspecialidad = $.map($("#EspecialidadesList").data("kendoListView").select(), function (item) {
        return dataSourceEspecialidadesXSedeParametrizacion.view()[$(item).index()].EspecialidadId;
    });
    var idProfesional = parseInt(profesionalId);
    var body = {
        relacion: {
            ProfesionalSaludId: idProfesional,
            EspecialidadId: idEspecialidad,
            SedeId: idSede
        },
        visibleUsuario: estado.checked
    }

    $('#loadingSedesParametrizacion').removeClass('hidden');

    $.post(PormedAutonomo.Web.Administracion.URLObtenerActivarProfesionalesXEspecialidadesXSedesParametrizacion, body)
                                                              .done(OnExitotoogleProfesionalSedesParametrizacion)
                                                              .fail(OnFallotoogleProfesionalSedesParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingSedesParametrizacion').addClass('hidden');
                                                               });
}
