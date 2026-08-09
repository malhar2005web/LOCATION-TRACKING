# LOCATION-TRACKING Project Boilerplate & Architectural Blueprint

This document serves as the master architectural reference, backend API specification, frontend design system, and .NET MAUI hybrid configuration blueprint for the **LOCATION-TRACKING** application.

---

## 🏗️ 1. ARCHITECTURE OVERVIEW

The application is structured as a **Hybrid Mobile App**:
- **Native Platform Core**: .NET 10.0 MAUI (`net10.0-android`).
- **UI & Presentation**: Blazor WebView hosting responsive HTML5, Vanilla JavaScript (`client.js`), and Liquid-Glass Vanilla CSS (`dsr-premium.css`, `style.css`).
- **Native Android Services**: 
  - `AndroidBackgroundService.cs`: Continuous foreground service for 24/7 background GPS tracking.
  - `GpsService.cs`: High-accuracy location capture using Google Play Services Fused Location.
  - `NotificationService.cs`: Android local notifications (`Plugin.LocalNotification`).
- **Local Storage Engine**: SQLite DB (`SqliteStorageService.cs`) for offline sync queuing.

---

## 🌐 2. BACKEND API SPECIFICATIONS

- **Base URL**: `https://fleettrackon.co.in/pcsdia`
- **Default Headers**:
  - `Content-Type: application/json`
  - `Bypass-Tunnel-Reminder: true`
  - `Authorization: Bearer <auth_token>`

### Core Endpoints

#### A. Daily Attendance Activity (`/iamatevent`)
- **Method**: `POST`
- **Purpose**: Sent when a user clicks **START DAY** or **END DAY**.
- **Request Payload**:
  ```json
  {
    "gotiamatdate": "2026-08-04 10:30:00",
    "gotempname": "demo admin2",
    "gotempid": "11",
    "gotinoutstatus": "START DAY",
    "gotiamatclient": "",
    "gotiamatlat": 17.7012001,
    "gotiamatlong": 73.9826115,
    "gimeinumber": "a057d027fed7bace"
  }
  ```

#### B. Activity Submissions (`/updateleaddeatils_sky`)
- **Method**: `POST`
- **Purpose**: Submits DSR updates, New Client registration, and Others field activity.

#### C. Client List (`/getclientlist`)
- **Method**: `GET`
- **Purpose**: Fetches the list of assigned clients for location tracking and DSR updating.

#### D. Leave Submissions (`/submit_leave`) & Status (`/get_leave_status`)
- **Method**: `POST` / `GET`
- **Purpose**: Manages leave applications (CL, SL, PL, LWP), duration calculation, and status tracking.

---

## 🎨 3. FRONTEND DESIGN SYSTEM (LIQUID-GLASS)

### Design Tokens
```css
:root {
  /* Brand Orange Accent Palette */
  --orange: #FF7A1A;
  --orange-deep: #F0630A;
  --orange-light: #FF9142;
  --orange-glow: rgba(255,122,26,0.45);

  /* Typography & Neutral Ink */
  --ink: #1E2430;
  --sub: #6A7180;
  --page-bg: #FDF8F0;

  /* Glass Surface Tokens */
  --glass-bg: rgba(255,255,255,0.16);
  --glass-bg-strong: rgba(255,255,255,0.30);
  --glass-border: rgba(255,255,255,0.55);
}
```

### Mandatory View Components Layout Pattern

```html
<div id="[view-name]-view" class="view dsr-premium-space-view">
    <!-- SVG Refraction Filter & Ambient Blobs -->
    <div class="bg-blob blob1"></div>
    <div class="bg-blob blob2"></div>
    <div class="bg-blob blob3"></div>

    <div class="page-container dsr-page-container glass-shell">
        <!-- 1. Permanent Inline Back Header (No "Welcome" text, title is leftmost) -->
        <div class="inline-back-row">
            <button type="button" class="inline-back-btn" onclick="showView('parent-view')" title="Back">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h2 class="inline-page-title">Page Title</h2>
        </div>

        <div class="page-content">
            <!-- 2. Section Label with Orange Icon Chip & Divider -->
            <div class="section-label">
                <div class="section-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M6 21V8l6-4 6 4v13"/></svg>
                </div>
                <span>Section Name</span>
            </div>

            <!-- 3. Floating Glass Group Card -->
            <div class="list-group glass floaty">
                <div class="field">
                    <div class="field-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div class="field-text">
                        <label>Field Name</label>
                        <input type="text" id="field-id" class="value-input" placeholder="Enter details...">
                    </div>
                </div>
            </div>

            <!-- 4. Form Action Buttons -->
            <div class="actions" style="margin-top: 20px; display: flex; gap: 12px;">
                <button type="button" class="btn primary glass-orange" onclick="submitForm()" style="flex: 1;">SUBMIT</button>
                <button type="button" class="btn secondary glass" onclick="showView('parent-view')" style="flex: 1;">CANCEL</button>
            </div>
        </div>
    </div>
</div>
```

---

## 📱 4. .NET MAUI HYBRID & BUILD BOILERPLATE

### Project Dependencies (`LOCATION-TRACKING.csproj`)
- `Microsoft.Maui.Controls` (net10.0-android)
- `Microsoft.AspNetCore.Components.WebView.Maui`
- `Plugin.LocalNotification`
- `SQLitePCLRaw.bundle_green` & `sqlite-net-pcl`

### Production Build & APK Generation Command
```powershell
dotnet publish -f net10.0-android -c Release
```
Output signed APK: `bin\Release\net10.0-android\publish\com.locationtracker.app-Signed.apk`
Deployment destination: `d:\Desktop\New folder (100)\com.locationtracker.app-Signed.apk`
