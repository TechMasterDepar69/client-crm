# 📚 Student Tuition CRM (SaaS Platform)

A secure Client Relationship Management system designed for private educators and tutors to track student enrollment, manage course status, and visualize monthly revenue.

**[View Live Demo](https://client-crm-demo.onrender.com)**

For Login - teacher@test.com
password - password123
---

## 🔐 Key Features (Upgrade from V1)

* **Secure Authentication:** Full Login/Register system using **JWT (JSON Web Tokens)** and **Bcrypt** encryption.
* **Protected Routes:** Backend middleware prevents unauthorized access to API endpoints.
* **Student Lifecycle:** Track statuses from `Trial` -> `Enrolled` -> `Graduated`.
* **Revenue Analytics:** Real-time calculation of total monthly tuition and active student count.
* **Mobile Responsive:** Fully optimized for teachers to use on their phones during class.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JS, Chart.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Security:** JWT, Bcrypt.js, CORS

---

## 📸 Screenshots

![Screenshot_5-12-2025_19726_client-crm-demo onrender com](https://github.com/user-attachments/assets/fe78295a-d1e2-48c9-b502-9bb9b58005e3)

![Screenshot_5-12-2025_19743_client-crm-demo onrender com](https://github.com/user-attachments/assets/96ea67d4-409e-4b77-9211-3d2b64d2d774)

---

## 🔧 How to Run Locally

If you want to run this CRM on your own machine, you need to configure the database credentials manually.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/TechMasterDepar69/client-crm.git](https://github.com/TechMasterDepar69/client-crm.git)
    cd client-crm
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory (same level as `server.js`) and add your MongoDB connection string:
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    ```

4.  **Run the Server**
    ```bash
    npm run dev
    ```

5.  **Open Browser**
    Visit `http://localhost:5000`

---

## 👨‍💻 Author

**Depar Min Htet**
* **GitHub:** [TechMasterDepar69](https://github.com/TechMasterDepar69)
* **Email:** techmasterdepar69@gmail.com

---

*This project was built as part of a Full Stack Data Analysis portfolio.*
