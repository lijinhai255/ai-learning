//#region \0@oxc-project+runtime@0.150.0/helpers/esm/decorate.js
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
//#endregion
//#region src/8.annotation.ts
function LogClass(constructor) {
	console.log("类的注解", constructor);
}
function LogProperty() {
	return (target, name) => {
		Reflect.set(target, name, "属性注解");
		console.log("属性的注解", target, name);
	};
}
function LogMethod() {
	return (target, name) => {
		console.log("方法的注解", target, name);
	};
}
let User = class User {
	name;
	say() {
		console.log(1);
	}
};
__decorate([LogProperty()], User.prototype, "name", void 0);
__decorate([LogMethod()], User.prototype, "say", null);
User = __decorate([LogClass], User);
const user = new User();
user.name;
user.say();
//#endregion
export {};

//# sourceMappingURL=8.annotation.mjs.map