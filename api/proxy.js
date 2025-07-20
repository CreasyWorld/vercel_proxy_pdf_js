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

    const pdfBuffer = await response.buffer();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="downloaded.pdf"');
    res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(400).json({ error: 'Failed to proxy PDF', details: error.message });
  }
}
