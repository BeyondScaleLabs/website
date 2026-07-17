import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: [
        'what-is-kaiden',
        'core-concepts',
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'installation',
        'your-first-sandbox',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      collapsed: false,
      items: [
        'models-and-inference',
        'ai-agents',
        'credentials-and-secrets',
        'skills-mcp-knowledge',
      ],
    },
    {
      type: 'category',
      label: 'Organizing Work',
      collapsed: false,
      items: [
        'projects',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      collapsed: false,
      items: [
        'network-security',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        'openshell-gateways',
      ],
    },
    {
      type: 'category',
      label: 'Settings',
      collapsed: false,
      items: [
        'settings',
      ],
    },
  ],
};

export default sidebars;
