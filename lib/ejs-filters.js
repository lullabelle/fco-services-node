var ejs = require('ejs'),
    pluralize = require('pluralize');

ejs.filters.pluralize = function(obj){
  return pluralize(obj.word, obj.count, true);
};

ejs.filters.formatMoney = function(num){
  return num.toFixed(2);
}
