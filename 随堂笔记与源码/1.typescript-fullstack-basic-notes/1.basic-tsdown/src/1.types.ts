
// 语法
// const xxx: type = xxxxx

// 原始类型
let isDone: boolean = true
let count: number = 42
let name: string = "TypeScript"

// 数组
let list: number[] = [1, 2, 3]
let list2: Array<number> = [1, 2, 3]

// 元组
let tuple: [string, number] = ["hello", 10]

// 枚举
enum Color { Red, Green, Blue }
let c: Color = Color.Green

// 特殊类型
let notSure: any = 4           // 放弃类型检查
let unknownValue: unknown = 4  // 安全的顶级类型
let noReturn: void = undefined // 函数无返回值
let empty: null = null
let notDefined: undefined = undefined
let neverEnd: never = (() => { throw new Error() })() // 永不存在的值