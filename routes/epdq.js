
var transaction,
    crypto = require('crypto'),
    EPDQ = require('epdq'),
    Transaction = require('./../models/transaction');

var journeyDescription = function(step){
  return transaction.slug + ":" + step;
};

// Middleware filter.
var findTransaction = function(req, res, next){
  try {
    transaction = Transaction.find(req.subdomains[0]);
  } catch(err) {
    res.status(404);
  }
  next();
};
var setExpiry = function(req, res, next){
  res.setHeader('Cache-Control', 'max-age=1800, public');
  next();
};

var secureRandom = function(len){
  return crypto.randomBytes(len).toString('hex');;
};

var transactionDoneUrl = function(req){
  return req.protocol + "://" + req.host + "/done";
};
var epdqTemplateUrl = function(req){
  return "TODO";
};


var paramplusValue = function(params){
  var vals = [];
  Transaction.PARAMPLUS_KEYS.forEach(function(key){
    if (typeof params['transaction'][key] != 'undefined'){
      vals.push(key + "=" + params['transaction'][key]);
    }
  });
  return vals;
};

var buildEpdqRequest = function(req, transaction, totalCost){
  return new EPDQ.Request({
    account: transaction.account,
    orderid: secureRandom(15),
    amount: Math.round(totalCost * 100),
    currency: 'GBP',
    language: 'en_GB',
    accepturl: transactionDoneUrl(req),
    paramplus: paramplusValue(req.body),
    tp: epdqTemplateUrl(req)
  });
};

module.exports = {
  middleware : { setExpiry : setExpiry, findTransaction : findTransaction },
  middlewares : [ setExpiry, findTransaction ],
  start : function(req, res){
    res.render('start', { journeyDescription : journeyDescription('start') });
  },
  confirm : function(req, res){
    try {
      var calculation = transaction.calculateTotal(req.body['transaction']),
          epdqRequest = buildEpdqRequest(req, transaction, calculation.totalCost);
      res.render('confirm', { transaction: transaction, epdqRequest: epdqRequest,
                              journeyDescription: journeyDescription('confirm') });
    } catch(err) {
      res.render('start', { errors: err.message, journeyDescription: journeyDescription('invalid_form') });
    }
  },
  done : function(req, res){
  }
};
