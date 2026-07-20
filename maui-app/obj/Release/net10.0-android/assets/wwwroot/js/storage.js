/**
 * ============================================
 * Storage Helper Module
 * Manages local persistence for offline queuing
 * ============================================
 */

const STORAGE_KEY = 'location_tracking_queue';
const LAST_SYNC_KEY = 'location_last_sync_time';

const StorageService = {
    /**
     * Save a location locally with status 'Pending'
     * @param {Object} locationData - Location coordinates and metrics
     */
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

    /**
     * Get the full queue of locations stored locally
     * @returns {Array} List of location records
     */
    getQueue: function () {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('[Storage] Error reading queue:', e);
            return [];
        }
    },

    /**
     * Save the location queue back to local storage
     * @param {Array} queue - Location queue array
     */
    setQueue: function (queue) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        } catch (e) {
            console.error('[Storage] Error writing queue:', e);
        }
    },

    /**
     * Get all pending locations from local storage
     * @returns {Array} List of pending location records
     */
    getPendingLocations: function () {
        return this.getQueue().filter(item => item.status === 'Pending');
    },

    /**
     * Get count of pending locations
     * @returns {number} Pending locations count
     */
    getPendingCount: function () {
        return this.getPendingLocations().length;
    },

    /**
     * Mark a set of locations as Synced based on their timestamps
     * @param {Array<string>} timestamps - Array of ISO timestamps
     */
    markAsSynced: function (timestamps) {
        try {
            const queue = this.getQueue();
            const timestampSet = new Set(timestamps);

            queue.forEach(item => {
                if (timestampSet.has(item.timestamp)) {
                    item.status = 'Synced';
                }
            });

            // Keep all pending records, but only the last 100 synced records to save storage
            const pendingItems = queue.filter(item => item.status === 'Pending');
            const syncedItems = queue.filter(item => item.status === 'Synced');
            const truncatedSynced = syncedItems.slice(-100);

            const newQueue = [...pendingItems, ...truncatedSynced];
            this.setQueue(newQueue);

            // Update last sync time to the most recent location timestamp
            const lastTimestamp = timestamps[timestamps.length - 1];
            this.setLastSyncTime(lastTimestamp || new Date().toISOString());
            console.log(`[Storage] Marked ${timestamps.length} records as synced.`);
        } catch (e) {
            console.error('[Storage] Error marking locations as synced:', e);
        }
    },

    /**
     * Get the timestamp of the last successful sync
     * @returns {string} Timestamp string or 'Never'
     */
    getLastSyncTime: function () {
        return localStorage.getItem(LAST_SYNC_KEY) || 'Never';
    },

    /**
     * Set the last successful sync timestamp
     * @param {string} timeStr - ISO timestamp string
     */
    setLastSyncTime: function (timeStr) {
        localStorage.setItem(LAST_SYNC_KEY, timeStr);
    },

    /**
     * Clear all stored location tracking queue data
     */
    clearAll: function () {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LAST_SYNC_KEY);
    }
};
