# TypeScript 基础与 Java 对照学习路线

这份笔记面向已经接触过 Java，准备系统学习 TypeScript 的开发者。目标是把 Java 中已经熟悉的概念当作坐标，再补上 TypeScript 和 JavaScript 的运行时差异。

## 先建立三条坐标轴

| 维度       | Java                                  | TypeScript                                             |
| ---------- | ------------------------------------- | ------------------------------------------------------ |
| 类型检查   | 编译阶段检查，字节码运行在 JVM 上     | 编译阶段检查，类型信息通常会在生成 JavaScript 时被移除 |
| 类型关系   | 以名义类型和继承关系为主              | 以结构类型为主，形状满足即可赋值                       |
| 并发模型   | 线程、线程池、锁、`CompletableFuture` | JavaScript 事件循环、Promise、异步 I/O                 |
| 空值模型   | `null`，常配合 `Optional`             | `null` 与 `undefined` 并存，通常用联合类型表达         |
| 集合模型   | `List`、`Map`、`Set` 等接口体系       | `Array`、`Map`、`Set`，配合高阶函数处理                |
| 运行时反射 | 类、注解和泛型有不同程度的运行时信息  | `interface`、`type` 和泛型默认不保留在运行时           |
| 模块系统   | package、类路径、Maven 或 Gradle      | ES Module、`import`、`export`、npm 或 pnpm             |

TypeScript 负责帮助你在开发阶段发现错误，JavaScript 负责真正运行。外部 JSON、表单、网络响应进入程序后，仍然需要运行时校验，类型声明不会自动把数据变成安全对象。

## 总体对应表

| Java 基础概念                    | TypeScript 对应写法                   | 学习时要记住的差异                                                |
| -------------------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| `int`、`double`                  | `number`                              | 没有内置的整数和浮点类型区分，精确大整数使用 `bigint`             |
| `byte`、`short`、`long`、`float` | `number` 或 `bigint`                  | 普通数值统一为 `number`，超过安全整数范围时再考虑 `bigint`        |
| `boolean`、`char`、`String`      | `boolean`、字符串                     | 没有独立的 `char`，单字符也是字符串                               |
| 局部变量                         | `let`、`const`                        | `const` 限制变量重新赋值，不代表对象内容不可变                    |
| `final` 常量                     | `const`、`as const`                   | `as const` 还能保留字面量和只读属性                               |
| 数组 `T[]`                       | `T[]`、`Array<T>`                     | 数组也是对象，提供 `map`、`filter`、`reduce` 等方法               |
| `List<T>`                        | `T[]`                                 | 常用集合操作直接调用数组方法                                      |
| `Map<K,V>`、`Set<T>`             | `Map<K,V>`、`Set<T>`                  | API 相似，但对象键和数组仍是最常用的数据结构                      |
| 方法                             | 函数、方法、箭头函数                  | 函数是一等值，可以传递、返回和保存到变量                          |
| `class`                          | `class`                               | 语法接近 Java，继承模型和运行时行为仍遵循 JavaScript              |
| `static`、`abstract`             | `static`、`abstract`                  | 关键字相近，抽象约束仍只在类型检查和类运行时行为中生效            |
| `extends`、`implements`          | `extends`、`implements`               | 类继承和接口实现语法相近，接口本身没有运行时值                    |
| `interface`                      | `interface`                           | 主要用于编译期约束，默认不会出现在运行时                          |
| DTO、记录对象                    | `type` 或 `interface`                 | 可用联合类型和交叉类型精确描述数据形状                            |
| 方法重载                         | 重载签名                              | 只影响类型检查，运行时仍只有一个函数实现                          |
| 泛型 `<T>`                       | 泛型 `<T>`                            | 结构类型让泛型更灵活，约束通常用 `extends`                        |
| `enum`                           | `enum`、字符串字面量联合              | 新代码常优先使用字符串联合，生成代码更直接                        |
| `Optional<T>`                    | `T \| undefined`、`T \| null`         | 需要明确区分缺少字段和字段值为空                                  |
| `try/catch`                      | `try/catch`                           | 没有 checked exception，失败契约要靠类型和文档约定                |
| `throws`                         | `Promise<T>` 配合运行时异常或结果类型 | `async` 函数的返回值一定是 Promise                                |
| `CompletableFuture<T>`           | `Promise<T>`                          | 组合方式相近，调度基础完全不同                                    |
| package                          | 目录和 ES Module                      | 每个文件可以是模块，导入导出由代码明确表达                        |
| 注解                             | Decorator 或普通函数                  | Decorator 需要配置，Java 注解语义需要按 TypeScript 运行时重新设计 |
| Stream API                       | 数组高阶函数、迭代器、生成器          | 常见转换直接用 `map`、`filter`、`reduce`                          |

## 第一阶段，补齐 JavaScript 基础语法

TypeScript 继承了 JavaScript 的表达式和运行时规则。先掌握下面内容，再进入复杂类型，否则会出现类型写对了、运行结果却不符合预期的情况。

### 变量、基本值和模板字符串

```ts
const appName = 'todo';
let completedCount = 0;
const message = `${appName} 已完成 ${completedCount} 项`;

completedCount += 1;
```

Java 对照写法如下。

```java
final String appName = "todo";
int completedCount = 0;
String message = appName + " 已完成 " + completedCount + " 项";

completedCount += 1;
```

使用规则可以这样记。

- 默认使用 `const`。
- 需要重新赋值时使用 `let`。
- 避免使用 `var`，它的函数作用域和提升行为容易掩盖错误。
- 字符串优先使用反引号模板字符串，插值写成 `${expression}`。
- `===` 用于严格相等，日常代码不依赖会进行隐式类型转换的 `==`。

### 条件、循环和短路运算

```ts
if (completedCount > 0) {
  console.log('已有完成项');
} else {
  console.log('暂时没有完成项');
}

for (let index = 0; index < 3; index += 1) {
  console.log(index);
}

const title = inputTitle ?? '未命名任务';
const label = inputTitle || '未命名任务';
```

`??` 只在左侧为 `null` 或 `undefined` 时使用默认值。`||` 会把空字符串、`0` 和 `false` 也当作需要回退的值。业务含义允许空字符串时，应优先使用 `??`。

数组遍历通常写成下面这样。

```ts
const titles = todos.filter((todo) => !todo.completed).map((todo) => todo.title);

for (const todo of todos) {
  console.log(todo.title);
}
```

Java 的 `forEach`、Stream `filter` 和 `map` 能帮助理解这些操作，但 TypeScript 里的回调函数可以捕获外层变量，`this` 行为也需要单独学习。

### 函数与箭头函数

```ts
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;

function greet(name = '朋友', prefix?: string): string {
  return `${prefix ?? '你好'}，${name}`;
}
```

对应的 Java 思路是方法签名和默认参数的组合。TypeScript 的参数可以是可选的，也可以设置默认值。

- `prefix?: string` 等价于参数可能缺失，类型可理解为 `string | undefined`。
- 默认参数会在参数为 `undefined` 时生效。
- 箭头函数没有自己的 `this`，会捕获外层 `this`。
- 普通函数的 `this` 由调用方式决定，按 Java 的实例方法理解会产生偏差。

## 第二阶段，掌握类型系统

### 类型推断优先，显式标注补充边界

```ts
const count = 3; // 推断为 number
let status = 'idle'; // 推断为 string

const userId: string = 'u-001';
let retries: number = 0;
```

局部变量通常让 TypeScript 推断类型，函数参数、返回值、公共接口和外部边界建议显式写出。这样可以让错误更早暴露，也能让 API 更容易阅读。

### 基本类型和特殊类型

| 类型        | 用途                     | 例子                          |
| ----------- | ------------------------ | ----------------------------- |
| `string`    | 文本                     | `'todo'`                      |
| `number`    | 数字                     | `42`、`3.14`                  |
| `boolean`   | 真值                     | `true`                        |
| `bigint`    | 大整数                   | `9007199254740993n`           |
| `symbol`    | 唯一标识                 | `Symbol('id')`                |
| `null`      | 明确为空                 | `null`                        |
| `undefined` | 缺失或尚未赋值           | `undefined`                   |
| `unknown`   | 未知输入，使用前必须收窄 | `JSON.parse(text) as unknown` |
| `any`       | 关闭大部分类型检查       | 仅在迁移旧代码等局部场景使用  |
| `never`     | 不会正常返回的分支       | 抛异常或穷尽判断              |
| `void`      | 函数没有有用返回值       | `(): void`                    |

`unknown` 是接收外部数据的首选。`any` 会让错误扩散到调用方，应把它限定在迁移边界等少数位置。

### `tsconfig` 是类型检查的开关

类型写得很严谨，如果编译配置没有打开严格检查，很多收益仍然拿不到。学习项目至少应明确下面几项，具体模块配置可按浏览器、Node.js 或构建工具调整。

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true
  }
}
```

Java 开发者可以把 `strict` 理解为一组更严格的编译期约束。它会影响空值、隐式 `any`、函数参数和类字段等检查。`noEmit` 适合只让 TypeScript 做检查的前端工程，后端或库项目则应根据构建流程决定是否输出 JavaScript 和声明文件。

### 数组、元组和只读

```ts
const ids: string[] = ['a', 'b'];
const scores: Array<number> = [90, 95];
const entry: [string, number] = ['math', 95];

const defaultTags = ['typescript', 'java'] as const;
const readonlyIds: readonly string[] = ['a', 'b'];
```

Java 的数组和集合通常需要先声明元素类型。TypeScript 里 `T[]` 与 `Array<T>` 等价。元组适合表达固定长度、固定位置的值，`readonly` 用于限制通过当前引用修改数据。

### 对象类型、类型别名和接口

```ts
type TodoId = string;

interface Todo {
  readonly id: TodoId;
  title: string;
  completed: boolean;
  description?: string;
}

type TodoPatch = Partial<Pick<Todo, 'title' | 'completed'>>;
```

`interface` 适合描述可被实现或扩展的对象契约，`type` 适合联合类型、交叉类型、元组和工具类型。两者都能描述对象形状，团队应保持一种清晰的使用约定。

Java 对照可以这样理解。

- `interface Todo` 接近 Java interface 加一组属性访问约定。
- `type Todo` 接近 DTO、记录类或数据传输对象的类型描述。
- `readonly` 表示当前类型视角下不可重新赋值，运行时仍需注意对象是否真的被冻结。
- `description?` 表示字段可以缺失，读取后需要处理 `undefined`。

### 联合类型与交叉类型

```ts
type LoadingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Todo[] }
  | { status: 'error'; message: string };

type Identified = { id: string };
type Timestamped = { createdAt: Date };
type Entity = Identified & Timestamped;
```

联合类型 `A | B` 表示值属于多个候选类型之一，交叉类型 `A & B` 表示同时满足多个类型。带有固定字面量字段的联合类型称为可辨识联合，适合表达状态机和 API 响应。

```ts
function getMessage(state: LoadingState): string {
  switch (state.status) {
    case 'idle':
      return '尚未开始';
    case 'loading':
      return '加载中';
    case 'success':
      return `共 ${state.data.length} 项`;
    case 'error':
      return state.message;
  }
}
```

如果新增了状态但忘记处理，配合 `never` 可以让编译器提醒你。

```ts
function assertNever(value: never): never {
  throw new Error(`未处理的状态: ${String(value)}`);
}
```

### 类型收窄和类型守卫

```ts
function printId(id: string | number): string {
  if (typeof id === 'number') {
    return id.toFixed(0);
  }
  return id.toUpperCase();
}

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.completed === 'boolean'
  );
}
```

Java 开发者可以把类型收窄理解为运行前的分支证明。`typeof`、`in`、`instanceof` 和自定义类型守卫都会帮助编译器在分支内部得到更具体的类型。

`as Todo` 只是告诉编译器相信这件事，不会检查 JSON 是否真的符合 `Todo`。网络边界应采用 schema 校验库或手写守卫，再把结果转换为业务类型。

## 第三阶段，函数类型和面向对象

### 函数类型、回调和高阶函数

```ts
type Comparator<T> = (left: T, right: T) => number;

function maxBy<T>(items: T[], compare: Comparator<T>): T | undefined {
  if (items.length === 0) {
    return undefined;
  }

  return items.reduce((current, item) => (compare(item, current) > 0 ? item : current));
}
```

Java 中通常用接口、函数式接口和 Lambda 表达同类能力。TypeScript 可以直接把函数写进变量、参数和返回值类型里。回调接口过于复杂时，先用函数类型别名保持公开接口最小。

### 类、访问修饰符和参数属性

```ts
class TodoService {
  constructor(private readonly repository: TodoRepository) {}

  async complete(id: string): Promise<Todo> {
    const todo = await this.repository.findById(id);
    if (!todo) {
      throw new Error('任务不存在');
    }

    return this.repository.save({ ...todo, completed: true });
  }
}
```

TypeScript 类的构造器参数可以直接声明为属性，这叫参数属性。`public`、`protected`、`private` 主要服务于类型检查，`#field` 才是 JavaScript 运行时的私有字段。

```ts
class Counter {
  #value = 0;

  increment(): void {
    this.#value += 1;
  }
}
```

Java 与 TypeScript 的类语法相似，以下地方要重点区分。

- Java 的方法重载可以有多个实现签名，TypeScript 运行时仍然只有一个实现函数。
- TypeScript 的 `interface` 在运行时不存在，也没有 `instanceof` 判断接口的运行时依据。
- TypeScript 默认允许结构相同的对象互相赋值，类来源只是一项背景信息。
- 类字段在严格模式下应明确初始化，避免读取到 `undefined`。

### 接口实现与结构类型

```ts
interface Repository<T> {
  findById(id: string): Promise<T | undefined>;
  save(value: T): Promise<T>;
}

class InMemoryTodoRepository implements Repository<Todo> {
  constructor(private readonly items: Todo[]) {}

  async findById(id: string): Promise<Todo | undefined> {
    return this.items.find((item) => item.id === id);
  }

  async save(value: Todo): Promise<Todo> {
    return value;
  }
}
```

只要一个对象拥有契约所需的成员，就可以传入 `Repository<Todo>`。这和 Java 中显式 `implements` 的使用体验相近，但类型兼容基础更偏向对象形状。

## 第四阶段，泛型和工具类型

泛型的核心问题是保留类型信息。先掌握函数、接口和类上的泛型，再学习 `keyof`、`typeof`、条件类型等高级写法。

### 泛型函数

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const firstTodo = first<Todo>(todos);
const firstId = first(['a', 'b']);
```

Java 对照是 `static <T> T first(List<T> items)`。TypeScript 经常可以从参数推断出 `T`，调用处不需要显式写泛型参数。

### 泛型约束

```ts
interface HasId {
  id: string;
}

function indexById<T extends HasId>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}
```

`T extends HasId` 表示泛型值至少具有 `id`。这组语法同时适用于任意满足结构的对象，语义侧重能力约束。

### `keyof`、索引访问和 `typeof`

```ts
function getProperty<T, K extends keyof T>(object: T, key: K): T[K] {
  return object[key];
}

const title = getProperty(todo, 'title');

const config = {
  retry: 3,
  timeoutMs: 5000,
} as const;

type Config = typeof config;
type TodoField = keyof Todo;
```

这组写法适合构建类型安全的通用工具。`keyof T` 得到属性名联合，`T[K]` 得到对应属性的值类型，`typeof value` 可以从值推导出类型。

### 映射类型、条件类型和 `infer`

```ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type ElementOf<T> = T extends readonly (infer Item)[] ? Item : never;

type TodoElement = ElementOf<readonly Todo[]>;
```

映射类型会遍历已有类型的属性，条件类型会根据类型关系选择结果，`infer` 可以在条件类型中提取待推断的部分。Java 没有完全对应的语法，最接近的理解是由编译器参与完成的类型变换。基础业务代码不需要频繁手写它们，优先复用内置工具类型。

### `satisfies` 和字面量保留

```ts
const statusLabels = {
  idle: '未开始',
  loading: '加载中',
  success: '已完成',
  error: '出错',
} satisfies Record<LoadingState['status'], string>;
```

`satisfies` 会检查对象是否符合目标类型，同时尽量保留对象自身更具体的推断结果。它适合配置表、路由表和状态映射，通常比直接写 `as Record<...>` 更能发现字段拼写错误。

### 常用工具类型

| 工具类型        | 含义                | Java 类比                        |
| --------------- | ------------------- | -------------------------------- |
| `Partial<T>`    | 所有属性可选        | 更新 DTO 或 Builder 中的可选字段 |
| `Required<T>`   | 所有属性必填        | 完整配置对象                     |
| `Readonly<T>`   | 所有属性只读        | 不可变视图                       |
| `Pick<T, K>`    | 选取部分属性        | 投影 DTO                         |
| `Omit<T, K>`    | 排除部分属性        | 去掉服务端生成字段的请求 DTO     |
| `Record<K, V>`  | 一组键到值的映射    | `Map` 的键值约束或对象字典       |
| `ReturnType<F>` | 提取函数返回值类型  | 根据工厂方法得到结果类型         |
| `Parameters<F>` | 提取函数参数元组    | 根据方法签名复用参数类型         |
| `Awaited<T>`    | 取得 Promise 最终值 | `CompletableFuture` 的结果类型   |

示例。

```ts
type CreateTodoInput = Omit<Todo, 'id'>;
type UpdateTodoInput = Partial<CreateTodoInput>;
type TodoById = Record<string, Todo>;

async function loadTodos(): Promise<Todo[]> {
  return todos;
}

type LoadedTodos = Awaited<ReturnType<typeof loadTodos>>;
```

工具类型应当服务于真实的类型复用。遇到一行很长、需要多次解释的条件类型时，优先拆成命名类型，保持可读性。

## 第五阶段，模块、错误和边界数据

### ES Module

```ts
// todo-types.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const DEFAULT_PAGE_SIZE = 20;
```

```ts
// todo-service.ts
import { DEFAULT_PAGE_SIZE, type Todo } from './todo-types';

export function takeFirstPage(items: Todo[]): Todo[] {
  return items.slice(0, DEFAULT_PAGE_SIZE);
}
```

Java 的 package 主要组织类名和编译产物，TypeScript 的模块由每个文件的 `import` 和 `export` 明确建立依赖。推荐使用具名导出，避免默认导出导致重命名和检索困难。

### 错误处理

```ts
async function saveTodo(todo: Todo): Promise<Todo> {
  try {
    return await repository.save(todo);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`保存任务失败: ${error.message}`);
    }
    throw new Error('保存任务失败');
  }
}
```

`catch` 里的值应按 `unknown` 处理。TypeScript 没有 Java 的 checked exception，函数签名不会强制调用方捕获所有异常。公共模块要在文档、错误类型或结果类型里说明失败方式。

当失败属于业务分支，可以显式返回结果类型。

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function parseTodo(input: unknown): Result<Todo, 'INVALID_TODO'> {
  if (!isTodo(input)) {
    return { ok: false, error: 'INVALID_TODO' };
  }
  return { ok: true, value: input };
}
```

异常适合真正的异常路径，`Result` 适合调用方需要显式分支处理的业务失败。两种风格可以共存，但单个模块应保持一致。

### JSON 和运行时校验

```ts
function parseJson(text: string): unknown {
  return JSON.parse(text) as unknown;
}

const value = parseJson(rawText);
if (!isTodo(value)) {
  throw new Error('响应数据不符合 Todo 契约');
}

value.title;
```

这一步对应 Java 中把 JSON 映射为 DTO 后做 Bean Validation 的边界。TypeScript 的 `interface` 只告诉编译器字段应该是什么，真实数据仍要经过运行时校验。

## 第六阶段，异步编程重点

### `Promise<T>` 对照 `CompletableFuture<T>`

```ts
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function loadTodo(id: string): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}`);
  if (!response.ok) {
    throw new Error(`请求失败，状态码 ${response.status}`);
  }
  return (await response.json()) as Todo;
}
```

Java 的对照可以写成 `CompletableFuture<Todo>`，但不要把两者理解成同一种线程模型。

- `Promise` 表示一个未来会得到结果或失败的状态。
- `async` 函数无论返回普通值还是抛出异常，最终都表现为 Promise。
- `await` 只暂停当前异步函数，不会阻塞 JavaScript 主线程。
- JavaScript 单线程事件循环负责执行回调，网络 I/O 由运行时处理。
- CPU 密集型任务仍会阻塞主线程，需要拆分、Worker 或服务端处理。

### 串行和并行

```ts
async function loadDashboard(): Promise<[Todo[], User]> {
  const todos = await loadTodos();
  const user = await loadCurrentUser();
  return [todos, user];
}

async function loadDashboardInParallel(): Promise<[Todo[], User]> {
  const [todos, user] = await Promise.all([loadTodos(), loadCurrentUser()]);
  return [todos, user];
}
```

前一个函数会顺序等待，后一个函数先启动两个独立请求，再一起等待结果。Java 中可以类比多个 `CompletableFuture` 后调用 `allOf`，但浏览器或 Node.js 的 I/O 调度规则不同。

### 常见组合方法

| 方法                 | 结果行为                 | 适用场景             |
| -------------------- | ------------------------ | -------------------- |
| `Promise.all`        | 任一失败就整体失败       | 多个结果全部需要成功 |
| `Promise.allSettled` | 收集每个成功或失败结果   | 批量任务需要逐项统计 |
| `Promise.race`       | 第一个完成的结果决定整体 | 超时或竞速           |
| `Promise.any`        | 第一个成功的结果决定整体 | 多个备用服务         |

超时通常和 `AbortController` 配合。

```ts
async function fetchWithTimeout<T>(url: string, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`请求失败，状态码 ${response.status}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
```

### 异步代码的四个检查点

1. 先判断两个异步操作是否真的相互独立，再决定顺序执行或 `Promise.all`。
2. 每个网络响应都检查 HTTP 状态和数据形状。
3. 给需要取消的请求传入 `AbortSignal`，组件卸载时及时取消。
4. 给失败、超时、重试和重复提交定义明确的业务行为。

## Java 学习者最容易踩的坑

### `null` 与 `undefined`

```ts
function getDescription(todo: Todo): string {
  return todo.description ?? '暂无描述';
}
```

开启 `strictNullChecks` 后，`string` 和 `string | undefined` 是不同类型。读取可选属性前要做判断、使用可选链或提供默认值。

### `number` 不等于 Java 的所有数值类型

```ts
const price = 19.9;
const largeId = 9007199254740993n;
```

普通 `number` 使用 IEEE 754 双精度浮点数，金额、精确小数和超大整数应采用合适的表示方式。`number` 与 `bigint` 混合计算前要先完成转换。

### 结构类型与名义类型的差异

```ts
interface UserId {
  value: string;
}

interface TodoId {
  value: string;
}

const todoId: TodoId = { value: 't-1' };
const userId: UserId = todoId;
```

这段代码可以通过检查，因为两者形状相同。需要避免 ID 混用时，可以使用品牌类型。

```ts
type Brand<T, B extends string> = T & { readonly __brand: B };
type UserIdValue = Brand<string, 'UserId'>;
type TodoIdValue = Brand<string, 'TodoId'>;
```

品牌类型只提供编译期区分，创建值时仍需要一个明确的转换函数。

### `as` 和非空断言的运行时边界

```ts
const todo = value as Todo;
const title = maybeTodo!.title;
```

`as` 与 `!` 都不会改变对象，也不会插入校验。边界代码里大量使用它们，通常说明校验或类型设计缺了一层。

### 可变对象和浅拷贝

```ts
const updated = { ...todo, completed: true };
```

对象展开只做浅拷贝。嵌套对象仍然共享引用，`const` 只限制变量绑定，整个对象仍可能被修改。

## 一一对应的 Todo 练习

建议用同一个小项目贯穿学习。Java 版本可以使用 `Todo`、`TodoRepository`、`TodoService` 和 REST Controller，TypeScript 版本保留相同的领域动作。

### 数据契约

```ts
interface Todo {
  readonly id: string;
  title: string;
  completed: boolean;
  readonly createdAt: string;
}

type CreateTodoInput = {
  title: string;
};

type UpdateTodoInput = Partial<Pick<Todo, 'title' | 'completed'>>;
```

Java 对照可以使用记录类表达输入和输出。

```java
public record CreateTodoInput(String title) {}
public record UpdateTodoInput(String title, Boolean completed) {}
```

### 仓储契约和内存实现

```ts
interface TodoRepository {
  list(): Promise<readonly Todo[]>;
  findById(id: string): Promise<Todo | undefined>;
  create(input: CreateTodoInput): Promise<Todo>;
  update(id: string, input: UpdateTodoInput): Promise<Todo>;
}
```

练习时先写内存实现，再替换成 HTTP 或数据库实现。这样可以把类型、异步和业务规则分开验证。

### 服务层验收点

- 标题去除首尾空白后需要至少包含一个非空字符。
- 创建时由服务生成 ID 和创建时间。
- 更新只允许修改 `title` 与 `completed`。
- 查询不到任务时返回明确的业务失败。
- 列表结果不允许调用方直接修改仓储内部数组。
- 所有异步方法都声明 `Promise<具体类型>`。

## 推荐学习顺序和阶段验收

### 第 1 周，语法和 JavaScript 运行时

学习变量、表达式、条件、循环、数组方法、对象、函数、模块和 `this`。验收标准是能独立写出 Todo 的添加、完成、删除内存版本，并能解释每个回调的输入输出。

### 第 2 周，类型建模

学习类型推断、接口、类型别名、联合、交叉、可选属性、类型收窄、`unknown`、`never` 和严格模式。验收标准是把所有 `any` 替换掉，并为无效输入补上类型守卫或运行时校验。

### 第 3 周，类、泛型和模块设计

学习接口实现、依赖注入、泛型仓储、工具类型、`keyof`、模块边界和错误类型。验收标准是同一份业务逻辑可以替换内存仓储而不修改服务层。

### 第 4 周，异步和工程实践

学习 Promise、`async/await`、并行请求、超时取消、重试边界、测试替身和 API 数据校验。验收标准是能处理加载中、成功、失败、空数据、超时和重复提交。

### 后续阶段，框架和类型驱动开发

再进入 React、Vue、NestJS、ORM、schema 校验和端到端测试。框架知识应建立在前面这些语言基础之上，避免把框架 API 当成 TypeScript 本身。

## 一份可执行的练习清单

1. 用 `type` 和 `interface` 分别建模 Todo，记录两者在项目中的取舍。
2. 为 `TodoRepository<T>` 写一个泛型内存实现，并用 `T extends HasId` 约束实体。
3. 用可辨识联合表达请求状态，覆盖空闲、加载中、成功和失败。
4. 写一个 `Result<T, E>`，把标题为空、任务不存在和存储失败区分开。
5. 用 `Promise.all` 同时加载 Todo 列表和当前用户，再用 `allSettled` 实现部分成功展示。
6. 给网络请求增加超时、取消和响应校验。
7. 开启严格模式，禁止新增 `any`，为每个外部输入保留 `unknown` 到领域类型的转换步骤。
8. 为服务层补单元测试，再用浏览器测试验证添加、完成、删除这三条用户路径。

## 最后形成自己的对照表

学完一轮后，建议把下面四列填成自己的项目实例。

| 要回答的问题     | Java 实例                 | TypeScript 实例                | 是否能解释差异 |
| ---------------- | ------------------------- | ------------------------------ | -------------- |
| 一个实体如何定义 | `record` 或 POJO          | `interface` 或 `type`          |                |
| 一个仓储如何抽象 | interface 加实现类        | interface 加结构兼容实现       |                |
| 一个失败如何表达 | exception 或 `Optional`   | `throw`、`Result` 或联合类型   |                |
| 两个请求如何并行 | `CompletableFuture.allOf` | `Promise.all`                  |                |
| 外部数据如何校验 | DTO 加 Bean Validation    | `unknown` 加 schema 或类型守卫 |                |
| 泛型如何复用     | `<T extends Base>`        | `<T extends HasId>`            |                |

“对标 Java”的学习标准，是能判断同一个业务问题在两种运行时、类型系统和错误模型下应该怎样设计，而非停留在逐字翻译语法。

## 延伸阅读

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [MDN JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Java API 文档](https://docs.oracle.com/en/java/javase/)
