import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  plugins: ['docusaurus-plugin-goatcounter'],

  title: 'Kaiden Documentation',
  tagline: 'AI coding agents in isolated, secured environments',
  favicon: 'img/icon.png',

  future: {
    v4: true,
  },

  url: 'https://openkaiden.ai',
  baseUrl: '/docs/',

  organizationName: 'openkaiden',
  projectName: 'kaiden-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: './content',
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          showLastUpdateTime: false,
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'kaiden',
      logo: {
        alt: 'Kaiden',
        src: 'img/icon.png',
        href: '/',
        width: 32,
        height: 32,
        style: { borderRadius: '22%', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' },
      },
      items: [
        {
          href: 'https://github.com/openkaiden/kaiden',
          position: 'right',
          className: 'navbar-github-link',
          'aria-label': 'GitHub',
        },
        {
          href: '/',
          position: 'right',
          label: 'Website',
        },
      ],
      hideOnScroll: false,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'yaml', 'toml'],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    goatcounter: {
      code: 'openkaiden-website',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
