import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnalyticsGC from '@/components/Analytics'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/site'
import { Analytics } from '@vercel/analytics/next'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — Compare Car Specs, Prices & Powertrains`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'compare cars',
    'car comparison',
    'car specifications',
    'EV',
    'electric car compare',
    'hybrid car',
    'PHEV',
    'sedan',
    'SUV',
    'car prices',
    'Thailand car market',
  ],
  icons: {
    icon: '/icon-compare-car.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — Compare Car Specs, Prices & Powertrains`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/icon-compare-car.png',
        width: 1024,
        height: 1024,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: `${SITE_NAME} — Compare Car Specs, Prices & Powertrains`,
    description: SITE_DESCRIPTION,
    images: ['/icon-compare-car.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">
          <TooltipProvider>{children}</TooltipProvider>
        </main>
        <Footer />
        <AnalyticsGC />
        <Analytics />
      </body>
    </html>
  )
}
