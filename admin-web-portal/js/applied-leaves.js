/**
 * Applied Leaves Logic
 * Data rendering & report generation
 */

const LEAVES_DATA = [
    {
        srNo: '1',
        appliedOn: '2026/08/05 10:15',
        userName: 'Aashish Chavan',
        department: 'Sales',
        empCode: 'EMP042',
        from: '2026/08/06',
        till: '2026/08/06',
        totalDays: '1.0',
        leaveType: 'Casual Leave',
        dayType: 'Full Day',
        responsiblePerson: 'Ramesh Kumar',
        approvedBy: 'Admin User',
        approvedOn: '2026/08/05 11:30',
        status: 'APPROVED'
    },
    {
        srNo: '2',
        appliedOn: '2026/08/07 09:20',
        userName: 'demo group',
        department: 'Operations',
        empCode: 'EMP001',
        from: '2026/08/08',
        till: '2026/08/09',
        totalDays: '2.0',
        leaveType: 'Sick Leave',
        dayType: 'Full Day',
        responsiblePerson: 'Suresh Patil',
        approvedBy: 'Admin User',
        approvedOn: '2026/08/07 10:00',
        status: 'APPROVED'
    },
    {
        srNo: '3',
        appliedOn: '2026/08/08 14:10',
        userName: 'Paresh',
        department: 'IT',
        empCode: 'EMP015',
        from: '2026/08/10',
        till: '2026/08/10',
        totalDays: '0.5',
        leaveType: 'Earned Leave',
        dayType: 'Half Day',
        responsiblePerson: 'Vikas Shah',
        approvedBy: '-',
        approvedOn: '-',
        status: 'PENDING'
    }
];

function renderLeavesTable(data) {
    const tbody = document.getElementById('leaves-tbody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="14" class="empty-table-msg">No leave records found matching search parameters</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => {
        let statusClass = 'status-approved';
        if (item.status === 'PENDING') statusClass = 'status-pending';
        if (item.status === 'REJECTED') statusClass = 'status-rejected';

        return `
            <tr>
                <td class="col-srno">${item.srNo}</td>
                <td class="col-datetime">${item.appliedOn}</td>
                <td><strong>${item.userName}</strong></td>
                <td><span class="dept-badge">${item.department}</span></td>
                <td><code class="code-pan">${item.empCode}</code></td>
                <td class="col-datetime">${item.from}</td>
                <td class="col-datetime">${item.till}</td>
                <td><strong>${item.totalDays}</strong></td>
                <td><span class="leave-type-pill">${item.leaveType}</span></td>
                <td>${item.dayType}</td>
                <td>${item.responsiblePerson}</td>
                <td>${item.approvedBy}</td>
                <td class="col-datetime">${item.approvedOn}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            </tr>
        `;
    }).join('');
}

function generateLeavesReport() {
    const fromDate = document.getElementById('leaves-from-date').value;
    const tillDate = document.getElementById('leaves-till-date').value;
    const user = document.getElementById('search-user-select').value;
    const dept = document.getElementById('search-dept-select').value;

    // Update report meta
    const metaRange = document.getElementById('leaves-meta-range');
    const metaDate = document.getElementById('leaves-meta-date');

    if (metaRange && fromDate && tillDate) {
        metaRange.textContent = `${fromDate.replace(/-/g,'/')} - ${tillDate.replace(/-/g,'/')}`;
    }

    if (metaDate) {
        const now = new Date();
        metaDate.textContent = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    }

    // Filter data
    let filtered = LEAVES_DATA;

    if (user !== 'All') {
        filtered = filtered.filter(item => item.userName.toLowerCase() === user.toLowerCase());
    }

    if (dept !== 'All') {
        filtered = filtered.filter(item => item.department.toLowerCase() === dept.toLowerCase());
    }

    renderLeavesTable(filtered);
    showToast(`Generated report for "${user}" (${dept} department)`, 'success');
}

// Initialize dates on page load
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const fromInput = document.getElementById('leaves-from-date');
    const tillInput = document.getElementById('leaves-till-date');

    if (fromInput) fromInput.value = firstDay;
    if (tillInput) tillInput.value = todayStr;

    renderLeavesTable(LEAVES_DATA);
});
