// AjaxSingleRequestController
// -------------

// This creates a simple mutex lock on AJAX queries so that only one happens at a time. It inherits from
// the normal `AjaxController`
svc.AjaxSingleRequestController = Class.create(svc.AjaxController, {
	// Our initializer is the same as `AjaxController`.
	initialize: function ($super, args) {
		$super(args);
		this._inProgress = false;
	},
	
	// Make a request if nothing is in progress.
	makeRequest: function ($super, args, callback) {
		if (this._inProgress) { return false; }
		this.setProgress(true);
		$super(args, callback);
	},

	setProgress: function (progress) {
		this._inProgress = progress;
	},

	// When the request finishes, unlock the progress lock
	onComplete: function () { this.setProgress(false); }
});
