import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://gaelscout.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://gaelscout.com/teams',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: 'https://gaelscout.com/events',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.2,
    },
    {
      url: 'https://gaelscout.com/profiles',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.2,
    },
    {
      url: 'https://gaelscout.com/rankings',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://gaelscout.com/predict',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: 'https://gaelscout.com/verify',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.1,
    }
  ]
}