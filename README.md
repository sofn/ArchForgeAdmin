# ArchForgeAdmin

**中文** | [English](./README.en-US.md)

ArchForge 的 **管理端 UI**（不是裸的 vue-pure-admin 模板）。对接后端 **`server-admin`（端口 8080）**，认证为 **sa-token**（`Authorization: Bearer <token>`）。

界面基于 [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) 7.x（Vue 3.5 + Vite 8 + Element Plus + Pinia + Vue Router 5），业务接口与权限已接到 ArchForge。

## 和后端的关系

| 项       | 值                                                  |
| -------- | --------------------------------------------------- |
| 本仓库   | 管理端前端，开发端口 **8848**                       |
| 后端     | `../ArchForge` → `archforge-server-admin` **:8080** |
| 开发代理 | Vite `/api` → `http://localhost:8080`               |
| 认证     | sa-token；Cookie `authorized-token`                 |
| 成功响应 | `{ code, message, data }`，`code === 0` 为成功      |
| 契约     | `../ArchForgeSpec/api/openapi.yaml`                 |

不要把本仓库指到 `server-web` :8081。C 端在 `ArchForgeWeb`。

## 快速开始

```bash
# 后端（ArchForge 仓库）
./gradlew :archforge-server-admin:bootRun   # :8080

# 本仓库
pnpm install
pnpm dev          # http://localhost:8848
```

Node.js >= 22，pnpm >= 9。

## 常用脚本

```bash
pnpm dev              # 开发（8848）
pnpm build            # 生产构建
pnpm build:staging    # 预发构建
pnpm typecheck        # TypeScript
pnpm lint             # ESLint + Prettier + Stylelint
pnpm preview          # 预览生产包
```

## 目录

```
src/api/           # 接口（baseURL: /api）
src/views/         # 页面（system / monitor / meta-table / …）
src/store/modules/ # Pinia
src/utils/http/    # Axios + sa-token 刷新
src/directives/    # v-perms 等
```

更细的 agent 说明见 [AGENTS.md](AGENTS.md) 与 [CLAUDE.md](CLAUDE.md)。

## Docker

```bash
docker build -t archforge-admin .
docker run -dp 8080:80 --name archforge-admin archforge-admin
```

镜像里的 Nginx 仍监听容器 80 端口；这与后端 8080 不是一回事。

## 浏览器

本地开发推荐最新 Chrome / Edge / Firefox。不支持 IE。

## 许可证

MIT。UI 骨架来自 vue-pure-admin（MIT）。
