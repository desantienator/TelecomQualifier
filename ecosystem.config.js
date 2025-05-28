export default {
  apps: [{
    name: "nextgen-telecom",
    script: "dist/index.js",
    interpreter: "node",
    instances: 1,
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000
    },
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    time: true,
    restart_delay: 1000,
    max_restarts: 5,
    min_uptime: "10s"
  }]
};