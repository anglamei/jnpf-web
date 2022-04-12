# jnpf-web-tenant(多租户前端)

## 环境要求

- Yarn(需先安装`Node.js`)

## 使用说明
### 安装依赖
```bash
yarn
```
### 开发环境

- 打开`src/utils/define.js`,修改接口地址

```bash

  // 开发环境接口配置
  const APIURl = 'http://192.168.0.25:30006'

```
- 运行前端项目
```bash
yarn dev
```

### 测试生产发布
```bash
# 构建测试环境
yarn build:staging

# 构建生产环境
yarn build
```