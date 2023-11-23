const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 33307;

// 设置数据库连接
const db = mysql.createConnection({
    host: '192.168.5.4',
	port: 3307,
    user: 'root',
    password: 'Hans_12345',
    database: 'emily'
});

// 静态文件服务
app.use(express.static('public')); // 假设你的 HTML 文件在 'public' 目录下
// 解析 application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

// 连接到数据库
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 获取当前级别
app.get('/api/level', (req, res) => {
    const query = 'SELECT currentLevel FROM rewardSetting WHERE id = 1';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json({ currentLevel: result[0].currentLevel });
    });
});

// 更新当前级别的 API
app.post('/api/update-level', (req, res) => {
	const newLevel = req.body.level;
	const query = 'UPDATE rewardSetting SET currentLevel = ? WHERE id = 1';
	db.query(query, [newLevel], (err, result) => {
		if (err) {
			console.error('Error executing query: ', err);
			res.status(500).send('Error executing query');
			return;
		}
		res.redirect('/admin.html');
	// 重定向回表单页面
	});
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
