// /api/proxy.js
export default async function handler(req, res) {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    res.status(400).send("Missing URL");
    return;
  }

  try {
    // 直接请求 PDF 文件，不跟随 302/301 重定向
    const fetchRes = await fetch(fileUrl, {
      method: "GET",
      redirect: "manual", // 设置不跟随重定向
    });

    // 如果响应是 3xx 重定向
    if (fetchRes.status >= 300 && fetchRes.status < 400) {
      return res.status(fetchRes.status).send("Redirect detected");
    }

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).send("Failed to fetch PDF" + fetchRes.status);
    }

    // 设置响应头，以 PDF 形式返回数据
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Access-Control-Allow-Origin", "*"); // 允许跨域访问

    // 将 PDF 文件流转发到客户端
    fetchRes.body.pipeTo(res);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
