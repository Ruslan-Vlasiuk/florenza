/* Payload admin must NOT inherit the public layout (Lenis, Header, etc) */
import '@payloadcms/next/css';
import config from '@/payload-config';
import { RootLayout } from '@payloadcms/next/layouts';
// @ts-expect-error — handleServerFunctions is internal but stable in Payload 3.x
import { handleServerFunctions } from '@payloadcms/next/dist/utilities/handleServerFunctions.js';
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
