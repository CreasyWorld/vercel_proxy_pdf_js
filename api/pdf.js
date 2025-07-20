// /api/proxy.js
export default async function handler(req, res) {
	
	const arr = req.url.split("/api/pdf?url=");
	
	if(arr.length < 1) {
		return res.status(400).send("Missing URL");
	}
	
	let fileUrl = arr[1];

	if (!fileUrl) {
		return res.status(400).send("Missing URL");
	}

	fileUrl = decodeURIComponent(fileUrl);

	try {
		const response = await fetch(fileUrl, {
		  method: 'GET',
		  headers: {
			'User-Agent': 'Mozilla/5.0',
			// 可以加入身份验证信息等头部
		  },
		});

		if (!response.ok) {
		  return res.status(400).send("获取pdf错误: " + response.status);
		}
		
		if (response.status === 302) {
		  const newUrl = response.headers.get('location'); // 获取重定向的 URL

		  if (newUrl) {
			// 使用 302 跳转到新 URL
			return res.redirect(302, '/api/pdf?url=' + newUrl);
		  } else {
			res.status(400).send('Redirect URL not found');
		  }
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
