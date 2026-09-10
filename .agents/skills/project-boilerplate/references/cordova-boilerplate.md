# 📲 Apache Cordova Reference Template

This template defines the recommended directory setup, HTML entry point with Content Security Policy (CSP), and JavaScript initialization pattern for Apache Cordova mobile apps.

---

## 📂 1. Recommended Folder Structure

```text
MyApp.Cordova/
├── config.xml                  # Cordova Project Configuration & Plugin Settings
├── package.json                # Project Dependencies & Build Scripts
├── www/                        # Application Source Code
│   ├── index.html              # Main Entry View
│   ├── css/
│   │   ├── index.css           # Global & Component Styles
│   │   └── dsr-premium.css     # Translucent Liquid-Glass Design Tokens
│   ├── js/
│   │   ├── index.js            # App Lifecycle & Cordova Native Initialization
│   │   ├── app.js              # Business Logic & SPA Router
│   │   └── api.js              # REST API Fetch Wrapper
│   ├── img/
│   │   ├── logo.png
│   │   └── icons/
│   └── lib/                    # Third-party Libraries (e.g. SQLite Plugin helpers)
├── plugins/                    # Cordova Installed Native Plugins
│   ├── cordova-plugin-geolocation/
│   ├── cordova-plugin-cordova-sqlite-storage/
│   └── cordova-plugin-network-information/
└── platforms/                  # Native Build Outputs
    ├── android/
    └── ios/
```

---

## 📄 2. Base HTML Entry (`www/index.html`)

Includes Content Security Policy (CSP) meta tag, viewport configuration, style links, and native `cordova.js` script tag:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <!-- Security: Content Security Policy for Native WebViews -->
    <meta http-equiv="Content-Security-Policy" 
          content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-inline' 'unsafe-eval'; 
                   style-src 'self' 'unsafe-inline'; 
                   script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
                   connect-src 'self' https: http: ws: wss:;
                   img-src 'self' data: content: blob:; 
                   font-src 'self' data:;" />
                   
    <meta name="format-detection" content="telephone=no" />
    <meta name="msapplication-tap-highlight" content="no" />
    <meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover" />
    
    <title>MyApp Mobile</title>
    
    <!-- CSS Styles -->
    <link rel="stylesheet" href="css/index.css" />
    <link rel="stylesheet" href="css/dsr-premium.css" />
</head>
<body>
    <div id="app" class="app-container">
        
        <!-- Header -->
        <header class="app-header">
            <div class="inline-back-row">
                <button type="button" class="inline-back-btn" id="btn-back" style="display: none;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <h1 id="page-title" class="inline-page-title">Dashboard</h1>
            </div>
        </header>

        <!-- Main View Content Area -->
        <main id="main-content" class="page-content">
            <div class="status-card glass floaty">
                <h3>Native Initialization</h3>
                <p id="deviceready-status" class="status-text">Initializing Cordova...</p>
            </div>

            <div class="form-group">
                <label for="client-name-input">CLIENT NAME</label>
                <input type="text" id="client-name-input" class="glass-input" placeholder="Enter Client Name" />
            </div>

            <button type="button" id="btn-submit" class="btn primary glass-orange">
                SUBMIT DATA
            </button>
        </main>
    </div>

    <!-- Cordova Native Bridge Script Injection (Generated at Build Time) -->
    <script src="cordova.js"></script>

    <!-- Application Logic Scripts -->
    <script src="js/api.js"></script>
    <script src="js/app.js"></script>
    <script src="js/index.js"></script>
</body>
</html>
```

---

## ⚡ 3. Base Native Controller (`www/js/index.js`)

Listens for `deviceready`, initializes native plugins (GPS, SQLite, Network Status), and manages app lifecycle:

```javascript
/*
 * MyApp Cordova Native Controller & Event Bridge
 */

const app = {
    // Application Entry Initialization
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('pause', this.onPause.bind(this), false);
        document.addEventListener('resume', this.onResume.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        console.log('[Cordova] Device is ready!');
        this.updateStatus('Device Ready & Connected');

        // 1. Initialize SQLite Database
        this.initDatabase();

        // 2. Register Geolocation Listener
        this.initGeolocation();

        // 3. Bind UI Click Listeners
        this.bindEvents();
    },

    // Update Status Display in UI
    updateStatus: function(msg) {
        const el = document.getElementById('deviceready-status');
        if (el) {
            el.innerText = msg;
            el.classList.add('ready');
        }
    },

    // SQLite Local Storage Initialization
    initDatabase: function() {
        if (window.sqlitePlugin) {
            window.db = window.sqlitePlugin.openDatabase({
                name: 'myapp_offline.db',
                location: 'default'
            }, function(db) {
                console.log('[SQLite] Database opened successfully');
                db.transaction(function(tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS sync_queue (id INTEGER PRIMARY KEY AUTOINCREMENT, payload TEXT, created_at TEXT)');
                });
            }, function(err) {
                console.error('[SQLite] Error opening DB:', err);
            });
        } else {
            console.warn('[SQLite] Cordova SQLite Plugin not found. Fallback to LocalStorage.');
        }
    },

    // Native GPS Location Listener
    initGeolocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    console.log('[GPS] Lat:', position.coords.latitude, 'Lng:', position.coords.longitude);
                    window.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                },
                function(error) {
                    console.warn('[GPS] Error getting location:', error.message);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    },

    // UI Action Binding
    bindEvents: function() {
        const btnSubmit = document.getElementById('btn-submit');
        if (btnSubmit) {
            btnSubmit.addEventListener('click', function() {
                const clientName = document.getElementById('client-name-input').value;
                alert('Submitting for client: ' + clientName);
            });
        }
    },

    // Lifecycle Handlers
    onPause: function() {
        console.log('[Lifecycle] App paused (background)');
    },

    onResume: function() {
        console.log('[Lifecycle] App resumed (foreground)');
    }
};

// Start initialization
app.initialize();


```
