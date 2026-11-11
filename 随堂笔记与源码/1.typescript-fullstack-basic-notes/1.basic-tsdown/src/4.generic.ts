// 为什么需要泛型？

// 可以返回字符串，也可以返回数字
// function getDetail(): string | number {
//     return true
// }

// 问题：动态的，根据函数参数有关
// 函数形参和实现
// 类型泛型，宽泛的类型
function getDetail<T, U, V>(info: T, info1: U, info2: V): [T, U, V] {
  return [info, info1, info2];
}

const getDetail2 = <T, U, V>(info: T, info1: U, info2: V): [T, U, V] => [
  info,
  info1,
  info2,
];

getDetail({}, "1", 2);
getDetail2({}, "1", 2);

class User<Id, Name, Age> {
  id: Id;
  constructor(id: Id) {
    this.id = id;
  }

  intro() {
    return this.id
  }
}
const user= new User('1')
user.intro()



interface IUser<N> {
    name: N;
    intro(): N
}