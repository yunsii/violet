[掘金](https://juejin.cn/post/6952417294941323277) | [V2EX](https://www.v2ex.com/t/771467) | [知乎](https://zhuanlan.zhihu.com/p/365821726) | [DEV](https://dev.to/theprimone/build-chrome-extension-mv3-development-environment-based-on-vite-react-497h)

# 基于 Vite + React 构建 Chrome Extension (MV3) 开发环境

## 前言

此前一直想做一个 bilibili 的弹幕扩展，最近借着研究 Vite 的契机实操了一下，花了两天时间算是搭好了基于 Vite + React 的 Chrome Extension (MV3) 开发环境，核心功能如下：

- 📦️ JS 打包成单文件
- 🎨 自动引入 CSS
- 🔨 打包 service worker
- 🚀 开发环境热更新

这里重点介绍一下当前热更新的实现，其他功能相对而言简单很多，详情可参考 [theprimone/violet](https://github.com/theprimone/violet)

> 一次偶然的机会在 B 站看了 《紫罗兰永恒花园》，给人印象深刻，刚好这次打算做个 bilibili 的弹幕扩展，索性就取了女主名字中的 **violet** 😃

## 实操

热更新大致的流程如下图所示：

![hot-reload-graph](/memo/images/chrome-extension-hot-reload.jpg)

### 启动

通过 `npm run dev` 同时执行三个命令：

- tsc 编译 service worker 并监听变化
- vite 编译 extension
- websocket 服务监听打包后目录 /dist 的变化

其中，由于 [`vite build --watch` 还未发布](https://github.com/vitejs/vite/issues/1434)，暂时通过[自定义脚本](https://github.com/theprimone/violet/blob/master/scripts/build-ext-watch.js)监听源码变化，待 vite 该功能发布后可移除。

### 热更新

浏览器页面加载 content scripts 后会创建一个 websocket 链接，服务端收到请求后会开启对 `/dist` 目录的监听，websocket 服务监听到 `/dist` 的变化后主动发起通知。

content scripts 收到需要更新 Extension 的通知，通过 `chrome.runtime.sendMessage` 触发 service worker 中通过 `chrome.runtime.onMessage` 注册的事件，依次触发 `chrome.runtime.reload` 和 `chrome.tabs.reload` 更新 Extension 和当前页面。实现了所写即所得，无需任何手动介入 🚀

可能会有读者有个疑问，为什么不直接在 service worker 中监听 websocket 的通知呢？

此前一直也是这么想的，在 Manifest V3 下使用 service worker 提倡 [Thinking with events](https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#events)，通过 `chrome.runtime.onInstalled` 和 `chrome.runtime.onStartup` 创建 websocket 客户端会被意外的关闭，即便是使用定时器轮询也会在执行多次之后被关闭再启动。因此，当前找到的最佳方案是在 service worker 中监听 `chrome.runtime.onMessage` 事件。

这样就实现了当页面加载当前 Extension 时才会触发热更新的流程。

## 总结

由于现在的 Chrome Extension 大多是低于 MV3 版本的，两天下来，踩了不少坑，对于此前没有接触过的浏览器扩展开发也有了一定程度的了解。现在只是针对 Chrome Extension 的场景，后续会在不断完善当前场景的情况下，完成对其他浏览器扩展的支持。最终应该可以封装一个浏览器扩展开发的工具。

---

## 后续

- [`vite build --watch`](https://github.com/vitejs/vite/compare/v2.1.5...v2.2.0) 在 v2.2.0 可用
- [`vite build --watch` 会清空打包后的文件夹](https://github.com/vitejs/vite/issues/3068)
- [`vite@2.2.4` watch 清空文件夹的问题已合并并发布](https://github.com/vitejs/vite/compare/v2.2.3...v2.2.4)
