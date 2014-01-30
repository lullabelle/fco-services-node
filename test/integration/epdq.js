var app = require('./../../app'),
    http = require('http'),
    request = require('supertest'),
    should = require('should'),
    sinon = require('sinon'),
    Transaction = require('./../../models/transaction');

describe("epdq routes", function(){
  describe("start", function(){
    it("should find the appropriate transaction", function(done){
      request(app)
        .get('/start')
        .set('host','pay-register-death-abroad.gov.uk')
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);
          res.text.should.match(/pay-register-death-abroad:start/)
          done();
        });
    });
  });
});
