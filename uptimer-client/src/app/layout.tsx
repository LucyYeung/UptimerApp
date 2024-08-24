import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { apolloClient } from '@/queries/apolloClient';
import ApolloProvider from '@/queries/apolloProvider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Uptimer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-TW'>
      <body className={inter.className}>
        <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
