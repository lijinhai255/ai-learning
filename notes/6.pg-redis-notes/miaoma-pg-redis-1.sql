CREATE TABLE IF NOT EXISTS "user" (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    gender        VARCHAR(10)  NOT NULL DEFAULT 'unknown' CHECK (gender IN ('male', 'female', 'unknown')),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    role          VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);


INSERT INTO "user" (username, email, gender, is_active, role, created_at) VALUES
    ('alice',   'alice@example.com',   'female',  TRUE,  'user',         now() - interval '30 days'),
    ('bob',     'bob@example.com',     'male',    TRUE,  'user',         now() - interval '25 days'),
    ('carol',   'carol@example.com',   'female',  TRUE,  'admin',        now() - interval '20 days'),
    ('david',   'david@example.com',   'male',    TRUE,  'user',         now() - interval '15 days'),
    ('erin',    'erin@example.com',    'female',  FALSE, 'user',         now() - interval '10 days'),
    ('frank',   'frank@example.com',   'male',    TRUE,  'user',         now() - interval '8 days'),
    ('grace',   'grace@example.com',   'female',  TRUE,  'super_admin',  now() - interval '5 days'),
    ('henry',   'henry@example.com',   'male',    FALSE, 'user',         now() - interval '3 days'),
    ('ivy',     'ivy@example.com',     'female',  TRUE,  'user',         now() - interval '2 days'),
    ('jack',    'jack@example.com',    'male',    TRUE,  'user',         now() - interval '1 day');

DELETE FROM "user"
WHERE id IN (8, 9, 10);

SELECT id, username, email, gender, is_active, role, created_at
FROM "user"
WHERE id = 1;

UPDATE "user"
SET username = '合一'
WHERE id = 1;


CREATE TABLE IF NOT EXISTS "cart" (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT       NOT NULL REFERENCES "user"(id),  -- 关联用户
    product_name  VARCHAR(100) NOT NULL,
    quantity      INT          NOT NULL DEFAULT 1,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

SELECT u.id AS user_id, u.username, u.role,
       c.id AS cart_id, c.product_name, c.quantity
FROM "user" u
LEFT JOIN "cart" c ON c.user_id = u.id
ORDER BY u.id;


CREATE TABLE IF NOT EXISTS "cart" (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT       NOT NULL REFERENCES "user"(id),  -- 关联用户
    product_name  VARCHAR(100) NOT NULL,
    quantity      INT          NOT NULL DEFAULT 1,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- LEFT JOIN
SELECT u.id AS user_id, u.username, u.role,
       c.id AS cart_id, c.product_name, c.quantity
FROM "user" u
LEFT JOIN "cart" c ON c.user_id = u.id
ORDER BY u.id;

-- INNER JOIN
SELECT u.id AS user_id, u.username, u.role,
       c.id AS cart_id, c.product_name, c.quantity
FROM "user" u
INNER JOIN "cart" c ON c.user_id = u.id
ORDER BY u.id;

-- RIGHT JOIN
SELECT u.id AS user_id, u.username,
       c.id AS cart_id, c.product_name, c.quantity
FROM "user" u
RIGHT JOIN "cart" c ON c.user_id = u.id
ORDER BY c.id;


-- 业务系统多表设计
-- ===== 修改已有表 =====
ALTER TABLE "user"
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
    ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE "cart"
    ADD COLUMN IF NOT EXISTS price      NUMERIC(10,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ   NOT NULL DEFAULT now();

-- ===== 订单主表 =====
CREATE TABLE IF NOT EXISTS "order" (
    id               BIGSERIAL PRIMARY KEY,
    order_no         VARCHAR(32)   NOT NULL UNIQUE,
    user_id          BIGINT        NOT NULL REFERENCES "user"(id),
    status           VARCHAR(20)   NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled', 'refunded')),
    total_amount     NUMERIC(12,2) NOT NULL DEFAULT 0,
    recipient_name   VARCHAR(50)   NOT NULL,
    recipient_phone  VARCHAR(20)   NOT NULL,
    shipping_address VARCHAR(255)  NOT NULL,
    remark           VARCHAR(255),
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    paid_at          TIMESTAMPTZ,
    completed_at     TIMESTAMPTZ,
    cancelled_at     TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_order_user_id    ON "order"(user_id);
CREATE INDEX IF NOT EXISTS idx_order_status     ON "order"(status);
CREATE INDEX IF NOT EXISTS idx_order_created_at ON "order"(created_at);

-- ===== 订单明细表 =====
CREATE TABLE IF NOT EXISTS "order_item" (
    id           BIGSERIAL PRIMARY KEY,
    order_id     BIGINT        NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    product_name VARCHAR(100)  NOT NULL,
    price        NUMERIC(10,2) NOT NULL,
    quantity     INT           NOT NULL CHECK (quantity > 0),
    subtotal     NUMERIC(12,2) NOT NULL,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_item_order_id ON "order_item"(order_id);

-- ===== 操作日志表 =====
CREATE TABLE IF NOT EXISTS "operation_log" (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       REFERENCES "user"(id),
    action      VARCHAR(50)  NOT NULL,
    target_type VARCHAR(30),
    target_id   BIGINT,
    detail      JSONB,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(255),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_operation_log_user_id    ON "operation_log"(user_id);
CREATE INDEX IF NOT EXISTS idx_operation_log_created_at ON "operation_log"(created_at);
CREATE INDEX IF NOT EXISTS idx_operation_log_target     ON "operation_log"(target_type, target_id);





-- 全文检索示例
CREATE TABLE IF NOT EXISTS "article" (
    id           BIGSERIAL PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,            -- 标题
    content      TEXT         NOT NULL,            -- 正文
    author_id    BIGINT       REFERENCES "user"(id),  -- 作者（可空，不影响演示）
    published_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 常用查询条件索引（按发布时间、作者）
CREATE INDEX IF NOT EXISTS idx_article_published_at ON "article"(published_at);
CREATE INDEX IF NOT EXISTS idx_article_author_id    ON "article"(author_id);

-- 增加 tsvector 生成列（自动维护，无需手工同步）
ALTER TABLE "article"
    ADD COLUMN IF NOT EXISTS fts tsvector
    GENERATED ALWAYS AS (to_tsvector('simple', title || ' ' || content)) STORED;

-- 建立 GIN 索引，这是全文检索性能的核心
CREATE INDEX IF NOT EXISTS idx_article_fts ON "article" USING GIN (fts);


INSERT INTO "article" (title, content, author_id, published_at) VALUES
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




-- 演示类飞书文档数据存储
-- 在 docs 表上增加类飞书文档相关字段
CREATE TABLE IF NOT EXISTS "docs" (
    id            BIGSERIAL PRIMARY KEY,
    doc_id      VARCHAR(64)  NOT NULL UNIQUE,
    content_json         JSONB NOT NULL UNIQUE
);

-- 给 JSONB 建 GIN 索引（支持 @>、? 等 JSON 查询）
CREATE INDEX IF NOT EXISTS idx_docs_content_json
    ON "docs" USING GIN (content_json);