(function () {
	//Create the connector
    var myConnector = tableau.makeConnector();

	myConnector.getSchema = function (schemaCallback) {
		var cols = [{
			id: "basisregistratie",
			dataType: tableau.dataTypeEnum.string
		},  {
			id: "bronhoudernaam",
			alias: "bronhoudernaam",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "status",
			dataType: tableau.dataTypeEnum.string
		}, {
            id: "location",
            dataType: tableau.dataTypeEnum.geometry
		}, {
			id: "meldingsNummer",
			datatype: tableau.dataTypeEnum.int
		}, {
			id: "tijdstipRegistratie",
			datatype: tableau.dataTypeEnum.dateTime
		}

		];

		var tableSchema = {
			id: "Terugmelddata",
			columns: cols
		};

		schemaCallback([tableSchema]);
	};

	//download the data
	myConnector.getData = function(table, doneCallback) {
		$.getJSON("https://leonhertgers.github.io/Live-Data-in-een-dashboard/data.json", function(resp) {
			var feat = resp.features;
			tableData = [];
			proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");

            // Iterate over the JSON object
			for (var i = 0, len = feat.length; i < len; i++) {
			//	var dateFormat = "DD-MM-YYYY";
			//	var tijdstipRegistratie = moment(feat[i].tijdstipRegistratie.value).format(dateFormat);

                var coordRD = feat[i].geometry.coordinates;
                var coordWGS =  proj4('EPSG:28992', 'WGS84', coordRD);
                var geoJson = '{"type":"Point","coordinates":' + JSON.stringify(coordWGS) + '}';
                var wkt_data = new Wkt.Wkt();
                wkt_data.read(geoJson);
                console.log(wkt_data);


				tableData.push({
					"basisregistratie": feat[i].properties.basisregistratie,
					"bronhoudernaam": feat[i].properties.bronhoudernaam,
					"status": feat[i].properties.status,
                    "location": wkt_data.toJson(),
					"meldingsNummer": feat[i].properties.meldingsNummer,
				//	"tijdstipRegistratie": tijdstipRegistratie
				});
			}
            tableau.log(tableData);

			table.appendRows(tableData);
			doneCallback();
		});
	};

    tableau.registerConnector(myConnector);
})();

$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "BAG Terugmelddata";
        tableau.submit();
    });
});
