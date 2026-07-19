# Persona Atlas

一个可离线运行的中文综合人格测试，包含大五人格、Schwartz 价值观、政治坐标、MBTI 偏好和生活环境偏好，共 160 题。所有答题数据只保存在浏览器 `localStorage`。

## 启动

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 关键文件

- `src/data/questions.ts`：160 道中文题目、模块元数据和量表文本
- `src/data/countries.ts`：55 个国家或地区的环境画像
- `src/utils/scoring.ts`：反向计分、分数标准化和四个结果模块计算
- `src/utils/countryMatching.ts`：用户环境画像、匹配权重和加权距离算法
- `src/utils/storage.ts`：本地答题进度保存、读取与清理
- `src/components/`：首页、答题流程、模块完成页和结果页面

## 扩展数据

新增题目时，在 `questions.ts` 对应维度数组加入 `[题目文字, 1 | -1]`。`1` 为正向计分，`-1` 为反向计分，并同步更新 `sections` 中的题数。

新增国家时，在 `countries.ts` 的 `seeds` 中加入国家基础信息、画像预设及需要覆盖的指标。完整对象会自动补齐所有 17 项环境指标。

匹配权重在 `src/utils/countryMatching.ts` 的 `MATCH_WEIGHTS` 中修改，五项权重之和应保持为 `1`。
