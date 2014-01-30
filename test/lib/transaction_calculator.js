var should = require('should'),
    TransactionCalculator = require('./../../lib/transaction_calculator'),
    transaction,
    calculator;

describe("TransactionCalculator", function(){
  describe("given a transaction without document types or registration costs", function(){
    beforeEach(function(){
      transaction = {
        'document_cost' : 20,
        'postage_cost' : 5,
        'registration' : false
      };
      calculator = new TransactionCalculator(transaction);
    });
    it("calculates the cost of a single document", function(){
      calculator.calculate({'document_count': 1}).totalCost.should.equal(20);
    });

    it("calculates the cost of multiple documents", function(){
      calculator.calculate({'document_count': 3}).totalCost.should.equal(60);
    });

    it("calculates the cost with postage", function(){
      calculator.calculate({'document_count': 3, 'postage': 'yes'}).totalCost.should.equal(65);
    });

    it("builds and item list for a single document", function(){
      calculator.calculate({'document_count': 1}).formattedItemList().should.equal("1 document");
    });

    it("builds and item list for multiple documents", function(){
      calculator.calculate({'document_count': 5}).formattedItemList().should.equal("5 documents");
    });

    it("builds and item list for multiple documents plus postage", function(){
      calculator.calculate({'document_count': 5, 'postage': 'yes'}).formattedItemList().should.equal("5 documents plus postage");
    });

    it("raises an error if the document count is not a number", function(){
      (function(){
        calculator.calculate({'document_count': 'lotz'});
      }).should.throw("Invalid document count");
    });
  });
  describe("given a transaction which allows zero documents", function(){
    beforeEach(function(){
      transaction = {
        'document_cost': 20,
        'allow_zero_document_count': true,
        'postage_cost': 5,
        'registration': false
      };
      calculator = new TransactionCalculator(transaction);
    });
    it("calculates the cost for multiple documents", function(){
      calculator.calculate({'document_count': 3}).totalCost.should.equal(60);
    });

    it("calculates the cost for zero documents", function(){
      calculator.calculate({'document_count': 0}).totalCost.should.equal(0);
    });

    it("calculates the cost for zero documents including postage", function(){
      calculator.calculate({'document_count': 0, 'postage': 'yes'}).totalCost.should.equal(5);
    });
  });
  describe("given a transaction which allows zero documents", function(){
    beforeEach(function(){
      transaction = {
        'document_cost': 20,
        'postage_cost': 5,
        'registration': false,
        'document_types' : {
          "certificate-of-biscuit-quality": "Certificate of biscuit quality",
          "tea-assurance-document": "Tea assurance document"
        }
      };
      calculator = new TransactionCalculator(transaction);
    });
    it("raises and exception if no document type is specified", function(){
      (function(){
        calculator.calculate({'document_count': 1})
      }).should.throw("Invalid document type");
    });

    it("builds an item list for a single document", function(){
      calculator.calculate({
        'document_count': 1, 'document_type': 'tea-assurance-document'
      }).formattedItemList().should.equal("1 Tea assurance document");
    });

    it("builds an item list for multiple documents", function(){
      calculator.calculate({
        'document_count': 2, 'document_type': 'tea-assurance-document'
      }).formattedItemList().should.equal("2 Tea assurance documents");
    });

    it("builds an item list for multiple documents with postage", function(){
      calculator.calculate({
        'document_count': 2, 'document_type': 'tea-assurance-document', 'postage': 'yes'
      }).formattedItemList().should.equal("2 Tea assurance documents plus postage");
    });

    it("builds an item list for a single certificate", function(){
      calculator.calculate({
        'document_count': 1, 'document_type': 'certificate-of-biscuit-quality'
      }).formattedItemList().should.equal("1 Certificate of biscuit quality");
    });

    it("builds an item list for multiple certificates", function(){
      calculator.calculate({
        'document_count': 2, 'document_type': 'certificate-of-biscuit-quality'
      }).formattedItemList().should.equal("2 Certificates of biscuit quality");
    });
  });
  describe("given a transaction with postage options", function(){
    beforeEach(function(){
      transaction = {
        'document_cost': 20,
        'postage_options': {
          "horse-and-cart": {
            "label": "Horse and cart",
            "cost" : 10
          },
          "iron-horse" : {
            "label" : "Iron horse",
            "cost" : 20
          },
          "flying-machine" : {
            "label" : "Flying machine",
            "cost" : 35
          }
        }
      };
      calculator = new TransactionCalculator(transaction);
    });

    it("calculates the cost of postage", function(){
      calculator.calculate({
        'document_count': 1, 'postage_option': 'iron-horse'
      }).totalCost.should.equal(40);
    });

    it("calculates the cost of postage and documents", function(){
      calculator.calculate({
        'document_count': 3, 'postage_option': 'flying-machine'
      }).totalCost.should.equal(95);
    });

    it("builds an item list including postage type", function(){
      calculator.calculate({
        'document_count': 1, 'postage_option': 'horse-and-cart'
      }).formattedItemList().should.equal("1 document plus Horse and cart postage");
    });

    it("builds an item list of multiple documents including the postage type", function(){
      calculator.calculate({
        'document_count': 3, 'postage_option': 'flying-machine'
      }).formattedItemList().should.equal("3 documents plus Flying machine postage");
    });

    it("raises an error if no postage option set", function(){
      (function(){
        calculator.calculate({ 'document_count': 1});
      }).should.throw("Invalid postage option");
    });

    it("raises an error if the postage option doesn't exist", function(){
      (function(){
        calculator.calculate({ 'document_count': 1, 'postage_option': 'mailman'});
      }).should.throw("Invalid postage option");
    });

    it("raises an error if document count is zero", function(){
      (function(){
        calculator.calculate({ 'document_count': 0, 'postage_option': 'flying-machine'});
      }).should.throw("Invalid document count");
    });
  });

  describe("given a transaction without postage", function(){
    beforeEach(function(){
      transaction = {
        'document_cost' : 20,
        'postage_cost' : false
      };
      calculator = new TransactionCalculator(transaction);
    });
    it("calculates the document cost", function(){
      calculator.calculate({'document_count': 3}).totalCost.should.equal(60);
    });

    it("builds an item list which doesn't include postage", function(){
      calculator.calculate({'document_count': 3}).formattedItemList().should.equal("3 documents");
    });
  });
});
