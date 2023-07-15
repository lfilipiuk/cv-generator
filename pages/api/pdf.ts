import { NextApiRequest, NextApiResponse } from 'next';
import markdownIt from 'markdown-it';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const md = markdownIt();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' })
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
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(fullHtml);
        const pdf = await page.pdf({ format: 'Letter' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');

        return res.send(pdf);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
