(function () {
	//Create the connector
	var myConnector = tableau.makeConnector();


	//the fields I surely need are:
	// - tijdstipStatusWijziging
	// - tijdstipWijziging
	// - tijdstipRegistratie
	// - meldingsnummer

	myConnector.getSchema = function (schemaCallback) {
		var cols = [{
			id: "basisregistratie",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "bronhoudernaam",
			alias: "bronhoudernaam",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "bronhoudercode",
			alias: "bronhoudercode",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "meldingsnummer",
			alias: "meldingsnummer",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "status",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "omschrijving",
			alias: "Description",
			dataType: tableau.dataTypeEnum.string
		},
			//{
		//	id: "tijdstipRegistratie",
		//	alias: "time 2",
		//	dataType: tableau.dataTypeEnum.date
	//	},
			{
			id: "tijdstipStatusWijziging",
			alias: "Status Wijziging",
			dataType: tableau.dataTypeEnum.date
		}, {
			id: "location",
			dataType: tableau.dataTypeEnum.geometry
		}];

		var tableSchema = {
			id: "Terugmelddata",
			alias: "Test",
			columns: cols
		};

		schemaCallback([tableSchema]);
	};

	//download the data
	myConnector.getData = function(table, doneCallback) {
		$.getJSON("https://stanronzhin.github.io/terugmeld/data.json", function(resp) {
			var feat = resp.features;
			tableData = [];
			proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");

			// Iterate over the JSON object
			for (var i = 0, len = feat.length; i < len; i++) {
                var dateFormat = "YYYY-MM-DD";
                var tijdstipStatuswijziging = moment(feat[i].tijdstipStatusWijziging).format(dateFormat);

				var coordRD = feat[i].geometry.coordinates;
				var coordWGS =  proj4('EPSG:28992', 'WGS84', coordRD);
				var geoJson = '{"type":"Point","coordinates":' + JSON.stringify(coordWGS) + '}';
				var wkt_data = new Wkt.Wkt();
				wkt_data.read(geoJson);
				console.log(wkt_data);
				tableData.push({
					"basisregistratie": feat[i].properties.basisregistratie,
					"bronhoudernaam": feat[i].properties.bronhoudernaam,
					"bronhoudercode": feat[i].properties.bronhoudercode,
					"meldingsnummer": feat[i].properties.meldingsNummer,
			//		"tijdstipRegistratie": tijdstipRegistratie,
					"tijdstipStatusWijziging":
						(function() {
                        if (typeof tijdstipStatuswijziging.isValid()) {
							return tijdstipStatuswijziging;
                        } else { return moment("");
                        }})(),
					"status": feat[i].properties.status,
					"omschrijving": feat[i].properties.omschrijving,
					"location": wkt_data.toJson()
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




