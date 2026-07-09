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
          { text: 'SQL Injection in admin/modules.php', link: '/posts/GHSA-g443-8869-6g52' },
          { text: 'RCE via Unsafe eval()', link: '/posts/GHSA-233f-2p5c-vfgw' },
          { text: 'RCE via Unsafe Dynamic Function Call', link: '/posts/GHSA-xrv3-wg8v-w8q8' },
          { text: 'RCE via Arbitrary File Write', link: '/posts/GHSA-h8p9-prrx-jx6r' },
          { text: 'Unauthenticated SQL Injection', link: '/posts/VE-0086' }
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
