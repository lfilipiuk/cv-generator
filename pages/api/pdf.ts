import { NextApiRequest, NextApiResponse } from 'next';
import markdownIt from 'markdown-it';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

const md = markdownIt();

const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const html = md.render(req.body.text);

    // Include CSS styles
    const cssPath = path.join(process.cwd(), 'public', 'resume.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    const fullHtml = `
        <style>
            ${cssContent}
        </style>
        ${html}
    `;

    try {
        const api2pdfResponse = await fetch('https://v2.api2pdf.com/chrome/pdf/html', {
            method: 'POST',
            headers: {
                'Authorization':  process.env.API2PDF_KEY as string,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                html: fullHtml,
                inline: false,
                fileName: 'cv.pdf',
                options: {
                    delay: 0,
                    puppeteerWaitForMethod: "WaitForNavigation",
                    puppeteerWaitForValue: "Load",
                    usePrintCss: true,
                    landscape: false,
                    printBackground: true,
                    displayHeaderFooter: false,
                    headerTemplate: "<span></span>",
                    footerTemplate: "<span></span>",
                    width: "8.27in",
                    height: "11.69in",
                    marginTop: ".4in",
                    marginBottom: ".4in",
                    marginLeft: ".4in",
                    marginRight: ".4in",
                    pageRanges: "1-10000",
                    scale: 1,
                    omitBackground: false
                }
                // No need to specify storage options unless you want to use custom storage.
            })
        });

        const jsonResponse = await api2pdfResponse.json() as { FileUrl: string };
        return res.status(200).json({ FileUrl: jsonResponse.FileUrl });

        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default handler;
