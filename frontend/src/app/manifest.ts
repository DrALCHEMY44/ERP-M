
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SmartERP AI - Cameroonian SME Hub',
    short_name: 'SmartERP',
    description: 'AI-powered ERP platform for SMEs in Cameroon.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
