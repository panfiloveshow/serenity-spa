#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const FAILED_BOOKINGS_DIR = '/var/www/serenity-spa/failed-bookings';
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;
const MAX_RETRIES = 10;

async function retryFailedBookings() {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
    console.error('[RETRY] Missing Telegram credentials');
    return;
  }

  try {
    const files = await fs.readdir(FAILED_BOOKINGS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log('[RETRY] No failed bookings to retry');
      return;
    }

    console.log(`[RETRY] Found ${jsonFiles.length} failed booking(s)`);

    for (const filename of jsonFiles) {
      const filepath = path.join(FAILED_BOOKINGS_DIR, filename);
      
      try {
        const content = await fs.readFile(filepath, 'utf-8');
        const booking = JSON.parse(content);

        // Check retry count
        if (booking.retryCount >= MAX_RETRIES) {
          console.log(`[RETRY] Max retries reached for ${filename}, archiving...`);
          const archivePath = filepath.replace('.json', '.archived.json');
          await fs.rename(filepath, archivePath);
          continue;
        }

        // Try to send to Telegram
        const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TG_CHAT_ID,
            text: booking.message,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });

        const result = await response.json();

        if (result.ok) {
          console.log(`[RETRY] Successfully sent ${filename}`);
          await fs.unlink(filepath);
        } else {
          console.error(`[RETRY] Failed to send ${filename}:`, result);
          // Update retry count
          booking.retryCount = (booking.retryCount || 0) + 1;
          booking.lastRetryAt = new Date().toISOString();
          await fs.writeFile(filepath, JSON.stringify(booking, null, 2));
        }
      } catch (error) {
        console.error(`[RETRY] Error processing ${filename}:`, error.message);
      }
    }
  } catch (error) {
    console.error('[RETRY] Error reading failed bookings directory:', error.message);
  }
}

// Run immediately
retryFailedBookings().then(() => {
  console.log('[RETRY] Retry job completed');
  process.exit(0);
}).catch(error => {
  console.error('[RETRY] Fatal error:', error);
  process.exit(1);
});
