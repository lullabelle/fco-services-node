var app = require('./../../app'),
    EPDQ = require('epdq'),
    request = require('supertest'),
    Response = require('express').response,
    should = require('should'),
    sinon = require('sinon'),
    Transaction = require('./../../models/transaction');

describe("epdq routes", function(){
  before(function(){
    sinon.spy(Response, 'render');
  });
  after(function(){
    Response.render.restore();
  });
  describe("start", function(){
    it("should find the appropriate transaction", function(done){

      request(app)
        .get('/start')
        .set('host','pay-register-death-abroad.gov.uk')
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);

          var renderArgs = Response.render.getCall(0).args;
          renderArgs[0].should.equal('start');
          renderArgs[1].journeyDescription.should.equal('pay-register-death-abroad:start');

          res.text.should.match(/Payment to register a death abroad/)

          done();
        });
    });
     it("should set the correct expiry headers", function(done){
      request(app)
        .get('/start')
        .set('host','pay-register-death-abroad.gov.uk')
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);
          res.headers['cache-control'].should.equal('max-age=1800, public');
          done();
        });
    });
    it("should return a 404 if the subdomain does not match a transaction", function(done){
      request(app)
        .get('/start')
        .set('host','pay-register-a-dog-abroad.gov.uk')
        .expect(404)
        .end(function(err, res){
          should.not.exist(err);
          done();
        });
    });
  });
  describe("GET /confirm", function(){
    it("should redirect to /start", function(){
      request(app)
        .get('/confirm')
        .expect(302)
        .end(function(err, res){
          should.not.exist(err);
          res.headers['location'].should.equal('/start');
        });
    });
  });

  describe("POST /confirm", function(){
    describe("given a zero document count", function(){
      it("should render the start template and assign an error", function(done){

        request(app)
          .post('/confirm')
          .set('host','pay-foreign-marriage-certificates.gov.uk')
          .send({ 'transaction' : { 'document_count' : '0', 'postage' : 'yes' } })
          .expect(200)
          .end(function(err, res){
            should.not.exist(err);

            var renderArgs = Response.render.lastCall.args;
            renderArgs[0].should.equal('start');
            renderArgs[1].errors.should.equal('Invalid document count');
            renderArgs[1].journeyDescription.should.equal('pay-foreign-marriage-certificates:invalid_form');

            done();
          });

      });
    });

    describe("given an invalid document type", function(){
      it("should render the start template and assign an error", function(done){

        request(app)
          .post('/confirm')
          .set('host','pay-foreign-marriage-certificates.gov.uk')
          .send({ 'transaction' : { 'document_count' : '5', 'postage' : 'yes', 'document_type' : 'nya' } })
          .expect(200)
          .end(function(err, res){
            should.not.exist(err);

            var renderArgs = Response.render.lastCall.args;
            renderArgs[0].should.equal('start');
            renderArgs[1].errors.should.equal('Invalid document type');
            renderArgs[1].journeyDescription.should.equal('pay-foreign-marriage-certificates:invalid_form');

            done();
          });

      });
    });
  });

  describe("POST /confirm", function(){
    it("should use the post body to build an EPDQ.Request", function(done){

      EPDQ.config.pspId = '5up3r53cr3t';
      EPDQ.config.shaIn = 'F4CC376CD7A834D997B91598FA747825A238BE0A';

      request(app)
        .post('/confirm')
        .set('host','pay-foreign-marriage-certificates.gov.uk')
        .send({ 'transaction' : { 'document_count' : '5', 'postage' : 'yes', 'document_type' : 'nulla-osta' } })
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);

          var renderArgs = Response.render.lastCall.args,
              transaction = renderArgs[1].transaction,
              epdqRequest = renderArgs[1].epdqRequest,
              formAttrs = epdqRequest.formAttributes(),
              viewName = renderArgs[0];

          viewName.should.equal('confirm');
          transaction.slug.should.equal('pay-foreign-marriage-certificates');
          transaction.title.should.equal('Payment for certificates to get married abroad');
          transaction.document_cost.should.equal(65);
          transaction.postage_cost.should.equal(10);
          transaction.registration.should.equal(false);
          transaction.account.should.equal('birth-death-marriage');

          formAttrs['ACCEPTURL'].should.equal('http://pay-foreign-marriage-certificates.gov.uk/done');
          formAttrs['ACCOUNT'].should.equal('birth-death-marriage');
          formAttrs['AMOUNT'].should.equal('33500'); // Math.round((65 * 5) + 10) * 100) = 33500
          formAttrs['CURRENCY'].should.equal('GBP');
          formAttrs['LANGUAGE'].should.equal('en_GB');
          formAttrs['PSPID'].should.equal('5up3r53cr3t');

          renderArgs[1].journeyDescription.should.equal('pay-foreign-marriage-certificates:confirm');

          done();
        });
    });
  });

  describe("with registration count", function(){
    it("should create an EPDQ Request with the correct amount", function(done){

      EPDQ.config.pspId = '5up3r53cr3t';
      EPDQ.config.shaIn = 'F4CC376CD7A834D997B91598FA747825A238BE0A';

      request(app)
        .post('/confirm')
        .set('host','pay-register-birth-abroad.gov.uk')
        .send({ 'transaction' : {
          'registration_count' : '5',
          'document_count' : '5',
          'postage' : 'yes'
        } })
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);

          var renderArgs = Response.render.lastCall.args,
              transaction = renderArgs[1].transaction,
              epdqRequest = renderArgs[1].epdqRequest,
              formAttrs = epdqRequest.formAttributes(),
              viewName = renderArgs[0];

          viewName.should.equal('confirm');
          transaction.slug.should.equal('pay-register-birth-abroad');
          transaction.title.should.equal('Payment to register a birth abroad');
          transaction.document_cost.should.equal(65);
          transaction.postage_cost.should.equal(10);
          transaction.registration.should.equal(true);
          transaction.account.should.equal('birth-death-marriage');

          formAttrs['ACCEPTURL'].should.equal('http://pay-register-birth-abroad.gov.uk/done');
          formAttrs['ACCOUNT'].should.equal('birth-death-marriage');
          formAttrs['AMOUNT'].should.equal('86000');
          formAttrs['CURRENCY'].should.equal('GBP');
          formAttrs['LANGUAGE'].should.equal('en_GB');
          formAttrs['PSPID'].should.equal('5up3r53cr3t');

          renderArgs[1].journeyDescription.should.equal('pay-register-birth-abroad:confirm');

          done();
        });
    });
  });
});
