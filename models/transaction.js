var fs = require('fs');

var Transaction = function(opts){
  var _self = this,
      attrs = ['slug', 'title', 'document_cost', 'postage_cost',
               'registration', 'account', 'document_types'];
  attrs.forEach(function(attr){
    _self[attr] = opts[attr];
  });
};

Transaction.find = function(id){
  if (transaction = Transaction.transactions()[id]){
    transaction['slug'] = id;
    return new Transaction(transaction);
  } else {
    throw "Transaction not found" // TODO: Exception classes.
  }
};

Transaction._transactions = null;

Transaction.transactions = function(){
  if (Transaction._transactions == null){
    var jsonFile = __dirname + '/../lib/transactions.json',
        data = fs.readFileSync(jsonFile, { encoding: 'utf8' });
    Transaction._transactions = JSON.parse(data);
  }
  return Transaction._transactions;
};

module.exports = Transaction;
