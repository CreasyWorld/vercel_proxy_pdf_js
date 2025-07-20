// /api/proxy.js
export default async function handler(req, res) {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).send("Missing URL");
  }

  console.log('Attempting to fetch PDF from:', fileUrl); // 打印请求的 URL

  try {
    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        // 可以加入身份验证信息等头部
      },
    });

    console.log('Response status:', response.status); // 打印目标服务器的返回状态

    if (!response.ok) {
      console.log('Response status text:', response.statusText); // 打印错误信息
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    // 使用 arrayBuffer() 获取文件的二进制数据
    const arrayBuffer = await response.arrayBuffer();

    // 将 ArrayBuffer 转为 Buffer，并返回文件
    const buffer = Buffer.from(arrayBuffer);

    // 设置响应头，返回 PDF 文件
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="downloaded.pdf"');
    res.status(200).send(buffer);  // 返回 PDF 文件内容

  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(400).json({ error: 'Failed to proxy PDF', details: error.message });
  }
}
