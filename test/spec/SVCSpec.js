describe("SVC General Tests", function () {
	it("should compile", function () {
		expect(true).toBe(true);
	});

	it("should exist in the global namespace by default", function () {
		expect(svc).not.toBe(null);
	});

	it("should be versioned correctly", function () {
		expect(svc.VERSION).toBe("2.0");
	});
});
