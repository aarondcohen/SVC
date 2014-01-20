describe("AjaxController tests", function () {
	var controller, TestAjaxController, complete, failure, success;

	beforeEach(function () {

		complete = failure = success = 0;

		TestAjaxController = Class.create(svc.AjaxController, {
			// The method called when the AJAX request is completed.
			onComplete: function () { 
				complete++; 
			},
			
			// The method called when the AJAX request fails.
			onFailure: function () { 
				failure++; 
			},
			
			// The method called when the AJAX request succeeds.
			onSuccess: function () { 
				success++; 
			}
		});
		controller = new TestAjaxController({actionPath: '/testPath'});	
	});

	afterEach(function () {
		complete = failure = success = 0;
	});

	it('should be created but throw errors without action path', function () {
		var c = new svc.AjaxController({ });
		expect(function () { c.path(); }).toThrow(new Error('AjaxController.js: path must be defined'));
	});

	it('should be created but does not throw errors without action method', function () {
		var c = new svc.AjaxController({});
		expect(function () { c.method(); }).not.toThrow();
	});

	it('should have an empty object for parameters by default', function () {
		expect(controller.parameters()).toEqual({});
	});

	it('should call the onComplete function for makeRequest', function () {
		window.$ = { 'ajax' : function (args) {
			args.complete();
		} };
		
		expect(complete).toBe(0);	
		controller.makeRequest();
		expect(complete).toBe(1);	
	});

	it('should call the onFailure function for makeRequest', function () {
		window.$ = { 'ajax' : function (args) {
			args.error();
		} };
		
		expect(failure).toBe(0);	
		controller.makeRequest();
		expect(failure).toBe(1);	
	});

	it('should call the standard onSuccess function for makeRequest', function () {
		window.$ = { 'ajax' : function (args) {
			args.success();
		} };
		
		expect(success).toBe(0);	
		controller.makeRequest();
		expect(success).toBe(1);	
	});

	it('should wrap the onSuccess function for makeRequest', function () {
		window.$ = { 'ajax' : function (args) {
			args.success();
		} };

		var wrap = 0;
		var fn = function (cb) {
			wrap++;
			cb();
		};
		
		expect(success).toBe(0);
		expect(wrap).toBe(0);
		controller.makeRequest({}, fn);
		expect(wrap).toBe(1);
		expect(success).toBe(1);
	});

	it('should extend parameters by default', function () {
		var params = {};
		window.$ = { 
			'ajax' : function (args) {
				params = args.data;
			} 
		};
		var c = new TestAjaxController({actionPath: '/foo'});
		expect(c.parameters()).toEqual({});
		c.makeRequest({b: 2});
		expect(params).toEqual({b:2});

	});
});
