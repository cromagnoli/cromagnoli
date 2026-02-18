import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/',
    component: ComponentCreator('/', '202'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'c53'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'c43'),
            routes: [
              {
                path: '/about/',
                component: ComponentCreator('/about/', '2d8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/case-studies/progressive-rollout/',
                component: ComponentCreator('/case-studies/progressive-rollout/', '8be'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/case-studies/stateless-configurable-modal/',
                component: ComponentCreator('/case-studies/stateless-configurable-modal/', 'c06'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/case-studies/transactional-email/',
                component: ComponentCreator('/case-studies/transactional-email/', '28a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/intro/',
                component: ComponentCreator('/intro/', '876'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
