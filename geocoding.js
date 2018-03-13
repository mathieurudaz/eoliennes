var geocoding = (function(){

    var APIKEY = "AIzaSyBgQ6KXHrB6tMqwK-xGL3FkqiTHG_7urcE"
    var VDBOUNDS = new google.maps.LatLngBounds(
        new google.maps.LatLng(46.200948, 5.958882),
        new google.maps.LatLng(47.008552, 7.312947));

    var input = document.getElementById('pac-input');
    var options = {
        bounds: VDBOUNDS,
        componentRestrictions: {country: 'ch'}
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);
    google.maps.event.addListener(autocomplete, 'place_changed', function(){

        // Construct the URL used to get the coordinates from Google
        url = "https://maps.googleapis.com/maps/api/geocode/json?"
            + "address=" + this.getPlace().formatted_address + "&"
            + "key=" + APIKEY;

        // Show the spinner
        $(".message_container").addClass("loading")

        // Send the request
        $.ajax({
            url: url, 
            type: "GET",   
            dataType: 'json',
            cache: false,
            success: function(response){

                console.log( response )
                console.log( response.results[0].geometry.location_type )

                var position = response.results[0].geometry.location
                var projectedPosition = projection([position.lng, position.lat])
                var vsProjectedPosition = vsProjection([position.lng, position.lat])

                // If the address is an area and not a point (approximate)
                if(response.results[0].geometry.bounds){

                    console.log( "This is a large area (polygon)" )

                    var locationBounds = response.results[0].geometry.bounds
                    var locationNortheastBounds = projection([
                        locationBounds["northeast"].lng,
                        locationBounds["northeast"].lat])
                    var locationSouthwestBounds = projection([
                        locationBounds["southwest"].lng,
                        locationBounds["southwest"].lat])

                    bounds = svgDebug.append( "rect" )
                        .attr( "fill", "rgba(255,255,0,0.2)" )
                        .attr( "x", locationSouthwestBounds[0] )
                        .attr( "y", locationNortheastBounds[1] )
                        .attr( "width", locationNortheastBounds[0] - locationSouthwestBounds[0] )
                        .attr( "height", locationSouthwestBounds[1] - locationNortheastBounds[1] )
                // If the address is a precise point
                }else{

                    console.log( "This is a precise addresse (point)" )

                }

                // Place the marker on the Debug map
                debugMarker
                    .attr("cx", projectedPosition[0])
                    .attr("cy", projectedPosition[1])

                // Place the "Your position" marker
                vsMarker
                    .attr("style", "visibility: visible")
                    .attr("cx", vsProjectedPosition[0])
                    .attr("cy", vsProjectedPosition[1])

                // Place the "Your position" text
                vsMarkerText
                    .attr("style", "visibility: visible")
                    .attr("x", vsProjectedPosition[0] + 60)
                    .attr("y", vsProjectedPosition[1] - 22)

                // Place the arrow
                d3.select("#user-arrow")
                    .attr("style", "visibility: visible")
                    .attr("style", "left:" + (vsProjectedPosition[0] + 0 ) + "px; top:" + (vsProjectedPosition[1]-33) + "px;visibility:visible;");

                var pixelData = canvas.getContext('2d').getImageData(
                    projectedPosition[0], projectedPosition[1], 1, 1).data;
                
                console.log(pixelData)
                // Change the values according to the result
                // TODO: parse all entries in address_components. find VAUD
                if(response.results[0].address_components[2].long_name != "Vaud") console.log( "Not in VD!" )
                $("b.special").text(Math.ceil(pixelData[0]/5.44) > 0 ? Math.ceil(pixelData[0]/5.44) + " eoliennes" : "aucune eolienne")

                // DEBUG: Show the marker on the viewshed map
                ctx.fillRect(
                    projectedPosition[0] - 2,
                    projectedPosition[1] - 2,
                    4,4);
        
                // Show the result and hide the spinner
                $(".message_container")
                    .removeClass("loading")
                    .addClass("success");

            }
        });   
    });

})();
