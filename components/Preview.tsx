import React from 'react';
import ReactMarkdown from 'react-markdown';

const Preview: React.FC<{ content: string }> = ({ content }) => {
    return (
        <div style={{
            boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.2)",
            padding: "2.54cm",
            backgroundColor: "white",
            width: "21cm",
            minHeight: "29.7cm",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
            transform: "scale(0.75)",
            transformOrigin: "top left",
        }}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};

export default Preview;
