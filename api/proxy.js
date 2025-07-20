// /api/proxy.js
export default async function handler(req, res) {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).send("Missing URL");
  }

  try {
    const response = await fetch(fileUrl);
    const pdfBuffer = await response.buffer();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(400).json({ error: 'PDF fetch failed' });
  }
}
