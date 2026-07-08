import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "My Blog",
  description: "Web 后端与安全技术分享",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/first-post' }
    ],
    sidebar: [
      {
        text: '技术文章',
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
