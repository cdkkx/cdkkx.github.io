import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: "cdkkx's Blog",
  description: "Personal Blog",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/first-post' }
    ],
    sidebar: [
      {
        text: '文章列表',
        items: [
          { text: '第一篇博客', link: '/posts/first-post' }
        ]
      },
      {
        text: '安全报告',
        items: [
          { text: 'Zen Cart SQL 注入漏洞', link: '/posts/zen-cart-sqli' },
          { text: 'Zen Cart Unsafe eval RCE', link: '/posts/zen-cart-rce-eval' },
          { text: 'Zen Cart 动态函数调用 RCE', link: '/posts/zen-cart-rce-dynamic-call' },
          { text: 'Zen Cart 文件写入 RCE', link: '/posts/zen-cart-rce-file-write' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cdkkx' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present cdkkx'
    }
  }
})
