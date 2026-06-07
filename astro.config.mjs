import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://langcraft-flux.github.io',
  base: '/last30days-deep-dive',
  integrations: [
    starlight({
      title: 'Last30Days Skill — Deep Dive',
      description: 'A 10-chapter deep dive into Matt Van Horn\'s Last30Days skill — by LangCraft',
      customCss: ['./src/styles/custom.css'],
      components: {
        Footer: './src/components/Footer.astro',
      },
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://langcraft-flux.github.io/last30days-deep-dive/og-image.jpg' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://langcraft-flux.github.io/last30days-deep-dive/og-image.jpg' } },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/langcraft-flux/last30days-deep-dive' },
      ],
      sidebar: [
        {
          label: 'Introduction',
          link: '/intro',
        },
        {
          label: 'Chapters',
          items: [
            { label: '1. Product Thesis & Surface Area', link: '/chapters/01-product-thesis-and-surface-area' },
            { label: '2. SKILL.md as Control Plane', link: '/chapters/02-skill-contract-and-control-plane' },
            { label: '3. CLI Entry Point & Runtime', link: '/chapters/03-cli-entry-point-and-runtime' },
            { label: '4. Query Planning & Topic Resolution', link: '/chapters/04-query-planning-and-topic-resolution' },
            { label: '5. Source Adapters & Auth Model', link: '/chapters/05-source-adapters-and-auth-model' },
            { label: '6. Ranking, Clustering & Fusion', link: '/chapters/06-ranking-clustering-and-fusion' },
            { label: '7. Rendering & Shareable HTML', link: '/chapters/07-rendering-and-shareable-html' },
            { label: '8. Watchlists, Storage & Briefings', link: '/chapters/08-watchlists-storage-and-briefings' },
            { label: '9. Testing & Release Discipline', link: '/chapters/09-testing-and-release-discipline' },
            { label: '10. Why the Design Works', link: '/chapters/10-why-the-design-works' },
          ],
        },
      ],
    }),
  ],
});
