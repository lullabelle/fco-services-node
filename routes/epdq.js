var transaction,
    Transaction = require('./../models/transaction');

var journeyDescription = function(step){
  return transaction.slug + ":" + step;
};

// Middleware filter.
var findTransaction = function(req, res, next){
  transaction = Transaction.find(req.subdomains[0]);
  next();
};

module.exports = {
  middlewares : [ findTransaction ],
  start : function(req, res){
    res.render('start', { journeyDescription : journeyDescription('start') });
  }
};
