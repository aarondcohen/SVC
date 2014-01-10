describe('View tests', function () {

	var subject, element, TestView, count, fn;

	beforeEach(function () {
		subject = new svc.ModifiableSubject();
		subject.set('key', 1);
		
		element = document.createElement('div');
		element.id = 'test-id';

		document.body.appendChild(element);

		TestView = Class.create(svc.View, {
			draw: function () {
				return document.getElementById('test-id');
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

	it('should not create a native view by default', function () {
		expect(function () { new svc.View({}); }).toThrow(new Error('View.js: draw must be defined in a subclass.'));
	});

	it('should create a view with draw implemented and teardown correctly', function () {
		var v, subj = new svc.ModifiableSubject();
		expect(function () { v = new TestView({subject: subj}); }).not.toThrow();
		spyOn(subj, 'notify').andCallThrough();
		spyOn(v, 'unsubscribeAll').andCallThrough();

		subj.destroy();

		expect(subj.notify).toHaveBeenCalled();
		expect(subj.notify).toHaveBeenCalledWith('subject:destroy');

		expect(v.unsubscribeAll).toHaveBeenCalled();
	});

	it('should be able to get data out of the view', function () {
		var v = new TestView({subject: subject});
		expect(v.getElement()).toEqual(element);
		expect(v.getSubject()).toEqual(subject);
	});

	it('should be able to subscribe to & unsubscribe from new functions', function () {
		var v = new TestView({subject: subject});
		
		v.subscribe('test', fn);
		expect(count).toBe(0);
		subject.notify('test');
		expect(count).toBe(1);

		v.unsubscribe('test');
		subject.notify('test');
		expect(count).toBe(1);
	});
});
