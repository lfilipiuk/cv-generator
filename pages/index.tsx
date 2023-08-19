import { useState } from 'react';
import { Form, Button, Alert } from 'antd';
import axios from 'axios';
import Editor from '../components/Editor';
import Preview from '../components/Preview';

const Home: React.FC = () => {
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    const generatePDF = async () => {
        try {
            const response = await axios.post('/api/pdf', { text });
            if (response.data.FileUrl) {
                window.location.href = response.data.FileUrl;  // This will trigger a download
            }
        } catch (err : any) {
            setError(err.message || 'An error occurred');
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1 }}>
                <Form>
                    <Editor value={text} onChange={(value: string) => setText(value)} />
                    <Button onClick={generatePDF}>Generate PDF</Button>
                </Form>
                {error && <Alert message={error} type="error" />}
            </div>
            <div style={{ flex: 1 }}>
                <Preview content={text} />
            </div>
        </div>
    );
};

export default Home;
