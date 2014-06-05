var app = require('./../../app'),
    browser,
    Browser = require('zombie'),
    EPDQ = require('epdq'),
    http = require('http'),
    port = (process.env.PORT || 1337),
    should = require('should');

Browser.dns.localhost('pay-register-birth-abroad.test.gov.uk');

describe("Pay to register a birth abroad", function(){

  beforeEach(function(done){
    browser = new Browser();
    browser.site = "http://pay-register-birth-abroad.test.gov.uk:"+port;
    done();
  });

  describe("start", function(){
    it("render the transaction intro page and generate the payment form when 'Calculate total' is clicked", function(done){
      browser.visit("/start", {}, function(err){

        should.not.exist(err);

        browser.text("title").should.equal('Payment to register a birth abroad - GOV.UK');

        browser.text('#content header h1').should.equal('Payment to register a birth abroad');
        browser.select('#transaction_registration_count','2');
        browser.select('#transaction_document_count', '0');
        browser.choose('#transaction_postage_option_uk');

        browser.pressButton('Calculate total', function(err){

          should.not.exist(err);

          browser.text('#content .article-container .inner p:first-child').should.equal(
            'The cost for 2 registrations and 0 certificates plus UK address or British Forces Post Office postage is £214.50.');

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
    describe("start with birth country parameter", function(){
      it("renders the transaction intro page and generates the payment form", function(done){
        browser.visit("/start?country=spain", {}, function(err){

        should.not.exist(err);

        browser.query("#transaction_country").value.should.equal("spain");

        browser.text("title").should.equal('Payment to register a birth abroad - GOV.UK');
        browser.text('.options-list li:first-child').should.match(/^UK address or British Forces Post Office - £4\.50$/);
        browser.text('.options-list li:nth-child(2)').should.match(/^Europe .*? £12\.50$/);
        browser.text('.options-list li:nth-child(3)').should.equal('Rest of the world - £22');

        browser.text('#content header h1').should.equal('Payment to register a birth abroad');
        browser.select('#transaction_registration_count','2');
        browser.select('#transaction_document_count', '2');
        browser.choose('#transaction_postage_option_europe');

        browser.pressButton('Calculate total', function(err){

          should.not.exist(err);

          browser.text('#content .article-container .inner p:first-child').should.equal(
            'The cost for 2 registrations and 2 certificates plus Europe (excluding Albania, Armenia, Azerbaijan, Belarus, Bosnia and Herzegovina, Georgia, Liechtenstein, Macedonia, Moldova, Montenegro, Russia, Serbia, Turkey and Ukraine) postage is £352.50.');

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

          doneText.should.match(/You have paid for 4 birth registrations and 3 certificates, plus postage./);
          doneText.should.match(/Your online payment reference is 12345678/);

          var finishedButton = browser.query('.inner section.done a');
          finishedButton.getAttribute('href').should.equal('https://www.gov.uk/done/pay-register-birth-abroad');
          finishedButton.innerHTML.should.equal('Finished');

          done();
        });
      });
    });
  });
});
