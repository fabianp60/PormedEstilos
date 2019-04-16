$(document).ready(function () {

	var sPageURL = window.location.search.substring(1);


	var sURLVariables = sPageURL.split('&');
	var sParam = 'casoId';
	var casoId;

	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			casoId = sParameterName[1];
		}
	}

	var token = ObtenerToken();
	ConsultarDetalleCaso(token, casoId);

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
		url: urlPQRS + "Token",
		data: JSON.stringify(dataJSON),
		crossDomain: true,
		contentType: 'application/json',
		dataType: 'json',
		async: false,
		success: function (data) {
			respuestaToken = data;
		},
		error: function (data) {
			respuestaToken = null;
		},
	});

	return respuestaToken;
}

//Obtener detalle caso
function ConsultarDetalleCaso(token, casoId) {
	$.ajax({
		type: 'GET',
		url: urlPQRS + "Solicitudes/Caso/?casoId=" + casoId,
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", token);
		},
		crossDomain: true,
		contentType: 'application/json',
		dataType: 'json',
		success: function (data) {
			if (data.Exitoso) {

				$("#txtSolicitudId").val(data.Resultado.SolicitudId);
				document.getElementById('txtSolicitudId').innerHTML = data.Resultado.SolicitudId;
				document.getElementById('txtTiposSolicitud').innerHTML = tipoSolicitud(data.Resultado.TiposSolicitud);
				document.getElementById('txtAreaSolicitud').innerHTML = data.Resultado.AreaSolicitud.Nombre;
				document.getElementById('txtTiposEstadoCaso').innerHTML = tipoEstado( data.Resultado.TiposEstadoCaso);
				document.getElementById('txtFechaRegistro').innerHTML = formatoFecha(data.Resultado.FechaRegistro);
				document.getElementById('txtCorreo').innerHTML = data.Resultado.Correo;
				document.getElementById('txtTelefono').innerHTML = data.Resultado.Telefono;
				document.getElementById('txtComentario').innerHTML = data.Resultado.Comentario;

				for (var i = 0; i < data.Resultado.SeguimientosSolicitudes.length; i++) {
					var div = document.createElement("div");
					if (data.Resultado.SeguimientosSolicitudes[i].RespuestaUsuario == 1) {
						div.className = "hhistorialpaciente";
					}
					else {
						div.className = "hhistorial";
					}
					
					var br = document.createElement("br");
					var para1 = document.createElement("p");
					var para2 = document.createElement("p");
					var para3 = document.createElement("p");
					var node1 = document.createTextNode(formatoFecha(data.Resultado.SeguimientosSolicitudes[i].Fecha));
					var node2 = document.createTextNode(recursoAgente + ": " + data.Resultado.SeguimientosSolicitudes[i].Usuario.NombreCompleto);
					var node3 = document.createTextNode(recursoComentario + ": " + data.Resultado.SeguimientosSolicitudes[i].Respuesta);
					para1.appendChild(node1);
					para2.appendChild(node2);
					para3.appendChild(node3);
					div.appendChild(para1);
					div.appendChild(para2);
					div.appendChild(para3);
					var element = document.getElementById("divHistorial");
					element.appendChild(div);
					element.appendChild(br);
				}

				if (data.Resultado.Estado != 3 && data.Resultado.RequiereInformacion == 1) {
					document.getElementById("enviarInformacion").style.visibility = "visible";
				}

			}
		},
		error: function (data) {
			alert("error: " + data);
		},
	});
}

//Enviar comentario del paciente
function enviarComentario() {
	if (ValidarDatosObligatorios()) {
		var token = ObtenerToken();

		var dataJSON = {
			SolicitudId: $("#txtSolicitudId").val(),
			Respuesta: $("#txtComentarioNuevo").val(),
		}

		$.ajax({
			type: 'POST',
			url: urlPQRS + "Solicitudes/Respuesta",
			beforeSend: function (request) {
				request.setRequestHeader("Authorization", token);
			},
			data: JSON.stringify(dataJSON),
			crossDomain: true,
			contentType: 'application/json',
			dataType: 'json',
			async: false,
			success: function (data) {
				if (data != null) {
					document.getElementById("mensajeResultados").innerHTML = data.Mensaje;
					$("#mensajeResultadosContainer").removeClass('hidden');
					location.reload();
				}

				$("#txtComentario").val('');

			},
			error: function (data) {
				document.getElementById("mensajeResultados").innerHTML = 'Se presentó un error';
				$("#mensajeResultadosContainer").removeClass('hidden');
			},
		});
	}
}


//Validacion de campos obligatorios
function ValidarDatosObligatorios() {
	var respuesta = true;

	$("#validacionComentario").hide();

	if ($("#txtComentarioNuevo").val().trim() == "") {
		$("#validacionComentario").show();
		respuesta = false;
	}

	if ($("#txtSolicitudId").val() == "" ) {
		repuesta = false;
	}

	return respuesta;
}

function formatoFecha(fechaString) {
	var fecha = new Date(fechaString);
	var dd = fecha.getDate();
	var mm = fecha.getMonth() + 1; //January is 0!
	var yyyy = fecha.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	return dd + '/' + mm + '/' + yyyy;
}

function tipoEstado(estadoId) {
	switch (estadoId) {
		case 1:
			return "Sin Asignar";
		case 2:
			return "En Proceso";
		case 3:
			return "Finalizado";
	}
}

function tipoSolicitud(tipoSolicitud) {
	switch (tipoSolicitud) {

		case 1:
			return "Peticion";
		case 2:
			return "Queja";
		case 3:
			return "Reclamo";
		case 4:
			return "Solicitud";
	}
}





