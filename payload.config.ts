import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

// Collections
import { Users } from './payload/collections/Users';
import { Media } from './payload/collections/Media';
import { Bouquets } from './payload/collections/Bouquets';
import { CategoriesType } from './payload/collections/CategoriesType';
import { Flowers } from './payload/collections/Flowers';
import { Occasions } from './payload/collections/Occasions';
import { Orders } from './payload/collections/Orders';
import { Customers } from './payload/collections/Customers';
import { Conversations } from './payload/collections/Conversations';
import { Messages } from './payload/collections/Messages';
import { DeliveryZones } from './payload/collections/DeliveryZones';
import { DeliverySlots } from './payload/collections/DeliverySlots';
import { BlogPosts } from './payload/collections/BlogPosts';
import { BlogPipeline } from './payload/collections/BlogPipeline';
import { SeoPages } from './payload/collections/SeoPages';
import { Broadcasts } from './payload/collections/Broadcasts';
import { BroadcastRecipients } from './payload/collections/BroadcastRecipients';
import { ClientBlacklist } from './payload/collections/ClientBlacklist';
import { ReEngagementLog } from './payload/collections/ReEngagementLog';
import { Escalations } from './payload/collections/Escalations';
import { LegalDocuments } from './payload/collections/LegalDocuments';
import { AnalyticsEvents } from './payload/collections/AnalyticsEvents';
import { PromptsVersions } from './payload/collections/PromptsVersions';
import { WeddingBriefs } from './payload/collections/WeddingBriefs';
import { CorporateInquiries } from './payload/collections/CorporateInquiries';
import { Reviews } from './payload/collections/Reviews';
import { FallbackReferrals } from './payload/collections/FallbackReferrals';

// Globals
import { BrandVoice } from './payload/globals/BrandVoice';
import { LiyaRules } from './payload/globals/LiyaRules';
import { BrandSettings } from './payload/globals/BrandSettings';
import { PaymentSettings } from './payload/globals/PaymentSettings';
import { DeliverySettings } from './payload/globals/DeliverySettings';
import { GlobalPhotoStyle } from './payload/globals/GlobalPhotoStyle';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — Florenza Admin',
    },
    importMap: {
      baseDir: dirname,
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
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgres://florenza:florenza_dev@localhost:5432/florenza',
    },
    // push is enabled in dev OR when explicitly forced via PAYLOAD_PUSH=true.
    // Production: leave PAYLOAD_PUSH=true on the FIRST deploy (so the schema
    // gets created), then unset it on subsequent deploys.
    // TODO: replace with explicit migrations once Payload+tsx+Node 22 bin
    // resolution is fixed (currently throws ERR_REQUIRE_ASYNC_MODULE).
    push: process.env.NODE_ENV !== 'production' || process.env.PAYLOAD_PUSH === 'true',
    migrationDir: path.resolve(dirname, 'db/migrations'),
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
    schemaOutputFile: path.resolve(dirname, 'payload-schema.json'),
  },

  sharp: undefined as any, // injected at runtime by withPayload
});
