import { NextApiRequest, NextApiResponse } from 'next';
import markdownIt from 'markdown-it';
import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

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

    let browser = null;
    try {
        // Here's the change. We're setting up Puppeteer to use the Chrome binary from chrome-aws-lambda
        browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        });

        const page = await browser.newPage();
        await page.setContent(fullHtml);
        const pdf = await page.pdf({ format: 'letter' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');

        return res.send(pdf);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        // Make sure to always close the browser
        if (browser) {
            await browser.close();
        }
    }
};

export default handler;
