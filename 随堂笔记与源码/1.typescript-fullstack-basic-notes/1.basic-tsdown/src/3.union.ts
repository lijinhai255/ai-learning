// 将类型当做一个集合的话
// 1. 联合类型
type TextBlock = { type: "text"; props: { color: string } };
type ImageBlock = { type: "image"; props: { url: string } };

type Block = TextBlock | ImageBlock; // 将两个具共性的类型合在一起变成一个新的类型
const block: Block = {
  type: "image",
  props: {
    url: "",
  },
};

// 2. 交叉类型
// 跟面向对象编程里面所说的多继承类似。
type IdProtocal = {
  id: string;
};
type NameProtocal = {
  name: string;
};

type IdAndNameProtocal = IdProtocal & NameProtocal;

const idandname: IdAndNameProtocal = {
    id: '',
    name: ''
}