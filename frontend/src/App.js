import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.png';
import { ClipLoader } from 'react-spinners';
import './App.css';

function App() {
    const projectLinkInputRef = useRef(null);

    const [formData, setFormData] = useState({
        projectLink: '',
        maxAlive: '3 hours',
        maxMemory: '4 Gi',
        maxCpu: '2 core'
    });

    const [response, setResponse] = useState(null);
    const [workspaceUrl, setWorkspaceUrl] = useState(null);
    const [workspacePassword, setWorkspacePassword] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    useEffect(() => {
        // Focus on the projectLink input when the component mounts
        if (projectLinkInputRef.current) {
            projectLinkInputRef.current.focus();
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFocus = (e) => {
        const { name, value } = e.target;
        setFocusedInput(name);
        if (name === 'maxAlive' && value === '3 hours') {
            setFormData({ ...formData, [name]: '' });
        }
        if (name === 'maxMemory' && value === '4 Gi') {
            setFormData({ ...formData, [name]: '' });
        }
        if (name === 'maxCpu' && value === '2 core') {
            setFormData({ ...formData, [name]: '' });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setFocusedInput(null);
        if (name === 'maxAlive' && value === '') {
            setFormData({ ...formData, [name]: '3 hours' });
        }
        if (name === 'maxMemory' && value === '') {
            setFormData({ ...formData, [name]: '4 Gi' });
        }
        if (name === 'maxCpu' && value === '') {
            setFormData({ ...formData, [name]: '2 core' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/createPod', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResponse(data.result);
            setWorkspaceUrl(data.workspaceUrl);
            setWorkspacePassword(data.workspacePassword);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to create workspace');
            setResponse(null);
        } finally {
            setLoading(false);
        }
    };

    const handleShowInput = () => {
        setIsInputVisible(true);
        if (projectLinkInputRef.current) {
            projectLinkInputRef.current.focus();
        }
    };

    const handleHideInput = () => {
        setIsInputVisible(false);
        if (projectLinkInputRef.current) {
            projectLinkInputRef.current.focus();
        }
    };

    const handleRepoAddressClick = () => {
        if (projectLinkInputRef.current) {
            projectLinkInputRef.current.focus();
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="container">
                    <div className="mb-5">
                        <img src={logo} alt="Logo" className='logo-image'/>
                        <h1>On The Fly</h1>
                    </div>
                    <div className='row'>
                        <form onSubmit={handleSubmit} className="form-horizontal">
                            <div className={`col-md-6 mx-auto ${isInputVisible ? 'mb-3' : ''} form-group position-relative`}>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="projectLinkInput"
                                    name="projectLink"
                                    placeholder="Git Repository Link, for example: git@github.com:mlkmhd/hekura.git"
                                    value={formData.projectLink}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    ref={projectLinkInputRef} // Ref added here
                                    required
                                />
                                {(formData.projectLink || focusedInput === 'projectLink') && (
                                    <label htmlFor="projectLinkInput" className="floating-label" onClick={handleRepoAddressClick}>Repo Address:</label>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-9 d-flex justify-content-end">
                                    {!isInputVisible && (
                                        <h6 onClick={handleShowInput} style={{ cursor: 'pointer', color: 'darkgray' }}>
                                            Show more options
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                                            </svg>
                                        </h6>
                                    )}
                                </div>
                            </div>
                            {isInputVisible && (
                                <div className='input'>
                                    <div className="col-md-6 mx-auto mb-3 form-group position-relative">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="maxAlive"
                                            name="maxAlive"
                                            placeholder="Max Alive Duration, for example: 3 hours"
                                            value={formData.maxAlive}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            required
                                        />
                                        {(formData.maxAlive || focusedInput === 'maxAlive') && (
                                            <label htmlFor="maxAlive" className="floating-label">Max Alive:</label>
                                        )}
                                    </div>
                                    <div className="col-md-6 mx-auto mb-3 form-group position-relative">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="maxMemory"
                                            name="maxMemory"
                                            placeholder="Max Memory, for example: 4 Gi"
                                            value={formData.maxMemory}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            required
                                        />
                                        {(formData.maxMemory || focusedInput === 'maxMemory') && (
                                            <label htmlFor="maxMemory" className="floating-label">Max Memory:</label>
                                        )}
                                    </div>
                                    <div className="col-md-6 mx-auto mb-3 form-group position-relative">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="maxCpu"
                                            name="maxCpu"
                                            placeholder="Max CPU, for example: 2 core"
                                            value={formData.maxCpu}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            required
                                        />
                                        {(formData.maxCpu || focusedInput === 'maxCpu') && (
                                            <label htmlFor="maxCpu" className="floating-label">Max CPU:</label>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-9 d-flex justify-content-end">
                                            <h6 onClick={handleHideInput} style={{ cursor: 'pointer', color: 'darkgray' }}>
                                                Hide options
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
                                                </svg>
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="col-md-6 mx-auto mb-3">
                                <button type="submit" className="btn btn-primary">Create Workspace</button>
                            </div>
                        </form>

                        {loading ? (
                            <div className="d-flex justify-content-center">
                                <ClipLoader color="#00BFFF" loading={loading} size={50} />
                            </div>
                        ) : (
                            <>
                                {error && <p className="text-danger">{error}</p>}
                                {response && (
                                    <div className='row'>
                                        <p className="text-success">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square-fill" viewBox="0 0 16 16">
                                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.906 4.094a.5.5 0 0 1 .638.768l-4.5 6a.5.5 0 0 1-.768.05l-2-2a.5.5 0 0 1 .768-.638l1.614 1.614 3.864-5.152a.5.5 0 0 1 .076-.078z"/>
                                            </svg> Workspace created successfully!
                                        </p>
                                        <div className="col-md-6 mx-auto mb-3">
                                            <div className="form-group">
                                                <label>Workspace URL:</label>
                                                <input type="text" className="form-control" value={workspaceUrl} readOnly />
                                            </div>
                                            <div className="form-group">
                                                <label>Password:</label>
                                                <input type="text" className="form-control" value={workspacePassword} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
