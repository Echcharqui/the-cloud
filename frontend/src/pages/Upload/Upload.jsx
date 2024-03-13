import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { API } from '../../config/config'

const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [chunks, setChunks] = useState([]);
    const [Progress, setProgress] = useState(0)

    const [status, setStatus] = useState("");

    const CHUNK_SIZE = 5 * 1024 * 1024
    const currentChunkIndex = useRef(0)
    const isPaused = useRef(false)


    const splitFileIntoChunks = () => {
        let chunks = [];
        for (let i = 0; i < file.size; i += CHUNK_SIZE) {
            const chunk = file.slice(i, i + CHUNK_SIZE);
            chunks.push(chunk);
        }
        return chunks;
    };

    const handelFileChanges = (event) => {
        const file = event.target.files[0];
        setFile(file)
    }


    const handleUploadClick = () => {
        uploadChunk(chunks[0], 0);
    }

    useEffect(() => {
        if (file) {
            console.log(file);
            const fileChunks = splitFileIntoChunks();
            console.log(fileChunks);
            setChunks(fileChunks);
            setUploading(true);
        }
    }, [file])


    const uploadChunk = (chunk, index) => {
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("chunkNumber", currentChunkIndex.current);
        formData.append("totalChunks", chunks.length);
        formData.append("originalname", file.name);


        var config = {
            method: 'post',
            url: `${API}/upload/v1`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                const chunkProgress = (progressEvent.loaded / progressEvent.total) * (100 / chunks.length);
                setProgress(prevProgress => prevProgress + chunkProgress);
            }
        };

        axios(config)
            .then(response => {

                console.log({ data: response.data });
                const temp = `Chunk ${currentChunkIndex.current + 1}/${chunks.length} uploaded successfully`;
                setStatus(temp);

                if (index + 1 < chunks.length) {

                    setTimeout(() => {
                        if (!isPaused.current) {
                            currentChunkIndex.current = index + 1
                            uploadChunk(chunks[index + 1], index + 1);
                        }
                    }, 1000);

                } else if (index + 1 === chunks.length) {
                    console.log({ data: response.data });
                    const temp = `Upload complete`;
                    setUploading(false);
                    setStatus(temp);
                }
            })
            .catch(error => {
                console.error(`Error uploading chunk ${index + 1}:`, error);
                setUploading(false);
            });
    };



    const handlePauseClick = () => {
        isPaused.current = true
    };

    const handleResumeClick = () => {
        if (isPaused && currentChunkIndex.current < chunks.length) {
            isPaused.current = false
            uploadChunk(chunks[currentChunkIndex.current], currentChunkIndex.current);
        }
    };

    return (
        <div className='page'>
            <input
                type="file"
                onChange={handelFileChanges}
            // disabled={uploading}
            />
            <br />
            <button onClick={handleUploadClick} >Upload</button>
            <br />
            <button onClick={handlePauseClick} >Pause</button>
            <br />
            <button onClick={handleResumeClick}  >Resume</button>
            <br />
            <h3>{status}</h3>
            <br />
            <h4>Upload Progress: {parseInt(Progress)}%</h4>
        </div>
    );
};

export default FileUploader;
