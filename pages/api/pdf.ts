import { NextApiRequest, NextApiResponse } from 'next';
import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import fetch from 'node-fetch';

const handler =  async (req: NextApiRequest, res: NextApiResponse) => {

    const response = await fetch('https://cv.lukaszfilipiuk.com/api/markdownToHtml', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: req.body.text }),
    });

    const { html: fullHtml } = await response.json();

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
