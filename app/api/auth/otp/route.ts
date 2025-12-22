
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendMail } from '@/lib/mail';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, type } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        if (type === 'send') {
            // Generate 6-digit OTP
            const otp = crypto.randomInt(100000, 999999).toString();
            const expires = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes

            // Save to database
            await prisma.verificationToken.create({
                data: {
                    identifier: email,
                    token: otp,
                    expires,
                },
            });

            // Send email
            const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6B4D27;">Verifikasi Email Anda</h2>
          <p>Kode OTP Anda adalah:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #56ABD7;">${otp}</h1>
          <p>Kode ini berlaku selama 10 menit via Gmail Anda.</p>
          <p>Jika Anda tidak meminta ini, abaikan saja.</p>
        </div>
      `;

            const mailResult = await sendMail({
                to: email,
                subject: 'Kode OTP Verifikasi Ambalan',
                html,
            });

            if (!mailResult.success) {
                return NextResponse.json({ message: 'Gagal mengirim email' }, { status: 500 });
            }

            return NextResponse.json({ message: 'OTP sent successfully' });
        }

        if (type === 'verify') {
            const { email, otp } = await req.json();

            if (!email || !otp) {
                return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
            }

            const record = await prisma.verificationToken.findFirst({
                where: {
                    identifier: email,
                    token: otp,
                },
            });

            if (!record) {
                return NextResponse.json({ isValid: false, message: 'Invalid OTP' }, { status: 400 });
            }

            const now = new Date();
            if (record.expires < now) {
                return NextResponse.json({ isValid: false, message: 'OTP Expired' }, { status: 400 });
            }

            // Optional: Delete token after usage or keep it until expiry? 
            // Usually better to delete to prevent replay attacks
            await prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: email,
                        token: otp
                    }
                }
            });

            return NextResponse.json({ isValid: true, message: 'OTP Verified' });
        }

        return NextResponse.json({ message: 'Invalid type' }, { status: 400 });

    } catch (error) {
        console.error('OTP API Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

