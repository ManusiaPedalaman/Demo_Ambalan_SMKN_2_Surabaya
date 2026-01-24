const postgres = require('postgres');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const sql = postgres(connectionString);

async function addFotoColumn() {
  try {
    console.log('Attempting to add "foto" column to "data_admin_terdaftar" table...');
    
    // Check if column exists first to avoid errors
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'data_admin_terdaftar' AND column_name = 'foto'
    `;

    if (columns.length > 0) {
      console.log('Column "foto" already exists.');
    } else {
      await sql`
        ALTER TABLE "data_admin_terdaftar" 
        ADD COLUMN "foto" TEXT
      `;
      console.log('Successfully added "foto" column.');
    }

  } catch (error) {
    console.error('Error adding column:', error);
  } finally {
    await sql.end();
  }
}

addFotoColumn();
