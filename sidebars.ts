
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    { type: 'doc', id: 'index', label: 'Production-Proven Case Studies' },
    {
      type: 'category',
      label: 'Stateless Configurable Modal',
      items: [
        { type: 'doc', id: 'case-studies/stateless-configurable-modal', label: 'Overview' },
        { type: 'doc', id: 'case-studies/stateless-configurable-modal-default', label: 'Default Behavior' },
        { type: 'doc', id: 'case-studies/stateless-configurable-modal-low-stock', label: 'Low Stock Notification' },
        { type: 'doc', id: 'case-studies/stateless-configurable-modal-notify-me', label: 'Notify-Me Fallback CTA' },
        { type: 'doc', id: 'case-studies/stateless-configurable-modal-after-selectors', label: 'After Selectors Context' },
        { type: 'doc', id: 'case-studies/stateless-configurable-modal-high-volume', label: 'High-Volume Options' },
        { type: 'doc', id: 'case-studies/stateless-configurable-modal-loading', label: 'Loading Variants' },
        { type: 'doc', id: 'case-studies/stateless-configurable-modal-api', label: 'API Reference' },
      ],
    },
    { type: 'doc', id: 'case-studies/progressive-rollout-legacy', label: 'Progressive Rollout on Legacy Systems' },
    { type: 'doc', id: 'case-studies/transactional-email', label: 'Transactional Email Framework' }
  ],
};

export default sidebars;
