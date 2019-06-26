

(function () {
	//Create the connector
	var myConnector = tableau.makeConnector();

	myConnector.getSchema = function (schemaCallback) {
		var cols = [{
			id: "basisregistratie",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "bronhoudernaam",
			alias: "bronhoudernaam",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "locatieLink",
			alias: "locatielink",
			dataType: tableau.dataTypeEnum.string
		},
			{
			id: "bronhoudercode",
			alias: "bronhoudercode",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "meldingsNummer",
			alias: "meldingsnummer",
			dataType: tableau.dataTypeEnum.int
		}, {
			id: "status",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "omschrijving",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "tijdstipRegistratie",
			alias: "Date registratie",
			dataType: tableau.dataTypeEnum.datetime
		},
			{
			id: "tijdstipStatusWijziging",
			alias: "Date status wijziging",
			dataType: tableau.dataTypeEnum.datetime
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
		$.getJSON("https://leonhertgers.github.io/Live-Data-in-een-dashboard/terugmeldingen (1).json", function(resp) {
		//	$.getJSON("https://api.acceptatie.kadaster.nl/tms/v1/terugmeldingen?apikey=l71c0911dd8fe14be1abba40a2f4ba3e69", function(resp) {

				var feat = resp.features;
			tableData = [];
			proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");

			// Iterate over the JSON object
			for (var i = 0, len = feat.length; i < len; i++) {
        //        var dateFormat = "YYYY-MM-DD";
			//	var dateFormat = 'MMMM Do YYYY, h:mm:ss a';
				var dateFormat = "Y-MM-DD HH:mm:ss";
				var tijdstipStatuswijziging = moment(feat[i].properties.tijdstipStatusWijziging).format(dateFormat);
				var registratie = moment(feat[i].properties.tijdstipRegistratie).format(dateFormat);
				var coordRD = feat[i].geometry.coordinates;
				var coordWGS =  proj4('EPSG:28992', 'WGS84', coordRD);
				var geoJson = '{"type":"Point","coordinates":' + JSON.stringify(coordWGS) + '}';
				var wkt_data = new Wkt.Wkt();
				wkt_data.read(geoJson);
				console.log(wkt_data);
				tableData.push({
					"basisregistratie": feat[i].properties.basisregistratie,
					"bronhoudernaam": feat[i].properties.bronhoudernaam,
					"locatieLink" : feat[i].properties.locatieLink,
					"bronhoudercode": feat[i].properties.bronhoudercode,
					"meldingsNummer": feat[i].properties.meldingsNummer,
					"tijdstipRegistratie": registratie,
					"tijdstipStatusWijziging":
						(function() {
                        if (typeof feat[i].tijdstipStatusWijziging == null) {
							return moment("");
                        } else { return tijdstipStatuswijziging;
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




