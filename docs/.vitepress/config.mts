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
