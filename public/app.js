const form = document.getElementById('client-form');
const clientList = document.getElementById('client-list');

// 1. Load clients when page opens
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

    // Send to Backend
    await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
    });

    form.reset();
    getClients();
});

// 3. Fetch and Display Clients
async function getClients() {
    const res = await fetch('/api/clients');
    const data = await res.json();
    const clients = data.data;

    // --- 📊 DASHBOARD LOGIC ---

    // 1. Total Count
    const total = clients.length;

    // 2. Active Count
    const active = clients.filter(c => c.status === 'Active').length;

    // 3. Total Money Value (Sum)
    const totalValue = clients.reduce((sum, client) => sum + (client.value || 0), 0);

    // Update UI
    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-active').innerText = active;
    document.getElementById('stat-value').innerText = `$${totalValue}`;

    // --- CHART LOGIC ---
    if (window.myChartInstance) window.myChartInstance.destroy();

    const ctx = document.getElementById('myChart').getContext('2d');
    const statusCounts = [
        clients.filter(c => c.status === 'New').length,
        clients.filter(c => c.status === 'Active').length,
        clients.filter(c => c.status === 'Completed').length,
        clients.filter(c => c.status === 'Lost').length
    ];

    window.myChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['New', 'Active', 'Completed', 'Lost'],
            datasets: [{
                data: statusCounts,
                backgroundColor: ['#3498db', '#f1c40f', '#27ae60', '#e74c3c']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // --- LIST RENDERING ---
    clientList.innerHTML = '';
    clients.forEach(client => {
        const div = document.createElement('div');
        div.classList.add('job-card'); // Keeping class name for CSS styling
        div.innerHTML = `
            <div class="job-info">
                <h3>${client.name}</h3>
                <p>${client.service} <small>($${client.value})</small></p>
            </div>
            <div class="job-actions">
                <select onchange="updateStatus('${client._id}', this.value)" class="status-select ${client.status.toLowerCase()}">
                    <option value="New" ${client.status === 'New' ? 'selected' : ''}>New</option>
                    <option value="Active" ${client.status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="Completed" ${client.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Lost" ${client.status === 'Lost' ? 'selected' : ''}>Lost</option>
                </select>
                <button class="delete-btn" onclick="deleteClient('${client._id}')">🗑️</button>
            </div>
        `;
        clientList.appendChild(div);
    });
}

// 4. Delete Client
async function deleteClient(id) {
    if (confirm('Delete this client?')) {
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

// 6. Export to CSV
function exportToCSV() {
    fetch('/api/clients')
        .then(res => res.json())
        .then(data => {
            let csv = "data:text/csv;charset=utf-8,Name,Service,Value,Status,Date\r\n";
            data.data.forEach(c => {
                csv += `${c.name},${c.service},${c.value},${c.status},${new Date(c.dateAdded).toLocaleDateString()}\r\n`;
            });
            const link = document.createElement("a");
            link.setAttribute("href", encodeURI(csv));
            link.setAttribute("download", "client_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}