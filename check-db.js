const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        // Attempt to count tokens to check if table exists
        const count = await prisma.verificationToken.count();
        console.log('Successfully accessed verification_tokens table. Count:', count);
    } catch (error) {
        console.error('Error accessing verification_tokens table:', error.message);
        if (error.code) console.error('Error code:', error.code);
    } finally {
        await prisma.$disconnect();
    }
}

main();
