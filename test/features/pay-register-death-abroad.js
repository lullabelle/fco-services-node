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
    it("accepts a country parameter for use in confirmation", function (done) {
      browser.visit("/start?country=usa", {}, function(err){
        should.not.exist(err);

        browser.query("input#transaction_country").value.should.equal('usa');

        browser.text("title").should.equal('Payment to register a death abroad - GOV.UK');
        browser.text('.options-list li:first-child').should.match(/^Tracked courier service to the UK or British Forces Post Office - £4\.50$/);
        browser.text('.options-list li:nth-child(2)').should.match(/^Tracked courier service to Europe .*? £12\.50$/);
        browser.text('.options-list li:nth-child(3)').should.equal('Tracked courier service to the rest of the world - £22');

        browser.text('#content header h1').should.equal('Payment to register a death abroad');

        browser.select('#transaction_registration_count','2');
        browser.select('#transaction_document_count', '2');
        browser.choose('#transaction_postage_option_rest-of-world');

        browser.pressButton('Calculate total', function(err){

          should.not.exist(err);

          browser.text('#content .article-container .inner p:first-child').should.equal(
            'The cost for 2 registrations and 2 certificates plus Tracked courier service to the rest of the world postage is £362.');

          done();
        });
      });
    });
    it("renders the transaction intro page and generates the payment form when 'Calculate total' is clicked", function(done){
      browser.visit("/start", {}, function(err){

        should.not.exist(err);

        browser.text("title").should.equal('Payment to register a death abroad - GOV.UK');

        browser.text('#content header h1').should.equal('Payment to register a death abroad');
        browser.select('#transaction_registration_count','2');
        browser.select('#transaction_document_count', '2');
        browser.choose('#transaction_postage_option_uk');

        browser.pressButton('Calculate total', function(err){

          should.not.exist(err);

          browser.text('#content .article-container .inner p:first-child').should.equal(
            'The cost for 2 registrations and 2 certificates plus Tracked courier service to the UK or British Forces Post Office postage is £344.50.');

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
      browser.visit("/done?orderID=test&currency=GBP&amount=45&PM=CreditCard&ACCEPTANCE=test123&STATUS=5&CARDNO=XXXXXXXXXXXX1111&CN=MR%20MICKEY%20MOUSE&TRXDATE=03%2F11%2F13&PAYID=12345678&NCERROR=0&BRAND=VISA&SHASIGN=6ACE8B0C8E0B427137F6D7FF86272AA570255003&document_count=3&registration_count=4&postage=yes",
        {}, function(err){
          should.not.exist(err);
          var doneText = browser.text('.article-container .inner');
          doneText.should.match(/You have paid for 4 registrations and 3 certificates, plus postage./);
          doneText.should.match(/Your payment reference is 12345678/);

          var finishedButton = browser.query('.article-container .inner section.done a.transaction-done');
          finishedButton.getAttribute('href').should.equal('https://www.gov.uk/done/pay-register-death-abroad');
          finishedButton.innerHTML.should.equal('Finished');

          done();
      });
    });
  });
});
