describe("Collection tests", function () {
	var collection, sortedCollection, subjects, unsortedSubjects, sortFn;

	beforeEach(function () {
		subjects = [];
		for (var i = 0; i < 5; i++) {
			var subject = new svc.ModifiableSubject();
			subject.set('key', i);
			subjects.push(subject);
		}

		unsortedSubjects = [];
		var subject2 = new svc.ModifiableSubject(); subject2.set('key', 2);
		var subject1 = new svc.ModifiableSubject(); subject1.set('key', 1);
		var subject3 = new svc.ModifiableSubject(); subject3.set('key', 3);

		unsortedSubjects.push(subject2);
		unsortedSubjects.push(subject1);
		unsortedSubjects.push(subject3);

		collection = new svc.Collection({ collection: subjects });
		var sortFn = function (mine) {
			return mine.get('key');
		};
		sortedCollection = new svc.Collection({ collection: unsortedSubjects, sortFunction: sortFn });
	});

	afterEach(function () {
		_.each(subjects, function (subject) {
			subject.destroy();
			subject = null;
		});
		_.each(unsortedSubjects, function (subject) {
			subject.destroy();
			subject = null;
		});
	});

	it('should be able to be created without any args', function () {
		var emptyCollection = new svc.Collection({});
		expect(emptyCollection.size()).toBe(0);	
	});

	it('should be able to be created with a collection and be the right size', function () {
		var newCollection = new svc.Collection({ collection: subjects });
		expect(newCollection.size()).toBe(5);
	});

	it('should be able to be created with a sort function that sorts the collection', function () {
		expect(sortedCollection.size()).toBe(3);

		expect(sortedCollection.at(0).get('key')).toBe(1);
		expect(sortedCollection.at(1).get('key')).toBe(2);
		expect(sortedCollection.at(2).get('key')).toBe(3);
	});

	it('should be able to retrieve an item at a particular index', function () {
		expect(collection.at(3)).toEqual(subjects[3]);
	});

	it('should be able to get an entry by the entry itself', function () {
		expect(collection.get(subjects[3])).toEqual(subjects[3]);
		// getting null will give you null back
		expect(collection.get(null)).toEqual(null);
	});
	
	it('should be able to retrieve all the items in a collection', function () {
		expect(collection.getAll()).toEqual(subjects);
	});

	it('should be able to get the index of an entry', function () {
		expect(collection.indexOf(null)).toBe(-1);
		expect(collection.indexOf(subjects[3])).toBe(3);
	});

	it('should be able to verify that an index is in range', function () {
		expect(collection.inRange(-1)).toBe(false);
		expect(collection.inRange(0)).toBe(true);
		expect(collection.inRange(4)).toBe(true);
		expect(collection.inRange(5)).toBe(false);
	});

	it('should be able to clear out the contents of the collection', function () {
		spyOn(collection, 'notify').andCallThrough();
		subjects.forEach(function (subject) {		
			spyOn(subject, 'notify').andCallThrough();
		});
		expect(collection.size()).toBe(5);
		collection.clear();
		expect(collection.size()).toBe(0);
		expect(collection.notify).toHaveBeenCalled();
		expect(collection.notify).toHaveBeenCalledWith('collection:clear');
		subjects.forEach(function (subject) {		
			expect(subject.notify).toHaveBeenCalled();
			expect(subject.notify).toHaveBeenCalledWith('collection:clear');
		});
	});

	it('should be able to remove an entry from the collection', function () {
		spyOn(collection, 'notify').andCallThrough();
		subjects.forEach(function (subject) {		
			spyOn(subject, 'notify').andCallThrough();
		});
		expect(collection.size()).toBe(5);
		var removed = collection.remove(subjects[2]);
		expect(removed).toEqual(subjects[2]);
		expect(collection.size()).toBe(4);
		expect(collection.notify).toHaveBeenCalled();
		expect(collection.notify).toHaveBeenCalledWith('collection:remove', subjects[2]);
		subjects.forEach(function (subject, i) {
			if (i == 2) {
				expect(subject.notify).toHaveBeenCalled();
				expect(subject.notify).toHaveBeenCalledWith('collection:remove');
			} else {
				expect(subject.notify).not.toHaveBeenCalled();
			}
		});
		expect(collection.get(subjects[2])).toEqual(null);

	});

	it('should be able to add an entry from the collection', function () {
		spyOn(collection, 'notify').andCallThrough();
		expect(collection.size()).toBe(5);
		var newSubject = new svc.ModifiableSubject();
		newSubject.set('key', 6);
		spyOn(newSubject, 'notify').andCallThrough();
		collection.add(newSubject);
		expect(collection.size()).toBe(6);
		expect(collection.notify).toHaveBeenCalled();
		expect(collection.notify).toHaveBeenCalledWith('collection:add', newSubject);
		expect(newSubject.notify).toHaveBeenCalled();
		expect(newSubject.notify).toHaveBeenCalledWith('collection:add');
		expect(collection.get(newSubject)).toEqual(newSubject);

	});
});
