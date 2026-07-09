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
          { text: 'GHSA-g443-8869-6g52 (SQLi)', link: '/posts/GHSA-g443-8869-6g52' },
          { text: 'GHSA-233f-2p5c-vfgw (RCE)', link: '/posts/GHSA-233f-2p5c-vfgw' },
          { text: 'GHSA-xrv3-wg8v-w8q8 (RCE)', link: '/posts/GHSA-xrv3-wg8v-w8q8' },
          { text: 'GHSA-h8p9-prrx-jx6r (RCE)', link: '/posts/GHSA-h8p9-prrx-jx6r' },
          { text: 'VE-0086 (Unauth SQLi)', link: '/posts/VE-0086' }
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
