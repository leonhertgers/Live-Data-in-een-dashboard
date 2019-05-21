// import {index} from "./index.js";
//const reproj = require("./index.js");
//$.getScript("index.js");

// scriptLoader('./index.js');
//
//  function scriptLoader(path, callback)
//  {
// 	 var script = document.createElement('script');
// 	 script.type = "text/javascript";
// 	 script.async = true;
// 	 script.src = path;
// 	 script.onload = function(){
// 		 if(typeof(callback) == "function")
// 		 {
// 			 callback();
// 		 }
// 	 };
// 	 try
// 	 {
// 		 var scriptOne = document.getElementsByTagName('script')[0];
// 		 scriptOne.parentNode.insertBefore(script, scriptOne);
// 	 }
// 	 catch(e)
// 	 {
// 		 document.getElementsByTagName("head")[0].appendChild(script);
// 	 }
//  }

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
			id: "geometry",
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

	function RD2WGS84(x, y) {
		if (x < 1000) {
			x *= 1000;
		}
		if (y < 1000) {
			y *= 1000;
		}
		var invalidX = (x < 0 || x > 290000);
		if (invalidX) {
			alert("x must be between 0 and 290,000");
		}
		var invalidY = (y <290000 || y > 630000);
		if (invalidY) {
			alert("y must be between 290,000 and 630,000,");
		}
		if (!invalidX && !invalidY) {
			var latLng = DoTheMath(x,y);
			return latLng;
		}
	}

	function DoTheMath(x,y) {
		var x0  = 155000.000;
		var y0  = 463000.000;
		var f0 = 52.156160556;
		var l0 =  5.387638889;
		var a01=3236.0331637 ; var b10=5261.3028966;
		var a20= -32.5915821 ; var b11= 105.9780241;
		var a02=  -0.2472814 ; var b12=   2.4576469;
		var a21=  -0.8501341 ; var b30=  -0.8192156;
		var a03=  -0.0655238 ; var b31=  -0.0560092;
		var a22=  -0.0171137 ; var b13=   0.0560089;
		var a40=   0.0052771 ; var b32=  -0.0025614;
		var a23=  -0.0003859 ; var b14=   0.0012770;
		var a41=   0.0003314 ; var b50=   0.0002574;
		var a04=   0.0000371 ; var b33=  -0.0000973;
		var a42=   0.0000143 ; var b51=   0.0000293;
		var a24=  -0.0000090 ; var b15=   0.0000291;

		var dx=(x-x0)*<span class="skimlinks-unlinked">Math.pow(10,-5</span>);
	var dy=(y-y0)*<span class="skimlinks-unlinked">Math.pow(10,-5</span>);

	var df =a01*dy + a20*<span class="skimlinks-unlinked">Math.pow(dx,2</span>) + a02*<span class="skimlinks-unlinked">Math.pow(dy,2</span>) + a21*<span class="skimlinks-unlinked">Math.pow(dx,2)*dy</span> + a03*<span class="skimlinks-unlinked">Math.pow(dy,3</span>);
	df+=a40*<span class="skimlinks-unlinked">Math.pow(dx,4</span>) + a22*<span class="skimlinks-unlinked">Math.pow(dx,2)*Math.pow(dy,2</span>) + a04*<span class="skimlinks-unlinked">Math.pow(dy,4</span>) + a41*<span class="skimlinks-unlinked">Math.pow(dx,4)*dy</span>;
	df+=a23*<span class="skimlinks-unlinked">Math.pow(dx,2)*Math.pow(dy,3</span>) + a42*<span class="skimlinks-unlinked">Math.pow(dx,4)*Math.pow(dy,2</span>) + a24*<span class="skimlinks-unlinked">Math.pow(dx,2)*Math.pow(dy,4</span>);
	var f = f0 + df/3600;

	var dl =b10*dx +b11*dx*dy +b30*<span class="skimlinks-unlinked">Math.pow(dx,3</span>) + b12*dx*<span class="skimlinks-unlinked">Math.pow(dy,2</span>) + b31*<span class="skimlinks-unlinked">Math.pow(dx,3)*dy</span>;
	dl+=b13*dx*<span class="skimlinks-unlinked">Math.pow(dy,3)+b50*Math.pow(dx,5</span>) + b32*<span class="skimlinks-unlinked">Math.pow(dx,3)*Math.pow(dy,2</span>) + b14*dx*<span class="skimlinks-unlinked">Math.pow(dy,4</span>);
	dl+=b51*<span class="skimlinks-unlinked">Math.pow(dx,5)*dy</span> +b33*<span class="skimlinks-unlinked">Math.pow(dx,3)*Math.pow(dy,3</span>) + b15*dx*<span class="skimlinks-unlinked">Math.pow(dy,5</span>);
	var l = l0 + dl/3600

	return [f, l];
}

	//download the data
	myConnector.getData = function(table, doneCallback) {
		$.getJSON("https://leonhertgers.github.io/live-data-in-een-dashboard/data.json", function(resp) {
//               $.getJSON("https://api.acceptatie.kadaster.nl/tms/v1/terugmeldingen?apikey=l71c0911dd8fe14be1abba40a2f4ba3e69", function(resp) {
			var feat = resp.features,
				tableData = [];
			//var epsg = require('epsg');
			// Iterate over the JSON object
			for (var i = 0, len = feat.length; i < len; i++) {
				
				tableData.push({
					"basisregistratie": feat[i].properties.basisregistratie,
					"bronhoudernaam": feat[i].properties.bronhoudernaam,
					"status": feat[i].properties.status,
					"geometry": RD2WGS84(feat[i].properties.geometry.coordinates[0], feat[i].properties.geometry.coordinates[1])
					 //"geometry": reproj.toWGS84(feat[i].properties.geometry, 'EPSG:28992', epsg)

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
