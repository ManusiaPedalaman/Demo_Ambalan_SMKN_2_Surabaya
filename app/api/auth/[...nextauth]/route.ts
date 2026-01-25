import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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
                            role: "ADMIN",
                            image: adminUser.foto && adminUser.foto.startsWith('data:') ? null : adminUser.foto
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
                            name: user.nama_lengkap || user.email.split('@')[0],
                            email: user.email,
                            role: "USER",
                            image: user.foto && user.foto.startsWith('data:') ? null : user.foto
                        };
                    }
                }


                const adminEmail = process.env.ADMIN_EMAIL || "AdminMada@gmail.com";
                const adminPassword = process.env.ADMIN_PASSWORD || "Mada4241";

                // Check for specific hardcoded admin credentials
                if (credentials.email === "login" && credentials.password === "admin") {
                    return {
                        id: "admin-manual-login",
                        name: "Super Admin",
                        email: "admin@ambalan.com", // Dummy email for session
                        role: "ADMIN",
                        image: null
                    };
                }
                
                if (credentials.email === adminEmail && credentials.password === adminPassword) {
                    try {

                        const hashedPassword = await bcrypt.hash(adminPassword, 10);
                        const newAdmin = await prisma.dataAdminTerdaftar.create({
                            data: {
                                id_admin: uuidv4(),
                                nama_lengkap: "Master Admin",
                                email: adminEmail,
                                password_hash: hashedPassword,
                                status: "Login",
                                foto: null
                            }
                        });

                        return {
                            id: newAdmin.id_admin,
                            name: newAdmin.nama_lengkap,
                            email: newAdmin.email,
                            role: "ADMIN",
                            image: null // Admin master doesn't need image
                        };
                    } catch (error) {
                        console.error("Auto-seed admin error:", error);

                        return {
                            id: "admin-master",
                            name: "Master Admin",
                            email: adminEmail,
                            role: "ADMIN",
                            image: null
                        };
                    }
                }

                return null;
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google' || account?.provider === 'facebook') {
                const email = user.email?.toLowerCase();
                if (!email) return false;

                try {
                    // Check if Admin
                    const existingAdmin = await prisma.dataAdminTerdaftar.findFirst({
                        where: { email }
                    });

                    if (existingAdmin) {
                        return true;
                    }

                    // Check if User exists
                    const existingUser = await prisma.dataUserLogin.findFirst({
                        where: { email }
                    });

                    if (!existingUser) {
                        // Create new user
                        const dummyHash = await bcrypt.hash(uuidv4(), 10);

                        try {
                            await prisma.dataUserLogin.create({
                                data: {
                                    id_login: uuidv4(),
                                    email: email,
                                    password_hash: dummyHash,
                                    status: "Login (Social)",
                                    nama_lengkap: user.name || email.split('@')[0],
                                    // Don't store large image in DB instantly if it causes issues, or strictly allow URL
                                    foto: user.image 
                                }
                            });
                        } catch (createError) {
                            // Handle race condition: check if it was created by another request
                             console.warn("Creation failed, checking race condition:", createError);
                             const raceCheck = await prisma.dataUserLogin.findFirst({
                                where: { email }
                            });
                            if (!raceCheck) {
                                // Real error
                                throw createError;
                            }
                        }
                    }

                    return true;
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    return false;
                }
            }


            return true;
        },
        async jwt({ token, user, account, trigger, session }) {

            if (user) {
                token.role = (user as any).role || 'USER';
                token.picture = user.image;

                if (account?.provider === 'google' || account?.provider === 'facebook') {
                    const adminCheck = await prisma.dataAdminTerdaftar.findFirst({
                        where: { email: user.email }
                    });
                    if (adminCheck) {
                        token.role = 'ADMIN';
                        const dbFoto = adminCheck.foto;
                        // Avoid base64 in token
                        token.picture = (dbFoto && dbFoto.startsWith('data:')) ? null : (dbFoto || user.image);
                    }
                }
            }

            // Handle session update
            if (trigger === "update") {
                if (session?.image && !session.image.startsWith('data:')) token.picture = session.image;
                if (session?.name) token.name = session.name;
            }

            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).role = token.role;
                if (token.picture) {
                    session.user.image = token.picture;
                }
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
