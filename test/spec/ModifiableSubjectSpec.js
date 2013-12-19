describe("ModifiableSubject tests", function () {
	var subject;

	beforeEach(function () {
		subject = new svc.ModifiableSubject();
		spyOn(subject, 'notify').andCallThrough();
	});

	afterEach(function () {
		subject.notify.reset();
		subject.destroy();
		subject = null;
	});

	it("should be able to be created, and be clean by default", function () {
		expect(subject.isDirty()).toBe(false);
	});

	it("should be able to be set as dirty & clean and notified of each", function () {
		expect(subject.isDirty()).toBe(false);		
		subject.dirty();
		expect(subject.isDirty()).toBe(true);
		expect(subject.notify).toHaveBeenCalled();
		expect(subject.notify).toHaveBeenCalledWith('subject:dirty');

		subject.clean();
		expect(subject.isDirty()).toBe(false);
		expect(subject.notify).toHaveBeenCalled();
		expect(subject.notify).toHaveBeenCalledWith('subject:clean');

		expect(subject.notify.calls.length).toBe(2);
	});

	it("should be able to get and set attributes and read the list of properties", function () {
		expect(subject.properties()).toEqual([]);
		subject.set('test', 1);
		expect(subject.properties()).toEqual(['test']);
		expect(subject.notify).toHaveBeenCalled();
		expect(subject.notify).toHaveBeenCalledWith('subject:change:test');
		subject.set('foo', 2);
		expect(subject.properties()).toEqual(['test', 'foo']);
		expect(subject.notify).toHaveBeenCalled();
		expect(subject.notify).toHaveBeenCalledWith('subject:change:foo');
		subject.set('bar', 3);
		expect(subject.properties()).toEqual(['test', 'foo', 'bar']);
		expect(subject.notify).toHaveBeenCalled();
		expect(subject.notify).toHaveBeenCalledWith('subject:change:bar');

		expect(subject.get('test')).toBe(1);
		expect(subject.get('foo')).toBe(2);
		expect(subject.get('bar')).toBe(3);
	});

	it("should be able to set data silently", function () {
		expect(subject.properties()).toEqual([]);
		subject.set('test', 1, true);
		expect(subject.properties()).toEqual(['test']);
		expect(subject.notify).not.toHaveBeenCalled();
		expect(subject.notify).not.toHaveBeenCalledWith('subject:change:test');
		expect(subject.get('test')).toBe(1);
	});

});
