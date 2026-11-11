import { Pool } from "pg";

const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "heyi",
  password: "xiao123",
  database: "postgres",
});

async function q() {
  // const res = await pool.query("SELECT * FROM public.user");
  const res =
    await pool.query(`INSERT INTO "article" (title, content, author_id, published_at) VALUES
    ('PostgreSQL 全文检索入门',   '全文检索是对文本内容进行分词、索引与快速匹配的技术，PostgreSQL 内置 tsvector 与 GIN 索引支持。', 1, now() - interval '10 days'),
    ('数据库索引优化实战',        '索引能显著提升查询性能，B-Tree 适合等值与范围查询，GIN 适合全文检索与数组类型。', 2, now() - interval '9 days'),
    ('电商订单系统设计',          '下单流程包含购物车校验、订单主表与明细表写入、金额计算，整个过程需要放在事务中保证一致性。', 1, now() - interval '8 days'),
    ('如何使用 GIN 索引加速搜索', '当使用 to_tsvector 建立文档向量后，配合 GIN 索引可以大幅加快全文检索的匹配速度。', 3, now() - interval '7 days'),
    ('PostgreSQL 事务与并发控制', '事务保证 ACID 特性，行级锁 FOR UPDATE 可防止并发下单导致的超卖或重复扣减。', 4, now() - interval '6 days'),
    ('购物车与订单的关联设计',    '购物车表通过 user_id 关联用户，下单后由购物车生成订单明细，并清空购物车。', 2, now() - interval '5 days'),
    ('全文检索中的中文分词问题',  '默认分词器对中文支持有限，生产环境建议安装 zhparser 或 pg_jieba 扩展以获得更好的中文分词效果。', 5, now() - interval '4 days'),
    ('索引失效的常见场景',        '对索引列使用函数包裹、隐式类型转换、LIKE 前置通配符等都会导致索引失效。', 1, now() - interval '3 days'),
    ('订单状态机设计',            '订单状态包括 pending、paid、shipped、completed、cancelled，状态流转应由程序严格校验。', 6, now() - interval '2 days'),
    ('浅谈搜索引擎与数据库检索',  '搜索引擎与数据库全文检索各有侧重，前者重相关性排序，后者重结构化查询与事务能力。', 7, now() - interval '1 day');
`);

  console.log("🚀 ~ q ~ res.rows:", res.rows);
}

q();
