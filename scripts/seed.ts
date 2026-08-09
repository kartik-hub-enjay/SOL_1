import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../lib/supabaseAdmin';
import {
  SEEDED_UNIVERSITIES,
  SEEDED_COMMUNITIES,
  SEEDED_STUDENTS,
  ADMIN_USER,
  SEEDED_CIRCLES,
  SEEDED_MESSAGES,
  SEEDED_OPPORTUNITIES,
} from '../lib/seedData';

async function seed() {
  console.log('🌱 Starting Spark Database Seeding...');

  // 1. Seed Universities
  console.log('Seeding universities...');
  const { error: uniError } = await supabaseAdmin
    .from('universities')
    .upsert(SEEDED_UNIVERSITIES, { onConflict: 'id' });
  if (uniError) console.warn('Universities seed note:', uniError.message);

  // 2. Seed Communities
  console.log('Seeding communities...');
  const { error: commError } = await supabaseAdmin
    .from('communities')
    .upsert(SEEDED_COMMUNITIES, { onConflict: 'id' });
  if (commError) console.warn('Communities seed note:', commError.message);

  // 3. Seed Students & Admin
  console.log('Seeding student profiles & admin...');
  const allUsers = [...SEEDED_STUDENTS, ADMIN_USER];
  const { error: usrError } = await supabaseAdmin
    .from('users')
    .upsert(allUsers, { onConflict: 'id' });
  if (usrError) console.warn('Users seed note:', usrError.message);

  // 4. Seed Circles
  console.log('Seeding circles...');
  const { error: circleError } = await supabaseAdmin
    .from('circles')
    .upsert(SEEDED_CIRCLES, { onConflict: 'id' });
  if (circleError) console.warn('Circles seed note:', circleError.message);

  // 5. Seed Circle Memberships
  console.log('Seeding circle memberships...');
  const circleMemberships = SEEDED_STUDENTS.slice(0, 30).map((u, i) => ({
    user_id: u.id,
    circle_id: SEEDED_CIRCLES[i % SEEDED_CIRCLES.length].id,
  }));
  const { error: cmError } = await supabaseAdmin
    .from('circle_memberships')
    .upsert(circleMemberships, { onConflict: 'user_id,circle_id' });
  if (cmError) console.warn('Circle memberships seed note:', cmError.message);

  // 6. Seed Messages
  console.log('Seeding realistic circle messages...');
  const allMessages = Object.values(SEEDED_MESSAGES).flat();
  const { error: msgError } = await supabaseAdmin
    .from('circle_messages')
    .upsert(allMessages, { onConflict: 'id' });
  if (msgError) console.warn('Messages seed note:', msgError.message);

  // 7. Seed Opportunities
  console.log('Seeding opportunities feed...');
  const { error: oppError } = await supabaseAdmin
    .from('opportunities')
    .upsert(SEEDED_OPPORTUNITIES, { onConflict: 'id' });
  if (oppError) console.warn('Opportunities seed note:', oppError.message);

  console.log('✅ Spark Database Seed script execution completed.');
}

seed().catch((err) => {
  console.error('Seed execution script warning:', err);
});
