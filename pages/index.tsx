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
            const response = await axios.post('https://cv.lukaszfilipiuk.com/api/pdf', { text }, { responseType: 'blob' });
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

            const downloadLink = URL.createObjectURL(pdfBlob);
            window.open(downloadLink, "_blank");
        } catch (err) {
            // @ts-ignore
            setError(err.message);
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
