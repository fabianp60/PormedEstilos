var PormedAutonomo =
{
    Web: {
        ParametrizarAgenda: {
            URLUsuariosParametrizacionAgendas: "",
            URLObtenerProfesionalesParametrizacionAgendas: "",
            URLActivarProfesionalAdministradorVisible: "",
        }
    }
};

var dataSourceUsuariosParametrizacion, dataSourceProfesionalesParametrizacion;
var requestUsuariosParametrizacion = new Array();
function finalizarRequests() {
    for (var i = 0; i < requestUsuariosParametrizacion.length; i++) {
        try {
            requestUsuariosParametrizacion[i].abort();
        } catch (e) {

        }
    }
}
function inicializarControlesUsuariosParametrizacion() {
    dataSourceUsuariosParametrizacion = new kendo.data.DataSource({
        data: [],
        pageSize: 10
    });

    $("#pagerUsuariosList").kendoPager({
        dataSource: dataSourceUsuariosParametrizacion,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        }
    });

    $("#UsuariosList").kendoListView({
        dataSource: dataSourceUsuariosParametrizacion,
        selectable: 'selectable',
        template: kendo.template($("#UsuariosParametrizacionTemplate").html()),
        change: function (e) {
            CargarProfesionalesParametrizacion();
        }
    });

    dataSourceProfesionalesParametrizacion = new kendo.data.DataSource({
        data: [],
        pageSize: 10
    });

    $("#pagerProfesionalesList").kendoPager({
        dataSource: dataSourceProfesionalesParametrizacion,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        }
    });

    $("#ProfesionalesList").kendoListView({
        dataSource: dataSourceProfesionalesParametrizacion,
        template: kendo.template($("#ProfesionalesParametrizacionTemplate").html()),

    });
    $("#inpBusqueda").keyup(function (e) {

        if ($(this).val().length > 2) {
            CargarUsuariosParametrizacion();
        } else if (e.keyCode == 8 || e.keyCode == 46) {
            $(this).val('');
            CargarUsuariosParametrizacion();
        }
    });
    CargarUsuariosParametrizacion();
}
function CargarUsuariosParametrizacion() {
    finalizarRequests();
    var body = {
        filtro: $('#inpBusqueda').val()
    }
    $('#loadingUsuariosParametrizacion').removeClass('hidden');
    limpiarDatosUsuariosParametrizacion();
    limpiarDatosProfesionalesParametrizacion();
    $.post(PormedAutonomo.Web.ParametrizarAgenda.URLUsuariosParametrizacionAgendas, body)
                                                              .done(OnExitoCargarUsuariosParametrizacion)
                                                              .fail(OnFalloCargarUsuariosParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingUsuariosParametrizacion').addClass('hidden');
                                                               });
}

function limpiarDatosUsuariosParametrizacion() {
    dataSourceUsuariosParametrizacion.data(new Array());
}
function OnExitoCargarUsuariosParametrizacion(result) {
    if (result.Exitoso) {
        dataSourceUsuariosParametrizacion.data(result.Resultado.Resultados);
        if (result.Resultado.Resultados.length > 0) {
            var listView = $("#UsuariosList").data("kendoListView");
            if (usuarioIdActivando != null) {
                var index = -1;
                for (var i = 0; i < listView.element.children().length ; i++) {
                    if (dataSourceUsuariosParametrizacion.view()[i].UsuarioId == usuarioIdActivando) {
                        index = i;
                    }
                }
                if (index != -1) {
                    listView.select(listView.element.children()[index]);
                } else {
                    listView.select(listView.element.children().first());
                }
                usuarioIdActivando = null;
            } else {
                listView.select(listView.element.children().first());
            }

        }
    }
}

function OnFalloCargarUsuariosParametrizacion(result) {
}

function CargarProfesionalesParametrizacion() {
    finalizarRequests();
    $('#loadingUsuariosParametrizacion').removeClass('hidden');
    var usuarioId = $.map($("#UsuariosList").data("kendoListView").select(), function (item) {
        return dataSourceUsuariosParametrizacion.view()[$(item).index()].UsuarioId;
    });

    limpiarDatosProfesionalesParametrizacion();

    $.get(PormedAutonomo.Web.ParametrizarAgenda.URLObtenerProfesionalesParametrizacionAgendas.replace('-usuarioId-', usuarioId))
                                                              .done(OnExitoCargarProfesionalesParametrizacion)
                                                              .fail(OnFalloCargarProfesionalesParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingUsuariosParametrizacion').addClass('hidden');
                                                               });
}

function limpiarDatosProfesionalesParametrizacion() {
    dataSourceProfesionalesParametrizacion.data(new Array());
}

function OnExitoCargarProfesionalesParametrizacion(result) {
    if (result.Exitoso) {
        dataSourceProfesionalesParametrizacion.data(result.Resultado);
        $("#ProfesionalesList").find('.VisibleUsuarioProfesionalCB').change(toogleProfesionalUsuariosParametrizacion);
    }
}

function OnFalloCargarProfesionalesParametrizacion(result) {
}

function toogleProfesionalUsuariosParametrizacion() {
    var usuarioId = $.map($("#UsuariosList").data("kendoListView").select(), function (item) {
        return dataSourceUsuariosParametrizacion.view()[$(item).index()].UsuarioId;
    });
    var idProfesional = parseInt($(this).data('profesionalsaludid'));
    var body = {
        relacion: {
            ProfesionalSaludId: idProfesional,
            UsuarioId: usuarioId
        },
        visibleUsuario: $(this).is(':checked')
    }

    $('#loadingUsuariosParametrizacion').removeClass('hidden');

    $.post(PormedAutonomo.Web.ParametrizarAgenda.URLActivarProfesionalAdministradorVisible, body)
                                                              .done(OnExitotoogleProfesionalUsuariosParametrizacion)
                                                              .fail(OnFallotoogleProfesionalUsuariosParametrizacion)
                                                               .complete(function () {
                                                                   $('#loadingUsuariosParametrizacion').addClass('hidden');
                                                               });
}

function OnExitotoogleProfesionalUsuariosParametrizacion(result) {
    CargarProfesionalesParametrizacion();
}

function OnFallotoogleProfesionalUsuariosParametrizacion(result) {
    CargarProfesionalesParametrizacion();
}

var usuarioIdActivando = null;

