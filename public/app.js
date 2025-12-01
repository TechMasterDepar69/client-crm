const form = document.getElementById('client-form');
const clientList = document.getElementById('client-list');

// 1. Load data when page opens
document.addEventListener('DOMContentLoaded', getClients);

// 2. Handle Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newClient = {
        name: document.getElementById('client-name').value,
        service: document.getElementById('service').value,
        value: Number(document.getElementById('value').value),
        status: document.getElementById('status').value
    };

    await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
    });

    form.reset();
    getClients();
});

// 3. Fetch and Display
async function getClients() {
    const res = await fetch('/api/clients');
    const data = await res.json();
    const clients = data.data;

    // --- DASHBOARD LOGIC ---
    const total = clients.length;
    const active = clients.filter(c => c.status === 'Enrolled').length;
    const totalValue = clients.reduce((sum, client) => sum + (client.value || 0), 0);

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-active').innerText = active;
    document.getElementById('stat-value').innerText = `฿${totalValue}`; // Changed to THB symbol

    // --- CHART LOGIC ---
    if (window.myChartInstance) window.myChartInstance.destroy();

    const ctx = document.getElementById('myChart').getContext('2d');
    const statusCounts = [
        clients.filter(c => c.status === 'Trial').length,
        clients.filter(c => c.status === 'Enrolled').length,
        clients.filter(c => c.status === 'Graduated').length,
        clients.filter(c => c.status === 'Paused').length
    ];

    window.myChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Trial', 'Enrolled', 'Graduated', 'Paused'],
            datasets: [{
                data: statusCounts,
                backgroundColor: ['#f1c40f', '#2ecc71', '#3498db', '#95a5a6'] // Yellow, Green, Blue, Grey
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // --- LIST RENDERING ---
    clientList.innerHTML = '';
    clients.forEach(client => {
        const div = document.createElement('div');
        div.classList.add('job-card');
        div.innerHTML = `
            <div class="job-info">
                <h3>${client.name}</h3>
                <p>${client.service} <small>(฿${client.value})</small></p>
            </div>
            <div class="job-actions">
                <select onchange="updateStatus('${client._id}', this.value)" class="status-select ${client.status.toLowerCase()}">
                    <option value="Trial" ${client.status === 'Trial' ? 'selected' : ''}>Trial</option>
                    <option value="Enrolled" ${client.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
                    <option value="Graduated" ${client.status === 'Graduated' ? 'selected' : ''}>Graduated</option>
                    <option value="Paused" ${client.status === 'Paused' ? 'selected' : ''}>Paused</option>
                </select>
                <button class="delete-btn" onclick="deleteClient('${client._id}')">🗑️</button>
            </div>
        `;
        clientList.appendChild(div);
    });
}

// 4. Delete
async function deleteClient(id) {
    if (confirm('Delete this student?')) {
        await fetch(`/api/clients/${id}`, { method: 'DELETE' });
        getClients();
    }
}

// 5. Update Status
async function updateStatus(id, newStatus) {
    await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    getClients();
}

// 6. Export to Excel
function exportToCSV() {
    fetch('/api/clients')
        .then(res => res.json())
        .then(data => {
            let csv = "data:text/csv;charset=utf-8,Student Name,Course,Tuition,Status,Date Added\r\n";
            data.data.forEach(c => {
                csv += `${c.name},${c.service},${c.value},${c.status},${new Date(c.dateAdded).toLocaleDateString()}\r\n`;
            });
            const link = document.createElement("a");
            link.setAttribute("href", encodeURI(csv));
            link.setAttribute("download", "student_list.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}