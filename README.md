# NextGen Telecom Service Qualification Marketplace

A comprehensive telecommunications service qualification platform that allows businesses to discover available telecom services from multiple providers and request quotes.

## Features

- **Service Qualification**: Enter an address to find available internet, voice, NBN, and ethernet services
- **Multi-Provider Results**: Compare offerings from NBN Co, Telstra, Optus Business, and TPG Telecom
- **Quote Requests**: Select providers and request formal quotations
- **Real-time Processing**: Instant qualification results with provider availability status
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Storage**: In-memory storage (easily replaceable with PostgreSQL)

## PM2 Production Setup

### Prerequisites
- Node.js 18+ installed
- PM2 installed globally: `npm install -g pm2`

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Build the application:**
```bash
npm run build
```

3. **Start with PM2:**
```bash
# Production mode
pm2 start ecosystem.config.js --env production

# Development mode
pm2 start ecosystem.config.js
```

### PM2 Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs nextgen-telecom

# Restart application
pm2 restart nextgen-telecom

# Stop application
pm2 stop nextgen-telecom

# Delete from PM2
pm2 delete nextgen-telecom

# Enable auto-restart on server reboot
pm2 startup
pm2 save
```

### Configuration

The application uses the `ecosystem.config.js` file for PM2 configuration:

- **Port**: 5000 (configurable via PORT environment variable)
- **Instances**: 1 (can be scaled up)
- **Memory limit**: 1GB
- **Logs**: Stored in `./logs/` directory

### Environment Variables

- `NODE_ENV`: Set to 'production' for production deployment
- `PORT`: Server port (default: 5000)

## Development

```bash
# Start development server
npm run dev

# Run on different port
PORT=3000 npm run dev
```

## Production Deployment

### Option 1: With Build Step
```bash
npm run build
npm start
```

### Option 2: Direct TypeScript Execution
```bash
NODE_ENV=production tsx server/index.ts
```

### Option 3: PM2 (Recommended)
```bash
pm2 start ecosystem.config.js --env production
```

## Nginx Configuration (Optional)

For production deployment behind a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## API Endpoints

- `GET /api/providers` - List all telecom providers
- `POST /api/qualifications` - Create service qualification
- `GET /api/qualifications/:id` - Get qualification results
- `POST /api/quote-requests` - Submit quote request
- `POST /api/validate-address` - Validate address format

## Future Enhancements

- Real address validation with Google Places API
- Integration with actual telecom provider APIs
- PostgreSQL database for persistent storage
- User authentication and account management
- Email notifications for quote requests
- Multi-site bulk qualification

## License

MIT License