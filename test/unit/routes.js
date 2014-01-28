var routes = require('./../../routes'),
    should = require('should'),
    request = {},
    response = {
      view : null, data : {},
      render : function(view, data){
        this.view = view;
        this.data = data;
      }
    };

describe('index route', function() {
  it('should route to the index view', function(){
    routes.index(request, response);
    response.view.should.equal('index');
    response.data.title.should.equal('Express');
  });
});
