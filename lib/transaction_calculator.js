/*
 * Based on https://github.com/alphagov/fco-services/blob/master/lib/transaction_calculator.rb
 */
var TransactionCalculator = function(transaction){
  this.transaction = transaction;
  this.itemList = {};
  this.totalCost = 0;
  this.postageOption = null;
  this.postageOptionLabel = null;
  this.documentCount = 0;
  this.postage = 0;
  this.documentType = null;
  this.registrationCount = 0;
};

var pluraliseLabel = function(quantity, label){
  if (quantity == 1) return label;

  var certificateRe = new RegExp('^([cC])ertificate','i');

  if (certificateRe.test(label)){
    return label.replace(certificateRe, "$1ertificates");
  } else {
    return label + "s"; // TODO: This could do with an inflection lib.
  }
}

TransactionCalculator.prototype._calculatePostage = function(){
  if (typeof this.transaction.postage_options != 'undefined'){
    if (this.postageOption != null){
      var postageMethod = this.transaction.postage_options[this.postageOption];
    }
    if (typeof postageMethod == 'undefined'){
      throw new Error("Invalid postage option")
    }
    this.totalCost += (postageMethod['cost'] || 0);
    this.itemList['postage'] = ' plus ' + postageMethod['label'] + ' postage';
  } else if (this.postage) {
    this.totalCost += (this.transaction.postage_cost || 0);
    this.itemList['postage'] = ' plus postage';
  }
};
TransactionCalculator.prototype._calculateRegistrations = function(values){
  if (this.transaction.registration){
    if (this.registrationCount < 1){
      throw new Error("Invalid registration count");
    }
    this.totalCost += (this.transaction.registration_cost * this.registrationCount);

    this.itemList['registration'] = this.registrationCount + " " +
      pluraliseLabel(this.registrationCount, this.transaction.registration_type + " registration") + " and ";

    this.itemList['document'] = this.documentCount + " " +
      pluraliseLabel(this.documentCount, this.transaction.registration_type + " certificate");
  }
};
TransactionCalculator.prototype._calculateDocuments = function(){
  if (typeof this.transaction.document_types != 'undefined'){
    var documentTypeLabel;

    if (this.documentType != null){
      documentTypeLabel = this.transaction.document_types[this.documentType];
    }
    if (typeof documentTypeLabel == 'undefined'){
      throw new Error("Invalid document type");
    }

  } else if (typeof this.transaction.document_type != 'undefined'){
    documentTypeLabel = this.transaction.document_type;
  }

  this.itemList['document'] = this.documentCount + " " + pluraliseLabel(this.documentCount, (documentTypeLabel || "document"));
};

TransactionCalculator.prototype.calculate = function(values){

  this.documentCount = parseInt(values['document_count']) || 0;
  if (!(this.documentCount > 0 ||
      (this.transaction.allow_zero_document_count && this.documentCount == 0))){
    throw new Error("Invalid document count");
  }

  this.postage = (values['postage'] == 'yes');
  this.documentType = values['document_type'];
  this.postageOption = values['postage_option'];
  this.registrationCount = parseInt(values['registration_count'] || 0);

  this.totalCost = (this.transaction.document_cost * this.documentCount);

  this._calculatePostage();
  this._calculateRegistrations();
  this._calculateDocuments();

  return this;
};

TransactionCalculator.prototype.formattedItemList = function(){
  return (this.itemList['registration'] || '') +
         (this.itemList['document'] || '') +
         (this.itemList['postage'] || '');
};

module.exports = TransactionCalculator;
