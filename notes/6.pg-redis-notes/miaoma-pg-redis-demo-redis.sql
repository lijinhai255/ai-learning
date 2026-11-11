-- redis 基本语法就是存取，SET GET
SET version 1 EX 3
SET cversion "1"

GET cversion

-- 字符串 SET、GET、INCR、DECR、MSET、SETEX
SET cversion "1"
SET num 1
GET cversion

GET num
INCR num
GET num


-- 哈希 HSET、HGET、HGETALL、HINCRBY
HSET user:1 name "Alice" age 25
HGETALL user:1000

-- 列表 LPUSH、RPUSH、LPOP、RPOP、LRANGE、LLEN
RPUSH orders "1"
RPUSH orders "2"
RPUSH orders "3"

-- 集合 SADD、SREM、SMEMBERS、SISMEMBER、SINTER、SUNION
SADD hobby "篮球"
SMEMBERS hobby
SADD hobby "足球"
SMEMBERS hobby

SADD zshobby "篮球"
SADD zshobby "排球"

SINTER hobby


-- 有序集合 ZADD、ZRANGE、ZRANGEBYSCORE、ZSCORE、ZINCRBY
ZADD res 1 "11"
ZADD res 20 "22"
ZRANGEBYSCORE res 1 20


-- 当用户登录成功之后
SET user:session:heyi true EX 10

GET user:session:heyi



MULTI
SET key1 "value1"
SET key2 "value2"
EXEC