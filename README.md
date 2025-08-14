# 📅Subscriptly

A subscription management API that helps users track, manage, and get reminded about their active subscriptions - complete with authentication, email notifications, and automated workflows.

## ✦ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication & Authorization:** JWT, bcrypt
- **Email Service:** Nodemailer
- **Reminder Workflow:** Upstash (for scheduling and processing reminders)
- **Other Tools:** Arcjet for fraud prevention/security

## ✦ Features

- **User Authentication:** Sign up, log in, and secure routes using JWT.
- **Authorization:** Role-based access control for different user permissions.
- **Subscription Management:** Add, edit, delete, and view subscriptions.
- **Automated Reminders:** Upstash-powered workflows to send reminders before renewal dates.
- **Email Notifications:** Notify users about subscription updates and reminders.
- **Error Handling:** Centralized error handler for cleaner code.
- **MongoDB Models:** Structured and validated data storage.
