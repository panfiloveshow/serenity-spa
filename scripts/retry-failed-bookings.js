#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const FAILED_BOOKINGS_DIR = '/var/www/serenity-spa/failed-bookings';
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;
const MAX_RETRIES = 10;

function queueEncryptionKey() {
  const material = process.env.FAILED_BOOKINGS_ENCRYPTION_KEY || TG_BOT_TOKEN;
  if (!material) return null;
  return crypto.createHash('sha256').update(material).digest();
}

function decryptQueueMessage(payload) {
  if (!payload) return null;
  if (typeof payload === 'string') return payload;
  if (payload.alg !== 'aes-256-gcm') {
    throw new Error(`Unsupported queue message encryption: ${payload.alg}`);
  }

  const key = queueEncryptionKey();
  if (!key) {
    throw new Error('Missing FAILED_BOOKINGS_ENCRYPTION_KEY or TG_BOT_TOKEN for queue decryption');
  }

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(payload.iv, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(payload.data, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

async function retryFailedBookings() {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
    console.error('[RETRY] Missing Telegram credentials');
    return;
  }

  try {
    const files = await fs.readdir(FAILED_BOOKINGS_DIR);
    // Exclude *.archived.json — they also end in .json and would otherwise be
    // re-scanned and re-renamed (…archived.archived.json) on every run.
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('.archived'));

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

        const retryMessage = booking.message || decryptQueueMessage(booking.retryMessage);
        if (!retryMessage) {
          throw new Error('Missing retry message');
        }

        // Try to send to Telegram — with a hard timeout so a hung request can't
        // stall the whole cron run (and overlap the next one).
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        let result;
        try {
          const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TG_CHAT_ID,
              text: retryMessage,
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            }),
            signal: controller.signal,
          });
          result = await response.json();
        } finally {
          clearTimeout(timeoutId);
        }

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
