// 类型推导
// 在定义类型时，某些类型无从得知，我就先用占位推导的形式来推测他的类型
type HumanGender = "man" | "woman";

// 定义一个类型，推导给定的人，是 man 类型还是 woman 类型

// 如果说我现在是写函数
const isman = (h: "man" | "woman") => (h === "man" ? true : false);
type isMan<H> = H extends "man" ? true : false;

const m = "woman";
type Res = isMan<typeof m>;

// 推导
const sum = (a: string, b: string, c: number, d: boolean) => a + b;


// type PickParams<F> = F extends (a: number, b: number) => number ? true : false
type PickParams<F> = F extends (...args: infer P) => any ? P : never

type P = PickParams<typeof sum>


// 获取数组的第一个元素的类型
type Arr = [string, string, boolean]
const arr: Arr = ['1', '2', true]

// type First<A> = A extends any[] ? true : false
// type First<A> = A extends [infer F, ...args: any] ? true : false
type MFirst<A extends any[]> = A extends [infer F, ...any[]] ? F : never

type F = MFirst<Arr>