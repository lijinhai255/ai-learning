// 自定义类型
// type
type User = {
  name: string;
  age: number;
};

const heyi: User = {
  name: "heyi",
  age: 18,
};
// interface、class 生成类类型
interface UserLike {
  name: string;
  say(): void;
}

class CUser implements UserLike {
    constructor(name: string) {
        this.name = name
    }

    name: string;

    say(): void {
        
    }
}


// type 和 interface 有什么区别？