import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
        }


        const existingUser = await prisma.dataUserLogin.findFirst({
            where: { email: email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 409 });
        }


        
        const hashedPassword = await bcrypt.hash(password, 10);


        const adminEmail = process.env.ADMIN_EMAIL || "AdminMada@gmail.com";

        if (email === adminEmail) {

            const existingAdmin = await prisma.dataAdminTerdaftar.findFirst({
                where: { email: email }
            });

            if (existingAdmin) {
                return NextResponse.json({ message: "Admin sudah terdaftar" }, { status: 409 });
            }

            const newAdmin = await prisma.dataAdminTerdaftar.create({
                data: {
                    id_admin: uuidv4(),
                    nama_lengkap: "Master Admin",
                    email: email,
                    password_hash: hashedPassword,
                    status: "Login"
                }
            });

            return NextResponse.json({ message: "Registrasi Admin berhasil", user: newAdmin }, { status: 201 });
        }


        const newUser = await prisma.dataUserLogin.create({
            data: {
                id_login: uuidv4(),
                email: email,
                password_hash: hashedPassword,
                status: "Login"
            },
        });

        return NextResponse.json({ message: "Registrasi berhasil", user: newUser }, { status: 201 });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
    }
}