//funcionalidades tomas de medicamentos del paciente
var fechaActualSemana = "";
//carga la semana actual por defecto
function TomasMedicamento(paciente) {

    //html de esperar carga
    var cargando = $("#esperarTomaMedicamento").html();
    //permite cargar los medicamentos de la semana actual
    $("#MedicamentosPacienteModal").on('shown.bs.modal', function (e) {

        $('#medicamentosPacienteItem').empty();
        $('#medicamentosPacienteItem').html(cargando);
        fechaActualSemana =  convertDate(new Date().toUTCString());
        $.get(PormedAutonomo.Web.AtencionCitas.URLTableroTomasMedicamentoPaciente, {
            page: 1,
            pageSize: 0,
            pacienteId: paciente,
            fecha: convertDate(new Date().toUTCString())
        }, function (data) {
            $('#medicamentosPacienteItem').empty();
            $('#medicamentosPacienteItem').html(data);
            SemanaAtras(paciente, cargando);
            VerDetalleTomaMedicamento(paciente, cargando);
            OtrosMedicamentos(paciente, cargando);
            TeclasCursorCalendario();
            console.clear();
        });

    })
}

function OtrosMedicamentos(paciente, cargando) {
    $("#otrosmedicamentos").unbind();
    $("#otrosmedicamentos").click(function (e) {
        $('#medicamentosPacienteItem').empty();
        $('#medicamentosPacienteItem').html(cargando);
        $.get(PormedAutonomo.Web.AtencionCitas.URLOtrosMedicamentos, {
            page: 1,
            pageSize: 0,
            pacienteId: paciente,
        }, function (data) {
            
            $('#medicamentosPacienteItem').empty();
            $('#medicamentosPacienteItem').html(data);
            RegresarSemana(paciente, cargando);
            TeclasCursorDiaCalendario();
            console.clear();
        });
    });
  

}

//permite ir una semana atras de la tomas de medicamento actual
function SemanaAtras(paciente, cargando) {
    $("#samanaatras").unbind();
    $("#samanaatras").click(function () {
        
        $('#medicamentosPacienteItem').empty();
        $('#medicamentosPacienteItem').html(cargando);

        var fechaatras = $(this).attr('date-dia');
        fechaActualSemana = fechaatras;
        $.get(PormedAutonomo.Web.AtencionCitas.URLTableroTomasMedicamentoPaciente, {
            page: 1,
            pageSize: 0,
            pacienteId: paciente,
            fecha: fechaatras
        }, function (data) {
            $('#medicamentosPacienteItem').empty();
            $('#medicamentosPacienteItem').html(data);
            SemanaAtras(paciente, cargando);
            SemanaSiguiente(paciente, cargando);
            OtrosMedicamentos(paciente, cargando);
            VerDetalleTomaMedicamento(paciente, cargando);
            TeclasCursorCalendario();
            console.clear();
        });
    });

}

//permite ir una semana mas adelante de la tomas de medicamento actual
function SemanaSiguiente(paciente, cargando) {
    $("#samanasiguiente").unbind();
    $("#samanasiguiente").click(function () {
        
        $('#medicamentosPacienteItem').empty();
        $('#medicamentosPacienteItem').html(cargando);

        var fechasiguiente = $(this).attr('date-dia');
        fechaActualSemana = fechasiguiente;

        $.get(PormedAutonomo.Web.AtencionCitas.URLTableroTomasMedicamentoPaciente, {
            page: 1,
            pageSize: 0,
            pacienteId: paciente,
            fecha: fechasiguiente
        }, function (data) {
            $('#medicamentosPacienteItem').empty();
            $('#medicamentosPacienteItem').html(data);
            SemanaAtras(paciente, cargando);
            SemanaSiguiente(paciente, cargando);
            OtrosMedicamentos(paciente, cargando);
            VerDetalleTomaMedicamento(paciente, cargando);
            TeclasCursorCalendario();
            console.clear();
        });
    });
}

//evento que permite ver el detalle de la toma de medicamento
function VerDetalleTomaMedicamento(paciente, cargando) {
    $('.diatoma').unbind();
    $('.diatoma').click(function (e) {
        DetalleTomaMedicamento($(this).attr('data-medicamentoPaciente'), paciente, $(this).attr('data-fecha'), cargando)
    });
}

//muestra el detalle de una toma de medicamento
function DetalleTomaMedicamento(medicamentoPaciente, paciente, fechaDia, cargando) {

    $('#medicamentosPacienteItem').empty();
    $('#medicamentosPacienteItem').html(cargando);
    $.get(PormedAutonomo.Web.AtencionCitas.URLDetalleTomasMedicamentoPaciente, {
        medicamentoPacienteId: medicamentoPaciente,
        fecha: fechaDia
    }, function (data) {
        $('#medicamentosPacienteItem').empty();
        $('#medicamentosPacienteItem').html(data);
        CarbiarDiaDetalleTomaMedicamento(medicamentoPaciente, paciente, cargando);
        RegresarSemana(paciente, cargando);
        TeclasCursorDiaCalendario();
        fechaActualSemana = fechaDia;
        console.clear();
    });
}

//eventos de ir un dia anterior o un dia siguiente del detalle de la toma
function CarbiarDiaDetalleTomaMedicamento(medicamentoPaciente, paciente, cargando) {

    $("#diaSiguiente").unbind();
    $("#diaSiguiente").click(function (e) {
        DetalleTomaMedicamento(medicamentoPaciente, paciente, $(this).attr('data-fecha'), cargando);
    });

    $("#diaAnterior").unbind();
    $("#diaAnterior").click(function (e) {
        DetalleTomaMedicamento(medicamentoPaciente, paciente, $(this).attr('data-fecha'), cargando);
    });

}

//funcion que permite cerrar el detalle de la toma de medicamento y regresar a la vista de la semana
function RegresarSemana(paciente, cargando) {
    $("#regresar").unbind();
    $("#regresar").click(function (e) {
        $('#medicamentosPacienteItem').empty();
        $('#medicamentosPacienteItem').html(cargando);
        $.get(PormedAutonomo.Web.AtencionCitas.URLTableroTomasMedicamentoPaciente, {
            page: 1,
            pageSize: 0,
            pacienteId: paciente,
            fecha: fechaActualSemana
        }, function (data) {
            $('#medicamentosPacienteItem').empty();
            $('#medicamentosPacienteItem').html(data);
            SemanaAtras(paciente, cargando);
            SemanaSiguiente(paciente, cargando);          
            OtrosMedicamentos(paciente, cargando);
            VerDetalleTomaMedicamento(paciente, cargando);
            TeclasCursorCalendario();
            console.clear();
        });
    });
}

//permite cambiar de semanas o el dia con las teclas de cursor
function TeclasCursorCalendario() {
    $("#diaAnterior").unbind();
    $("#diaSiguiente").unbind();
    $("#regresar").unbind();
    $(document).keyup(function (e) {
        if (e.which == 37) {

            $("#samanaatras").click();
        }
        if (e.which == 39) {
            $("#samanasiguiente").click();
        }
    });
}

function TeclasCursorDiaCalendario() {
    $("#samanaatras").unbind();
    $("#samanasiguiente").click();
    $(document).keyup(function (e) {
        if (e.which == 37) {
            $("#diaAnterior").click();
        }
        if (e.which == 39) {
            $("#diaSiguiente").click();
        }
        if (e.keyCode == 27) {
            $("#regresar").click();
        }
    });
}

///efectos secundarios
var paginaEfecto = 1;
function EfectosSecundarios(paciente) {
    //html de esperar carga
    var cargando = $("#esperarefectosMedicamento").html();
    //permite cargar los medicamentos de la semana actual
    $("#EfectosPacienteModal").on('shown.bs.modal', function (e) {
        paginaEfecto = 1;
        ConsultarEfectosSecundarios(cargando, paciente);
    });

}

//esta funcion permite cambiar de pagina de en la consulta de efectos secundarios
function CambiarPaginaEfectos(cargando, paciente) {
    $("#paginaefectosiguiente").unbind();
    $("#paginaefectoanterior").unbind();
    $("#paginaefectosiguiente").click(function () {
        var paginactual = $("#tbefectos").attr('data-pagina');
        paginaEfecto = parseInt(paginactual) + 1;
        ConsultarEfectosSecundarios(cargando, paciente);
    });
    $("#paginaefectoanterior").click(function () {
        var paginactual = $("#tbefectos").attr('data-pagina');
        if ((parseInt(paginactual) - 1) < 1) {
            paginaEfecto = 1;
        }
        else {
            paginaEfecto = parseInt(paginactual) - 1;
            ConsultarEfectosSecundarios(cargando, paciente);
        }
        
    });
}

//consultar los efectos secundarios
function ConsultarEfectosSecundarios(cargando, paciente) {
    $('#efectosPacienteItem').empty();
    $('#efectosPacienteItem').html(cargando);
    $.get(PormedAutonomo.Web.AtencionCitas.URLEfectosSecundariosPaciente, {
        page: paginaEfecto,
        pageSize: 10,
        pacienteId: paciente,

    }, function (data) {
        $('#efectosPacienteItem').empty();
        $('#efectosPacienteItem').html(data);
        CambiarPaginaEfectos(cargando,paciente);
        console.clear();
    });
}


function convertDate(inputFormat) {
    
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    var fecha = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')+" "+pad(d.getHours())+":"+pad(d.getMinutes())+":"+pad(d.getSeconds());
    return fecha;
}