module.exports = {
  apps: [
    {
      script: './index.js',
      name: 'az-social-be',
      log_date_format: 'HH:mm:ss MMDDYY',
      exec_mode: 'cluster',
      instances: 'max',
      autorestart: true,
    },
    {
      name: 'az-social-update-token',
      script: 'cross-env NODE_ENV=production nodemon src/updateToken.job.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    }
  ],
};
