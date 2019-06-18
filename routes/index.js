var express = require('express');
var instapayReq = require('../payreq.js')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/invoices', function(req, res){
  console.log(req.param("price"))
  var price = req.param("price")

  price = price * 100000
  var unixTime = Math.round(+new Date()/1000)
  var encoded = instapayReq.encode({
    "satoshis": price,
    "timestamp": unixTime,
    "tags": [
      {
        "tagName": "payee_node_key",
        "data": "3925b6f67e2c340036ed12093dd44e0368df1b6ea26c53dbe4811f58fd5db8c1"
      },
      {
        "tagName": "expire_time",
        "data": 3600
      }
    ]
  })
  var privateKeyHex = 'e126f68f7eafcc8b74f54d269fe206be715000f94dac067d1c04a8ca3b2db734'
  var signed = instapayReq.sign(encoded, privateKeyHex)

  res.status(200)
  res.format({
    'application/json': function () {
      res.send({ invoice: signed['paymentRequest'] })
    }
  })

});

module.exports = router;
