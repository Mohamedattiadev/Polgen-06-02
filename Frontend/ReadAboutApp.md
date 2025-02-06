### to add Admin manually in postgres:

INSERT INTO users (id, username, email, password, phone, address, role, resetToken, resetTokenExpiry, createdAt, updatedAt)
VALUES (
    gen_random_uuid(), -- Assuming 'id' is a UUID, generated dynamically
    'username', 
    'email@gmail.com', 
    'password', -- Plain password, which will be hashed by the backend
    'phone', 
    'address', 
    'admin', 
    NULL, -- Assuming resetToken is NULL initially
    NULL, -- Assuming resetTokenExpiry is NULL initially
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
);


--NOTE: just change the values of the plain names....

----------------



## Frontend File Structure

src
├── Routers
│   ├── api.js                        // API configurations
│   └── auth.js                       // Authentication-related routing
├── assets                            // Static assets for different pages
│   ├── Aboutus_images
│   ├── Ar-Ge_images
│   ├── Contactus_images
│   ├── Main_images
│   ├── Services_images
│   ├── Siparis_images
│   └── Slider_images
├── components                        // Shared reusable components
│   ├── Error404
│   │   ├── Error404.jsx              // 404 Error page component
│   │   └── Error404.module.css       // CSS module for Error404
│   ├── HomeComponent                 // Components related to the home page
│   │   ├── Footer
│   │   │   ├── Footer.jsx            // Footer component
│   │   │   └── Footer.module.css     // CSS module for Footer
│   │   ├── Forgot_password
│   │   │   ├── ForgotPassword.jsx    // Forgot password component
│   │   │   └── ForgotPassword.module.css  // CSS module for Forgot password
│   │   ├── Login
│   │   │   ├── Login.jsx             // Login component
│   │   │   └── Login.module.css      // CSS module for Login
│   │   ├── Navbar
│   │   │   ├── Navbar.jsx            // Navbar component
│   │   │   └── Navbar.module.css     // CSS module for Navbar
│   │   ├── Register
│   │   │   ├── Register.jsx          // Register component
│   │   │   └── Register.module.css   // CSS module for Register
│   │   ├── Reset_Password            // Reset password components
│   │   │   ├── Reset_Password.jsx    // Reset password component
│   │   │   └── Reset_Password.module.css // CSS module for Reset password
│   │   ├── Slider
│   │   │   ├── Slider.jsx            // Slider component
│   │   │   └── Slider.module.css     // CSS module for Slider
│   └── OrderComponent                // Components related to orders
│       ├── AdminComponent
│       │   ├── AdminSideBar.jsx      // Sidebar for Admin
│       │   ├── AdminSideBar.module.css  // CSS module for AdminSideBar
│       │   ├── AdminTables.jsx       // Tables for Admin
│       │   └── AdminTables.module.css   // CSS module for AdminTables
│       ├── UserComponent
│       │   ├── UserSideBar.jsx       // Sidebar for User
│       │   ├── UserSideBar.module.css   // CSS module for UserSideBar
│       │   ├── UserTables.jsx        // Tables for User
│       │   └── UserTables.module.css    // CSS module for UserTables
├── pages                             // Organized pages for routing
│   ├── Home
│   │   ├── About
│   │   │   ├── About.jsx             // About page component
│   │   │   └── About.module.css      // CSS module for About page
│   │   ├── Ar_Ge
│   │   │   ├── Ar_Ge.jsx             // Ar-Ge page component
│   │   │   └── Ar_Ge.module.css      // CSS module for Ar-Ge page
│   │   ├── Contact
│   │   │   ├── Contact.jsx           // Contact page component
│   │   │   └── Contact.module.css    // CSS module for Contact page
│   │   ├── Covid_19
│   │   │   ├── Covid_19.jsx          // Covid-19 page component
│   │   │   └── Covid_19.module.css   // CSS module for Covid-19 page
│   │   ├── LoginPage
│   │   │   ├── LoginPage.jsx         // Login page component
│   │   │   └── LoginPage.module.css  // CSS module for Login page
│   │   ├── Main
│   │   │   ├── Main.jsx              // Main page component
│   │   │   └── Main.module.css       // CSS module for Main page
│   │   ├── RegisterPage
│   │   │   ├── RegisterPage.jsx      // Register page component
│   │   │   └── RegisterPage.module.css // CSS module for Register page
│   │   └── Services
│   │       ├── Services.jsx          // Services page component
│   │       └── Services.module.css   // CSS module for Services page
├── translations                      // Internationalization files
│   ├── locales
│   │   ├── ar/ar_translation.json    // Arabic translations
│   │   ├── en/en_translation.json    // English translations
│   │   ├── fr/fr_translation.json    // French translations
│   │   └── tr/tr_translation.json    // Turkish translations
├── styles                            // Shared styles and global CSS
├── zustand                           // State management folder
├── App.css                           // Main styling file for global styles
├── App.jsx                           // Main app component
├── index.css                         // General CSS
├── index.jsx                         // Root index file for React
└── main.jsx                          // Root main file for React

--------

## Backend File Structure

backend
├── models                           // Sequelize models
│   ├── User.js                      // User model (username, email, password, etc.)
│   └── ...other models              // Additional database models
├── routes                           // API routes
│   ├── auth.js                      // Authentication routes (register, login)
│   └── ...other routes              // Additional routes for the application
├── services                         // Service layers
│   ├── emailService.js              // Nodemailer service for sending emails
│   └── ...other services            // Other service modules
├── config                           // Configuration files
│   ├── database.js                  // Database configuration (PostgreSQL)
│   ├── dotenv                       // Environment variable configuration
│   └── ...other configurations      // Any additional configuration files
├── middleware                       // Middleware functions
│   ├── authMiddleware.js            // JWT authentication middleware
│   └── ...other middleware          // Other middleware
├── app.js                           // Main application file
├── server.js                        // Server setup and startup
└── package.json                     // Backend dependencies and scripts


------------

##Features (In Points)


# Frontend Features

1-Authentication Pages:

User registration with validation (password, email).
Login with JWT and protected routing.

2-Reusable Components:

Navbar, Footer, and other shared components.

3-Responsive Design:

Each component uses its own CSS module for modularity and responsive design.

4-Dynamic Routing:

Protected routes for Admin and User dashboards.
404 Error handling.


----------------------------------------

# Backend Features

1-User Management:

User registration with email validation and hashed passwords.
Login with JWT authentication.

2-Email Notifications:

nodemailer to send registration confirmation emails.

3-Database:

PostgreSQL database with Sequelize ORM.

Models for users, roles, and more.

4-Error Handling:
Comprehensive error handling for all endpoints.
Sequelize validation for data consistency.

---------------------------------
