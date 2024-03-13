import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import { API } from '../../config/config'

import { Typography } from '@mui/material'


const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [status, setStatus] = useState("");
    const [totalChunks, settotalChunks] = useState(0)
    const [Progress, setProgress] = useState(0)
    const [Resuming, setResuming] = useState(false)

    let chunkNumber = useRef(0);
    let start = useRef(0);
    let end = useRef(0);
    let isPaused = useRef(false);

    const chunkSize = 5 * 1024 * 1024; // 5MB (adjust based on your requirements)

    // update the totalChunks based on the selected file size
    useEffect(() => {
        if (selectedFile) {
            settotalChunks(Math.ceil(selectedFile.size / chunkSize));
            start.current = 0;
            // Update this line to ensure the correct end point for the first chunk
            end.current = Math.min(chunkSize, selectedFile.size);
        }
    }, [selectedFile]);



    // adding or changing teh file func
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    // cconnection troubles handling
    const handleNetworkError = () => {
        setStatus("Network error, waiting to resume...");

        const retryUpload = () => {
            window.removeEventListener('online', retryUpload); // Remove listener once back online
            setStatus("Resuming upload...");
            uploadNextChunk(); // Try to upload the current chunk again
        };

        window.addEventListener('online', retryUpload); // Listen for when the connection comes back
    };

    // upload a chunck 
    const uploadNextChunk = () => {
        if (!selectedFile || isPaused.current) {
            return;
        }

        // Ensure this update is made before slicing the chunk
        end.current = Math.min(start.current + chunkSize, selectedFile.size);

        if (end.current <= selectedFile.size) {
            const chunk = selectedFile.slice(start.current, end.current);
            const formData = new FormData();
            formData.append("file", chunk);
            formData.append("chunkNumber", chunkNumber.current);
            formData.append("totalChunks", totalChunks);
            formData.append("originalname", selectedFile.name);

            var config = {
                method: 'post',
                url: `${API}/upload/v1`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    const chunkProgress = (progressEvent.loaded / progressEvent.total) * (100 / totalChunks);
                    setProgress(prevProgress => prevProgress + chunkProgress);
                }
            };

            axios(config)
                .then(async (response) => {
                    console.log({ data: response.data });
                    const temp = `Chunk ${chunkNumber.current + 1}/${totalChunks} uploaded successfully`;
                    setStatus(temp);

                    chunkNumber.current = chunkNumber.current + 1;
                    start.current = end.current;
                    end.current = start.current + chunkSize;

                    setTimeout(() => {
                        if (!isPaused.current) {
                            uploadNextChunk();
                        }
                    }, 1000);

                }).catch((error) => {
                    console.error("Error uploading chunk:", error);
                    // Detect a network error
                    if (!error.response) {
                        handleNetworkError();
                    }
                });
        } else {
            setSelectedFile(null);
            setStatus("File upload completed");
        }
    };

    // pause the upload 
    const pauseTheUplaod = () => {
        console.log("pause");
        isPaused.current = true
        setResuming(true)
    }

    // resume the upload 
    const resumeTheUplaod = () => {
        console.log("resume");
        isPaused.current = false
        setResuming(false)
        uploadNextChunk()
    }



    return (
        <div className='page'>
            <Typography variant='h4' component="h1">uplaod page</Typography>
            <br />
            <input type="file" onChange={handleFileChange} />
            <br />
            <button disabled={!selectedFile} onClick={uploadNextChunk}>Upload File</button>
            <br />
            <button disabled={Resuming || !selectedFile} onClick={pauseTheUplaod}>Pause</button>
            <br />
            <button disabled={!Resuming} onClick={resumeTheUplaod}>Resume</button>
            <br />
            <h3>{status}</h3>
            <br />
            <h4>Upload Progress: {parseInt(Progress)}%</h4>
        </div>
    )
}

export default Upload