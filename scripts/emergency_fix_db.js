const postgres = require('postgres');

// Use the DIRECT connection string to ensure we bypass pooler issues for DDL
const connectionString = "postgresql://postgres.keoymowkimgexkgykthe:Mada_4dmin123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function main() {
  console.log("Connecting to database via postgres.js...");
  const sql = postgres(connectionString);

  try {
    console.log("Adding missing columns...");
    
    await sql`ALTER TABLE data_user_login ADD COLUMN IF NOT EXISTS nama_lengkap TEXT`;
    console.log("Added nama_lengkap");

    await sql`ALTER TABLE data_user_login ADD COLUMN IF NOT EXISTS no_wa TEXT`;
    console.log("Added no_wa");

    await sql`ALTER TABLE data_user_login ADD COLUMN IF NOT EXISTS tgl_lahir DATE`;
    console.log("Added tgl_lahir");

    await sql`ALTER TABLE data_user_login ADD COLUMN IF NOT EXISTS sekolah_instansi TEXT`;
    console.log("Added sekolah_instansi");

    await sql`ALTER TABLE data_user_login ADD COLUMN IF NOT EXISTS kelas TEXT`;
    console.log("Added kelas");
    
    await sql`ALTER TABLE data_user_login ADD COLUMN IF NOT EXISTS jurusan TEXT`;
    console.log("Added jurusan");

    await sql`ALTER TABLE data_user_login ADD COLUMN IF NOT EXISTS foto TEXT`;
    console.log("Added foto");

    console.log("Database patch completed successfully!");
  } catch (error) {
    console.error("Error executing SQL:", error);
  } finally {
    await sql.end();
  }
}

main();
