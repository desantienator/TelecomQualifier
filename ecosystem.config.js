module.exports = {
  apps: [{
    name: "nextgen-telecom",
    script: "server/index.ts",
    interpreter: "node",
    interpreter_args: "--loader tsx",
    instances: 1,
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development",
      PORT: 5000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 5000
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