# foca-cookie-storage

Foca 持久化 cookie 引擎，基于 `document.cookie` API。

[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/foca-js/foca-taro-storage/Test/master?label=test&logo=jest)](https://github.com/foca-js/foca-taro-storage/actions)
[![Codecov](https://img.shields.io/codecov/c/github/foca-js/foca-taro-storage?logo=codecov)](https://codecov.io/gh/foca-js/foca-taro-storage)
[![License](https://img.shields.io/github/license/foca-js/foca-cookie-storage?logo=open-source-initiative)](https://github.com/foca-js/foca-cookie-storage/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/foca-cookie-storage?logo=npm)](https://www.npmjs.com/package/foca-cookie-storage)

# 安装

```bash
yarn add foca-cookie-storage
```

# 使用

```typescript
import { store } from 'foca';
import { cookieStorage, CookieStorage } from 'foca-cookie-storage';

store.init({
  persist: [
    {
      key: 'my-project',
      version: '1',
      // 默认配置
      engine: cookieStorage,
      models: [],
    },
    {
      key: 'my-project-1',
      version: '1',
      // 自定义配置
      engine: new CookieStorage({
        // ...
      }),
      models: [],
    },
  ],
});
```
