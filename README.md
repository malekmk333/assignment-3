# Malik Khan – Student Assignment Tracker (Assignment 3)

## 1. Overview
This project is a **Student Assignment Tracker web application** built using **Node.js, Express, MongoDB Atlas, and EJS**. 

It allows a user to:
1. **Register** – Create an account securely with hashed passwords.  
2. **Log In** – Access assignment features using session-based authentication.  
3. **View Assignments** – View all assignments in a clean, table-based layout.  
4. **Create Assignments** – Add new assignments through a simple form.  
5. **Edit Assignments** – Update assignment details using a pre-filled edit form.  
6. **Delete Assignments** – Remove assignments with a confirmation page.

This application demonstrates **CRUD operations**, **authentication**, **MongoDB integration**, **EJS templating**, and **basic Bootstrap UI styling**.

All code used is **self-written**, inspired by **course lectures**, **class labs**, and a few **online references when needed**.

## 2. File Structure
Assignment-3/  
│  
├── app.js  
├── package.json  
├── package-lock.json  
├── .env  
├── .gitignore  
│  
├── config/  
│   └── db.js  
│  
├── models/  
│   ├── User.js  
│   └── Assignment.js  
│  
├── routes/  
│   ├── authRoutes.js  
│   └── assignmentRoutes.js  
│  
├── views/  
│   ├── index.ejs  
│   ├── login.ejs  
│   ├── register.ejs  
│   ├── assignments.ejs  
│   ├── new-assignment.ejs  
│   ├── edit-assignment.ejs  
│   ├── delete-confirm.ejs  
│   └── partials/  
│       ├── header.ejs  
│       └── footer.ejs  
│  
└── public/  
    └── css/  
        └── style.css  

---

## 3. Code Sources & Documentation
- All code used is **self-written**, following lecture examples, INFR3120 class labs, and documentation listed below.
### Documentation Used:
- Express Routing – https://expressjs.com/en/guide/routing.html  
- Mongoose Models/Schemas – https://mongoosejs.com/docs/models.html  
- bcrypt password hashing – https://www.npmjs.com/package/bcrypt  
- express-session – https://www.npmjs.com/package/express-session  
- connect-mongo – https://www.npmjs.com/package/connect-mongo  
- Bootstrap 5 forms/table classes – https://getbootstrap.com/docs/5.3/forms/overview/  
- EJS templating – https://ejs.co/


## 4. CRUD Functionality
- **Create:**  
  Users can create a new assignment using a form (`/assignments/new`).  
  Fields include Title, Course, Due Date, and Status.

- **Read:**  
  Users can view all their assignments on the main assignment list page (`/assignments`).

- **Update:**  
  Users can edit existing assignments (`/assignments/:id/edit`) using a pre-filled form.

- **Delete:**  
  Before deleting an assignment, the user is shown a confirmation page (`/assignments/:id/delete`) to avoid accidental deletion.

Full CRUD functionality is implemented with Mongoose and Express routes.

## 5. Authentication System
- Users must **register** before accessing assignment features.  
- Passwords are protected using **bcrypt hashing**.  
- Sessions are handled using **express-session**, stored inside MongoDB using **connect-mongo**.  
- A simple middleware (`requireLogin`) protects all assignment routes.  
- Only logged-in users can access `/assignments`.

This ensures user privacy and prevents unauthorized access.

## 6. EJS Views & UI Design
The UI uses **EJS templating** with:

- Common `header.ejs` and `footer.ejs` partials  
- Clean Bootstrap 5 styling  
- Forms, tables, and buttons styled consistently  
- Simple, readable layout for beginner-level clarity  
- Basic custom CSS in `style.css`  


## 7. Deployment & Environment Variables
The application is deployed on **Render Web Service**.

Environment variables used:

MONGODB_URI=your_atlas_connection_string
SESSION_SECRET=anyRandomString
PORT=3000 (optional)

The `.env` file is hidden using `.gitignore` to protect sensitive credentials.


## 8. GitHub Repository
You can clone the repository using:
https://github.com/malekmk333/assignment-3.git

## 9. Running the Application

**Install dependencies:**
npm install

Run in development mode:
npm run dev

Open in browser:
http://localhost:3000

To run using normal Node:
npm start

