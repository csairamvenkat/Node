// const authenticateToken = require('../middleware/authenticateToken');
// const express = require('express');
// const router = express.Router();
// const db = require('../db');
// // Basic test route
// app.get('/', (req, res) => {
//     res.send('API is running');
//   });
  
//   // AUTH ROUTES
//   // Register new user
//   app.post('/api/auth/register', async (req, res) => {
//     try {
//       const { name, email, password } = req.body;
      
//       // Validate input
//       if (!name || !email || !password) {
//         return res.status(400).json({
//           success: false,
//           message: 'Name, email and password are required'
//         });
//       }
      
//       // Check if user already exists
//       const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      
//       if (existingUsers.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message: 'User with this email already exists'
//         });
//       }
      
//       // Hash the password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
      
//       // Insert new user
//       const [result] = await db.query(
//         'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//         [name, email, hashedPassword]
//       );
      
//       // Return success response
//       res.status(201).json({
//         success: true,
//         message: 'User registered successfully',
//         userId: result.insertId
//       });
//     } catch (error) {
//       console.error('Error registering user:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error registering user',
//         error: error.message
//       });
//     }
//   });
  
//   // // Login user
//   // app.post('/api/auth/login', async (req, res) => {
//   //   try {
//   //     const { email, password } = req.body;
      
//   //     // Validate input
//   //     if (!email || !password) {
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: 'Email and password are required'
//   //       });
//   //     }
      
//   //     // Check if user exists
//   //     const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      
//   //     if (users.length === 0) {
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: 'Invalid email or password'
//   //       });
//   //     }
      
//   //     const user = users[0];
      
//       // Validate password
//       const validPassword = await bcrypt.compare(password, user.password);
//       if (!validPassword) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid email or password'
//         });
//       }
      
//       // Create and assign token
//       const token = jwt.sign(
//         { id: user.id, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRES_IN }
//       );
      
//       res.json({
//         success: true,
//         message: 'Login successful',
//         token
//       });
//     } catch (error) {
//       console.error('Error logging in:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error logging in',
//         error: error.message
//       });
//     }
//   });
  
//   // PROTECTED ROUTES
//   // GET endpoint to fetch all users from the database
//   app.get('/api/users', authenticateToken, async (req, res) => {
//     try {
//       // Execute the SQL query
//       const [rows] = await db.query('SELECT id, name, email FROM users');
      
//       // Return the results
//       res.json({
//         success: true,
//         data: rows
//       });
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching users',
//         error: error.message
//       });
//     }
//   });
  
//   // POST endpoint to create a new user - admin only
//   app.post('/api/users', authenticateToken, async (req, res) => {
//     try {
//       const { name, email } = req.body;
      
//       // Validate input
//       if (!name || !email) {
//         return res.status(400).json({
//           success: false,
//           message: 'Name and email are required'
//         });
//       }
      
//       // Insert new user
//       const [result] = await db.query(
//         'INSERT INTO users (name, email) VALUES (?, ?)',
//         [name, email]
//       );
      
//       // Return success response
//       res.status(201).json({
//         success: true,
//         message: 'User created successfully',
//         userId: result.insertId
//       });
//     } catch (error) {
//       console.error('Error creating user:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error creating user',
//         error: error.message
//       });
//     }
//   });
  
//   // GET endpoint to fetch a specific user
//   app.get('/api/users/:id', authenticateToken, async (req, res) => {
//     try {
//       const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.params.id]);
      
//       if (rows.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: 'User not found'
//         });
//       }
      
//       res.json({
//         success: true,
//         data: rows[0]
//       });
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching user',
//         error: error.message
//       });
//     }
//   });
  
//   // Self user information - get current logged in user's info
//   app.get('/api/me', authenticateToken, async (req, res) => {
//     try {
//       const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
      
//       if (rows.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: 'User not found'
//         });
//       }
      
//       res.json({
//         success: true,
//         data: rows[0]
//       });
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching user',
//         error: error.message
//       });
//     }
//   });


const authenticateToken = require('../middleware/authenticateToken');
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Basic test route
router.get('/', (req, res) => {
    res.send('API is running');
});

// AUTH ROUTES
// Register new user
router.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Check if user already exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // Return success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
});

// Login user
router.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Create and assign token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

// PROTECTED ROUTES
// GET endpoint to fetch all users from the database
router.get('/api/users', authenticateToken, async (req, res) => {
    try {
        // Execute the SQL query
        const [rows] = await db.query('SELECT id, name, email FROM users');

        // Return the results
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// POST endpoint to create a new user - admin only
router.post('/api/users', authenticateToken, async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate input
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
        }

        // Insert new user
        const [result] = await db.query(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );

        // Return success response
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// GET endpoint to fetch a specific user
router.get('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
});

// Self user information - get current logged in user's info
router.get('/api/me', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
});

module.exports = router;
