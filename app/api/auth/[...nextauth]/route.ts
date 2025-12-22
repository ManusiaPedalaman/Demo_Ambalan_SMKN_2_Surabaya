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

                const { prisma } = require('@/lib/prisma');
                const bcrypt = require('bcryptjs');

                if (!credentials?.email || !credentials?.password) return null;


                const adminUser = await prisma.dataAdminTerdaftar.findFirst({
                    where: { email: credentials.email }
                });

                if (adminUser) {

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


                const adminEmail = process.env.ADMIN_EMAIL || "AdminMada@gmail.com";
                const adminPassword = process.env.ADMIN_PASSWORD || "Mada4241";

                if (credentials.email === adminEmail && credentials.password === adminPassword) {
                    try {

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


            if (account?.provider === 'google' || account?.provider === 'facebook') {
                const email = user.email;
                if (!email) return false;

                try {





                    const existingAdmin = await prisma.dataAdminTerdaftar.findFirst({
                        where: { email }
                    });

                    if (existingAdmin) {


                        return true;
                    }


                    const existingUser = await prisma.dataUserLogin.findFirst({
                        where: { email }
                    });

                    if (!existingUser) {



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


            return true;
        },
        async jwt({ token, user, account }) {

            if (user) {
                token.role = (user as any).role || 'USER';







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
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXTAUTH_SECRET || 'changeme',
});

export { handler as GET, handler as POST };
