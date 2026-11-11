// 注解的本质是面向切面编程。
// 什么是面切面编程呢？比如说我提前在一个类属性、方法全部定义好了细节以后，但是我后续呢，不想去侵入它里面的代码来完成。所以我们就需要通过注解的方式，在函数体的开头或者是类的开头，去通过注解的方式，非常优雅的给它注入一些新的特性。

function LogClass(constructor: Function) {
  console.log("类的注解", constructor);
}

function LogProperty() {
  return (target: any, name: string) => {
    Reflect.set(target, name, "属性注解");
    console.log("属性的注解", target, name);
  };
}

function LogMethod() {
  return (target: any, name: string) => {
    console.log("方法的注解", target, name);
  };
}

@LogClass
class User {
    // ......
    @LogProperty()
    name?: string

    @LogMethod()
    say() {
        console.log(1)
    }
}

const user = new User()
user.name
user.say()