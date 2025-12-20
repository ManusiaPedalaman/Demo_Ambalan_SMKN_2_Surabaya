import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuidv4 } from 'uuid';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Prepare Utils
                const { prisma } = require('@/lib/prisma');
                const bcrypt = require('bcryptjs');

                if (!credentials?.email || !credentials?.password) return null;

                // 1. Cek Admin Database (DataAdminTerdaftar)
                const adminUser = await prisma.dataAdminTerdaftar.findFirst({
                    where: { email: credentials.email }
                });

                if (adminUser) {
                    // Check password if admin exists
                    const isValid = await bcrypt.compare(credentials.password, adminUser.password_hash);
                    if (isValid) {
                        return {
                            id: adminUser.id_admin,
                            name: adminUser.nama_lengkap || "Admin",
                            email: adminUser.email,
                            role: "ADMIN"
                        };
                    }
                }

                // 2. Cek User Database (DataUserLogin)
                const user = await prisma.dataUserLogin.findFirst({
                    where: { email: credentials.email }
                });

                if (user && user.password_hash) {
                    const isValid = await bcrypt.compare(credentials.password, user.password_hash);
                    if (isValid) {
                        return {
                            id: user.id_login,
                            name: user.email.split('@')[0],
                            email: user.email,
                            role: "USER"
                        };
                    }
                }

                // 3. Fallback & Auto-Seed Hardcoded Admin
                const adminEmail = process.env.ADMIN_EMAIL || "AdminMada@gmail.com";
                const adminPassword = process.env.ADMIN_PASSWORD || "Mada4241";

                if (credentials.email === adminEmail && credentials.password === adminPassword) {
                    try {
                        // Create admin in DB so it shows up in dashboard lists
                        const hashedPassword = await bcrypt.hash(adminPassword, 10);
                        const newAdmin = await prisma.dataAdminTerdaftar.create({
                            data: {
                                id_admin: uuidv4(),
                                nama_lengkap: "Master Admin",
                                email: adminEmail,
                                password_hash: hashedPassword,
                                status: "Login"
                            }
                        });

                        return {
                            id: newAdmin.id_admin,
                            name: newAdmin.nama_lengkap,
                            email: newAdmin.email,
                            role: "ADMIN"
                        };
                    } catch (error) {
                        console.error("Auto-seed admin error:", error);
                        // If create fails (e.g. race condition), try specific fetch or just return fallback
                        return {
                            id: "admin-master",
                            name: "Master Admin",
                            email: adminEmail,
                            role: "ADMIN"
                        };
                    }
                }

                return null;
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const { prisma } = require('@/lib/prisma');
            const bcrypt = require('bcryptjs');

            // If login is with Google or Facebook
            if (account?.provider === 'google' || account?.provider === 'facebook') {
                const email = user.email;
                if (!email) return false;

                try {
                    // 1. Check if email is an ADMIN (e.g. they used social login but email matches admin)
                    // If matched, we allow it but typically they should use credentials if they want full admin power, 
                    // OR we map them to admin here. For now, let's just create them as regular user if not admin.
                    const existingAdmin = await prisma.dataAdminTerdaftar.findFirst({
                        where: { email }
                    });

                    if (existingAdmin) {
                        // If they are admin, we let them through. 
                        // Note: role assignment happens in JWT callback, we need to ensure it knows they are admin.
                        // However, standard flow might treat them as user if we don't assign role here.
                        // For simplicity, if they are admin, we don't duplicate them into user table.
                        return true;
                    }

                    // 2. Check if user exists in DataUserLogin
                    const existingUser = await prisma.dataUserLogin.findFirst({
                        where: { email }
                    });

                    if (!existingUser) {
                        // Create new user in DataUserLogin
                        // Generate dummy hash since they use social login
                        const dummyHash = await bcrypt.hash(uuidv4(), 10);

                        await prisma.dataUserLogin.create({
                            data: {
                                id_login: uuidv4(),
                                email: email,
                                password_hash: dummyHash,
                                status: "Login (Social)"
                            }
                        });
                    }

                    return true;
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    return false;
                }
            }

            // Allow Credentials login to proceed
            return true;
        },
        async jwt({ token, user, account }) {
            // Assign role
            if (user) {
                token.role = (user as any).role || 'USER'; // Default to USER



                // If social login, we might need to fetch role again or check admin table 
                // to give them ADMIN role if their email is in admin table.
                if (account?.provider === 'google' || account?.provider === 'facebook') {
                    const { prisma } = require('@/lib/prisma');
                    const adminCheck = await prisma.dataAdminTerdaftar.findFirst({
                        where: { email: user.email }
                    });
                    if (adminCheck) {
                        token.role = 'ADMIN';
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
});

export { handler as GET, handler as POST };
