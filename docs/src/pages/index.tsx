import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

interface DocCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

function DocCard({title, description, href, icon}: DocCardProps) {
  return (
    <Link to={href} className={styles.card}>
      <div className={styles.cardIcon}>{icon}</div>
      <div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </Link>
  );
}

const gettingStarted: DocCardProps[] = [
  {
    title: 'What is Kaiden?',
    description: 'The core idea: sandboxes, security, and why every agent needs its own isolated environment.',
    href: '/what-is-kaiden',
    icon: '◈',
  },
  {
    title: 'Your First Sandbox',
    description: 'Walk through the five-step wizard to create a secured sandbox for any repository.',
    href: '/your-first-sandbox',
    icon: '⬡',
  },
];

const configuration: DocCardProps[] = [
  {
    title: 'Credentials & Secrets',
    description: 'Store API keys and tokens in the Secret Vault. Agents never see the values directly.',
    href: '/credentials-and-secrets',
    icon: '◉',
  },
  {
    title: 'AI Agents',
    description: 'Configure Claude Code, Codex, Goose, and other agents with per-agent defaults.',
    href: '/ai-agents',
    icon: '◎',
  },
  {
    title: 'Models & Inference',
    description: 'Cloud providers, local Ollama models, enterprise OpenShift AI, and semantic routing.',
    href: '/models-and-inference',
    icon: '◇',
  },
];

const organizing: DocCardProps[] = [
  {
    title: 'Projects',
    description: 'Save credentials, network rules, and skills as a project so every workspace inherits them.',
    href: '/projects',
    icon: '▣',
  },
  {
    title: 'Skills, MCP & Knowledge',
    description: 'Give agents domain skills, live tool access via MCP servers, and retrieval over your docs.',
    href: '/skills-mcp-knowledge',
    icon: '▤',
  },
];

const security: DocCardProps[] = [
  {
    title: 'Network Security',
    description: 'Deny-by-default network policy, reading blocked events, and live policy updates.',
    href: '/network-security',
    icon: '◆',
  },
  {
    title: 'Settings',
    description: 'OpenShell runtime, CLI tools, experimental features, and the status bar reference.',
    href: '/settings',
    icon: '◈',
  },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroBadge}>Documentation</div>
          <h1 className={styles.heroTitle}>Kaiden Docs</h1>
          <p className={styles.heroSubtitle}>
            Kaiden is an open desktop platform for running AI coding agents in isolated, secured environments.
            Every agent gets its own sandbox — it can only reach what you've allowed, touch the files
            you've shared, and call the models you've configured.
          </p>
          <div className={styles.heroActions}>
            <Link to="/what-is-kaiden" className={styles.primaryButton}>
              Get started
            </Link>
            <Link to="/your-first-sandbox" className={styles.secondaryButton}>
              First sandbox →
            </Link>
          </div>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Getting Started</h2>
            <div className={styles.grid}>
              {gettingStarted.map((card) => (
                <DocCard key={card.href} {...card} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Configuration</h2>
            <div className={styles.grid}>
              {configuration.map((card) => (
                <DocCard key={card.href} {...card} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Organizing Work</h2>
            <div className={styles.grid}>
              {organizing.map((card) => (
                <DocCard key={card.href} {...card} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Security & Reference</h2>
            <div className={styles.grid}>
              {security.map((card) => (
                <DocCard key={card.href} {...card} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
