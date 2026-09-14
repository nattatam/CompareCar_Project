import type { MetadataRoute } from "next";
import { cars } from "@/data/cars";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/compare"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/credits"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: absoluteUrl("/disclaimer"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const carRoutes: MetadataRoute.Sitemap = cars.map((car) => ({
    url: absoluteUrl(`/car/${car.id}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [absoluteUrl(car.image)],
  }));

  return [...staticRoutes, ...carRoutes];
}