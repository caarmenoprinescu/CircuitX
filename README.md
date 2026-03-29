# 🏁 CircuitX

CircuitX is a full-featured racing management web application where users can act as **Pilots** or **Organizers**. The platform enables organizers to create and manage racing events on different circuits, while pilots can join events, select cars from their personal garage, and analyze their technical advantage against other participants.

---

## ✨ Features

### 👤 Authentication & User Roles
- 🔐 Login & Sign Up with input validation
- 👱🏼 Role selection at registration: **Pilot** or **Organizer**
- 🔒 Protected routes based on user role

---

### 🚗 Pilot Features
- 🏎️ Personal garage management (CRUD operations)
- 👉🏼 Select a car for a race
- 🔝 Compare technical performance against other participants
- 🏁 Join racing events
- 👤 Profile management

---

### 🏁 Organizer Features
- 🗺️ Manage circuits
- 📅 Create, update, and delete events (CRUD)
- 👥 Manage participants and available slots
- 📊 Event analytics (2 different statistical views)
- 📈 Track registrations and event status (Draft / Published)

---

### 📅 Event System
- 🔍 Browse and filter events (date, country, level)
- 🧾 View detailed event information
- 💰 Pricing and slot management
- 🏎️ Circuit-based event organization

---

### 🎨 UI & UX
- 🌙 Modern dark theme
- ⚖️ Symmetry-based layout design
- ⚡ Fast and responsive interface
- 🧩 Component-based architecture

---

## 🛠️ Tech Stack

- Frontend: React
- State Management: Context API
- Routing: React Router
- Testing: Vitest + React Testing Library
- Language: TypeScript / JavaScript

---

## ⚙️ Installation & Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/circuitx.git
cd circuitx
npm install
npm run dev      # start development server
npm run test     # run tests
