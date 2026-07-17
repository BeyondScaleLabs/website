import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

type LinkItem = {label: string; href: string};

const groups: {title: string; items: LinkItem[]}[] = [
  {
    title: 'Project',
    items: [
      {label: 'GitHub', href: 'https://github.com/openkaiden/kaiden'},
      {label: 'Releases', href: 'https://github.com/openkaiden/kaiden/releases'},
      {label: 'kdn CLI', href: 'https://github.com/openkaiden/kdn'},
      {label: 'MCP Registry', href: 'https://github.com/openkaiden/mcp-registry-online'},
    ],
  },
  {
    title: 'Organization',
    items: [
      {label: 'openkaiden', href: 'https://github.com/openkaiden'},
      {label: 'License (Apache 2.0)', href: 'https://github.com/openkaiden/kaiden/blob/main/LICENSE'},
      {label: 'llms.txt', href: '/llms.txt'},
    ],
  },
];

export default function Footer(): React.ReactElement {
  const iconUrl = useBaseUrl('/img/icon.png');
  return (
    <footer className="kaiden-footer">
      <div className="kaiden-footer__inner">
        <div className="kaiden-footer__brand">
          <a href="/" className="kaiden-footer__logo-link">
            <img src={iconUrl} alt="Kaiden" width={28} height={28} className="kaiden-footer__icon" />
            <span className="kaiden-footer__name">kaiden</span>
          </a>
          <p className="kaiden-footer__desc">
            Open platform for running AI coding agents in isolated sandboxes with enterprise-grade governance.
          </p>
          <p className="kaiden-footer__license">Apache 2.0 · openkaiden organization</p>
        </div>

        {groups.map((group) => (
          <div key={group.title} className="kaiden-footer__group">
            <p className="kaiden-footer__group-title">{group.title}</p>
            <ul className="kaiden-footer__links">
              {group.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="kaiden-footer__link"
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
