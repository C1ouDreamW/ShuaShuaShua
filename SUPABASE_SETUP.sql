-- 创建存储题目的表
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_ids TEXT[] NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);

-- 允许匿名用户访问
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取
CREATE POLICY "Enable read for all users" ON questions
  FOR SELECT USING (true);

-- 允许所有人插入
CREATE POLICY "Enable insert for all users" ON questions
  FOR INSERT WITH CHECK (true);

-- 允许所有人删除
CREATE POLICY "Enable delete for all users" ON questions
  FOR DELETE USING (true);

-- 允许所有人更新
CREATE POLICY "Enable update for all users" ON questions
  FOR UPDATE USING (true);

-- 创建存储类别的表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at DESC);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all users" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON categories
  FOR DELETE USING (true);

CREATE POLICY "Enable update for all users" ON categories
  FOR UPDATE USING (true);
