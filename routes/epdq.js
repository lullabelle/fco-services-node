require('./../lib/ejs-filters');

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
    var name = null;
    if (req.subdomains.length){
      name = req.subdomains[req.subdomains.length - 1];
    }
    transaction = Transaction.find(name);
  } catch(err) {
    res.status(404);
    res.send('404 error');
    return;
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

var websiteRoot = function(req){
  return req.protocol + "://" + req.host;
}

var transactionDoneUrl = function(req){
  return websiteRoot(req) + "/done";
};
var epdqTemplateUrl = function(req){
  //return websiteRoot(req) + "/barclays_epdq_template.html";
  return "https://assets.digital.cabinet-office.gov.uk/templates/barclays_epdq.html";
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
    res.render('start', {
      transaction : transaction, journeyDescription : journeyDescription('start')
    });
  },

  confirm : function(req, res){
    try {
      var calculation = transaction.calculateTotal(req.body['transaction']),
          epdqRequest = buildEpdqRequest(req, transaction, calculation.totalCost);

      res.render('confirm', {
        calculation: calculation, epdqRequest: epdqRequest,
        transaction: transaction, journeyDescription: journeyDescription('confirm')
      });
    } catch(err) {
      res.render('start', { errors: err.message, journeyDescription: journeyDescription('invalid_form') });
    }
  },

  done : function(req, res){
  }
};
