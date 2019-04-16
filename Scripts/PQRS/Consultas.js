var casosTable;

$(document).ready(function () {

	var token = ObtenerToken();
	ConsultarCasos(token);
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

//Obtener listado de Casos
function ConsultarCasos(token) {
	var dataSolicitudes = null;
	var numeroIdentificacion = $("#numeroIdentificacion").val();
	var tipoIdentificacion = $("#nombreCortoTipoIdentificacion").val();

	$.ajax({
		type: 'GET',
		url: urlPQRS + "Solicitudes/Casos?numeroIdentificacion=" + numeroIdentificacion + "&tipoIdentificacion=" + tipoIdentificacion,
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", token);
		},
		crossDomain: true,
		contentType: 'application/json',
		dataType: 'json',
		async: false,
		success: function (data) {
			dataSolicitudes = data;
		},
		error: function (data) {
			alert("error: " + data);
		},
	});

	if (dataSolicitudes != null) {
		casosTable = $('#casosTable').DataTable({
			"processing": true,
			"serverSide": false,
			"language": {
				"url": urlLocalizacion
			},
			data: dataSolicitudes,
			columns: [
				{ data: 'SolicitudId' },
				{ data: '' },
				{ data: 'AreaSolicitud.Nombre' },
				{ data: '' },
				{ data: '' },
				{ data: '' },
				{
					"targets": -1,
					"data": null,

					"defaultContent": "<button onclick='DetalleCaso(this)'><img src='../../Content/Imagenes/im_buscar.png'/></button>"
				}
			],
			"columnDefs": [
				{
					"render": function (data, type, row) {
						switch (row.TipoSolicitud) {

							case 1:
								return "Peticion";
							case 2:
								return "Queja";
							case 3:
								return "Reclamo";
							case 4:
								return "Solicitud";
						}
					},
					"targets": 1
				},
				{
					"render": function (data, type, row) {

						var fecha = new Date(row.FechaRegistro);
						var dd = fecha.getDate();
						var mm = fecha.getMonth() + 1;
						var yyyy = fecha.getFullYear();
						if (dd < 10) {
							dd = '0' + dd;
						}
						if (mm < 10) {
							mm = '0' + mm;
						}
						return dd + '/' + mm + '/' + yyyy;
					},
					"targets": 3
				},
				{
					"render": function (data, type, row) {
						switch (row.Estado) {
							case 1:
								return "Sin Asignar";
							case 2:
								return "En Proceso";
							case 3:
								return "Finalizado";
						}
					},
					"targets": 4
				},
				{
					"render": function (data, type, row) {
						switch (row.RequiereInformacion) {
							case 1:
								return "Si";
							default:
								return "No";
							
						}
					},
					"targets": 5
				},
			]
		});
	}

	

}

function DetalleCaso(e) {
	var dataRow = casosTable.row($(e).parents('tr')).data();

	window.location.href = '/0/PQRS/Detalle?casoId=' + dataRow.SolicitudId;
}

//Error en la tabla
function errorTabla() {
	alert("Error tabla");

}

