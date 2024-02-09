import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.gaelscout.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://www.gaelscout.com/teams',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: 'https://www.gaelscout.com/events',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.2,
    },
    {
      url: 'https://www.gaelscout.com/profiles',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.2,
    },
    {
      url: 'https://www.gaelscout.com/rankings',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.gaelscout.com/predict',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.4,
    }
  ]
}