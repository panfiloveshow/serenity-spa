/**
 * PM2 ecosystem configuration for Serenity Spa production deployment.
 *
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 reload ecosystem.config.js --update-env     # zero-downtime reload
 *   pm2 logs serenity-spa
 *   pm2 monit
 */
module.exports = {
  apps: [
    {
      name: 'serenity-spa',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      cwd: '/var/www/serenity-spa',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '30s',
      restart_delay: 2000,
      kill_timeout: 5000,
      listen_timeout: 10000,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/home/samsa/.pm2/logs/serenity-spa-err.log',
      out_file: '/home/samsa/.pm2/logs/serenity-spa-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
