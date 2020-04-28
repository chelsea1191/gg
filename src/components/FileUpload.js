import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = ({ auth }) => {
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { url, original_filename } = res.data.result;
      setUploadedFile({ url, original_filename });
      setMessage('File Uploaded');
      setFileName('Choose file');
      const updatedAuth = { ...auth, avatar: url };
      console.log(updatedAuth);
      axios.put(`/api/users/${auth.id}`, updatedAuth);
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };
  return (
    <Fragment>
      {uploadedFile ? (
        <div id="uploadedFile">
          <h3 className="text-center">{uploadedFile.original_filename}</h3>
          <img src={uploadedFile.url} className="userProfileImage" />
        </div>
      ) : null}
      {message ? (
        <div
          className="alert alert-secondary alert-dismissible fade show"
          role="alert"
        >
          {message}
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      ) : null}
      <form onSubmit={onSubmit} className="fileUpload">
        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
        </div>
        <input
          type="submit"
          value="Upload"
          className="btn button mt-1"
          id="submitImageButton"
        />
      </form>
    </Fragment>
  );
};

export default FileUpload;
