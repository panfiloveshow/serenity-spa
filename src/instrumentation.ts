export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startPrivateRelayUpdater } = await import('./lib/private-relay');
    const { startBotScheduler } = await import('./lib/bot/scheduler');
    await startPrivateRelayUpdater();
    startBotScheduler();
  }
}
