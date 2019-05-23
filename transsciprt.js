$(document).ready(function() {

    $('form').on('submit', (event)=>{

        event.preventDefault();


        $.getJSON("https://stanronzhin.github.io/terugmeld/data.json", function(resp) {
            var feat = resp.features;
            console.log(feat);

        proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");

            for (var i = 0, len = feat.length; i < len; i++) {
                var coordRD = feat[i].geometry.coordinates;
                console.log(coordRD);

                var coordWGS =  proj4('EPSG:28992', 'WGS84', coordRD);
                console.log(coordWGS);
                console.log(JSON.stringify(coordWGS));

                var wkt_data = new Wkt.Wkt();
                wkt_data.read(JSON.stringify(coordWGS));
            }

        });
    });
});
