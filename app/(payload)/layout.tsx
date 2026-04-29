/* Payload admin must NOT inherit the public layout (Lenis, Header, etc) */
import '@payloadcms/next/css';
import config from '@/payload-config';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import { importMap } from './admin/importMap';

import './admin-overrides.css';

const serverFunction: ServerFunctionClient = async (args) => {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
