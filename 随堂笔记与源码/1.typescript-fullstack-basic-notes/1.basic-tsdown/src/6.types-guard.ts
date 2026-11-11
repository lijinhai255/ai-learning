// 类型保护
// 很多，比如说交叉类型、联合类型啊，在真正实际业务应用的时候，等到最后需要去判断、去推导它的真实类型的时候呢，可能往往不准，你就需要去借助一个外力来去帮助它推导出来一个正确的类型。

function padLeft(value: string, padding: number | string) {
  // 2     2 4
  if (isNumber(padding)) {
    return Array(padding + 1).join(" ") + value;
  }
  return padding + value;
}

function isNumber(padding: number | string): padding is number {
    return typeof padding === 'number'
}
function isString(padding: number | string): padding is string {
    return typeof padding === 'string'
}
