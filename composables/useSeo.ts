/**
 * SEO par page : titre, description, canonical et balises Open Graph / Twitter
 * cohérentes. Utilise l'URL du site (runtimeConfig.public.siteUrl) + le chemin
 * courant pour générer les URLs canoniques.
 */
export function usePageSeo(opts: { title: string; description: string; path?: string }) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = (config.public.siteUrl as string)?.replace(/\/$/, '') || ''
  const url = siteUrl + (opts.path ?? route.path)

  useSeoMeta({
    title: opts.title,
    description: opts.description,
    ogTitle: opts.title,
    ogDescription: opts.description,
    ogUrl: url,
    twitterTitle: opts.title,
    twitterDescription: opts.description,
  })

  useHead({
    link: [{ rel: 'canonical', href: url }],
  })
}
