

const DsrDb = {
    db: null,
    useFallback: false,

    init: function(callback) {
        const self = this;
        if (self.db || self.useFallback) {
            if (callback) callback();
            return;
        }

        try {
            if (window.sqlitePlugin) {
                self.db = window.sqlitePlugin.openDatabase({
                    name: 'dsrs.db',
                    location: 'default'
                });
                console.log('[DsrDb] Database opened via cordova-sqlite-storage');
            } else if (window.openDatabase) {
                self.db = window.openDatabase('dsrs_db', '1.0', 'Dsr Database', 5 * 1024 * 1024);
                console.log('[DsrDb] Database opened via WebSQL');
            }
        } catch (e) {
            console.error('[DsrDb] Database open exception:', e);
        }

        if (self.db) {
            self.db.transaction(tx => {
                tx.executeSql(`
                    CREATE TABLE IF NOT EXISTS dsrs (
                        id TEXT PRIMARY KEY,
                        client_id TEXT,
                        client_name TEXT,
                        customer_name TEXT,
                        office_address TEXT,
                        site_name TEXT,
                        contact_person TEXT,
                        contact_no TEXT,
                        last_remark TEXT,
                        visited_for TEXT,
                        followup TEXT,
                        latitude REAL,
                        longitude REAL,
                        sync_status TEXT DEFAULT 'Pending',
                        created_timestamp TEXT
                    )
                `, [], () => {
                    console.log('[DsrDb] DSRs table verified successfully.');
                    if (callback) callback();
                }, (tx, err) => {
                    console.error('[DsrDb] Failed to verify dsrs table:', err);
                    self.useFallback = true;
                    if (callback) callback();
                });
            });
        } else {
            console.warn('[DsrDb] SQLite/WebSQL unavailable. Falling back to localStorage.');
            self.useFallback = true;
            if (callback) callback();
        }
    },

    saveDsr: function(dsr, callback) {
        const self = this;
        const record = {
            id: dsr.id || 'DSR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            client_id: dsr.client_id || '',
            client_name: dsr.client_name || '',
            customer_name: dsr.customer_name || '',
            office_address: dsr.office_address || '',
            site_name: dsr.site_name || '',
            contact_person: dsr.contact_person || '',
            contact_no: dsr.contact_no || '',
            last_remark: dsr.last_remark || '',
            visited_for: dsr.visited_for || 'Others',
            followup: dsr.followup || '',
            latitude: parseFloat(dsr.latitude) || 0.0,
            longitude: parseFloat(dsr.longitude) || 0.0,
            sync_status: dsr.sync_status || 'Pending',
            created_timestamp: dsr.created_timestamp || new Date().toISOString()
        };

        if (self.useFallback) {
            const list = self._getLocalStorageList();
            const index = list.findIndex(r => r.id === record.id);
            if (index >= 0) {
                list[index] = record;
            } else {
                list.push(record);
            }
            self._saveLocalStorageList(list);
            if (callback) callback(record);
            return;
        }

        self.db.transaction(tx => {
            tx.executeSql(`
                INSERT INTO dsrs 
                    (id, client_id, client_name, customer_name, office_address, site_name, contact_person, contact_no, last_remark, visited_for, followup, latitude, longitude, sync_status, created_timestamp)
                VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    client_name = excluded.client_name,
                    customer_name = excluded.customer_name,
                    office_address = excluded.office_address,
                    site_name = excluded.site_name,
                    contact_person = excluded.contact_person,
                    contact_no = excluded.contact_no,
                    last_remark = excluded.last_remark,
                    visited_for = excluded.visited_for,
                    followup = excluded.followup,
                    latitude = excluded.latitude,
                    longitude = excluded.longitude,
                    sync_status = excluded.sync_status
            `, [
                record.id, record.client_id, record.client_name, record.customer_name,
                record.office_address, record.site_name, record.contact_person, record.contact_no,
                record.last_remark, record.visited_for, record.followup, record.latitude, record.longitude,
                record.sync_status, record.created_timestamp
            ], () => {
                if (callback) callback(record);
            }, (tx, err) => {
                tx.executeSql(`DELETE FROM dsrs WHERE id = ?`, [record.id], () => {
                    tx.executeSql(`
                        INSERT INTO dsrs 
                            (id, client_id, client_name, customer_name, office_address, site_name, contact_person, contact_no, last_remark, visited_for, followup, latitude, longitude, sync_status, created_timestamp)
                        VALUES 
                            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        record.id, record.client_id, record.client_name, record.customer_name,
                        record.office_address, record.site_name, record.contact_person, record.contact_no,
                        record.last_remark, record.visited_for, record.followup, record.latitude, record.longitude,
                        record.sync_status, record.created_timestamp
                    ], () => {
                        if (callback) callback(record);
                    });
                });
            });
        });
    },

    getDsrs: function(callback) {
        const self = this;
        if (self.useFallback) {
            const list = self._getLocalStorageList();
            if (callback) callback(list);
            return;
        }

        self.db.transaction(tx => {
            tx.executeSql(`SELECT * FROM dsrs ORDER BY created_timestamp DESC`, [], (tx, results) => {
                const list = [];
                for (let i = 0; i < results.rows.length; i++) {
                    list.push(results.rows.item(i));
                }
                if (callback) callback(list);
            }, (tx, err) => {
                console.error('[DsrDb] getDsrs failed:', err);
                if (callback) callback([]);
            });
        });
    },

    getPendingSync: function(callback) {
        const self = this;
        if (self.useFallback) {
            const list = self._getLocalStorageList().filter(r => r.sync_status === 'Pending');
            if (callback) callback(list);
            return;
        }

        if (!self.db) {
            console.warn('[DsrDb] Database not initialized yet.');
            if (callback) callback([]);
            return;
        }

        self.db.transaction(tx => {
            tx.executeSql(`SELECT * FROM dsrs WHERE sync_status = 'Pending'`, [], (tx, results) => {
                const list = [];
                for (let i = 0; i < results.rows.length; i++) {
                    list.push(results.rows.item(i));
                }
                if (callback) callback(list);
            }, (tx, err) => {
                if (callback) callback([]);
            });
        });
    },

    markAsSynced: function(ids, callback) {
        const self = this;
        if (ids.length === 0) {
            if (callback) callback();
            return;
        }

        if (self.useFallback) {
            const list = self._getLocalStorageList();
            list.forEach(r => {
                if (ids.includes(r.id)) {
                    r.sync_status = 'Synced';
                }
            });
            self._saveLocalStorageList(list);
            if (callback) callback();
            return;
        }

        self.db.transaction(tx => {
            const placeholders = ids.map(() => '?').join(',');
            tx.executeSql(`UPDATE dsrs SET sync_status = 'Synced' WHERE id IN (${placeholders})`, ids, () => {
                if (callback) callback();
            }, (tx, err) => {
                console.error('[DsrDb] markAsSynced failed:', err);
                if (callback) callback();
            });
        });
    },

    _getLocalStorageList: function() {
        try {
            const data = localStorage.getItem('local_dsrs_store');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    _saveLocalStorageList: function(list) {
        try {
            localStorage.setItem('local_dsrs_store', JSON.stringify(list));
        } catch (e) {}
    }
};
