module.exports = {
  apps: [{
    script: 'npm start',
    watch: '.'
  }],

  deploy: {
    production: {
      key: 'opendesign2023.pem',
      user: 'ubuntu',
      host: '54.180.128.72',
      ref: 'origin/edit-mode',
      repo: 'git@github.com:joonwkim/openplace.git',
      path: 'home/ubuntu/projects',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh && npm install && prisma db push && prisma generate && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
