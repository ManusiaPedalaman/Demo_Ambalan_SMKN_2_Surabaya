'use server';
import { prisma } from "@/lib/prisma";

export async function updateAdminProfileImage(email: string, base64Image: string) {
    try {
        if (!email) throw new Error("Email is required");

        await prisma.dataAdminTerdaftar.updateMany({
            where: { email: email },
            data: { foto: base64Image }
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating admin profile image:", error);
        return { success: false, error: 'Failed to update image' };
    }
}
