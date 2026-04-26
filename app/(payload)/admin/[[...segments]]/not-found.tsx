import config from '@/payload-config';
import { NotFoundPage } from '@payloadcms/next/views';
import { importMap } from '../importMap';

type Args = {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

const Page = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params: params as any, searchParams, importMap });

export default Page;
