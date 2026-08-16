# Amethyst Docs

这是一个基于 VitePress 的文档项目。

## 本地启动

先安装依赖：

```bash
pnpm install
```

启动本地开发服务器：

```bash
pnpm run docs:dev
```

启动后在浏览器打开终端里显示的本地地址，通常是：

```text
http://localhost:5173
```

## 搜索说明

本项目使用 VitePress 原生本地搜索。

- 日常本地开发直接运行 `pnpm run docs:dev` 即可使用搜索。
- 如果是刚启用搜索、刚修改搜索配置，或者你发现搜索框能打开但搜不到内容，请先重启一次 `npm run docs:dev`。
- 如果你要验证最终构建产物里的搜索是否正常，执行：

```bash
pnpm run docs:build
pnpm run docs:preview
```

## 其他常用命令

构建静态站点：

```bash
pnpm run docs:build
```

本地预览构建结果：

```bash
pnpm run docs:preview
```

## 项目结构

```text
docs/                  文档内容
docs/.vitepress/       VitePress 配置
```
