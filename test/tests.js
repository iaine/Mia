const mockTouchData = '{"@context":"http://www.w3.org/ns/anno.jsonld","creator":"05badad9-fa76-bb4b-9b88-736963eaf8f6","id":"http://example.org/msa/anno","type":"Annotation","created":"2019-07-31T09:22:02.284Z","body":{"type":"touch","value":{"x": 123, "y": 456, "z":100},"format":"text/plain"},"target":["http://127.0.0.1/prov/","./prov/model"]}';
const mockUrlData = '{"@context":"http://www.w3.org/ns/anno.jsonld","creator":"05badad9-fa76-bb4b-9b88-736963eaf8f6","id":"http://example.org/msa/anno","type":"Annotation","created":"2019-07-31T09:22:02.284Z","body":{"type":"https://static.xx.fbcdn.net/rsrc.php/v3ikyv4/yn/l/en_US/ezaJxg9Gfgg.js?_nc_x=XSvVclQG3nN","value":"GET","format":"text/plain"},"target":["http://127.0.0.1/prov/","./prov/model"]}';

QUnit.test( "Heatmap", function( assert ) {
    let heat = heatmap(mockTouchData);
    console.log(JSON.stringify(heat));
    assert.ok( typeof heat === 'object',"Passed!" );
    assert.ok( JSON.stringify(heat) === '{"freq":234.68,"dur":0.5,"gain":0.5,"pos":{"x":123,"y":456,"z":100},"idx":1}', "Passed!" );
});

QUnit.test( "Nontouch won't return in heatmap", function( assert ) {
    let heat = heatmap(mockUrlData);
    assert.notOk( heat === {"freq":234.68,"dur":0.5,"gain":0.5,"pos":{"x":123,"y":456,"z":100},"idx":1}, "Passed!" );
});

QUnit.test( "Connect to Server Side Events", function( assert ) {
    let connection = source('sse', [], []);
    assert.throws(connection, Error, "No location throws an error");

    connection = source('sse', 'http://127.0.0.1:3000/sse', []);
    assert.ok(connection, "Location found");
});