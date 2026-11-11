//#region src/4.generic.ts
var User = class {
	id;
	constructor(id) {
		this.id = id;
	}
	intro() {
		return this.id;
	}
};
new User("1").intro();
//#endregion
export {};

//# sourceMappingURL=4.generic.mjs.map