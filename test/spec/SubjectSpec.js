describe("Subject tests", function () {
	var subject;

	beforeEach(function () {
		subject = new svc.Subject();
	});

	afterEach(function () {
		subject.destroy();
		subject = null;
	});

	it("should be able to be created", function () {
		expect(true).toBe(true); // we got here
		expect(subject._notificationToObservers).toEqual({});
	});

	it("should be equal to itself", function () {
		expect(subject.isEqual(subject)).toBe(true);
	});

	it("should notify that it is going to destroy itself", function () {
		spyOn(subject, 'notify').andCallThrough();

		subject.destroy();
		expect(subject.notify).toHaveBeenCalled();
		expect(subject.notify).toHaveBeenCalledWith('subject:destroy');
	});

	it("should subscribe, notify, and destroy a new notification", function () {
		spyOn(subject, 'notify').andCallThrough();

		var bar = 0;
		expect(subject._notificationToObservers).toEqual({});
		subject.subscribe('test', function () { bar += 1; });
		expect(subject._notificationToObservers).not.toEqual({});
		expect(subject._notificationToObservers.test.length).toEqual(1);
		expect(bar).toEqual(0);	
		subject.notify('test');
		expect(bar).toEqual(1);
		expect(subject.notify).toHaveBeenCalled();
		expect(subject.notify).toHaveBeenCalledWith('test');
		subject.notify.reset();
		subject.destroy();
		expect(subject.notify).toHaveBeenCalled();
		expect(subject.notify).toHaveBeenCalledWith('subject:destroy');
		expect(subject._notificationToObservers).toEqual({});
		subject.notify('test');
		expect(bar).toEqual(1);
	});

	it("should subscribe & unsubscribe from a notification", function () {
		spyOn(subject, 'notify').andCallThrough();
		var func = function () { bar += 1; };

		var bar = 0;
		expect(subject._notificationToObservers).toEqual({});
		subject.subscribe('test', func);
		expect(subject._notificationToObservers).not.toEqual({});
		expect(subject._notificationToObservers.test.length).toEqual(1);
		expect(bar).toEqual(0);	
		subject.notify('test');
		expect(bar).toEqual(1);
		expect(subject.notify).toHaveBeenCalled();
		expect(subject.notify).toHaveBeenCalledWith('test');
		subject.unsubscribe('test', func);
		expect(subject._notificationToObservers.test.length).toEqual(0);
		subject.notify('test');
		expect(bar).toEqual(1);
	});
});
