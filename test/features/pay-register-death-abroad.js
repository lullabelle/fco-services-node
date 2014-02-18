var app = require('./../../app'),
    browser,
    Browser = require('zombie'),
    EPDQ = require('epdq'),
    http = require('http'),
    port = (process.env.PORT || 1337),
    should = require('should');

Browser.dns.localhost('pay-register-death-abroad.test.gov.uk');

describe("Pay to register a death abroad", function(){

  beforeEach(function(done){
    browser = new Browser();
    browser.site = "http://pay-register-death-abroad.test.gov.uk:"+port;
    done();
  });

  describe("start", function(){
    it("render the transaction intro page and generate the payment form when 'Calculate total' is clicked", function(done){
      browser.visit("/start", {}, function(err){

        should.not.exist(err);

        browser.text('#content header h1').should.equal('Payment to register a death abroad');
        browser.select('#transaction_registration_count','2');
        browser.select('#transaction_document_count', '2');
        browser.select('#transaction_postage', 'Yes');

        browser.pressButton('Calculate total', function(err){

          should.not.exist(err);

          browser.text('#content .article-container .inner p:first-child').should.equal(
            'The cost for 2 registrations and 2 certificates plus postage is £350.00.');

          browser.query("form.epdq-submit").action.should.match(/https:\/\/mdepayments\.epdq\.co\.uk/);
          browser.query("form.epdq-submit").method.should.equal("post");

          browser.field("input[name='ORDERID']").should.exist;
          browser.field("input[name='PSPID']").should.exist;
          browser.field("input[name='SHASIGN']").should.exist;
          browser.field("input[name='AMOUNT']").should.exist;
          browser.field("input[name='CURRENCY']").should.exist;
          browser.field("input[name='LANGUAGE']").should.exist;
          browser.field("input[name='ACCEPTURL']").should.exist;

          browser.button("Pay").should.exist;

          done();
        });
      });
    });
  });
  describe("/done", function(){
    it("should show the completed transaction", function(done){
      browser.visit("/done?orderID=27107f89b1ec56a17ac4fde7a60ecc&amount=480&STATUS=5&PAYID=28170384&NCERROR=0&document_count=4&postage=yes&registration_count=2&SHASIGN=01A11E9D3D661AE7BF086B28F250252C24F1EE44",
        {}, function(err){
          should.not.exist(err);
          var doneText = browser.text('.article-container .inner');
          doneText.should.match(/You have paid for 2 registrations and 4 certificates, plus postage./);
          doneText.should.match(/Your payment reference is 28170384/);
          done();
      });
    });
  });
});
