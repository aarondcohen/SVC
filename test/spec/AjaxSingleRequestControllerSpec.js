describe("AjaxSingleController tests", function () {
	var controller, TestAjaxSingleRequestController, complete, failure, success;

	beforeEach(function () {

		complete = failure = success = 0;

		TestAjaxSingleRequestController = Class.create(svc.AjaxSingleRequestController, {
			// The method called when the AJAX request is completed.
			onComplete: function ($super) { 
				complete++; 
				$super();
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
		controller = new TestAjaxSingleRequestController({actionPath: '/testPath'});	
	});

	afterEach(function () {
		complete = failure = success = 0;
	});

	it('should allow two separate requests to be made', function () {
		window.$ = { 'ajax' : function (args) {
			args.complete();
		} };

		expect(complete).toBe(0);
		controller.makeRequest({});
		expect(complete).toBe(1);
		controller.makeRequest({});
		expect(complete).toBe(2);
	});

	it('should not allow separate requests to be made', function () {
		window.$ = { 'ajax' : function (args) {
			args.complete();
		} };

		expect(complete).toBe(0);
		controller.makeRequest({});
		controller.setProgress(true);
		expect(complete).toBe(1);
		controller.makeRequest({});
		expect(complete).toBe(1);
		controller.setProgress(false);
		controller.makeRequest({});
		expect(complete).toBe(2);
	});
});
