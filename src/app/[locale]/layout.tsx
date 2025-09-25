import {NextIntlClientProvider} from 'next-intl';
import Header from '@/components/ui/header';

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: 'en'|'fr'|'pl'};
}) {
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header/>
      <main>{children}</main>
    </NextIntlClientProvider>
  );
}
