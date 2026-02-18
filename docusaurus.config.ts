
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Cristian Romagnoli',
  tagline: 'Production Engineering Case Studies',
  url: 'https://cromagnoli.github.io',
  baseUrl: '/',
  trailingSlash: true,
  favicon: 'img/favicon.ico',
  organizationName: 'cromagnoli',
  projectName: 'cromagnoli',
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Cristian Romagnoli',
      items: [
        { to: '/', label: 'Case Studies', position: 'left' },

        { to: '/about', label: 'About', position: 'left' },
        {
          href: 'https://www.linkedin.com/in/cristianromagnoli/',
          label: 'LinkedIn',
          position: 'right',
        },
      ],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },
};

export default config;
