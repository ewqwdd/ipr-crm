import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function sendToTelegram(...args: string[]) {
  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: `🚨 Error:\n\`\`\`${args.join(`\n\n`)}\`\`\``,
        parse_mode: 'Markdown',
      },
    );
  } catch (err) {
    console.error('Failed to send Telegram message', err.response?.data);
  }
}
