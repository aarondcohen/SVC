describe("ActionView tests", function () {
	var subject, element, TestView, count, fn, input, TestController;

	beforeEach(function () {
		subject = new svc.ModifiableSubject();
		subject.set('key', 1);
		
		element = document.createElement('div');
		element.id = 'action-test-id';

		input = document.createElement('input');
		input.id = 'action-test-input-id';

		element.appendChild(input);

		document.body.appendChild(element);

		TestView = Class.create(svc.ActionView, {
			initialize: function ($super, args) {
				$super(args);
				this.subscribe("subject:change:foo", fn);
			},
			draw: function () {
				this._field = document.getElementById('action-test-input-id');
				return document.getElementById('action-test-id');
			}
		});

		TestController = Class.create(svc.Controller, {
			foo: function (subject) {
				subject.notify('subject:change:foo'); 
			}
		});

		count = 0;
		fn = function foo() {
			count++;
		};
	});

	afterEach(function () {
		subject.destroy();
		subject = null;

		document.body.removeChild(element);
		element = null;
	});

	it('should fail to be created without a draw method', function () {
		expect(function () { new svc.ActionView({}); }).toThrow(new Error('View.js: draw must be defined in a subclass.'));
	});

	it('should create a view with draw implemented', function () {	
		var v, subj = new svc.ModifiableSubject(), c = new TestController();
		expect(function () { v = new TestView({subject: subj, controller: c, action: 'foo'}); }).not.toThrow();
		spyOn(subj, 'notify').andCallThrough();
		spyOn(v, 'unsubscribeAll').andCallThrough();

		expect(v.getField()).toEqual(input);

		expect(count).toBe(0);
		v.fire();
		expect(count).toBe(1);

		subj.destroy();

		expect(subj.notify).toHaveBeenCalled();
		expect(subj.notify).toHaveBeenCalledWith('subject:destroy');

		expect(v.unsubscribeAll).toHaveBeenCalled();
	});
});
