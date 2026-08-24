/**
 * ============================================
 * Local Storage SQLite & Sync Manager for Reminders
 * Supports window.sqlitePlugin, WebSQL, and localStorage fallbacks
 * ============================================
 */

const ReminderDb = {
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
                    name: 'reminders.db',
                    location: 'default'
                });
                console.log('[ReminderDb] Database opened via cordova-sqlite-storage');
            } else if (window.openDatabase) {
                self.db = window.openDatabase('reminders_db', '1.0', 'Reminders Database', 5 * 1024 * 1024);
                console.log('[ReminderDb] Database opened via WebSQL');
            }
        } catch (e) {
            console.error('[ReminderDb] Database open exception:', e);
        }

        if (self.db) {
            self.db.transaction(tx => {
                tx.executeSql(`
                    CREATE TABLE IF NOT EXISTS reminders (
                        id TEXT PRIMARY KEY,
                        client_name TEXT,
                        contact_person TEXT,
                        contact_number TEXT,
                        reminder_type TEXT,
                        reminder_date TEXT,
                        reminder_time TEXT,
                        remark TEXT,
                        source_module TEXT,
                        created_timestamp TEXT,
                        updated_timestamp TEXT,
                        status TEXT,
                        sync_status TEXT
                    )
                `, [], () => {
                    console.log('[ReminderDb] Reminders table verified successfully.');
                    tx.executeSql(`
                        CREATE TABLE IF NOT EXISTS cached_clients (
                            leadno TEXT PRIMARY KEY,
                            leadname TEXT,
                            address TEXT,
                            contactperson TEXT,
                            contactno TEXT,
                            leadsitename TEXT,
                            reserved1 TEXT
                        )
                    `, [], () => {
                        console.log('[ReminderDb] Cached clients table verified.');
                        if (callback) callback();
                    }, (tx, err) => {
                        console.error('[ReminderDb] Failed to create cached_clients table:', err);
                        if (callback) callback();
                    });
                }, (tx, err) => {
                    console.error('[ReminderDb] Failed to verify reminders table:', err);
                    self.useFallback = true;
                    if (callback) callback();
                });
            });
        } else {
            console.warn('[ReminderDb] SQLite/WebSQL unavailable. Falling back to localStorage.');
            self.useFallback = true;
            if (callback) callback();
        }
    },

    saveReminder: function(rem, callback) {
        const self = this;
        const record = {
            id: rem.id,
            client_name: rem.client_name,
            contact_person: rem.contact_person || '',
            contact_number: rem.contact_number || '',
            reminder_type: rem.reminder_type,
            reminder_date: rem.reminder_date,
            reminder_time: rem.reminder_time,
            remark: rem.remark || '',
            source_module: rem.source_module,
            created_timestamp: rem.created_timestamp || new Date().toISOString(),
            updated_timestamp: rem.updated_timestamp || new Date().toISOString(),
            status: rem.status || 'Pending',
            sync_status: rem.sync_status || 'Pending'
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
                INSERT INTO reminders 
                    (id, client_name, contact_person, contact_number, reminder_type, reminder_date, reminder_time, remark, source_module, created_timestamp, updated_timestamp, status, sync_status)
                VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    client_name = excluded.client_name,
                    contact_person = excluded.contact_person,
                    contact_number = excluded.contact_number,
                    reminder_type = excluded.reminder_type,
                    reminder_date = excluded.reminder_date,
                    reminder_time = excluded.reminder_time,
                    remark = excluded.remark,
                    source_module = excluded.source_module,
                    updated_timestamp = excluded.updated_timestamp,
                    status = excluded.status,
                    sync_status = excluded.sync_status
            `, [
                record.id, record.client_name, record.contact_person, record.contact_number,
                record.reminder_type, record.reminder_date, record.reminder_time, record.remark,
                record.source_module, record.created_timestamp, record.updated_timestamp, record.status, record.sync_status
            ], () => {
                if (callback) callback(record);
            }, (tx, err) => {
                // If ON CONFLICT is not supported in the WebSQL sqlite version, fallback to DELETE then INSERT
                tx.executeSql(`DELETE FROM reminders WHERE id = ?`, [record.id], () => {
                    tx.executeSql(`
                        INSERT INTO reminders 
                            (id, client_name, contact_person, contact_number, reminder_type, reminder_date, reminder_time, remark, source_module, created_timestamp, updated_timestamp, status, sync_status)
                        VALUES 
                            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        record.id, record.client_name, record.contact_person, record.contact_number,
                        record.reminder_type, record.reminder_date, record.reminder_time, record.remark,
                        record.source_module, record.created_timestamp, record.updated_timestamp, record.status, record.sync_status
                    ], () => {
                        if (callback) callback(record);
                    });
                });
            });
        });
    },

    getPendingSync: function(callback) {
        const self = this;
        if (self.useFallback) {
            const pending = self._getLocalStorageList().filter(r => r.sync_status === 'Pending');
            if (callback) callback(pending);
            return;
        }

        self.db.transaction(tx => {
            tx.executeSql(`SELECT * FROM reminders WHERE sync_status = 'Pending'`, [], (tx, results) => {
                const list = [];
                for (let i = 0; i < results.rows.length; i++) {
                    list.push(results.rows.item(i));
                }
                if (callback) callback(list);
            });
        });
    },

    markAsSynced: function(ids, callback) {
        const self = this;
        if (self.useFallback) {
            const list = self._getLocalStorageList();
            const idSet = new Set(ids);
            list.forEach(r => {
                if (idSet.has(r.id)) r.sync_status = 'Synced';
            });
            self._saveLocalStorageList(list);
            if (callback) callback();
            return;
        }

        if (ids.length === 0) {
            if (callback) callback();
            return;
        }

        self.db.transaction(tx => {
            const placeholders = ids.map(() => '?').join(',');
            tx.executeSql(`UPDATE reminders SET sync_status = 'Synced' WHERE id IN (${placeholders})`, ids, () => {
                if (callback) callback();
            });
        });
    },

    updateStatus: function(id, status, callback) {
        const self = this;
        const now = new Date().toISOString();
        if (self.useFallback) {
            const list = self._getLocalStorageList();
            const r = list.find(x => x.id === id);
            if (r) {
                r.status = status;
                r.sync_status = 'Pending';
                r.updated_timestamp = now;
                self._saveLocalStorageList(list);
            }
            if (callback) callback();
            return;
        }

        self.db.transaction(tx => {
            tx.executeSql(`
                UPDATE reminders 
                SET status = ?, sync_status = 'Pending', updated_timestamp = ? 
                WHERE id = ?
            `, [status, now, id], () => {
                if (callback) callback();
            });
        });
    },

    getReminders: function(callback) {
        const self = this;
        if (self.useFallback) {
            if (callback) callback(self._getLocalStorageList());
            return;
        }

        self.db.transaction(tx => {
            tx.executeSql(`SELECT * FROM reminders ORDER BY reminder_date ASC, reminder_time ASC`, [], (tx, results) => {
                const list = [];
                for (let i = 0; i < results.rows.length; i++) {
                    list.push(results.rows.item(i));
                }
                if (callback) callback(list);
            });
        });
    },

    searchReminders: function(query, typeFilter, statusFilter, sortBy, callback) {
        const self = this;
        if (self.useFallback) {
            let list = self._getLocalStorageList();

            // Filters
            if (query) {
                const q = query.toLowerCase();
                list = list.filter(r => r.client_name.toLowerCase().includes(q));
            }
            if (typeFilter) {
                list = list.filter(r => r.reminder_type === typeFilter);
            }
            if (statusFilter) {
                list = list.filter(r => r.status === statusFilter);
            }

            // Sorting
            list.sort((a, b) => {
                let comp = 0;
                if (sortBy === 'time') {
                    comp = a.reminder_time.localeCompare(b.reminder_time);
                } else {
                    comp = a.reminder_date.localeCompare(b.reminder_date) || a.reminder_time.localeCompare(b.reminder_time);
                }
                return comp;
            });

            if (callback) callback(list);
            return;
        }

        self.db.transaction(tx => {
            let sql = `SELECT * FROM reminders WHERE 1=1`;
            const params = [];

            if (query) {
                sql += ` AND client_name LIKE ?`;
                params.push(`%${query}%`);
            }
            if (typeFilter) {
                sql += ` AND reminder_type = ?`;
                params.push(typeFilter);
            }
            if (statusFilter) {
                sql += ` AND status = ?`;
                params.push(statusFilter);
            }

            if (sortBy === 'time') {
                sql += ` ORDER BY reminder_time ASC`;
            } else {
                sql += ` ORDER BY reminder_date ASC, reminder_time ASC`;
            }

            tx.executeSql(sql, params, (tx, results) => {
                const list = [];
                for (let i = 0; i < results.rows.length; i++) {
                    list.push(results.rows.item(i));
                }
                if (callback) callback(list);
            });
        });
    },

    // ── LocalStorage Helpers ──
    _getLocalStorageList: function() {
        try {
            const data = localStorage.getItem('local_reminders_store');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    _saveLocalStorageList: function(list) {
        try {
            localStorage.setItem('local_reminders_store', JSON.stringify(list));
        } catch (e) {}
    },

    saveCachedClients: function(clients, callback) {
        const self = this;
        if (self.useFallback) {
            try {
                localStorage.setItem('cached_clients_store', JSON.stringify(clients));
            } catch (e) {}
            if (callback) callback();
            return;
        }

        self.db.transaction(tx => {
            tx.executeSql(`DELETE FROM cached_clients`, [], () => {
                if (!clients || clients.length === 0) {
                    if (callback) callback();
                    return;
                }
                let completed = 0;
                clients.forEach(c => {
                    tx.executeSql(`
                        INSERT INTO cached_clients 
                            (leadno, leadname, address, contactperson, contactno, leadsitename, reserved1)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `, [
                        String(c.leadno),
                        c.leadname || '',
                        c.address || '',
                        c.contactperson || '',
                        c.contactno || '',
                        c.leadsitename || '',
                        c.reserved1 || ''
                    ], () => {
                        completed++;
                        if (completed === clients.length && callback) {
                            callback();
                        }
                    }, () => {
                        tx.executeSql(`DELETE FROM cached_clients WHERE leadno = ?`, [String(c.leadno)], () => {
                            tx.executeSql(`
                                INSERT INTO cached_clients 
                                    (leadno, leadname, address, contactperson, contactno, leadsitename, reserved1)
                                VALUES (?, ?, ?, ?, ?, ?, ?)
                            `, [
                                String(c.leadno),
                                c.leadname || '',
                                c.address || '',
                                c.contactperson || '',
                                c.contactno || '',
                                c.leadsitename || '',
                                c.reserved1 || ''
                            ], () => {
                                completed++;
                                if (completed === clients.length && callback) {
                                    callback();
                                }
                            });
                        });
                    });
                });
            });
        });
    },

    searchCachedClients: function(query, groupQuery, callback) {
        const self = this;
        if (self.useFallback) {
            let list = [];
            try {
                const data = localStorage.getItem('cached_clients_store');
                list = data ? JSON.parse(data) : [];
            } catch (e) {}

            if (query) {
                const q = query.toLowerCase();
                list = list.filter(c => (c.leadname || '').toLowerCase().includes(q));
            }
            if (groupQuery) {
                const g = groupQuery.toLowerCase();
                list = list.filter(c => (c.reserved1 || '').toLowerCase().includes(g));
            }
            if (callback) callback(list);
            return;
        }

        self.db.transaction(tx => {
            let sql = `SELECT * FROM cached_clients WHERE 1=1`;
            const params = [];
            if (query) {
                sql += ` AND leadname LIKE ?`;
                params.push(`%${query}%`);
            }
            if (groupQuery) {
                sql += ` AND reserved1 LIKE ?`;
                params.push(`%${groupQuery}%`);
            }
            tx.executeSql(sql, params, (tx, results) => {
                const list = [];
                for (let i = 0; i < results.rows.length; i++) {
                    list.push(results.rows.item(i));
                }
                if (callback) callback(list);
            });
        });
    }
};
