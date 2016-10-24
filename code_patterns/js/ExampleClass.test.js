/**
 * [ NOTE ]
 * 
 * Split views in your IDE, and have one view be the file you want to test
 * and the other view be your test file.
 */  
describe('ExampleClass', function(){
  /**
   * [ NOTE ]
   * 
   * Require any dependencies within the root `describe` so that a test file
   * can be skipped properly.
   */
  import ExampleClass from './ExampleClass.js';
  
  var sandbox, initStub, exampleClass;
  
  beforeEach(function(){
    sandbox = sinon.sandbox.create();
    
    /**
     * [ NOTE ]
     * 
     * For methods that execute within a constructor you'll need to stub them
     * out on the prototype to ensure they don't execute.
     */
    initStub = sandbox.stub(ExampleClass.prototype, 'init');
    
    exampleClass = new ExampleClass();
  });
  
  afterEach(function(){
    sandbox.restore();
  });
  
  it("should be defined", function(){
    exampleClass.should.be.a.function;
  });
  
  describe('init', function(){
    /**
     * [ NOTE ]
     * 
     * Since `init` was stubbed out above, we now need to restore it so it can
     * be tested here.
     */
    beforeEach(function(){
      initStub.restore();
    });
    
    it("should initialize the component", function(){    
      /**
       * [ NOTE ]
       * 
       * Utility methods or methods that don't cause any sort of mutation on the
       * DOM can use spies. Methods that setup listeners, make network requests,
       * etc. should use stubs.
       */
      var logSpy = sandbox.spy(window.console, 'log');
      var templateStub = sandbox.stub(exampleClass.templates, 'EXAMPLE_TEMPLATE');
      var findSpy = sandbox.spy($.fn, 'find');
      var addListenersStub = sandbox.stub(exampleClass, 'addListeners');
      
      exampleClass.init();
      
      /**
       * [ NOTE ]
       * 
       * For methods that get called with arguments, you need to use `calledWith`
       * and check that the arguments passed are the correct value or the 
       * correct type. For simple values like Booleans & Strings you check the 
       * exact value. For Objects, Arrays, & Functions you can just use sinon's 
       * `match` API to verify the type.
       */
      logSpy.should.be.calledWith(exampleClass.LOG_PREFIX, sinon.match.string);
      templateStub.should.be.calledWith({
        cssClassPrefix: exampleClass.cssClassPrefix,
        jsPrefix: exampleClass.jsPrefix.replace('.', ''),
        navURLs: sinon.match.array,
        props: sinon.match({
          fu: exampleClass.randomProp
        })
      });
      findSpy.should.be.calledWith(exampleClass.selectors.NAV_ITEM);
      addListenersStub.should.be.called;
    });
  });
  
  describe('addListeners', function(){
    
    it("should add listeners to component elements", function(){    
      var onStub = sandbox.stub($.fn, 'on');
      sandbox.stub(exampleClass.handleNavItemClick, 'bind').returns('handleNavItemClick');
      
      exampleClass.addListeners();
      
      /**
       * [ NOTE ]
       * 
       * Since handlers that use the `bind` event return an anoymous function we
       * can't check that the 3rd argument is the function on our Class. Instead
       * we stub out the bind of the handler to return the function name so we
       * can verify that the correct function is passed.
       */
      onStub.should.be.calledWith(exampleClass.events.CLICK, exampleClass.selectors.NAV_ITEM, 'handleNavItemClick');
    });
  });
  
  describe('handleNavItemClick', function(){
    var def, ajaxStub;
    
    beforeEach(function(){
      /**
       * [ NOTE ]
       * 
       * For `ajax` requests you'll want to stub it out and return a Defer Object
       * that you can `resolve` or `reject` based on your test case. We're not
       * going to resolve or reject in this case because the code was setup
       * properly with handlers rather than anonymous functions.
       */
      def = $.Deferred();
      ajaxStub = sandbox.stub($, 'ajax', function(){
        return def;
      });
    });
    
    it("should get nav item data", function(){
      var doneSpy = sandbox.spy(def, 'done');
      var failSpy = sandbox.spy(def, 'fail');
      sandbox.stub(exampleClass.handleNavItemSuccess, 'bind').returns('handleNavItemSuccess');
      sandbox.stub(exampleClass.handleNavItemFailure, 'bind').returns('handleNavItemFailure');
      
      exampleClass.handleNavItemClick(null);
      
      ajaxStub.should.be.calledWith({
        url: exampleClass.urls.NAV_ITEM,
        data: {
          fu: 'bar'
        }
      });
      doneSpy.should.be.calledWith('handleNavItemSuccess');
      failSpy.should.be.calledWith('handleNavItemFailure');
    });
  });
  
  describe('handleNavItemSuccess', function(){
    var respMock;
    
    beforeEach(function(){
      respMock = '{"fu":"bar"}';
    });
    
    it("should handle the service response", function(){
      var logStub = sandbox.stub(window.console, 'log');
      var parseSpy = sandbox.spy(window.JSON, 'parse');
      
      exampleClass.handleNavItemSuccess(respMock);
      
      logStub.should.be.calledWith({ fu: 'bar' });
      parseSpy.should.be.calledWith( respMock );
    });
  });
  
  describe('handleNavItemFailure', function(){
    var respMock;
    
    beforeEach(function(){
      /**
       * [ NOTE ]
       * 
       * There are times when you need to fast-forward if `setTimeout` or 
       * `setInterval` are being used. This is when the `clock` API comes in use.
       * First you need to setup `useFakeTimers`, then just call `clock.tick` like below.
       */
      sandbox.clock = sinon.useFakeTimers();
      respMock = 'Something has gone horribly wrong';
    });
    
    afterEach(function(){
      sandbox.clock.restore();
    });
    
    it("should handle the service response", function(){
      var setTimeoutSpy = sandbox.spy(window, 'setTimeout');
      var errorStub = sandbox.stub(window.console, 'error');
      
      exampleClass.handleNavItemFailure(respMock);
      sandbox.clock.tick(exampleClass.errorWait);
      
      setTimeoutSpy.should.be.calledWith(sinon.match.func, exampleClass.errorWait);
      errorStub.should.be.calledWith( respMock );
    });
  });
});