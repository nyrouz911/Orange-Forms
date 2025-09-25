import createMiddleware from 'next-intl/middleware';
import intlConfig from './next-intl.config.js';

export default createMiddleware(intlConfig);

export const config = {
  matcher: ['/', '/(en|fr|pl)/:path*']
};
