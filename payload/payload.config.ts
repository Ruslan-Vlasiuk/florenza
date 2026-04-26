import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

// Collections
import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Bouquets } from './collections/Bouquets';
import { CategoriesType } from './collections/CategoriesType';
import { Flowers } from './collections/Flowers';
import { Occasions } from './collections/Occasions';
import { Orders } from './collections/Orders';
import { Customers } from './collections/Customers';
import { Conversations } from './collections/Conversations';
import { Messages } from './collections/Messages';
import { DeliveryZones } from './collections/DeliveryZones';
import { DeliverySlots } from './collections/DeliverySlots';
import { BlogPosts } from './collections/BlogPosts';
import { BlogPipeline } from './collections/BlogPipeline';
import { SeoPages } from './collections/SeoPages';
import { Broadcasts } from './collections/Broadcasts';
import { BroadcastRecipients } from './collections/BroadcastRecipients';
import { ClientBlacklist } from './collections/ClientBlacklist';
import { ReEngagementLog } from './collections/ReEngagementLog';
import { Escalations } from './collections/Escalations';
import { LegalDocuments } from './collections/LegalDocuments';
import { AnalyticsEvents } from './collections/AnalyticsEvents';
import { PromptsVersions } from './collections/PromptsVersions';
import { WeddingBriefs } from './collections/WeddingBriefs';
import { CorporateInquiries } from './collections/CorporateInquiries';
import { Reviews } from './collections/Reviews';
import { FallbackReferrals } from './collections/FallbackReferrals';

// Globals
import { BrandVoice } from './globals/BrandVoice';
import { LiyaRules } from './globals/LiyaRules';
import { BrandSettings } from './globals/BrandSettings';
import { PaymentSettings } from './globals/PaymentSettings';
import { DeliverySettings } from './globals/DeliverySettings';
import { GlobalPhotoStyle } from './globals/GlobalPhotoStyle';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — Florenza Admin',
    },
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
  },

  collections: [
    Users,
    Media,
    Bouquets,
    CategoriesType,
    Flowers,
    Occasions,
    Orders,
    Customers,
    Conversations,
    Messages,
    DeliveryZones,
    DeliverySlots,
    BlogPosts,
    BlogPipeline,
    SeoPages,
    Broadcasts,
    BroadcastRecipients,
    ClientBlacklist,
    ReEngagementLog,
    Escalations,
    LegalDocuments,
    AnalyticsEvents,
    PromptsVersions,
    WeddingBriefs,
    CorporateInquiries,
    Reviews,
    FallbackReferrals,
  ],

  globals: [
    BrandSettings,
    BrandVoice,
    LiyaRules,
    GlobalPhotoStyle,
    PaymentSettings,
    DeliverySettings,
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'florenza_dev_secret_change_in_production',

  typescript: {
    outputFile: path.resolve(dirname, '..', 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgres://florenza:florenza_dev@localhost:5432/florenza',
    },
  }),

  upload: {
    limits: {
      fileSize: 20_000_000, // 20 MB max
    },
  },

  cors: [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ],

  csrf: [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ],

  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  graphQL: {
    disable: false,
    schemaOutputFile: path.resolve(dirname, '..', 'payload-schema.json'),
  },

  sharp: undefined as any, // injected at runtime by withPayload
});
