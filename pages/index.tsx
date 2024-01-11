import React, { useState } from "react";
import { Form, Button, Alert } from "antd";
import axios from "axios";
import Editor from "../components/Editor";
import Preview from "../components/Preview";

const Home: React.FC = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState("");

  const handleImageChange = async (e : any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // @ts-ignore
        setImage(reader.result); // This is now a Base64 string
      };
      reader.readAsDataURL(file);
    }
  };


  const generatePDF = async () => {
    try {
      const payload = {
        text: text,
        image: image || null,
      };
      const response = await axios.post('/api/pdf', payload);
      if (response.data.FileUrl) {
        window.location.href = response.data.FileUrl; // This will trigger a download
      }
      setError("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  // @ts-ignore
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flex: 1 }}>
        <Form>
          <Editor value={text} onChange={(value: string) => setText(value)} />
          <Button onClick={generatePDF}>Generate PDF</Button>
          <div>
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </div>
        </Form>
        {error && <Alert message={error} type="error" />}
      </div>
      <div style={{ flex: 1 }}>
        <Preview content={text} image={image} />
      </div>
    </div>
  );
};

export default Home;
