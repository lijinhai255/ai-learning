interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// 帮我提取出来用户 id，name 变成新类型
type IdName = Pick<User, "id" | "name">;
// 帮我去除用户 password 字段
type RemovePassword = Omit<User, 'password'>

// 不用 Pick 类型，自己实现一个 Pick 类型
type MiaomaPick<U, K extends keyof U> = {
    [P in K]: U[P]
}

type IdName2 = MiaomaPick<User, 'id' | 'name'>


// 不用 Omit 类型，自己实现一个 Omit 类型
type MiaomaOmit<U, K extends keyof U> = {
    [P in keyof U as P extends K ? never : P]: U[P]
}
type RemovePassword2 = MiaomaOmit<User, 'password'>




// 学习更多的内置工具类型
// 1. Pick 类型
// 2. Omit 类型
// 3. Record 类型
// 4. Partial 类型
// 5. Required 类型
// 6. Readonly 类型
// 7. NonNullable 类型
// 8. Exclude 类型
// 9. Extract 类型
// 10. Never 类型

// 实现一个 Record 类型
type MiaomaRecord<K extends string | number | symbol, T> = {
    [P in K]: T
}

// 实现一个 Partial 类型
type MiaomaPartial<U> = {
    [P in keyof U]?: U[P]
}