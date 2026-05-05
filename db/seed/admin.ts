/**
 * Idempotent admin user seed.
 *
 * Creates the first admin if `users` collection is empty. Reads credentials
 * from INITIAL_ADMIN_EMAIL + INITIAL_ADMIN_PASSWORD. Skips silently if env
 * vars are missing or any user already exists.
 *
 * Used by docker-entrypoint.sh on container start, and `pnpm seed:admin`
 * locally.
 */

import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../../payload.config';

async function seedAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  const name = process.env.INITIAL_ADMIN_NAME ?? 'Owner';

  if (!email || !password) {
    console.log('[seed:admin] INITIAL_ADMIN_EMAIL or INITIAL_ADMIN_PASSWORD not set — skipping');
    return;
  }

  const payload = await getPayload({ config });

  const byEmail = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  });

  if (byEmail.docs.length > 0) {
    console.log(`[seed:admin] User already exists: ${email} — skipping`);
    return;
  }

  const admin = await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      email,
      password,
      name,
      role: 'owner',
    } as any,
  });

  console.log(`[seed:admin] Created owner user: ${admin.email} (id: ${admin.id})`);

  await payload.destroy();
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed:admin] FAILED:', err);
    process.exit(1);
  });
