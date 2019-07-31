let express = require('express');

let router = express.Router();

router.get('/sse/:id', function(req, res, next) {

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    writeStreamData(res, req.params.id);

});

let writeStreamData = function(res, type) {
    const mockTouchData = '{"@context":"http://www.w3.org/ns/anno.jsonld","creator":"05badad9-fa76-bb4b-9b88-736963eaf8f6","id":"http://example.org/msa/anno","type":"Annotation","created":"2019-07-31T09:22:02.284Z","body":{"type":"touch","value":{"x": 123, "y": 456, "z":100},"format":"text/plain"},"target":["http://127.0.0.1/prov/","./prov/model"]}';
    const mockUrlData = '{"@context":"http://www.w3.org/ns/anno.jsonld","creator":"05badad9-fa76-bb4b-9b88-736963eaf8f6","id":"http://example.org/msa/anno","type":"Annotation","created":"2019-07-31T09:22:02.284Z","body":{"type":"https://static.xx.fbcdn.net/rsrc.php/v3ikyv4/yn/l/en_US/ezaJxg9Gfgg.js?_nc_x=XSvVclQG3nN","value":"GET","format":"text/plain"},"target":["http://127.0.0.1/prov/","./prov/model"]}';

    let _data;
    for(let i=0;i<10000;i++) {
        _data = (type === 'touch') ? mockTouchData : mockUrlData;
    }
    return _data;
};

module.exports = router;
