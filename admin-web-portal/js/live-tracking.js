/**
 * Live Tracking Interactive Map Logic
 * Leaflet.js map with Live User Pegman Markers & Floating Tool Popovers
 */

let map = null;
let streetLayer = null;
let satLayer = null;
let markersGroup = null;
let activeGeofenceCircles = []; // Stores active Leaflet geofence circles

// User Pegman Locations (Matching original screenshots)
const LIVE_USERS = [
    {
        id: '1',
        name: 'demo group',
        lat: 18.4748056,
        lng: 73.8119057,
        location: '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051',
        speed: '0 km/h',
        gpsDateTime: '2026/08/08 12:49',
        status: 'Active (GPS Fix)'
    },
    {
        id: '2',
        name: 'Paresh',
        lat: 19.1663,
        lng: 73.2368,
        location: '0.41 Km from : Mankivali, Badlapur-E, Mumbai, Maharashtra',
        speed: '0 km/h',
        gpsDateTime: '2026/07/31 13:44',
        status: 'Active (GPS Fix)'
    }
];

function createYellowPegmanIcon(userName) {
    return L.divIcon({
        className: 'pegman-marker-wrapper',
        html: `
            <div class="pegman-pin-card">
                <div class="pegman-figure-box">
                    <svg class="pegman-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="5" r="3.5" fill="#EAB308" stroke="#1E293B" stroke-width="1.5"/>
                        <path d="M8.5 10C8.5 8.89543 9.39543 8 10.5 8H13.5C14.6046 8 15.5 8.89543 15.5 10V15H14V22H10V15H8.5V10Z" fill="#F59E0B" stroke="#1E293B" stroke-width="1.5"/>
                    </svg>
                    <span class="pegman-badge-dot"></span>
                </div>
                <div class="pegman-label">${userName}</div>
            </div>
        `,
        iconSize: [44, 48],
        iconAnchor: [22, 48],
        popupAnchor: [0, -48]
    });
}

function initLiveTrackingMap() {
    const container = document.getElementById('live-map');
    if (!container) return;

    map = L.map('live-map', {
        center: [18.82, 73.52],
        zoom: 9,
        zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri'
    });

    markersGroup = L.featureGroup().addTo(map);

    LIVE_USERS.forEach(user => {
        const marker = L.marker([user.lat, user.lng], {
            icon: createYellowPegmanIcon(user.name)
        });

        const popupContent = `
            <div class="map-popup-card">
                <div class="popup-title-row">
                    <span class="popup-user-name">${user.name}</span>
                    <span class="popup-status-badge">${user.status}</span>
                </div>
                <div class="popup-meta">
                    <p><strong>GPS Time:</strong> ${user.gpsDateTime}</p>
                    <p><strong>Speed:</strong> ${user.speed}</p>
                    <p class="popup-address"><strong>Location:</strong> ${user.location}</p>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent, { className: 'custom-leaflet-popup' });
        markersGroup.addLayer(marker);
    });

    map.fitBounds(markersGroup.getBounds().pad(0.2));
}

/* ── Floating Popover Controls ── */
function togglePopover(name) {
    const targetId = `popover-${name}`;
    const btnId = `tb-${name}`;

    const targetPop = document.getElementById(targetId);
    if (!targetPop) {
        console.error('Popover element not found:', targetId);
        return;
    }

    const isCurrentlyVisible = (targetPop.style.display === 'block');

    // Close all popovers and deactivate toolbar buttons
    document.querySelectorAll('.map-popover-card').forEach(pop => {
        pop.style.display = 'none';
        pop.classList.remove('open');
    });
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));

    if (!isCurrentlyVisible) {
        targetPop.style.display = 'block';
        targetPop.classList.add('open');
        const activeBtn = document.getElementById(btnId);
        if (activeBtn) activeBtn.classList.add('active');

        // Auto-fill latitude/longitude if opening Add Landmark
        if (name === 'add-landmark') {
            const latInput = document.getElementById('add-lm-lat');
            const lngInput = document.getElementById('add-lm-lng');
            if (latInput) latInput.value = '18.4748056';
            if (lngInput) lngInput.value = '73.8119057';
        }
    }
}

function closePopover(name) {
    const pop = document.getElementById(`popover-${name}`);
    if (pop) {
        pop.style.display = 'none';
        pop.classList.remove('open');
    }
    const btn = document.getElementById(`tb-${name}`);
    if (btn) btn.classList.remove('active');
}

/* ── User Geofence Circles (Image 2 Feature) ── */
function displayGeofenceCircle() {
    if (!map) return;

    // Remove existing circles first
    removeGeofenceCircle(false);

    // Create 2 Geofence circles around Pune and Mumbai markers
    LIVE_USERS.forEach(user => {
        const circle = L.circle([user.lat, user.lng], {
            color: '#F28C52',
            fillColor: '#F28C52',
            fillOpacity: 0.22,
            radius: 1800, // 1.8 KM Geofence circle radius
            weight: 2
        }).addTo(map);

        circle.bindTooltip(`Geofence Zone: ${user.name}`, { permanent: false, direction: 'top' });
        activeGeofenceCircles.push(circle);
    });

    // Zoom map to show circles
    const group = L.featureGroup(activeGeofenceCircles);
    map.fitBounds(group.getBounds().pad(0.2));

    showToast('Geofence circles displayed on map!', 'success');
}

function removeGeofenceCircle(showToastMsg = true) {
    if (!map) return;

    activeGeofenceCircles.forEach(circle => {
        map.removeLayer(circle);
    });
    activeGeofenceCircles = [];

    if (showToastMsg) {
        showToast('Geofence circles removed from map', 'info');
    }
}

/* ── Party Name Actions (Image 1) ── */
function handleUpdatePartyName() {
    const party = document.getElementById('pn-party-name').value || 'PIONEER HOUSING';
    showToast(`Updated Party Name: ${party}`, 'success');
    closePopover('party-name');
}

function handleAddPartyName() {
    const party = document.getElementById('pn-party-name').value;
    if (!party) {
        showToast('Please enter a party name', 'error');
        return;
    }
    showToast(`New party "${party}" added successfully!`, 'success');
    closePopover('party-name');
}

/* ── Add Landmark Actions (Image 3) ── */
function handleSubmitAddLandmark() {
    const lat = document.getElementById('add-lm-lat').value;
    const lng = document.getElementById('add-lm-lng').value;
    const addr = document.getElementById('add-lm-address').value;

    if (!addr) {
        showToast('Please enter landmark address', 'error');
        return;
    }

    // Add landmark pin marker on map
    if (map && lat && lng) {
        const lmMarker = L.marker([parseFloat(lat), parseFloat(lng)], {
            icon: L.divIcon({
                className: 'landmark-marker-pin',
                html: `<div class="lm-pin">📍</div>`,
                iconSize: [24, 24]
            })
        }).addTo(map);

        lmMarker.bindPopup(`<b>Landmark:</b> ${addr}`).openPopup();
        map.setView([parseFloat(lat), parseFloat(lng)], 14);
    }

    showToast('New landmark added to map!', 'success');
    closePopover('add-landmark');
}

/* ── Update Landmark Actions (Image 4) ── */
function onSelectLandmarkToUpdate(val) {
    const latInput = document.getElementById('up-lm-lat');
    const lngInput = document.getElementById('up-lm-lng');
    const addrInput = document.getElementById('up-lm-address');

    if (val === 'Pune Sun City Office') {
        if (latInput) latInput.value = '18.4748056';
        if (lngInput) lngInput.value = '73.8119057';
        if (addrInput) addrInput.value = 'Sai Virat Society, Sun City Rd, Pune 411051';
    } else if (val === 'Mumbai Badlapur Plant') {
        if (latInput) latInput.value = '19.1663';
        if (lngInput) lngInput.value = '73.2368';
        if (addrInput) addrInput.value = 'Mankivali, Badlapur-E, Mumbai';
    }
}

function handleSaveUpdateLandmark() {
    const lm = document.getElementById('up-select-lm').value;
    showToast(`Landmark "${lm || 'Selected'}" updated!`, 'success');
    closePopover('update-landmarks');
}

/* ── Map Layer Controls ── */
function switchMapLayer(type) {
    const btnMap = document.getElementById('btn-map-layer');
    const btnSat = document.getElementById('btn-sat-layer');

    if (type === 'satellite') {
        map.removeLayer(streetLayer);
        map.addLayer(satLayer);
        if (btnMap) btnMap.classList.remove('active');
        if (btnSat) btnSat.classList.add('active');
        showToast('Switched to Satellite view', 'info');
    } else {
        map.removeLayer(satLayer);
        map.addLayer(streetLayer);
        if (btnSat) btnSat.classList.remove('active');
        if (btnMap) btnMap.classList.add('active');
        showToast('Switched to Map view', 'info');
    }
}

function fitAllMarkers() {
    if (markersGroup && map) {
        map.fitBounds(markersGroup.getBounds().pad(0.25));
        showToast('Viewing all user locations', 'success');
    }
}

function searchTrackingUser() {
    const query = document.getElementById('search-user-id').value.trim().toLowerCase();
    if (!query) {
        fitAllMarkers();
        return;
    }

    const found = LIVE_USERS.find(u => u.name.toLowerCase().includes(query));
    if (found && map) {
        map.setView([found.lat, found.lng], 14, { animate: true });
        showToast(`Centered on user "${found.name}"`, 'success');
    } else {
        showToast(`No user found matching "${query}"`, 'error');
    }
}

function searchLandmark() {
    const query = document.getElementById('search-landmark').value.trim();
    if (query) {
        showToast(`Searching landmark: "${query}"`, 'info');
    }
}

function clearTrackingSearch() {
    document.getElementById('search-user-id').value = '';
    document.getElementById('search-landmark').value = '';
    removeGeofenceCircle(false);
    fitAllMarkers();
    showToast('Filters and Geofences cleared', 'success');
}

function toggleTrafficLayer() {
    showToast('Traffic overlay updated', 'info');
}

// Init map on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initLiveTrackingMap();

    // Attach explicit click listeners for popover toolbar buttons
    const btnParty = document.getElementById('tb-party-name');
    const btnGeo = document.getElementById('tb-user-geofence');
    const btnAddLm = document.getElementById('tb-add-landmark');
    const btnUpLm = document.getElementById('tb-update-landmarks');

    if (btnParty) btnParty.onclick = (e) => { e.preventDefault(); togglePopover('party-name'); };
    if (btnGeo) btnGeo.onclick = (e) => { e.preventDefault(); togglePopover('user-geofence'); };
    if (btnAddLm) btnAddLm.onclick = (e) => { e.preventDefault(); togglePopover('add-landmark'); };
    if (btnUpLm) btnUpLm.onclick = (e) => { e.preventDefault(); togglePopover('update-landmarks'); };
});
