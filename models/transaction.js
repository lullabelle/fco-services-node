var fs = require('fs'),
    TransactionCalculator = require('./../lib/transaction_calculator');

var Transaction = function(opts){
  var _self = this,
      attrs = ['slug', 'title', 'document_cost', 'postage_cost',
               'registration', 'account', 'document_types',
               'allow_zero_document_count'];

  attrs.forEach(function(attr){
    _self[attr] = opts[attr];
  });
};

Transaction.PARAMPLUS_KEYS = ['document_count', 'postage', 'postage_option', 'registration_count'];

Transaction.prototype.calculateTotal = function(values){
  return new TransactionCalculator(this).calculate(values);
};

Transaction.find = function(id){
  if (transaction = Transaction.transactions()[id]){
    transaction['slug'] = id;
    return new Transaction(transaction);
  } else {
    throw new Error("Transaction not found");
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
