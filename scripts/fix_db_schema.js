const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting manual schema update...');
  try {
    // Add missing columns to data_user_login
    await prisma.$executeRawUnsafe(`ALTER TABLE "data_user_login" ADD COLUMN IF NOT EXISTS "nama_lengkap" TEXT;`);
    console.log('Added nama_lengkap');

    await prisma.$executeRawUnsafe(`ALTER TABLE "data_user_login" ADD COLUMN IF NOT EXISTS "no_wa" TEXT;`);
    console.log('Added no_wa');

    await prisma.$executeRawUnsafe(`ALTER TABLE "data_user_login" ADD COLUMN IF NOT EXISTS "tgl_lahir" DATE;`);
    console.log('Added tgl_lahir');

    await prisma.$executeRawUnsafe(`ALTER TABLE "data_user_login" ADD COLUMN IF NOT EXISTS "sekolah_instansi" TEXT;`);
    console.log('Added sekolah_instansi');

    await prisma.$executeRawUnsafe(`ALTER TABLE "data_user_login" ADD COLUMN IF NOT EXISTS "kelas" TEXT;`);
    console.log('Added kelas');

    await prisma.$executeRawUnsafe(`ALTER TABLE "data_user_login" ADD COLUMN IF NOT EXISTS "jurusan" TEXT;`);
    console.log('Added jurusan');

    await prisma.$executeRawUnsafe(`ALTER TABLE "data_user_login" ADD COLUMN IF NOT EXISTS "foto" TEXT;`);
    console.log('Added foto');
    
    console.log('Schema update completed successfully.');
  } catch (e) {
    console.error('Error updating schema:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
