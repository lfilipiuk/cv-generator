// Editor.tsx
import React from 'react';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt();

interface EditorProps {
    value: string;
    onChange: (text: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
    return (
        <MarkdownEditor
            value={value}
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={({ html, text }) => { onChange(text) }}
            view={{ menu: false, md: true, html: false }
            }
        />
    );
};

export default Editor;
