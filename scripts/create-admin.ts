
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
    const email = 'AdminDemo4241@gmail.com'; // Corrected typo from user input gamil
    const password = 'DemoAmbalan2025';
    const name = 'Admin Demo';

    console.log(`Creating admin account for: ${email}`);

    // 1. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    console.log('Password hashed successfully.');

    // 2. Insert into Database
    try {
        const newAdmin = await prisma.dataAdminTerdaftar.create({
            data: {
                id_admin: uuidv4(),
                email: email,
                password_hash: passwordHash,
                nama_lengkap: name,
                status: 'Active'
            },
        });

        console.log('✅ Admin created successfully!');
        console.log(newAdmin);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
