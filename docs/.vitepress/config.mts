import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
  title: 'Bartender.js',
  description: 'Library for creating accessible off-canvas bars and modals.',
  lastUpdated: true,
  sitemap: {
    hostname: 'https://bartender.fokke.fi',
    lastmodDateOnly: false,
  },
  cleanUrls: true,
  transformPageData(pageData) {
    const path = pageData.relativePath
      .replace(/index\.md$/, '')
      .replace(/\.(md|html)$/, '')

    const canonicalUrl = [
      `https://bartender.fokke.fi`,
      path ? `/${path}` : undefined,
    ]
      .filter((item) => !!item)
      .join('')

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: canonicalUrl },
    ])
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      src: '/bartender-logo.webp',
      width: 138,
      height: 40,
      'aria-label': 'Back to the home page',
    },
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/overview' },
    ],
    editLink: {
      pattern: 'https://github.com/Fokke-/bartender.js/edit/master/docs/:path',
    },
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Overview', link: '/overview' },
          { text: 'Getting started', link: '/getting-started' },
          { text: 'Playground', link: '/playground' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Main instance', link: '/main-instance' },
          { text: 'Adding a new bar', link: '/adding-a-new-bar' },
          {
            text: 'Opening, closing and toggling the bar',
            link: '/opening-closing-and-toggling-the-bar',
          },
          {
            text: 'Removing the bar',
            link: '/removing-the-bar',
          },
          {
            text: 'Getting an existing bar instance',
            link: '/getting-an-existing-bar-instance',
          },
          {
            text: 'Events',
            link: '/events',
          },
        ],
      },
      {
        text: 'Styling',
        items: [{ text: 'Styling guide', link: '/styling-guide' }],
      },
      {
        text: 'Integrations',
        items: [{ text: 'Vue plugin', link: '/vue-plugin' }],
      },
    ],
    socialLinks: [
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/package/@fokke-/bartender.js',
      },
      { icon: 'github', link: 'https://github.com/Fokke-/bartender.js' },
      {
        icon: 'githubsponsors',
        link: 'https://github.com/sponsors/Fokke-',
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Ville Fokke Saarivaara',
    },
  },
})
