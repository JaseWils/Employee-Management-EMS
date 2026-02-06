# 🏢 Employee Management System

A comprehensive full-stack Employee Management System built with the MERN stack.

## ✨ Features

- 👥 **Employee Management** - Complete CRUD operations
- 🏢 **Department Management** - Organize employees by departments
- 📝 **Leave Management** - Apply, approve, and track leaves
- 💰 **Salary Management** - Process salaries with allowances and deductions
- 🔐 **Authentication** - JWT + OTP email verification
- 💳 **Payment Integration** - Razorpay payment gateway
- 📊 **Dashboard** - Real-time statistics and analytics
- 🔔 **Email Notifications** - Automated email notifications

## 🛠️ Tech Stack

**Frontend:** React.js, React Router, Axios, Bootstrap, Firebase
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Authentication:** JWT, Bcrypt, OTP Verification
**Storage:** Cloudinary
**Payments:** Razorpay
**Email:** Nodemailer

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gmail account (for OTP emails)
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Employee-Management-EMS.git
cd Employee-Management-EMS

# Server setup
cd server
npm install
copy .env.example .env
# Edit .env with your credentials
npm start

# Client setup (in new terminal)
cd client
npm install
copy .env.example .env
# Edit .env with your credentials
npm start
```

### Default Admin Credentials
- Email: `admin@ems.com`
- Password: `admin123`

## 📁 Project Structure

```
Employee-Management-EMS/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   └── services/    # API services
│   └── package.json
├── server/              # Node.js backend
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   └── utils/           # Helper functions
└── README.md
```

## 🔧 Environment Variables

See `.env.example` files in `client/` and `server/` directories.

### Server Environment Variables
- `MONGODB_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_*` - Cloudinary credentials
- `EMAIL_*` - Email service configuration
- `RAZORPAY_*` - Razorpay credentials

### Client Environment Variables
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_FIREBASE_*` - Firebase configuration
- `REACT_APP_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name

## 📝 API Endpoints

- **Auth:** `/api/v1/register`, `/api/v1/login`, `/api/v1/verify-otp`
- **Staff:** `/api/v1/get-staffs`, `/api/v1/add-staff`
- **Departments:** `/api/v1/get-dept`, `/api/v1/add-dept`
- **Leaves:** `/api/v1/get-leaves`, `/api/v1/apply-leave`
- **Salaries:** `/api/v1/get-salaries`, `/api/v1/add-salary`

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- OTP email verification
- Protected API routes
- Environment variable protection

## 📝 License

ISC

## 👨‍💻 Author

Soumadip SS

---
⭐ Star this repo if you find it helpful!
