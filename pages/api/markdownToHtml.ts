import { NextApiRequest, NextApiResponse } from 'next';
import markdownIt from 'markdown-it';
import path from 'path';
import fs from 'fs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    // Initialize markdownIt within the function
    const md = markdownIt();
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

    return res.status(200).json({ html: fullHtml });
};

export default handler;
