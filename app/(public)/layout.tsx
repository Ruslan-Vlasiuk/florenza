import type { ReactNode } from 'react';
import { Header } from '@/components/florenza/Header';
import { Footer } from '@/components/florenza/Footer';
import { LiyaChatLauncher } from '@/components/florenza/LiyaChatLauncher';
import { LenisProvider } from '@/components/florenza/LenisProvider';
import { CustomCursor } from '@/components/florenza/CustomCursor';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <CustomCursor />
      <LocalBusinessSchema />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <LiyaChatLauncher />
    </LenisProvider>
  );
}
