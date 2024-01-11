import React from "react";
import ReactMarkdown from "react-markdown";

const Preview: React.FC<{ content: string; image: string }> = ({
  content,
  image,
}) => {
  // Split the content into pages
  const pages = content.split("<!-- newpage -->");

  return (
    <>
      {pages.map((pageContent, index) => (
        <div
          key={index}
          style={{
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
          }}
        >
          {index === 0 && image && (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={image} alt="Profile Photo" style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover' }} />
              </div>
          )}
          <div style={{ color: "black" }}>
            <style>
              {`
                                a {
                                    color: black !important;
                                }
                            `}
            </style>
            <ReactMarkdown>{pageContent}</ReactMarkdown>
          </div>
        </div>
      ))}
    </>
  );
};

export default Preview;
