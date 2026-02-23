
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    { type: 'doc', id: 'index', label: 'Production-Proven Case Studies' },
    { type: 'doc', id: 'case-studies/stateless-configurable-modal', label: 'Stateless Configurable Modal' },
    { type: 'doc', id: 'case-studies/stateless-configurable-modal-api', label: 'Stateless Configurable Modal API' },
    { type: 'doc', id: 'case-studies/progressive-rollout-legacy', label: 'Progressive Rollout on Legacy Systems' },
    { type: 'doc', id: 'case-studies/transactional-email', label: 'Transactional Email Framework' },
    { type: 'doc', id: 'about', label: 'About' },
  ],
};

export default sidebars;
