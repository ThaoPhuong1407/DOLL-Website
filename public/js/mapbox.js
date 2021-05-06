
/* eslint-disable */
export const displayMap = (loc) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibXNhbm5hMTQwNyIsImEiOiJja21ud24ybjIwMWJmMnhrbjBtMGw0ZmhjIn0.1cBqkre_A90qwU-uZ3tiSA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/msanna1407/ckmnx2cy12pj217s21gaivawm',
        scrollZoom: true,
        center: loc,
        zoom: 10,
        interactive: true,
    });

    // We have access to mapboxgl object when we add their script to our html file
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([-71.2296696, 42.4470699]);
    bounds.extend([-71.2280607,42.4454253]);
    bounds.extend([-71.2280607, 42.4454253]);
    bounds.extend([-71.2287756, 42.4451581]);


    // Add popup
    new mapboxgl
        .Popup({
            offset: 10,
        })
        .setLngLat(loc)
        .setHTML(`<p> 114 Waltham St, Lexington, MA 02421 </p>`)
        .addTo(map);
        

    // Create a nice transition/animation
    // Must come at the end
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 250,
            left: 200,
            right: 200,
        }
    });
}

