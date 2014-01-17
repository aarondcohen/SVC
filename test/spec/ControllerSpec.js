describe("Controller Tests", function () {
	it("should not fail to create a controller", function () {
		var c;
		expect(function () { c = new svc.Controller({}); }).not.toThrow();
	});
});
