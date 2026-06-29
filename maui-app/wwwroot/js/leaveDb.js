

const LeaveDb = {
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
                    name: 'leaves.db',
                    location: 'default'
                });
                console.log('[LeaveDb] Database opened via cordova-sqlite-storage');
            } else if (window.openDatabase) {
                self.db = window.openDatabase('leaves_db', '1.0', 'Leaves Database', 5 * 1024 * 1024);
                console.log('[LeaveDb] Database opened via WebSQL');
            }
        } catch (e) {
            console.error('[LeaveDb] Database open exception:', e);
        }

        if (self.db) {
            self.db.transaction(tx => {
                tx.executeSql(`
                    CREATE TABLE IF NOT EXISTS leaves (
                        id TEXT PRIMARY KEY,
                        client_id TEXT,
                        employee_name TEXT,
                        leave_type TEXT,
                        full_half_day TEXT,
                        start_date TEXT,
                        end_date TEXT,
                        total_days REAL,
                        reason TEXT,
                        in_absence TEXT,
                        status TEXT DEFAULT 'Pending',
                        sync_status TEXT DEFAULT 'Pending',
                        created_timestamp TEXT,
                        updated_timestamp TEXT
                    )
                `, [], () => {
                    console.log('[LeaveDb] Leaves table verified successfully.');
                    if (callback) callback();
                }, (tx, err) => {
                    console.error('[LeaveDb] Failed to verify leaves table:', err);
                    self.useFallback = true;
                    if (callback) callback();
                });
            });
        } else {
            console.warn('[LeaveDb] SQLite/WebSQL unavailable. Falling back to localStorage.');
            self.useFallback = true;
            if (callback) callback();
        }
    },

    saveLeave: function(leave, callback) {
        const self = this;
        const record = {
            id: leave.id,
            client_id: leave.client_id || '',
            employee_name: leave.employee_name || '',
            leave_type: leave.leave_type || '',
            full_half_day: leave.full_half_day || 'Full Day',
            start_date: leave.start_date || '',
            end_date: leave.end_date || '',
            total_days: parseFloat(leave.total_days) || 0.0,
            reason: leave.reason || '',
            in_absence: leave.in_absence || '',
            status: leave.status || 'Pending',
            sync_status: leave.sync_status || 'Pending',
            created_timestamp: leave.created_timestamp || new Date().toISOString(),
            updated_timestamp: leave.updated_timestamp || new Date().toISOString()
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
                INSERT INTO leaves 
                    (id, client_id, employee_name, leave_type, full_half_day, start_date, end_date, total_days, reason, in_absence, status, sync_status, created_timestamp, updated_timestamp)
                VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    employee_name = excluded.employee_name,
                    leave_type = excluded.leave_type,
                    full_half_day = excluded.full_half_day,
                    start_date = excluded.start_date,
                    end_date = excluded.end_date,
                    total_days = excluded.total_days,
                    reason = excluded.reason,
                    in_absence = excluded.in_absence,
                    status = excluded.status,
                    sync_status = excluded.sync_status,
                    updated_timestamp = excluded.updated_timestamp
            `, [
                record.id, record.client_id, record.employee_name, record.leave_type,
                record.full_half_day, record.start_date, record.end_date, record.total_days,
                record.reason, record.in_absence, record.status, record.sync_status,
                record.created_timestamp, record.updated_timestamp
            ], () => {
                if (callback) callback(record);
            }, (tx, err) => {

                tx.executeSql(`DELETE FROM leaves WHERE id = ?`, [record.id], () => {
                    tx.executeSql(`
                        INSERT INTO leaves 
                            (id, client_id, employee_name, leave_type, full_half_day, start_date, end_date, total_days, reason, in_absence, status, sync_status, created_timestamp, updated_timestamp)
                        VALUES 
                            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        record.id, record.client_id, record.employee_name, record.leave_type,
                        record.full_half_day, record.start_date, record.end_date, record.total_days,
                        record.reason, record.in_absence, record.status, record.sync_status,
                        record.created_timestamp, record.updated_timestamp
                    ], () => {
                        if (callback) callback(record);
                    });
                });
            });
        });
    },

    getLeaves: function(callback) {
        const self = this;
        if (self.useFallback) {
            const list = self._getLocalStorageList();
            if (callback) callback(list);
            return;
        }

        self.db.transaction(tx => {
            tx.executeSql(`SELECT * FROM leaves ORDER BY created_timestamp DESC`, [], (tx, results) => {
                const list = [];
                for (let i = 0; i < results.rows.length; i++) {
                    list.push(results.rows.item(i));
                }
                if (callback) callback(list);
            }, (tx, err) => {
                console.error('[LeaveDb] getLeaves failed:', err);
                if (callback) callback([]);
            });
        });
    },

    searchLeaves: function(query, statusFilter, typeFilter, sortBy, callback) {
        const self = this;
        if (self.useFallback) {
            let list = self._getLocalStorageList();
            
            if (query) {
                const q = query.toLowerCase();
                list = list.filter(r => 
                    (r.reason && r.reason.toLowerCase().includes(q)) ||
                    (r.employee_name && r.employee_name.toLowerCase().includes(q)) ||
                    (r.in_absence && r.in_absence.toLowerCase().includes(q))
                );
            }
            if (statusFilter) {
                list = list.filter(r => r.status === statusFilter);
            }
            if (typeFilter) {
                list = list.filter(r => r.leave_type === typeFilter);
            }

            if (sortBy === 'oldest') {
                list.sort((a, b) => new Date(a.created_timestamp) - new Date(b.created_timestamp));
            } else {
                list.sort((a, b) => new Date(b.created_timestamp) - new Date(a.created_timestamp));
            }

            if (callback) callback(list);
            return;
        }

        self.db.transaction(tx => {
            let sql = `SELECT * FROM leaves WHERE 1=1`;
            const params = [];

            if (query) {
                sql += ` AND (reason LIKE ? OR employee_name LIKE ? OR in_absence LIKE ?)`;
                const searchStr = `%${query}%`;
                params.push(searchStr, searchStr, searchStr);
            }
            if (statusFilter) {
                sql += ` AND status = ?`;
                params.push(statusFilter);
            }
            if (typeFilter) {
                sql += ` AND leave_type = ?`;
                params.push(typeFilter);
            }

            if (sortBy === 'oldest') {
                sql += ` ORDER BY created_timestamp ASC`;
            } else {
                sql += ` ORDER BY created_timestamp DESC`;
            }

            tx.executeSql(sql, params, (tx, results) => {
                const list = [];
                for (let i = 0; i < results.rows.length; i++) {
                    list.push(results.rows.item(i));
                }
                if (callback) callback(list);
            }, (tx, err) => {
                console.error('[LeaveDb] searchLeaves failed:', err);
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
            console.warn('[LeaveDb] Database not initialized yet.');
            if (callback) callback([]);
            return;
        }

        self.db.transaction(tx => {
            tx.executeSql(`SELECT * FROM leaves WHERE sync_status = 'Pending'`, [], (tx, results) => {
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
            tx.executeSql(`UPDATE leaves SET sync_status = 'Synced' WHERE id IN (${placeholders})`, ids, () => {
                if (callback) callback();
            }, (tx, err) => {
                console.error('[LeaveDb] markAsSynced failed:', err);
                if (callback) callback();
            });
        });
    },

    cancelLeaveLocal: function(id, callback) {
        const self = this;
        const nowStr = new Date().toISOString();
        if (self.useFallback) {
            const list = self._getLocalStorageList();
            const record = list.find(r => r.id === id);
            if (record) {
                record.status = 'Cancelled';
                record.sync_status = 'Pending';
                record.updated_timestamp = nowStr;
                self._saveLocalStorageList(list);
            }
            if (callback) callback();
            return;
        }

        self.db.transaction(tx => {
            tx.executeSql(
                `UPDATE leaves SET status = 'Cancelled', sync_status = 'Pending', updated_timestamp = ? WHERE id = ?`,
                [nowStr, id],
                () => { if (callback) callback(); },
                (tx, err) => {
                    console.error('[LeaveDb] cancelLeaveLocal failed:', err);
                    if (callback) callback();
                }
            );
        });
    },

    _getLocalStorageList: function() {
        try {
            const data = localStorage.getItem('local_leaves_store');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    _saveLocalStorageList: function(list) {
        try {
            localStorage.setItem('local_leaves_store', JSON.stringify(list));
        } catch (e) {}
    }
};
