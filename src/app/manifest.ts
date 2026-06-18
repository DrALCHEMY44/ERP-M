
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
        src: 'https://placehold.co/192x192/2563eb/white?text=ERP',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://placehold.co/512x512/2563eb/white?text=SmartERP',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
