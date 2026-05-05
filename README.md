# 🎯 Team Task Manager

A **production-ready task management platform** for teams to create projects, assign tasks, and track progress with **role-based access control**. Built with **Next.js 16**, **Prisma ORM**, **MongoDB**, and **TypeScript**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your MongoDB URL and JWT secret

# 3. Setup database
npm run db:push
npm run db:seed

# 4. Run development server
npm run dev

# 5. Test credentials
# Admin: admin@example.com / Admin@123456
# User: john@example.com / Member@123456
```

Visit `http://localhost:3000`

---

## 🎨 Key Features

### 🔐 **Authentication**
- Signup/Login with JWT tokens
- Password validation and hashing
- Email verification support
- Last login tracking

### 👥 **Team Management**
- Create and manage projects
- Invite team members with roles
- Role-based access control (OWNER, ADMIN, MEMBER, VIEWER)
- Granular permissions per member

### 📋 **Task Management**
- Create, assign, and track tasks
- Status: TODO → IN_PROGRESS → IN_REVIEW → DONE → CANCELLED
- Priority levels: LOW, MEDIUM, HIGH, URGENT
- Progress tracking, time estimation, subtasks
- Task tagging and filtering

### 💬 **Collaboration**
- Comments with nested replies
- File attachments to tasks/comments
- Activity logging for all changes
- Real-time notifications

### 📊 **Dashboard & Analytics**
- Personal dashboard with task overview
- Project-specific statistics
- Overdue task tracking
- Team activity timeline

---

## 📋 Project Structure

```
team-task-manager/
├── app/api/                   # REST API routes
│   ├── auth/                  # Authentication
│   ├── projects/              # Project management
│   ├── tasks/                 # Task management
│   ├── users/                 # User profiles
│   └── dashboard/             # Analytics
├── lib/                        # Utilities
│   ├── auth/                  # JWT & Password
│   ├── permissions.ts         # RBAC logic
│   ├── validations.ts         # Input validation
│   └── audit.ts               # Activity logging
├── types/                      # TypeScript definitions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data
└── README.md                  # This file
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup          Register new user
POST   /api/auth/login           Login and get JWT token
```

### Projects
```
GET    /api/projects             List user's projects
POST   /api/projects             Create new project
GET    /api/projects/{id}        Get project details
PUT    /api/projects/{id}        Update project
DELETE /api/projects/{id}        Delete project (owner only)
```

### Team Members
```
GET    /api/projects/{id}/members              List members
POST   /api/projects/{id}/members              Add member
PUT    /api/projects/{id}/members/{id}         Update role
DELETE /api/projects/{id}/members/{id}         Remove member
```

### Tasks
```
GET    /api/tasks                List tasks (with filters)
POST   /api/tasks                Create task
GET    /api/tasks/{id}           Get task details
PUT    /api/tasks/{id}           Update task
DELETE /api/tasks/{id}           Delete task
POST   /api/tasks/{id}/comments  Add comment
```

### Dashboard & Users
```
GET    /api/dashboard            Get dashboard data
GET    /api/users/{id}           Get user profile
PUT    /api/users/{id}           Update profile
```

👉 **Full API Docs**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🛡️ Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Password Hashing** - bcryptjs with 10 salt rounds
✅ **Role-Based Access Control** - Global + Project-level
✅ **Input Validation** - Comprehensive validation rules
✅ **Audit Trail** - Complete change history
✅ **Permission Checks** - On every endpoint
✅ **SQL Injection Prevention** - Via Prisma ORM

---

## 👥 Role-Based Access Control

### Global Roles
- **SUPER_ADMIN** - System administrator
- **ADMIN** - Manage users and projects
- **USER** - Regular user

### Project Roles
| Role | Tasks | Members | Delete |
|------|-------|---------|--------|
| OWNER | ✅ | ✅ | ✅ |
| ADMIN | ✅ | ✅ | ❌ |
| MEMBER | ✅ | ❌ | ❌ |
| VIEWER | 🔍 | ❌ | ❌ |

---

## 📊 Database Schema

**12 Models** with comprehensive relationships:

```
User → Projects → ProjectMembers
              ↓
            Tasks → Comments
              ↓      ↓
         Notifications Activity
              ↓
         FileAttachments
```

**Models:**
- User, Project, ProjectMember, Task, Tag
- TaskComment, FileAttachment, Activity
- Notification, ProjectInvite

---

## ✅ Features Implemented

- [x] User authentication (signup/login)
- [x] Role-based access control (2 levels)
- [x] Project management (CRUD + archiving)
- [x] Team collaboration (invite, roles, permissions)
- [x] Task management (create, assign, track)
- [x] Task subtasks and tagging
- [x] Comments with nested replies
- [x] File attachments
- [x] Activity logging (audit trail)
- [x] Notifications system
- [x] Dashboard with analytics
- [x] Input validation
- [x] Error handling
- [x] Pagination support
- [x] Advanced filtering
- [x] TypeScript throughout
- [x] Database indexes
- [x] Cascade deletes
- [x] Comprehensive documentation

---

## 📈 Database Management

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to MongoDB
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio (GUI)
npm run db:studio

# Seed with sample data
npm run db:seed
```

---

## 🧪 Testing with Sample Data

The seed includes:
- **Admin**: admin@example.com / Admin@123456
- **User 1**: john@example.com / Member@123456
- **User 2**: jane@example.com / Member@123456
- **2 Projects** with 5 tasks
- **Tags**, comments, and notifications

Run `npm run db:seed` to populate.

---

## 🔐 Environment Setup

Create `.env.local`:
```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/db"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRY="7d"
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

---

## 🛠 Development

### Build
```bash
npm run build
npm run start
```

### Lint
```bash
npm run lint
```

### Database Commands
```bash
npm run db:push      # Sync schema
npm run db:migrate   # Create migration
npm run db:studio    # Open GUI
npm run db:seed      # Populate data
```

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- ✅ **Vercel** (recommended for Next.js)
- ✅ **Netlify**
- ✅ **AWS Amplify**
- ✅ **Docker + Cloud**

### Production Checklist
- [ ] Update `JWT_SECRET` with a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB connection with proper credentials
- [ ] Update `NEXT_PUBLIC_API_URL` to production domain
- [ ] Setup HTTPS
- [ ] Enable CORS if needed
- [ ] Configure email notifications (optional)

---

## 📚 Additional Resources

- 📖 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- ✨ **[FEATURES.md](./FEATURES.md)** - Detailed feature list
- 🔍 **[Prisma Schema](./prisma/schema.prisma)** - Database design
- 🌱 **[Seed Data](./prisma/seed.ts)** - Sample data generator

---

## 🚨 Validation Rules

### Passwords
- Minimum 8 characters
- 1+ uppercase, lowercase, number, special char

### Projects
- Name: 2-100 characters
- Description: 0-500 characters

### Tasks
- Title: 2-200 characters
- Description: 0-2000 characters
- Due date must be in future

### Comments
- Content: 1-2000 characters

---

## 🐛 Common Issues

**MongoDB Connection Error?**
- Check connection string in `.env.local`
- Verify IP whitelist in MongoDB Atlas
- Confirm database user permissions

**JWT Token Invalid?**
- Verify `JWT_SECRET` is set
- Check token expiry settings
- Re-login and get new token

**Schema Errors?**
- Run `npm run db:push`
- Check MongoDB connection
- Review Prisma logs

---

## 🔮 Future Enhancements

- 📧 Email notifications
- 🔄 Real-time updates (WebSockets)
- 💾 Cloud file storage (S3/Blob)
- 🔍 Advanced search
- 📅 Recurring tasks
- 📊 Gantt charts
- 🔐 Two-factor authentication
- 🌐 OAuth (Google, GitHub)
- 📱 Mobile app
- 🤖 AI suggestions

---

## 📄 Documentation

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error"
  }
}
```

### Authentication
```
Header: Authorization: Bearer <jwt-token>
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - Use freely for personal and commercial projects.

---

## 💡 Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| Next.js | Web framework | 16.2.4 |
| React | UI library | 19.2.4 |
| TypeScript | Type safety | 5 |
| Prisma | ORM | 6.4.1 |
| MongoDB | Database | Cloud |
| Tailwind CSS | Styling | 4 |
| bcryptjs | Password hashing | 2.4.3 |
| jsonwebtoken | JWT auth | 9.1.2 |

---

## 🙏 Credits

Built with ❤️ using modern web technologies and best practices.

---

## 📞 Support

- 📖 Read the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- 🐛 Check [FEATURES.md](./FEATURES.md) for what's implemented
- 💬 Review code comments
- 🔍 Check Prisma schema for data model

---

**Last Updated**: January 2026
**Status**: ✅ Production Ready
