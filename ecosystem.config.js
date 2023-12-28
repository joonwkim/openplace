module.exports = {
  apps: [{
    script: 'npm start',
    watch: '.'
  }],

  deploy: {
    production: {
      key: 'key.pem',
      user: 'ubuntu',
      host: '3.36.91.10',
      ref: 'origin/edit-mode',
      repo: 'git@github.com:joonwkim/openplace.git',
      path: 'home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh &&  npm install && prisma db push && prisma generate && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
