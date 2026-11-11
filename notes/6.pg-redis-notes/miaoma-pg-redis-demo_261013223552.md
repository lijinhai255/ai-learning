# miaoma-pg-redis-demo · AI 分析
2026/10/13 22:35:52
这是通用知识问题，我直接为你解答。Redis 中**最常见、最核心**的数据结构有 5 种，日常开发中 90% 以上的场景都用它们：

## 1. String（字符串）
最基本、最灵活的类型，value 可以是字符串、整数或浮点数，最大 512MB。
- 典型命令：`SET`、`GET`、`INCR`、`DECR`、`MSET`、`SETEX`
- 常见用途：缓存、计数器、分布式锁、Session 存储

## 2. Hash（哈希）
相当于一个 field-value 的映射表，适合存对象。
- 典型命令：`HSET`、`HGET`、`HGETALL`、`HINCRBY`
- 常见用途：存储用户信息、商品详情等结构化对象

## 3. List（列表）
双向链表，支持从两端插入/弹出，可按索引范围获取。
- 典型命令：`LPUSH`、`RPUSH`、`LPOP`、`RPOP`、`LRANGE`、`LLEN`
- 常见用途：消息队列、时间线、最新列表

## 4. Set（集合）
无序、元素唯一（自动去重），支持集合运算。
- 典型命令：`SADD`、`SREM`、`SMEMBERS`、`SISMEMBER`、`SINTER`、`SUNION`
- 常见用途：去重、标签系统、共同好友、随机抽奖（`SPOP`）

## 5. ZSet / Sorted Set（有序集合）
在 Set 基础上每个元素带一个 score（分值），按 score 自动排序。
- 典型命令：`ZADD`、`ZRANGE`、`ZRANGEBYSCORE`、`ZSCORE`、`ZINCRBY`
- 常见用途：排行榜、延时队列、限流（滑动窗口）

---

### 补充：进阶结构（不那么"常见"但很有用）
- **Bitmap（位图）**：本质是 String 的位操作，用于签到、在线状态统计
- **HyperLogLog**：基数统计，用于 UV 去重统计，极省内存
- **Geo**：地理位置计算，用于附近的人/门店
- **Stream**：Redis 5.0 引入的日志型消息流，支持消费组，可做可靠消息队列

### 简单选型建议
| 需求 | 推荐结构 |
|------|----------|
| 缓存单个值 / 计数器 | String |
| 存对象字段 | Hash |
| 消息队列 / 列表 | List |
| 去重 / 集合运算 | Set |
| 排行榜 / 按分数排序 | ZSet |

如果你需要，我可以进一步用 `TYPE`、`OBJECT ENCODING` 等命令查看当前数据库（DB 0）里实际存储的数据使用了哪些结构。需要的话告诉我即可。