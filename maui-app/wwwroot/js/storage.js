

const STORAGE_KEY = 'location_tracking_queue';
const LAST_SYNC_KEY = 'location_last_sync_time';

const StorageService = {
    
    saveLocation: function (locationData) {
        try {
            const queue = this.getQueue();
            const record = {
                clientId: locationData.clientId,
                deviceId: locationData.deviceId,
                latitude: parseFloat(locationData.latitude),
                longitude: parseFloat(locationData.longitude),
                accuracy: locationData.accuracy ? parseFloat(locationData.accuracy) : null,
                speed: locationData.speed ? parseFloat(locationData.speed) : null,
                bearing: locationData.bearing ? parseFloat(locationData.bearing) : null,
                batteryLevel: locationData.batteryLevel ? parseFloat(locationData.batteryLevel) : null,
                timestamp: locationData.timestamp || new Date().toISOString(),
                status: 'Pending'
            };
            queue.push(record);
            this.setQueue(queue);
            console.log('[Storage] Saved location locally:', record.timestamp);
            return record;
        } catch (e) {
            console.error('[Storage] Error saving location offline:', e);
            return null;
        }
    },

    getQueue: function () {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('[Storage] Error reading queue:', e);
            return [];
        }
    },

    setQueue: function (queue) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        } catch (e) {
            console.error('[Storage] Error writing queue:', e);
        }
    },

    getPendingLocations: function () {
        return this.getQueue().filter(item => item.status === 'Pending');
    },

    getPendingCount: function () {
        return this.getPendingLocations().length;
    },

    markAsSynced: function (timestamps) {
        try {
            const queue = this.getQueue();
            const timestampSet = new Set(timestamps);

            queue.forEach(item => {
                if (timestampSet.has(item.timestamp)) {
                    item.status = 'Synced';
                }
            });

            const pendingItems = queue.filter(item => item.status === 'Pending');
            const syncedItems = queue.filter(item => item.status === 'Synced');
            const truncatedSynced = syncedItems.slice(-100);

            const newQueue = [...pendingItems, ...truncatedSynced];
            this.setQueue(newQueue);

            this.setLastSyncTime(new Date().toISOString());
            console.log(`[Storage] Marked ${timestamps.length} records as synced.`);
        } catch (e) {
            console.error('[Storage] Error marking locations as synced:', e);
        }
    },

    getLastSyncTime: function () {
        return localStorage.getItem(LAST_SYNC_KEY) || 'Never';
    },

    setLastSyncTime: function (timeStr) {
        localStorage.setItem(LAST_SYNC_KEY, timeStr);
    },

    clearAll: function () {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LAST_SYNC_KEY);
    }
};
