// /api/proxy.js
import https from "https";

export default async function handler(req, res) {
	
	const arr = req.url.split("/api/pdf/");
	
	if(arr.length < 1) {
		return res.status(400).send("Missing URL");
	}
	
	let fileUrl = arr[1];

	if (!fileUrl) {
		return res.status(400).send("Missing URL");
	}
	const range = req.headers["Range"] || req.headers["range"];
	console.log(range);
	fileUrl = decodeURIComponent(fileUrl);
	console.log(fileUrl);
	try {

		https.get(fileUrl, (remoteRes) => {

			if (remoteRes.statusCode >= 300 && remoteRes.statusCode < 400) {
				const location = remoteRes.headers["Location"] || remoteRes.headers["location"];

				if (location) {

					let headers = {};
					if(range) {
						headers.Range = range;
					}

					https.get(location, {headers}, (remoteRes_1) => {
						// 设置状态码和关键头
						res.status(remoteRes_1.statusCode);
						Object.keys(remoteRes_1.headers).forEach((key) => {
							res.setHeader(key, remoteRes_1.headers[key]);
						});
						remoteRes_1
							.on("error", (err) => {
								console.error("Remote fetch error:", err);
								res.status(500).end("Download failed");
							})
							.pipe(res);
					});
					return ;
				}
			}

			// 设置状态码和关键头
			res.status(remoteRes.statusCode);
			Object.keys(remoteRes.headers).forEach((key) => {
				res.setHeader(key, remoteRes.headers[key]);
			});
			remoteRes
				.on("error", (err) => {
					console.error("Remote fetch error:", err);
					res.status(500).end("Download failed");
				})
				.pipe(res);
		});

		// const response = await fetch(fileUrl, {
		//   method: 'GET',
		//   headers: {
		// 	'User-Agent': 'Mozilla/5.0',
		// 	// 可以加入身份验证信息等头部
		//   },
		// });
		//
		// if (!response.ok) {
		//   return res.status(400).send("获取pdf错误: " + response.status + " url: " + fileUrl);
		// }
		//
		// if (response.status === 302) {
		//   const newUrl = response.headers.get('location'); // 获取重定向的 URL
		//
		//   if (newUrl) {
		// 	// 使用 302 跳转到新 URL
		// 	return res.redirect(302, '/api/pdf?url=' + newUrl);
		//   } else {
		// 	res.status(400).send('Redirect URL not found');
		//   }
		// }
		//
		// // 使用 arrayBuffer() 获取文件的二进制数据
		// const arrayBuffer = await response.arrayBuffer();
		//
		// // 将 ArrayBuffer 转为 Buffer，并返回文件
		// const buffer = Buffer.from(arrayBuffer);
		//
		// // 设置响应头，返回 PDF 文件
		// res.setHeader('Content-Type', 'application/pdf');
		// res.setHeader('Content-Disposition', 'attachment; filename="downloaded.pdf"');
		// res.status(200).send(buffer);  // 返回 PDF 文件内容

	} catch (error) {
		console.error('Error fetching PDF:', error);
		res.status(400).json({ error: 'Failed to proxy PDF', details: error.message });
	}
}
