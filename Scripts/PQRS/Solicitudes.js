$(document).ready(function () {

	var token = ObtenerToken();
	ConsultarAreas(token);
	ConsultarTiposSolcitud(token);
});

//Obtener token Servicio Web
function ObtenerToken() {
	var respuestaToken = null;

	var dataJSON = {
		"ClienteId": "sample string 1",
		"ClienteLlave": "AD64KCYPIWKQ0KPVO2FC"
	}

	$.ajax({
		type: 'POST',
		url: urlPQRS+"Token",
		data: JSON.stringify(dataJSON),
		crossDomain: true,
		contentType: 'application/json',
		dataType: 'json',
		async: false,
		success: function (data) {
			respuestaToken = data;
		},
		error: function () {
			respuestaToken = null;
		},
	});

	return respuestaToken;
}

//Obtener listado de Areas
function ConsultarAreas(token) {
	$.ajax({
		type: 'GET',
		url: urlPQRS+"Solicitudes/Areas",
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", token);
		},
		crossDomain: true,
		contentType: 'application/json',
		dataType: 'json',
		success: function (data) {
			$("#listAreas").append("<option value=''></option>")
			$.each(data.Resultado, function (Resultado, row) {
				$("#listAreas").append("<option value='" + row.AreaSolicitudId + "'>" + row.Nombre + "</option>")
			});
		}
	});
}

//Consultar Tipos de Solicitud
function ConsultarTiposSolcitud(token) {
	$.ajax({
		type: 'GET',
		url: urlPQRS+"Solicitudes/TiposSolicitud",
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", token);
		},
		crossDomain: true,
		contentType: 'application/json',
		dataType: 'json',
		success: function (data) {
			$("#listTipos").append("<option value=''></option>")
			$.each(data.Resultado, function (Resultado, row) {
				$("#listTipos").append("<option value='" + row.Id + "'>" + row.Nombre + "</option>")
			});
		}
	});
}

//Enviar Solicitud
function EnviarSolicitud() {	
	if (ValidarDatosObligatorios()) {
		var token = ObtenerToken();

		var dataJSON = {
			//SolicitudId: 0,
			//Estado: 0,
			Comentario: $("#txtComentario").val(),
			Correo: $("#txtCorreo").val(),
			Telefono: $("#txtTelefono").val(),
			//Celular: $("#txtCelular").val(),
			AreaSolicitudId: $("#listAreas option:selected").val(),
			TipoSolicitud: $("#listTipos option:selected").val(),
			Usuario: {
				NumeroIdentificacion: $("#numeroIdentificacion").val(),
				TipoIdentificacion: {
					NombreCorto: $("#nombreCortoTipoIdentificacion").val()
				},
				Nombres: $("#nombres").val(),
				Apellidos: $("#apellidos").val(),
			},
			AplicacionSolicitud: {
				Nombre: "Pormed"
			}
		}

		$.ajax({
			type: 'POST',
			url: urlPQRS+"Solicitudes",
			beforeSend: function (request) {
				request.setRequestHeader("Authorization", token);
				$("#loader").show();
			},
			data: JSON.stringify(dataJSON),
			crossDomain: true,
			contentType: 'application/json',
			dataType: 'json',
			//async: false,
			success: function (data) {
				$("#loader").hide();
				if (data != null) {
					document.getElementById("mensajeResultados").innerHTML = data.Mensaje;
					$("#mensajeResultadosContainer").removeClass('hidden');
				}

				$("#txtComentario").val('');
				$("#listAreas").val('');
				$("#listTipos").val('');

			},
			error: function (data) {
				$("#loader").hide();
				document.getElementById("mensajeResultados").innerHTML = 'Se presentó un error';
				$("#mensajeResultadosContainer").removeClass('hidden');
			},
		});
	}
}

//Validacion de campos obligatorios
function ValidarDatosObligatorios() {

	var respuesta = true;

	$("#validacionArea").hide();
	$("#validacionTipo").hide();
	$("#validacionCorreo").hide();
	$("#validacionComentario").hide();

	if ($("#listAreas option:selected").val().trim() == "") {
		$("#validacionArea").show();
		respuesta = false;
	}
	if ($("#listTipos option:selected").val().trim() == "") {
		$("#validacionTipo").show();
		respuesta = false;
	}
	if ($("#txtCorreo").val().trim() == "") {
		$("#validacionCorreo").show();
		respuesta = false;
	}
	if ($("#txtComentario").val().trim() == "") {
		$("#validacionComentario").show();
		respuesta = false;
	}

	if ($("#nombres").val() == "" || $("#apellidos").val() == "" || $("#numeroIdentificacion").val() == "" || $("#nombreCortoTipoIdentificacion").val() == "") {
		repuesta = false;
	}

	return respuesta;
}


