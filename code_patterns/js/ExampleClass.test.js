describe('ExampleClass', function(){
  // require any dependencies here
  
  var sandbox = undefined;
  var exampleClass = undefined;
  
  beforeEach(function(){
    sandbox = sinon.sandbox.create();
    exampleClass = new ExampleClass();
  });
  
  afterEach(function(){
    sandbox.restore();
  });
  
  it("should be defined", function(){
    exampleClass.should.be.a.function;
  });
  
  describe('init', function(){
    it("should initialize the component", function(){
      var logSpy = sandbox.spy(window.console, 'log');
      var templateStub = sandbox.stub(exampleClass.templates, 'EXAMPLE_TEMPLATE');
      var findSpy = sandbox.spy($.fn, 'find');
      
      exampleClass.init();
      
      logSpy.should.be.calledWith(exampleClass.LOG_PREFIX, sinon.match.string);
      templateStub.should.be.calledWith({
        cssClassPrefix: exampleClass.cssClassPrefix,
        jsPrefix: exampleClass.jsPrefix.replace('.', ''),
        navURLs: sinon.match.array
      });
      findSpy.should.be.calledWith(exampleClass.selectors.NAV_ITEM);
    });
  });
});