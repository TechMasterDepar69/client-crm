// 🔒 SECURITY CHECK
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

const form = document.getElementById('client-form');
const clientList = document.getElementById('client-list');

document.addEventListener('DOMContentLoaded', getClients);

// --- HELPER: AUTHENTICATED FETCH ---
// This wrapper adds the token to every request automatically
async function authFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // <--- THE VIP PASS
    };

    const response = await fetch(url, {
        ...options,
        headers: headers
    });

    if (response.status === 401) {
        logout(); // Token expired or invalid -> Kick them out
    }

    return response;
}

// 2. Handle Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newClient = {
        name: document.getElementById('client-name').value,
        service: document.getElementById('service').value,
        value: Number(document.getElementById('value').value),
        status: document.getElementById('status').value
    };

    // Use authFetch instead of normal fetch
    await authFetch('/api/clients', {
        method: 'POST',
        body: JSON.stringify(newClient)
    });

    form.reset();
    getClients();
});

// 3. Fetch and Display
async function getClients() {
    // Use authFetch
    const res = await authFetch('/api/clients');
    const data = await res.json();

    if (!data.success) return; // Stop if error

    const clients = data.data;

    // --- DASHBOARD LOGIC ---
    const total = clients.length;
    const active = clients.filter(c => c.status === 'Enrolled').length;
    const totalValue = clients.reduce((sum, client) => sum + (client.value || 0), 0);

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-active').innerText = active;
    document.getElementById('stat-value').innerText = `฿${totalValue}`;

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
                backgroundColor: ['#f1c40f', '#2ecc71', '#3498db', '#95a5a6']
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

async function deleteClient(id) {
    if (confirm('Delete this student?')) {
        await authFetch(`/api/clients/${id}`, { method: 'DELETE' });
        getClients();
    }
}

async function updateStatus(id, newStatus) {
    await authFetch(`/api/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
    });
    getClients();
}

function exportToCSV() {
    authFetch('/api/clients')
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