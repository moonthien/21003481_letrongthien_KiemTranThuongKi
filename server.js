// server.js
const express = require('express'); // Thư viện tạo server web
const mysql = require('mysql2'); // Thư viện kết nối và thao tác với MySQL
const cors = require('cors'); // Thư viện cho phép yêu cầu từ các domain khác
const multer = require('multer'); // Thư viện giúp tải file từ người dùng lên server
const path = require('path'); // Thư viện thao tác với đường dẫn file

// Khởi tạo express app
const app = express();

// Middleware
app.use(cors()); // Cho phép yêu cầu từ các domain khác
app.use(express.json()); // Chấp nhận JSON trong body của yêu cầu
app.use('/uploads', express.static('uploads')); // Cho phép truy cập các file trong thư mục uploads

// Thiết lập multer để tải file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file
    }
});
const upload = multer({ storage }); // Tạo biến upload cho việc tải file

// Kết nối đến MySQL
const db = mysql.createConnection({
    host: '127.0.0.1', // Địa chỉ localhost của MySQL
    port: 3306, // Port của MySQL
    user: 'root', // Tên người dùng MySQL
    password: '123456789', // Mật khẩu MySQL
    database: 'catagory' // Tên cơ sở dữ liệu
});

// Kết nối đến cơ sở dữ liệu
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('MySQL Connected...');
});

// Lấy tất cả dữ liệu từ bảng category
app.get('/category', (req, res) => {
    const sql = 'SELECT * FROM category';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        res.json(result);
    });
});

//Lấy tất cả dữ liệu từ bảng location
app.get('/location', (req, res) => {
    const sql = 'SELECT * FROM location';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        res.json(result);
    });
});


// Endpoint để đăng nhập
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM Account WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length > 0) {
            return res.json({ message: 'Login successful', user: result[0] });
        }
        return res.status(401).json({ message: 'Invalid username or password' });
    });
});

// Endpoint để đăng ký tài khoản
app.post('/register', upload.single('avatar'), (req, res) => {
    const { username, password } = req.body;
    const avatar = req.file ? req.file.filename : null;

    // Kiểm tra username có tồn tại không
    const checkQuery = 'SELECT * FROM Account WHERE username = ?';
    db.query(checkQuery, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Thêm tài khoản mới vào cơ sở dữ liệu
        const insertQuery = 'INSERT INTO Account (username, password, avatar) VALUES (?, ?, ?)';
        db.query(insertQuery, [username, password, avatar], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
        });
    });
});

// Endpoint để đổi mật khẩu
app.put('/reset-password', (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra xem username có tồn tại không
    const checkQuery = 'SELECT * FROM Account WHERE username = ?';
    db.query(checkQuery, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Username does not exist' });
        }

        // Cập nhật mật khẩu
        const updateQuery = 'UPDATE Account SET password = ? WHERE username = ?';
        db.query(updateQuery, [password, username], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Password reset successful' });
        });
    });
});

// Endpoint để xóa tài khoản
app.delete('/delete-account', (req, res) => {
    const { username } = req.body;

    // Kiểm tra xem username có tồn tại không
    const checkQuery = 'SELECT * FROM Account WHERE username = ?';
    db.query(checkQuery, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Username does not exist' });
        }

        // Xóa tài khoản
        const deleteQuery = 'DELETE FROM Account WHERE username = ?';
        db.query(deleteQuery, [username], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Account deleted successfully' });
        });
    });
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});