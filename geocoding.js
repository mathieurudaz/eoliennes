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

                }else{
                    console.log( "This is a precise addresse (point)" )

                    // draw bounds around the point
                    var locationNortheastBounds = [
                        projectedPosition[0] + 10,
                        projectedPosition[1] - 10]
                    var locationSouthwestBounds = [
                        projectedPosition[0] - 10,
                        projectedPosition[1] + 10]

                    console.log(locationSouthwestBounds + ","+locationNortheastBounds)

                    //var pixelData = canvas.getContext('2d').getImageData(
                    //    projectedPosition[0], projectedPosition[1], 1, 1).data;
                    
                    //console.log(pixelData)
                    //console.log(Math.ceil(pixelData[0]/5.44))
                    //$("b.special").text(getRange(Math.ceil(pixelData[0]/5.44)))
                }

                                    // SVG
                    bounds = svgDebug.append( "rect" )
                        .attr( "fill", "transparent" )
                        .attr("stroke", "#00ffff")
                        .attr("stroke-width", 1)
                        .attr( "x", locationSouthwestBounds[0] )
                        .attr( "y", locationNortheastBounds[1] )
                        .attr( "width", locationNortheastBounds[0] - locationSouthwestBounds[0] )
                        .attr( "height", locationSouthwestBounds[1] - locationNortheastBounds[1] )

                    // CANVAS
                    /*ctx.fillRect(
                        locationSouthwestBounds[0],
                        locationNortheastBounds[1],
                        locationNortheastBounds[0] - locationSouthwestBounds[0],
                        locationSouthwestBounds[1] - locationNortheastBounds[1]);*/

                    surfaceWidth = Math.floor(locationNortheastBounds[0]) - Math.floor(locationSouthwestBounds[0]);
                    surfaceHeight = Math.floor(locationSouthwestBounds[1]) - Math.floor(locationNortheastBounds[1]);
                    surfaceLeftTopX = Math.floor(locationSouthwestBounds[0])
                    surfaceLeftTopY = Math.floor(locationNortheastBounds[1])
                    console.log("SURFACE")
                    console.log("top x: " + surfaceLeftTopX)
                    console.log("top y: " + surfaceLeftTopY)
                    console.log("width: " + surfaceWidth)
                    console.log("height: " + surfaceHeight)
                    // Mean of the surface
                    surfaceCount = {
                        mean:0,
                        no:0,
                        yes:0,
                        total:0
                    }
                    var debugcanvas = document.createElement('canvas');
                    $("#debug-map").append($(debugcanvas));
                    debugcanvas.width = surfaceWidth;
                    debugcanvas.height = surfaceHeight;
                    debugctx = debugcanvas.getContext('2d')
                    $(debugcanvas).css({
                        "position": "absolute",
                        "top": surfaceLeftTopY,
                        "left": surfaceLeftTopX + surfaceWidth + 1
                    })
                    imagedata = canvas.getContext('2d').getImageData(
                        surfaceLeftTopX,
                        surfaceLeftTopY,
                        surfaceWidth,
                        surfaceHeight)
                    console.log(imagedata)
                    imageDataIndex = 0

                    for(var i=0; i<surfaceWidth*surfaceHeight; i+=1){
                        /*var pixdata = canvas.getContext('2d').getImageData(
                            surfaceLeftTopX + iw,
                            surfaceLeftTopY + ih, 1, 1).data;*/
                        var pixdata = [
                            imagedata.data[i*4],
                            imagedata.data[i*4+1],
                            imagedata.data[i*4+2],
                            imagedata.data[i*4+3]
                        ];

                        pixdataVal = (pixdata[0] + pixdata[1] + pixdata[2]) / 3
                        debugctx.fillStyle = "rgb("+pixdata[0]+","+pixdata[1]+","+pixdata[2]+")";

                        if(pixdataVal < 1){
                            surfaceCount.no += 1
                            debugctx.fillStyle = "rgb("+0+","+255+","+255+")";
                        }else{
                            surfaceCount.yes += 1
                            surfaceCount.mean += pixdata[0]
                            if(pixdataVal > 90){
                                //debugctx.fillStyle = "rgb("+255+","+0+","+255+")";
                            }
                        }
                        surfaceCount.total += 1
                        //console.log(pixdata)
                        debugctx.fillRect(imageDataIndex%surfaceWidth, Math.floor(imageDataIndex/surfaceWidth),1, 1);
                        imageDataIndex += 1

                    }

                    /*for(var iw=0; iw< surfaceWidth; iw++){
                        for(var ih=0; ih< surfaceHeight; ih++){
                            //var pixdata = canvas.getContext('2d').getImageData(
                            //    surfaceLeftTopX + iw,
                            //    surfaceLeftTopY + ih, 1, 1).data;
                            var pixdata = [
                                imagedata.data[imageDataIndex*4],
                                imagedata.data[imageDataIndex*4+1],
                                imagedata.data[imageDataIndex*4+2],
                                imagedata.data[imageDataIndex*4+3]
                            ];

                            imageDataIndex +=1                        

                            pixdataVal = (pixdata[0] + pixdata[1] + pixdata[2]) / 3
                            debugctx.fillStyle = "rgb("+pixdata[0]+","+pixdata[1]+","+pixdata[2]+")";

                            if(pixdataVal < 1){
                                surfaceCount.no += 1
                                debugctx.fillStyle = "rgb("+0+","+255+","+255+")";
                            }else{
                                surfaceCount.yes += 1
                                surfaceCount.mean += pixdata[0]
                                if(pixdataVal > 90){
                                    //debugctx.fillStyle = "rgb("+255+","+0+","+255+")";
                                }
                            }
                            surfaceCount.total += 1
                            //console.log(pixdata)
                            debugctx.fillRect(iw,ih,1, 1);
                        }
                    }*/

                    surfaceCount.mean = surfaceCount.mean / surfaceCount.yes
                    console.log("Probabilité de voir une éolienne: " + (surfaceCount.yes/surfaceCount.total*100) + "%")
                    console.log("Moyenne: " + Math.ceil(surfaceCount.mean/5.44))
                    $(".special-1").text(Math.round(surfaceCount.yes/surfaceCount.total*100) + "%")
                    $(".special-2").html(getRange(Math.ceil(surfaceCount.mean/5.44)))


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
                    .attr("x", getTextPosition(vsProjectedPosition[0], vsProjectedPosition[1])[0])
                    .attr("y", getTextPosition(vsProjectedPosition[0], vsProjectedPosition[1])[1])

                // Place the arrow
                d3.select("#user-arrow")
                    .attr("style", "visibility: visible")
                    .attr("style",
                        getArrowOrientation(vsProjectedPosition[0], vsProjectedPosition[1])  +
                        "visibility: visible;");

                // Change the values according to the result
                // TODO: parse all entries in address_components. find VAUD
                if(response.results[0].address_components[2].long_name != "Vaud") console.log( "Not in VD!" )

                // DEBUG: Show the marker on the viewshed map
                ctx.fillStyle = "#00ffff";
                ctx.fillRect(
                    projectedPosition[0],
                    projectedPosition[1],
                    1,1);
        
                // Show the result and hide the spinner
                $(".message_container")
                    .removeClass("loading")
                    .addClass("success");

            }
        });   
    });
})();

var getTextPosition = function(x, y){
    px = x + 60
    py = y - 25

    if(x>vdWidth/2){
        px = x - 170
    }

    if(y>vdHeight/2){
        py = y + 32
     }
    return [px, py]
}

var getArrowOrientation = function(x, y){
    sx = 1;
    sy = 1;
    px = x;
    py = y - 33;

    if(x>vdWidth/2){
        sx = -1
        px = x -55
    }

    if(y>vdHeight/2){
        sy = -1
        py = y + 4
     }

    return "transform: scale(" + sx + "," + sy + ");" +
            "left:" + px + "px;" +
            "top:" + py + "px;"
}

var getRange = function(val){

    console.log(val)

    if(val == 0){
        return "<b class='special'>une éolienne</b>"
    }else if(val < 6){
        return "entre <b class='special'>1 et 5</b> éoliennes"
    }else if(val < 11){
        return "entre <b class='special'>5 et 10</b> éoliennes"
    }else if(val <= 20){
        return "entre <b class='special'>10 et 20</b> éoliennes"
    }else if(val > 20){
        return "<b class='special'>plus de 20</b> éoliennes"
    }else{
        return "une éolienne"
    }
}