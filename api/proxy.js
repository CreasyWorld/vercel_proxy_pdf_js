// /api/proxy.js
export default async function handler(req, res) {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).send("Missing URL");
  }

  try {
    // 请求 PDF 文件，设置不自动跟随重定向
    const fetchRes = await fetch(fileUrl, {
      method: "GET",
      redirect: "manual",  // 不自动跟随重定向
    });

    // 如果是 302 或 其他 3xx 状态码，检查 Location 头，手动重定向
    if (fetchRes.status >= 300 && fetchRes.status < 400) {
      const redirectUrl = fetchRes.headers.get('Location');
      if (redirectUrl) {
        console.log(`Redirecting to: ${redirectUrl}`);
        // 如果遇到重定向，直接重定向到新的 URL
        return res.redirect(redirectUrl);
      } else {
        return res.status(fetchRes.status).send("No redirect URL found in Location header");
      }
    }

    // 如果请求失败
    if (!fetchRes.ok) {
      return res.status(fetchRes.status).send("Failed to fetch PDF" + fetchRes.status);
    }

    // 设置响应头，返回 PDF 文件内容
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Access-Control-Allow-Origin", "*");  // CORS 支持

    // 将 PDF 数据流直接返回
    fetchRes.body.pipeTo(res);
  } catch (err) {
    // 捕获任何错误并返回
    res.status(500).send("Proxy error: " + err.message);
  }
}
