
// Dedicated Bot Token
const BOT_TOKEN = '8554941949:AAGPIRQqcwvzEZ2C69a6meGuumG0NWqA1jc';
// We need to find this ID. For now, we'll log it if missing.
const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

export async function sendTelegramNotification(message: string) {
    // If we don't have a chat ID yet, log to console
    if (!DEFAULT_CHAT_ID) {
        console.warn('TELEGRAM_CHAT_ID is not set. Message not sent:', message);
        return;
    }

    try {
        const url = `https://api.telegram.org/bot8554941949:AAGPIRQqcwvzEZ2C69a6meGuumG0NWqA1jc/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: DEFAULT_CHAT_ID,
                text: message,
                parse_mode: 'Markdown', // Optional: allows bold/italic
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to send Telegram message:', errorData);
        }
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
}
