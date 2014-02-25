var app = require('./../../app'),
    browser,
    Browser = require('zombie'),
    port = (process.env.PORT || 1337),
    should = require('should');

Browser.dns.localhost('pay-foreign-marriage-certificates.test.gov.uk');

describe("Payment for certificates to get married abroad", function(){

  beforeEach(function(done){
    browser = new Browser();
    browser.site = "http://pay-foreign-marriage-certificates.test.gov.uk:"+port;
    done();
  });

  describe("start", function(){
    it("render the transaction intro page and generate the payment form when 'Calculate total' is clicked", function(done){
      browser.visit("/start", {}, function(err){

        should.not.exist(err);

        browser.text("title").should.equal('Payment for certificates to get married abroad - GOV.UK');
        var homeBreadcrumb = browser.query("ol[role='breadcrumbs'] li:first-child a");
        homeBreadcrumb.getAttribute('href').should.equal('https://www.gov.uk/');
        homeBreadcrumb.innerHTML.should.equal('Home');

        browser.text('.options-list li:first-child').should.equal('Nulla Osta');
        browser.text('.options-list li:last-child').should.equal('Certificate of no impediment');

        browser.text('.inner label[for="transaction_document_count"]').should.match(/How many do you need\? Each certificate costs £65\./);

        browser.choose('#transaction_document_type_certificate-of-no-impediment');
        browser.select('#transaction_document_count', '2');
        browser.select('#transaction_postage', 'Yes');

        browser.pressButton('Calculate total', function(err){

          should.not.exist(err);

          browser.text('#content .article-container .inner p:first-child').should.equal(
            'The cost of 2 certificates of no impediment plus postage is £140.00.');

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
      browser.visit("/done?orderID=test&currency=GBP&amount=45&PM=CreditCard&ACCEPTANCE=test123&STATUS=5&CARDNO=XXXXXXXXXXXX1111&CN=MR%20MICKEY%20MOUSE&TRXDATE=03%2F11%2F13&PAYID=12345678&NCERROR=0&BRAND=VISA&SHASIGN=6ACE8B0C8E0B427137F6D7FF86272AA570255003&document_count=3&registration_count=4&postage=no",
        {}, function(err){
          should.not.exist(err);

          var doneText = browser.text('.article-container .inner');
          doneText.should.match(/You have paid for 4 registrations and 3 certificates/);
          doneText.should.match(/Your payment reference is 12345678/);

          var finishedButton = browser.query('.inner section.done a');
          finishedButton.getAttribute('href').should.equal('https://www.gov.uk/done/pay-foreign-marriage-certificates');
          finishedButton.innerHTML.should.equal('Finished');

          done();
      });
    });
  });
});
