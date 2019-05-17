import {reproject} from "reproject"

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
		}, {	id: "geometry",
                        alias: "geographical location",
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
		$.getJSON("https://leonhertgers.github.io/live-data-in-een-dashboard/data.json", function(resp) {
//               $.getJSON("https://api.acceptatie.kadaster.nl/tms/v1/terugmeldingen?apikey=l71c0911dd8fe14be1abba40a2f4ba3e69", function(resp) {
			var feat = resp.features,
				tableData = [];

			// Iterate over the JSON object
			for (var i = 0, len = feat.length; i < len; i++) {
				
				tableData.push({
					"basisregistratie": feat[i].properties.basisregistratie,
					"bronhoudernaam": feat[i].properties.bronhoudernaam,
					"status": feat[i].properties.status,
					"geometry": feat[i].properties.geometry | reproject --use-epsg-io --from=EPSG:28992 --to=EPSG:4326

				});
			}

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
