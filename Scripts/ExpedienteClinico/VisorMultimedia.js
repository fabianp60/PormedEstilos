
var lstArchivosGlobal;
var lstCategoriasGlobal;
var lstFechasGlobal;
var lstArchivosFiltradaGlobal;
var dataSourceCategoriasGlobal;
var dataSourceFechasGlobal;
var dataSourceArchivosGlobal;

var PormedAutonomo =
{
    Web: {
        VisorMultimedia: {
            ObtenerArchivos: "",
            ObtenerImagen: "",
            ObtenerVideo: "",
            ObtenerAudio: "",
            ObtenerDocumento: "",
        }
    }
};

/// <summary>
/// Evento al terminar de cargar la página
/// </summary>
$(document).ready(function () {
    Inicializar();
});

/// <summary>
/// Inicialización de valores
/// </summary>
function Inicializar() {

    $('#loadingBusqueda').removeClass('hidden');

    ($.getJSON(PormedAutonomo.Web.VisorMultimedia.ObtenerArchivos)
                                           .done(OnExitoObtenerArchivos)
                                           .fail(OnFalloObtenerArchivos)
                                            .complete(function () {
                                                $('#loadingBusqueda').addClass('hidden');
                                            }));

}

/// <summary>
/// Evento de éxito al obtener archivos desde el controlador
/// </summary>
/// <param name="result">Resultado obtenido en la consulta</param>
function OnExitoObtenerArchivos(result) {
    if (result.Exitoso && result.Resultado.length != 0) {

        $("#ContainerResultados").removeClass('hidden');

        lstArchivosGlobal = Enumerable.From(result.Resultado);
        lstCategoriasGlobal = lstArchivosGlobal.Select(function (a) { return a.Episodio.DescripcionEpisodio; }).Distinct().Select(function (c) { return { categoria: c }; }).ToArray();
        
        dataSourceCategoriasGlobal = new kendo.data.DataSource({
            data: lstCategoriasGlobal,
            pageSize: 10
        });

        $("#pagerLstCategoriasContainer").kendoPager({
            dataSource: dataSourceCategoriasGlobal,
            previousNext: true,
            messages: {
                display: $('#Etiqueta_PaginacionKendo').text(),
                empty: $('#Etiqueta_PaginacionVacioKendo').text()
            }
        });

        $("#LstCategoriasContainer").kendoListView({
            dataSource: dataSourceCategoriasGlobal,
            selectable: 'selectable',
            template: kendo.template($("#templateCategorias").html()),
            change: function (e) {
                CargarFechasXCategoria();
           } 
        });

        $("#CategoriasContainer").removeClass('hidden');

    }
    else {
        $("#ContainerNoResultados").removeClass('hidden');
    }
}

/// <summary>
/// Evento de error al obtener archivos desde el controlador
/// </summary>
/// <param name="result">Error obtenido en la consulta</param>
function OnFalloObtenerArchivos(error) {
    $("#mensajeResultados").text($("#lbErrorConexion")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");
}

/// <summary>
/// Evento al dar click en una categoría
/// </summary>
function CargarFechasXCategoria() {

    $('#loadingBusqueda').removeClass('hidden');

    LimpiarContenedorMultimedia();
    
    var nombreCategoria = $.map($("#LstCategoriasContainer").data("kendoListView").select(), function (item) {
        return dataSourceCategoriasGlobal.view()[$(item).index()].categoria;
    });

    lstArchivosFiltradaGlobal = Enumerable.From(lstArchivosGlobal.Where(function (x) { return x.Episodio.DescripcionEpisodio == nombreCategoria[0]; }).ToArray());

    
    var fechaAjustada = false;
    var Fechas = Enumerable.From(lstArchivosFiltradaGlobal.Select(function (a) {
        if (typeof a.Episodio.FechaGrabacion == "string")
        {
            
            return a.Episodio.FechaGrabacion;
        }
        else {
            fechaAjustada = true;
            return a.Episodio.FechaGrabacion.getTime();
        }

    }).Distinct().Select(function (f) {
        if (fechaAjustada)
        {
            return { fecha: new Date(f) };
        }
        else {
            return { fecha: f };
        }
        
    }).ToArray());
    AjustarFechas(Fechas);

    dataSourceFechasGlobal = new kendo.data.DataSource({
        data: lstFechasGlobal,
        pageSize: 10
    });

    $("#pagerLstFechasContainer").kendoPager({
        dataSource: dataSourceFechasGlobal,
        previousNext: true,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        }
    });

    $("#LstFechasContainer").kendoListView({
        dataSource: dataSourceFechasGlobal,
        selectable: 'selectable',
        template: kendo.template($("#templateFechas").html()),
        change: function (e) {
            CargarDocumentosXFechaXCategoria();
        }
    });

    $("#FechasContainer").removeClass('hidden');

    $('#loadingBusqueda').addClass('hidden');

}

/// <summary>
/// Permite ajustar las fechas a Date de JS y actualizar la lista lstFechasGlobal
/// </summary>
/// <param name="result">Listado de archivos filtrados por categoría</param>
function AjustarFechas(Fechas) {
    for (var i = 0; i < Fechas.Count() ; i++) {
        if (typeof Fechas.ElementAt(i).fecha == "string") {
            Fechas.ElementAt(i).fecha = new Date(parseInt(Fechas.ElementAt(i).fecha.replace("/Date(", "").replace(")/", ""), 10));
        }
    }
    lstFechasGlobal = Fechas.ToArray();

}

/// <summary>
/// Permite generar una copia de la lista lstArchivosFiltradaGlobal y ajustar las fechas a Date de JS
/// </summary>
/// <returns>Copia de la lista lstArchivosFiltradaGlobal con las fechas ajustadas</returns>
function AjustarFechasLstArchivos() {

    var lstArchivosFiltradaGlobalTemp = lstArchivosFiltradaGlobal;

    for (var i = 0; i < lstArchivosFiltradaGlobalTemp.Count() ; i++) {
        if (typeof lstArchivosFiltradaGlobalTemp.ElementAt(i).Episodio.FechaGrabacion == "string") {
            lstArchivosFiltradaGlobalTemp.ElementAt(i).Episodio.FechaGrabacion = new Date(parseInt(lstArchivosFiltradaGlobalTemp.ElementAt(i).Episodio.FechaGrabacion.replace("/Date(", "").replace(")/", ""), 10));
        }
    }

    return lstArchivosFiltradaGlobalTemp;

}

/// <summary>
/// Evento al dar click en una fecha
/// </summary>
function CargarDocumentosXFechaXCategoria() {

    $('#loadingBusqueda').removeClass('hidden');

    LimpiarContenedorMultimedia();

    var nombreCategoria = $.map($("#LstCategoriasContainer").data("kendoListView").select(), function (item) {
        return dataSourceCategoriasGlobal.view()[$(item).index()].categoria;
    });

    var fecha = $.map($("#LstFechasContainer").data("kendoListView").select(), function (item) {
        return dataSourceFechasGlobal.view()[$(item).index()].fecha;
    });

    var lstArchivosFiltradaGlobalFechasConv = AjustarFechasLstArchivos();

    var lstArchivosFiltradaGlobal = Enumerable.From(lstArchivosFiltradaGlobalFechasConv.Where(function (x) { return x.Episodio.FechaGrabacion.getTime() === fecha[0].getTime(); }).ToArray());

    dataSourceArchivosGlobal = new kendo.data.DataSource({
        data: lstArchivosFiltradaGlobal.ToArray(),
        pageSize: 10
    });

    $("#pagerLstDocumentosContainer").kendoPager({
        dataSource: dataSourceArchivosGlobal,
        previousNext: true,
        messages: {
            display: $('#Etiqueta_PaginacionKendo').text(),
            empty: $('#Etiqueta_PaginacionVacioKendo').text()
        }
    });

    $("#LstDocumentosContainer").kendoListView({
        dataSource: dataSourceArchivosGlobal,
        selectable: 'selectable',
        template: kendo.template($("#templateArchivos").html()),
        change: function (e) {
            CargarArchivo();
        }
    });

    $("#DocumentosContainer").removeClass('hidden');

    $('#loadingBusqueda').addClass('hidden');

}

/// <summary>
/// Evento al dar click en un Archivo
/// </summary>
function CargarArchivo() {

    $('#loadingCargando').removeClass('hidden');

    var archivoCodigo = $.map($("#LstDocumentosContainer").data("kendoListView").select(), function (item) {
        return dataSourceArchivosGlobal.view()[$(item).index()].ArchivoMultimediaCodigo;
    });

    var extensionArchivo = $.map($("#LstDocumentosContainer").data("kendoListView").select(), function (item) {
        return dataSourceArchivosGlobal.view()[$(item).index()].ExtensionArchivo;
    });

    var rutaArchivo = $.map($("#LstDocumentosContainer").data("kendoListView").select(), function (item) {
        return dataSourceArchivosGlobal.view()[$(item).index()].RutaArchivo;
    });

    LimpiarContenedorMultimedia();
    $('#DocumentosContainer').removeClass('hidden')

    if (extensionArchivo == "wma" || extensionArchivo == "mp3" || extensionArchivo == "AAC") {

        $("#audVisor")
                .on('load', function () { $('#loadingCargando').addClass('hidden'); })
                .on('error', function () {
                    $("#imgPrincipal").removeClass('hidden');
                    OnFalloCargaRecurso();
                })
                .attr('src', PormedAutonomo.Web.VisorMultimedia.ObtenerAudio.replace('-rutaArchivo-', rutaArchivo));

        $('#AudioContainer').removeClass('hidden');

    } else {
        if (extensionArchivo == "webm" || extensionArchivo == "mp4" || extensionArchivo == "ogv") {
                        
            $("#vidVisor")
                .on('load', function () { $('#loadingCargando').addClass('hidden'); })
                .on('error', function () {
                    $("#imgPrincipal").removeClass('hidden');
                    OnFalloCargaRecurso();
                })
                .attr('src', PormedAutonomo.Web.VisorMultimedia.ObtenerVideo.replace('-rutaArchivo-', rutaArchivo)).load(function () {

                    this.width;   // Note: $(this).width() will not work for in memory images

                });
            
            $('#VideoContainer').removeClass('hidden');

        } else {

            if (extensionArchivo == "pdf") {

                $("#docVisor")
                    .on('load', function () { $('#loadingCargando').addClass('hidden'); })
                    .on('error', function () {
                        $("#imgPrincipal").removeClass('hidden');
                        OnFalloCargaRecurso();
                    })
                    .attr('src', PormedAutonomo.Web.VisorMultimedia.ObtenerDocumento.replace('-rutaArchivo-', rutaArchivo)).load(function () {

                        this.width;   // Note: $(this).width() will not work for in memory images

                    });

                $("#docVisor").bind('error', function () {
                    $("#imgPrincipal").removeClass('hidden');
                    OnFalloCargaRecurso();
                })

                $('#DocumentsContainer').removeClass('hidden');
                

            } else {

                $("#imgVisor")
                    .on('load', function () { $('#ImagenContainer').removeClass('hidden'); $('#loadingCargando').addClass('hidden'); })
                    .on('error', function () {
                        $("#imgPrincipal").removeClass('hidden');
                        OnFalloCargaRecurso();
                    })
                    .attr('src', PormedAutonomo.Web.VisorMultimedia.ObtenerImagen.replace('-rutaArchivo-', rutaArchivo)).load(function () {

                        this.width;   // Note: $(this).width() will not work for in memory images

                    });

            }
        }
    }
    
}

/// <summary>
/// Evento de error cuando no es posible cargar un archivo
/// </summary>
function OnFalloCargaRecurso() {
    $("#mensajeResultados").text($("#lbErrorCargaRecurso")[0].innerText);
    $("#mensajeResultadosContainer").removeClass("hidden");

    LimpiarContenedorMultimedia();
}


function LimpiarContenedorMultimedia() {
    $("#imgPrincipal").attr('class', 'hidden');
    $('#ImagenContainer').attr('class', 'hidden');
    $('#VideoContainer').attr('class', 'hidden');
    $('#AudioContainer').attr('class', 'hidden');
    $('#loadingCargando').addClass('hidden');
    $('#DocumentsContainer').attr('class', 'hidden')
    $('#DocumentosContainer').addClass('hidden')
}