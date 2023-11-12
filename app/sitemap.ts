import { absoluteUrl } from '@/lib/utils'
import { MetadataRoute } from 'next'

const rootUrl = absoluteUrl('');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: rootUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]
}
