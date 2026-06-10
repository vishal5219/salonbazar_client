import { useEffect } from 'react'
import { SEO_DEFAULTS } from '@/constants/seo'

function upsertMeta(attr, key, content) {
  if (content == null || content === '') return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!data) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export default function SEO({
  title,
  description,
  canonical,
  image,
  ogType = 'website',
  noindex = false,
  jsonLd,
  jsonLdId = 'seo-jsonld',
}) {
  const ogImage = image || SEO_DEFAULTS.defaultImage

  useEffect(() => {
    document.title = title

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertLink('canonical', canonical)

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:type', ogType)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('property', 'og:site_name', SEO_DEFAULTS.siteName)
    upsertMeta('property', 'og:locale', SEO_DEFAULTS.locale)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:site', SEO_DEFAULTS.twitterHandle)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)

    const ldData = Array.isArray(jsonLd)
      ? { '@context': 'https://schema.org', '@graph': jsonLd }
      : jsonLd
    upsertJsonLd(jsonLdId, ldData)
  }, [title, description, canonical, ogImage, ogType, noindex, jsonLd, jsonLdId])

  return null
}
