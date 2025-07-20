// api/return-html-file.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'pdf.html'); // 指定 HTML 文件路径

  // 读取文件并返回
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading HTML file');
      return;
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(data);  // 返回 HTML 文件内容
  });
}
