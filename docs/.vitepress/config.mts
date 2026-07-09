import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  lang: 'en-US',
  title: "cdkkx's Blog",
  description: "Personal Blog",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Articles', link: '/posts/first-post' }
    ],
    sidebar: [
      {
        text: 'Articles',
        items: [
          { text: 'My First Post', link: '/posts/first-post' }
        ]
      },
      {
        text: 'Security Reports',
        items: [
          { text: 'Zen Cart SQL Injection', link: '/posts/zen-cart-sqli' },
          { text: 'Zen Cart Unsafe eval RCE', link: '/posts/zen-cart-rce-eval' },
          { text: 'Zen Cart Dynamic Function Call RCE', link: '/posts/zen-cart-rce-dynamic-call' },
          { text: 'Zen Cart File Write RCE', link: '/posts/zen-cart-rce-file-write' }
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
