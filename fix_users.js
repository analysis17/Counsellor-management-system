const http = require('http');

const users = [
  { id: 1, name: '系统管理员', username: 'admin', role: 'ADMIN' },
  { id: 2, name: '计算机学院管理员', username: 'college1', collegeId: 1, role: 'COLLEGE' },
  { id: 3, name: '张三', username: 'counselor1', collegeId: 1, role: 'COUNSELOR' },
  { id: 4, name: '王五', username: 'counselor3', collegeId: 2, role: 'COUNSELOR' },
  { id: 5, name: '赵六', username: 'counselor4', collegeId: 2, role: 'COUNSELOR' },
  { id: 6, name: '李四', username: 'counselor2', collegeId: 1, role: 'COUNSELOR' },
  { id: 7, name: '机械学院管理员', username: 'college2', collegeId: 2, role: 'COLLEGE' }
];

function updateUser(user) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(user);
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/user/update',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(body));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  for (const user of users) {
    console.log(`更新用户 ${user.id}: ${user.name}`);
    try {
      const result = await updateUser(user);
      console.log(`结果: ${result}`);
    } catch (error) {
      console.error(`失败: ${error.message}`);
    }
  }
  console.log('完成');
}

run();