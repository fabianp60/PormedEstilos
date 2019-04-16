var acEspecialidadXEspecialidad;
var opcionesFiltroEspecialidades;

var acProfesional;
var opcionesFiltroProfesional;

var PormedAutonomo =
{
    Web: {
        AgendarCita: {
            ObtenerEspecialidadesUrl: "",
            ObtenerSedesEspecialidad: "",
            ObtenerProfesionalesSalud: "",
            ObtenerSedesProfesional: "",
            UrlImagenLoading: "",
            UrlMisCitas:"",
        }
    }
};
//Evento jquery de documento cargado
$(document).ready(function () {

    cargarControles();

});

function cargarControles() {
    acEspecialidadXEspecialidad = $("#EspecialidadIdXEspecialidadInp").kendoAutoComplete({

        dataTextField: "Nombre",
        filter: "contains",
        minLength: 3,
        select: function (e) {
            var dataItem = this.dataItem(e.item.index());
            ActualizarValorEspecialidad(dataItem.EspecialidadId);
        
        },
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: function (options) {
                    ActualizarValorEspecialidad(0);
                    opcionesFiltroEspecialidades = options;
                    $.getJSON(PormedAutonomo.Web.AgendarCita.ObtenerEspecialidadesUrl.replace("-filtro-", options.data.filter.filters[0].value))
                                            .done(OnExitoObtenerEspecialidades)
                                            .fail(OnFalloObtenerEspecialidades);
                    //PageMethods.ObtenerProfesionales(options.data.filter.filters[0].value, OnExitoObtenerProfesionales, OnFalloObtenerProfesionales);

                }
            }
        }
    });
    acProfesional = $("#ProfesionalSaludIdInp").kendoAutoComplete({

        dataTextField: "NombreCompleto",
        filter: "contains",
        minLength: 3,
        select: function (e) {
            var dataItem = this.dataItem(e.item.index());
            ActualizarValorProfesional(dataItem.ProfesionalSaludId);
        
        },
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: function (options) {
                    ActualizarValorProfesional(0);
                    opcionesFiltroProfesional = options;
                    $.getJSON(PormedAutonomo.Web.AgendarCita.ObtenerProfesionalesSalud.replace("-filtro-", options.data.filter.filters[0].value))
                                            .done(OnExitoObtenerProfesionales)
                                            .fail(OnFalloObtenerProfesionales);
                  
                }
            }
        }
    });

    $("#EspecialidadIdXProfesionalInp").change(function () {
        CargarOpcionesSedeXProfesional();
    });

    var fechaDeseada=  $("#dpFechaDeseada").kendoDatePicker(
       {
           format: "yyyy/MM/dd"
       });

    fechaDeseada.data("kendoDatePicker").min(new Date());
    $("#TipoBusquedaDD").change(function () {
        CargarControlesTipoBusqueda();
    });

   

    CargarControlesTipoBusqueda();
}

function CargarControlesTipoBusqueda() {
    switch ($("#TipoBusquedaDD").val()) {
        case "0": //Por Especialidad
            $("#EspecialidadXEspecialidadContainer").removeClass("hidden");
            $("#EspecialidadXProfesionalContainer").addClass("hidden");
            break;
        case "1": //Por Profesional
            $("#EspecialidadXEspecialidadContainer").addClass("hidden");
            $("#EspecialidadXProfesionalContainer").removeClass("hidden");
            break;
        default:
            break;
    }
    LimpiarOpcionesSede();
}
//Éxito en la obtención de especialidades
function OnExitoObtenerEspecialidades(result) {
    opcionesFiltroEspecialidades.success(result.Resultado.Resultados);
}

//Falla en  la obtención de especialidades
function OnFalloObtenerEspecialidades(error) {
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

}

//Actualizar el valor de la especialidad
function ActualizarValorEspecialidad(valor)
{
    $("#EspecialidadIdXEspecialidadHd").val(valor);
    if (valor==0) {
        LimpiarOpcionesSede();
    } else {
        CargarOpcionesSedeXEspecialidad(valor);
    }
}
//Limpiar opciones combo box de sedes
function LimpiarOpcionesSede()
{
    $('#SedeIdInp')
    .find('option')
    .remove()
    .end().val(null);
    var disponibilidades = $('#DisponibilidadesContenedor');
    if (disponibilidades!=null) {
        disponibilidades.empty();
    }
}
//Cargar sedes por especialidad
function CargarOpcionesSedeXEspecialidad(especialidadId) {
    $("#loadingSedes").removeClass("hidden");
    $.getJSON(PormedAutonomo.Web.AgendarCita.ObtenerSedesEspecialidad.replace("-id-", especialidadId))
                                           .done(OnExitoObtenerSedesEspecialidad)
                                           .fail(OnFalloObtenerSedesEspecialidad);
}

//Éxito en la obtención de los datos de sedes por especialidad
function OnExitoObtenerSedesEspecialidad(result) {
    $("#loadingSedes").addClass("hidden");
    var select = $('#SedeIdInp');
    select.append('<option value="0">' + $('#lbTodasLasSedes').text() + '</option>')
    for (var i = 0; i < result.length; i++) {
        select.append('<option value="' + result[i].SedeId + '">' + result[i].Nombre + '</option>');
    }
}

//Falla en  la obtención de los datos sedes por especialidad
function OnFalloObtenerSedesEspecialidad(error) {
    $("#loadingSedes").addClass("hidden");
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

}


//Éxito en la obtención de especialidades
function OnExitoObtenerProfesionales(result) {
    opcionesFiltroProfesional.success(result.Resultado.Resultados);
}

//Falla en  la obtención de especialidades
function OnFalloObtenerProfesionales(error) {
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

}

//Actualizar el valor del profesional de la salud
function ActualizarValorProfesional(valor) {
    $("#ProfesionalSaludIdHd").val(valor);
    if (valor == 0) {
        LimpiarOpcionesEspecialidadXMedico();
    } else {
        CargarOpcionesEspeciadlidadesXProfesional(valor);
    }
}
//Limpiar opciones combo box de especialidades por profesional
function LimpiarOpcionesEspecialidadXMedico() {
    LimpiarOpcionesSede();
    $('#EspecialidadIdXProfesionalInp')
    .find('option')
    .remove()
    .end().val(null);
}

//Cargar sedes por especialidad
function CargarOpcionesEspeciadlidadesXProfesional(profesionalSaludId) {
    $("#loadingEspecialidadesProfesional").removeClass("hidden");
    $.getJSON(PormedAutonomo.Web.AgendarCita.ObtenerEspecialidesProfesional.replace("-id-", profesionalSaludId))
                                           .done(OnExitoObtenerEspecialidadesMedico)
                                           .fail(OnFalloObtenerEspecialidadesMedico);
}

//Éxito en la obtención de los datos de sedes por especialidad
function OnExitoObtenerEspecialidadesMedico(result) {
    $("#loadingEspecialidadesProfesional").addClass("hidden");
    var select = $('#EspecialidadIdXProfesionalInp');
    for (var i = 0; i < result.length; i++) {
        select.append('<option value="' + result[i].EspecialidadId + '">' + result[i].Nombre + '</option>');
    }
    if (result.length>0) {
        select.val(result[0].EspecialidadId);
        CargarOpcionesSedeXProfesional();
    }
}

//Falla en  la obtención de los datos sedes por especialidad
function OnFalloObtenerEspecialidadesMedico(error) {
    $("#loadingEspecialidadesProfesional").addClass("hidden");
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

}


//Cargar sedes por profesional de la salud
function CargarOpcionesSedeXProfesional() {
    var profesionalId = $("#ProfesionalSaludIdHd").val();
    var especialidadlId = $("#EspecialidadIdXProfesionalInp").val();
    if (profesionalId != null && profesionalId != 0 && especialidadlId != null && especialidadlId != 0) {
        LimpiarOpcionesSede();
        $("#loadingSedes").removeClass("hidden");
        $.getJSON(PormedAutonomo.Web.AgendarCita.ObtenerSedesProfesional
                                                                        .replace("-especialidadId-", especialidadlId)
                                                                        .replace("-profesionalId-", profesionalId)
                                                                        .replace("&amp;", "&")
                                                                        )
                                               .done(OnExitoObtenerSedesProfesional)
                                               .fail(OnFalloObtenerSedesProfesional);
    }
}

//Éxito en la obtención de los datos de sedes por especialidad
function OnExitoObtenerSedesProfesional(result) {
    $("#loadingSedes").addClass("hidden");
    var select = $('#SedeIdInp');
    select.append('<option value="0">' + $('#lbTodasLasSedes').text() + '</option>')
    for (var i = 0; i < result.length; i++) {
        select.append('<option value="' + result[i].SedeId + '">' + result[i].Nombre + '</option>');
    }
}

//Falla en  la obtención de los datos sedes por especialidad
function OnFalloObtenerSedesProfesional(error) {
    $("#loadingSedes").addClass("hidden");
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

}

function diasDisponiblesLoad(){
    var diaSeleccionado = $(".DiaDisponibleSeleccionado");
    if (diaSeleccionado!=null) {
        seleccionarFecha(diaSeleccionado);
    }
}
function seleccionarFecha(fecha) {
    $('#FechaBusquedaDisponiblidadesInp').val($(fecha).data('fecha'));
    $('#submitBusquedaDisponibilidades').click();
    var fechaActual = $(".DiaDisponibleSeleccionado");
    fechaActual.removeClass("DiaDisponibleSeleccionado");
    fechaActual.addClass("DiaDisponible");
    $(fecha).removeClass("DiaDisponible");
    $(fecha).addClass("DiaDisponibleSeleccionado");

    if (fecha.length > 0) {
        $("#dvFechas").scrollTop($('.DiaDisponibleSeleccionado').offset().top);
    }
    
}

function mostrarModalReserva() {
    limpiarPopUp();
    $("#reservarModal").modal('show');
}

function confirmarReservaLoad()
{
    

    $("#TipoFinanciadorDD").change(function () {
        CargarControlesTipoFinanciador();
    });
    CargarControlesTipoFinanciador();
}

function limpiarPopUp()
{
    var popup = document.getElementById("ContenedorReservaCita");
    if (popup!=null) {
        popup.innerHTML =("<div id='loadingReserva' class=' aletr ' style='display:none'><h5><img src='" + PormedAutonomo.Web.AgendarCita.UrlImagenLoading + "' />@PormedAutonomo.Infraestructura.Transversal.Global.Recursos.Language.Mensaje_Reservando</h5></div>");
    }
}
function CargarControlesTipoFinanciador() {
    switch ($("#TipoFinanciadorDD").val()) {
        case "0": //Empresa
            $("#tipoFinanciadorEmpresaContainer").removeClass("hidden");
            $("#tipoFinanciadorParticularContainer").addClass("hidden");
            break;
        case "1": //Particular
            $("#tipoFinanciadorEmpresaContainer").addClass("hidden");
            $("#tipoFinanciadorParticularContainer").removeClass("hidden");
            break;
        default:
            break;
    }
}

function ReservaCompletada(mensaje) {
    $('#reservarModal').modal('hide');
    document.getElementById("mensajeConfirmacion").innerHTML = mensaje;
    $('#ConfirmacionModal').modal('show');
   
  // usuariosTable.ajax.reload();
  // if (mensaje != null && mensaje != '') {
  //     document.getElementById("mensajeResultados").innerHTML = mensaje;
  //     $("#mensajeResultadosContainer").removeClass('hidden');
  // }
}
function AceptarConfirmacionBtnClick()
{
    $('#ConfirmacionModal').modal('hide');
    window.location = PormedAutonomo.Web.AgendarCita.UrlMisCitas;
}
// Mostrar mensaje de error cuando no hay disponibilidad.

function errorDisponibilidad(msg) {
    $('#mensajeErrorGeneralContainer').removeClass('hidden');
    $("#mensajeErrorGeneral").text(msg);
    document.getElementById("mensajeErrorGeneral").innerHTML = msg;
    var disponibilidades = $('#DisponibilidadesContenedor');
    if (disponibilidades != null) {
        disponibilidades.empty();
    }
};