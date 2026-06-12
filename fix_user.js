const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'duty_system',
  charset: 'utf8mb4'
});

connection.connect((err) => {
  if (err) {
    console.error('连接失败:', err);
    return;
  }
  console.log('连接成功');
  
  // 先检查是否存在已删除的id=3记录
  connection.query('SELECT * FROM sys_user WHERE id = 3', (err, results) => {
    if (err) {
      console.error('查询失败:', err);
      connection.end();
      return;
    }
    
    if (results.length > 0) {
      // 存在记录，恢复它
      connection.query('UPDATE sys_user SET deleted = 0, name = "张三", username = "counselor1", password = "123456", college_id = 1, role = "COUNSELOR" WHERE id = 3', (err, results) => {
        if (err) {
          console.error('更新失败:', err);
        } else {
          console.log('恢复成功:', results);
        }
        connection.end();
      });
    } else {
      // 不存在记录，插入新记录
      connection.query('INSERT INTO sys_user (id, username, password, name, college_id, role, deleted) VALUES (3, "counselor1", "123456", "张三", 1, "COUNSELOR", 0)', (err, results) => {
        if (err) {
          console.error('插入失败:', err);
        } else {
          console.log('插入成功:', results);
        }
        connection.end();
      });
    }
  });
});