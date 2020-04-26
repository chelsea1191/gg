import React, { Fragment, useState } from 'react';
import axios from 'axios';

const FileUpload = ({ auth }) => {
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState('');

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
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
          setTimeout(() => setUploadPercentage(''), 3000);
        },
      });
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      setMessage('File Uploaded');
      const updatedAuth = { ...auth, avatar: filePath };
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

        {/* {uploadPercentage !== '' ? (
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped bg-secondary"
              role="progressbar"
              style={{ width: `${uploadPercentage}%` }}
            >
              {uploadPercentage}%
            </div>
          </div>
        ) : null} */}

        <input
          type="submit"
          value="Upload"
          className="btn button mt-1"
          id="submitImageButton"
        />
      </form>

      {uploadedFile ? (
        <div>
          <h3 className="text-center">{uploadedFile.fileName}</h3>
          <img src={uploadedFile.filePath} className="userProfileImage" />
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
