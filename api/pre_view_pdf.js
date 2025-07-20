// /api/proxy.js
export default async function handler(req, res) {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).send("Missing URL");
  }

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

    if (response.status === 302) {
      const newUrl = response.headers.get('location'); // 获取重定向的 URL

      if (newUrl) {
        // 使用 302 跳转到新 URL
        return res.redirect(302, '/web/viewer.html?file=https://vercel-proxy-pdf-js.vercel.app/api/pdf_base64?url=' + encodeURIComponent(btoa(newUrl)));
      } else {
        res.status(400).send('Redirect URL not found');
      }
    } else {
      // 如果不是 302 状态，直接返回其他响应或处理错误
      return res.redirect(302, '/web/viewer.html?file=https://vercel-proxy-pdf-js.vercel.app/api/pdf_base64?url=' + encodeURIComponent(btoa(fileUrl)));
    }

  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(400).json({ error: 'Failed to proxy PDF' + req.url, details: error.message });
  }
}
