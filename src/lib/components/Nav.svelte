<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import { downloadStore, FALLBACK_URL } from '$lib/stores/download';
  import DownloadModal from '$lib/components/DownloadModal.svelte';
  import { assets, base } from '$app/paths';
  import { onMount } from 'svelte';

  let scrolled = $state(false);
  let mounted = $state(false);
  let modalOpen = $state(false);

  onMount(() => {
    mounted = true;
    const handler = () => (scrolled = window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  });
</script>

<header class="fixed top-0 left-0 right-0 z-50">
  <!-- background layer: blur + tint are isolated here so they don't affect child rendering -->
  <div
    class="absolute inset-0 transition-all duration-200 {scrolled ? 'backdrop-blur border-b' : ''}"
    style="background: {scrolled ? 'color-mix(in srgb, var(--bg) 90%, transparent)' : 'transparent'}; border-color: var(--border);"
    aria-hidden="true"
  ></div>
  <nav class="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="{base}" class="flex items-center gap-2.5 shrink-0">
      <img src="{assets}/icon.png" alt="Kaiden" width="32" height="32" style="border-radius: 22%; box-shadow: 0 2px 8px rgba(0,0,0,0.18)" />
      <span class="font-semibold tracking-tight text-[15px]" style="color: var(--text-primary)">
        kaiden
      </span>
    </a>

    <div class="flex items-center gap-1">
      <a
        href="https://github.com/openkaiden/kaiden"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden sm:block px-3 py-1.5 text-sm transition-colors"
        style="color: var(--text-secondary)"
        onmouseenter={(e) => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
        onmouseleave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
      >GitHub</a>
      <a
        href="/docs"
        class="hidden sm:block px-3 py-1.5 text-sm transition-colors"
        style="color: var(--text-secondary)"
        onmouseenter={(e) => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
        onmouseleave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
      >Docs</a>

      {#if mounted}
        <button
          onclick={() => theme.toggle()}
          class="w-8 h-8 flex items-center justify-center rounded-md transition-colors ml-1"
          style="color: var(--text-muted)"
          aria-label="Toggle theme"
        >
          {#if $theme === 'dark'}
            <!-- sun -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg>
          {:else}
            <!-- moon -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
            </svg>
          {/if}
        </button>
      {:else}
        <div class="w-8 h-8"></div>
      {/if}

      {#if $downloadStore}
        <button
          onclick={() => (modalOpen = true)}
          class="ml-2 px-4 py-1.5 text-sm font-medium rounded-md transition-opacity hover:opacity-90 cursor-pointer"
          style="background: var(--accent); color: var(--navy)"
        >Download</button>
      {:else}
        <a
          href={FALLBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="ml-2 px-4 py-1.5 text-sm font-medium rounded-md transition-opacity hover:opacity-90"
          style="background: var(--accent); color: var(--navy)"
        >Download</a>
      {/if}
    </div>
  </nav>
</header>

<DownloadModal bind:open={modalOpen} />
