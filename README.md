#  Location Tracker — Complete Build Guide

A full-stack mobile application using **Apache Cordova** + **Node.js** + **MySQL** for real-time GPS location tracking with client/admin roles.

---

##  Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Cordova App Setup](#cordova-app-setup)
4. [Plugin Installation](#plugin-installation)
5. [Configuration](#configuration)
6. [Running the App](#running-the-app)
7. [Android APK Generation](#android-apk-generation)
8. [Default Credentials](#default-credentials)
9. [API Reference](#api-reference)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure these are installed on your system:

| Tool | Version | Check Command |
|------|---------|---------------|
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **MySQL** | 8.0+ | `mysql --version` |
| **Cordova CLI** | 12+ | `cordova -v` |
| **Android SDK** | API 34 | `sdkmanager --list` |
| **Java JDK** | 17+ | `java -version` |
| **Gradle** | 8+ | `gradle -v` |

### Install Cordova CLI (if not installed)
```bash
npm install -g cordova
```

---

## Backend Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Create MySQL Database
```bash
mysql -u root -p
```

Then run:
```sql
SOURCE models/schema.sql;
```

Or manually:
```sql
CREATE DATABASE IF NOT EXISTS location_tracker;
```
Then import the schema:
```bash
mysql -u root -p location_tracker < models/schema.sql
```

### Step 3: Configure Environment
Edit `backend/.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=location_tracker
JWT_SECRET=your-secret-key-change-this
PORT=3000
```

### Step 4: Seed Default Admin
```bash
npm run seed
```

This creates:
- **Admin**: ID=`admin`, Password=`admin123`
- **Test Client**: ID=`CLT-TEST01`, Device=`test-device-001`

### Step 5: Start the Server
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════╗
║        Location Tracker API Server          ║
╠════════════════════════════════════════════════╣
║  Running on:  http://0.0.0.0:3000            ║
╚════════════════════════════════════════════════╝
```

### Step 6: Verify Health Check
```bash
curl http://localhost:3000/api/health
```

---

## Cordova App Setup

### Step 1: Navigate to Cordova Project
```bash
cd cordova-app
```

### Step 2: Add Android Platform
```bash
cordova platform add android
```

### Step 3: Install All Plugins
```bash
# Device info (UUID, platform, model)
cordova plugin add cordova-plugin-device

# GPS location (foreground)
cordova plugin add cordova-plugin-geolocation --variable GPS_REQUIRED="true"

# Background mode (keeps app alive)
cordova plugin add cordova-plugin-background-mode

# Native dialogs
cordova plugin add cordova-plugin-dialogs

# ⭐ PRODUCTION Background Geolocation (RECOMMENDED)
cordova plugin add @transistorsoft/cordova-background-geolocation
```

> ️ **Note**: `@transistorsoft/cordova-background-geolocation` is free for development/testing. Production use requires a license ($299 one-time). If you want a completely free alternative:
> ```bash
> cordova plugin add cordova-plugin-mauron85-background-geolocation
> ```

---

## Configuration

### Set Backend API URL

Edit `cordova-app/www/js/api.js` and change the `API_BASE_URL`:

```javascript
// Find your computer's LAN IP:
// Windows: ipconfig → IPv4 Address
// Mac/Linux: ifconfig → en0/wlan0

const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000';
```

**Example**: If your PC IP is `192.168.1.50`:
```javascript
const API_BASE_URL = 'http://192.168.1.50:3000';
```

> ️ Do NOT use `localhost` — the phone can't reach `localhost` on your PC. Use the LAN IP.

---

## Running the App

### On Connected Android Device
```bash
cd cordova-app
cordova run android --device
```

### On Android Emulator
```bash
cordova run android --emulator
```

### Browser Testing (Limited — no background tracking)
```bash
cordova run browser
```

---

## Android APK Generation

### Debug APK
```bash
cd cordova-app
cordova build android
```

APK location:
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (Signed)
```bash
# Generate a keystore (one-time)
keytool -genkey -v -keystore location-tracker.keystore \
    -alias locationtracker -keyalg RSA -keysize 2048 -validity 10000

# Build release
cordova build android --release -- \
    --keystore=location-tracker.keystore \
    --storePassword=YOUR_STORE_PASSWORD \
    --alias=locationtracker \
    --password=YOUR_KEY_PASSWORD
```

Release APK:
```
platforms/android/app/build/outputs/apk/release/app-release.apk
```

### AAB (for Play Store)
```bash
cordova build android --release --packageType=bundle
```

---

## Default Credentials

| Role | ID | Password |
|------|-----|----------|
| **Admin** | `admin` | `admin123` |
| **Test Client** | `CLT-TEST01` | Device: `test-device-001` |

---

## API Reference

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/client/register` | `{ deviceId, name? }` | Register new client |
| POST | `/api/client/login` | `{ clientId, deviceId }` | Client login |
| POST | `/api/client/logout` | `{ clientId }` | Client logout |
| POST | `/api/admin/login` | `{ adminId, password }` | Admin login |

### Location

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/location/update` | `{ clientId, deviceId, latitude, longitude, timestamp }` | Send location |
| POST | `/api/location/batch` | `{ locations: [...] }` | Batch send locations |

### Admin (Protected — requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/clients` | Get all clients with latest location |
| GET | `/api/admin/client/:id` | Get client details + location history |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

---

## Troubleshooting

### Background Location Not Working

**Android 10+**: The user MUST grant "Allow all the time" location permission.
1. Go to **Settings → Apps → Location Tracker → Permissions → Location**
2. Select **"Allow all the time"**

**Android 12+**: Also disable battery optimization:
1. **Settings → Apps → Location Tracker → Battery**
2. Select **"Unrestricted"**

**Android 13+**: Also grant notification permission:
1. The app will ask on first launch
2. Or: **Settings → Apps → Location Tracker → Notifications → Enable**

### Cannot Connect to Server
- Ensure backend is running (`npm start` in backend folder)
- Ensure phone and PC are on the **same WiFi network**
- Use your PC's **LAN IP** (not `localhost`)
- Check Windows Firewall isn't blocking port 3000

### MySQL Connection Failed
- Ensure MySQL service is running
- Check credentials in `.env`
- Ensure `location_tracker` database exists
- Run `models/schema.sql` to create tables

### Cordova Build Fails
```bash
# Check environment
cordova requirements android

# Clean and rebuild
cordova clean
cordova platform remove android
cordova platform add android
cordova build android
```

---

## Architecture

```
┌─────────────────────────────────┐
│       Cordova Mobile App        │
│  ┌───────────────────────────┐  │
│  │    Login (Client/Admin)   │  │
│  ├───────────────────────────┤  │
│  │   Client Dashboard        │  │
│  │   • GPS tracking (1min)   │  │
│  │   • Background service    │  │
│  ├───────────────────────────┤  │
│  │   Admin Dashboard         │  │
│  │   • Client list           │  │
│  │   • Auto-refresh (60s)    │  │
│  │   • Location history      │  │
│  └───────────┬───────────────┘  │
└──────────────┼──────────────────┘
               │ REST API (JWT)
┌──────────────┼──────────────────┐
│  Node.js + Express Backend      │
│  ┌───────────┴───────────────┐  │
│  │   /api/client/*           │  │
│  │   /api/admin/*            │  │
│  │   /api/location/*         │  │
│  └───────────┬───────────────┘  │
└──────────────┼──────────────────┘
               │ MySQL2
┌──────────────┼──────────────────┐
│       MySQL Database            │
│  • admins                       │
│  • clients                      │
│  • locations (GPS history)      │
└─────────────────────────────────┘
```

---

## License

MIT
