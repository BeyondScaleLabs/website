<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import ForDevelopers from '$lib/components/ForDevelopers.svelte';
  import CorePrinciples from '$lib/components/CorePrinciples.svelte';
  import HowItWorks from '$lib/components/HowItWorks.svelte';
  import Capabilities from '$lib/components/Capabilities.svelte';
  import ForPlatformEngineers from '$lib/components/ForPlatformEngineers.svelte';
  import OpenSource from '$lib/components/OpenSource.svelte';
  import Install from '$lib/components/Install.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { assets } from '$app/paths';
</script>

<svelte:head>
  <title>Kaiden — AI coding agents. Governed, isolated, open.</title>
  <meta name="description" content="Kaiden is the open platform for running AI coding agents in isolated, reproducible sandboxes with enterprise-grade governance. Supports Claude Code, Goose, Cursor, and OpenCode." />
  <meta name="keywords" content="AI agent sandboxing, AI coding agents, enterprise AI governance, MCP workspace, Claude Code sandbox, agentic coding" />
  <meta property="og:title" content="Kaiden — AI coding agents. Governed, isolated, open." />
  <meta property="og:description" content="Run AI coding agents in isolated sandboxes with enterprise governance. Open source. Supports Claude Code, Goose, Cursor, OpenCode." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="{assets}/icon.png" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Kaiden — AI coding agents. Governed, isolated, open." />
  <meta name="twitter:image" content="{assets}/icon.png" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kaiden",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    description: "Open platform for running AI coding agents in isolated, reproducible sandboxes with enterprise-grade governance.",
    url: "https://openkaiden.ai",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    keywords: "AI agent sandboxing, enterprise AI governance, MCP workspace"
  })}<\/script>`}
</svelte:head>

<Nav />
<main>
  <Hero />
  <ForDevelopers />
  <CorePrinciples />
  <HowItWorks />
  <Capabilities />
  <ForPlatformEngineers />
  <OpenSource />
  <Install />
</main>
<Footer />
