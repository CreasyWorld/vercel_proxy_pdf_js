// /api/proxy.js
export default async function handler(req, res) {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    res.status(400).send("Missing URL");
    return;
  }

  try {
    const fetchRes = await fetch(fileUrl, {
      method: "GET",
      redirect: "follow", // 跟随 302
    });

    if (!fetchRes.ok) {
      res.status(fetchRes.status).send("Failed to fetch target PDF");
      return;
    }

    // 设置响应类型为 PDF
    res.setHeader("Content-Type", "application/pdf");

    // 添加 CORS 支持
    res.setHeader("Access-Control-Allow-Origin", "*");

    // 流式转发 PDF 内容
    const reader = fetchRes.body;
    if (!reader) {
      return res.status(500).send("Empty response");
    }

    reader.pipeTo(res);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
