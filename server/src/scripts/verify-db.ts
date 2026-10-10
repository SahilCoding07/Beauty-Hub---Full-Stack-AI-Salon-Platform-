/**
 * Standalone script to validate MongoDB Atlas connectivity.
 * Usage: npm run db:verify
 */
import { connectDatabase, disconnectDatabase, getDatabaseStatus } from '../config/database.js';

async function main() {
  console.log('MongoDB Atlas connection verification\n');
  await connectDatabase();

  const status = getDatabaseStatus();
  console.log('\nConnection status:');
  console.log(`  Connected:  ${status.connected}`);
  console.log(`  Host:       ${status.host}`);
  console.log(`  Database:   ${status.database}`);
  console.log(`  ReadyState: ${status.readyState} (1 = connected)`);
  console.log('\n✓ MongoDB Atlas is configured correctly. Data will persist across server restarts.\n');

  await disconnectDatabase();
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
