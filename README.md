# 健康要素初筛评估 H5

手机端优先的 Next.js + TypeScript + Tailwind CSS 工具，用于根据用户勾选的症状统计 7 个健康要素的命中次数、百分比和优先级排序。

## 运行

```bash
npm install
npm run dev
```

默认访问：

- 用户端首页：`http://localhost:3000`
- 管理后台：`http://localhost:3000/admin`

## 配置症状和 @ 映射

症状和健康要素配置在：

```text
src/data/symptomMap.json
```

每个症状格式如下：

```json
{
  "id": 1,
  "name": "这里填写真实症状名称",
  "marks": {
    "气血": "@",
    "毒素": "@"
  }
}
```

如果某个症状与某个健康要素有关，就在 `marks` 里写 `"健康要素名": "@"`。用户端不会显示这些后台关系。

健康要素总数也在同一个文件顶部：

```json
{ "name": "气血", "total": 63 }
```

后续如果增加或减少健康要素，优先修改 `symptomMap.json` 即可。

## 计分逻辑

计分逻辑在：

```text
src/lib/scoring.ts
```

公式：

```text
百分比 = 命中次数 / 健康要素总数 * 100%
```

结果按百分比从高到低排序，百分比相同时按命中次数排序。

## 提交记录

用户点击“生成结果”后，会向接口写入提交记录：

```text
data/submissions.json
```

管理后台可以查看记录，并通过 `/api/submissions/export` 导出 CSV。

当前 `symptomMap.json` 已根据 `D:\病因梳理\3   新症状简表.pdf` 导入 95 条症状和 @ 映射。

## 校对文件与校验

PDF 导入后的中间校对文件在：

```text
data/symptom-map-review.csv
```

校验脚本在：

```text
scripts/validate-symptom-map.ps1
```

运行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\validate-symptom-map.ps1
```

脚本会确认 95 条症状、7 个健康要素列，以及每列 @ 数量是否分别等于 63、60、55、54、51、39、38。
