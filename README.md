# File Uploader

A simple drag-and-drop file uploader with **Node.js backend** and **AWS S3 storage**. Supports file type and size validation, upload progress, and displays clickable S3 links after upload.

[Live Demo](http://simple-file-uploader-sushan.s3-website.ap-south-1.amazonaws.com/)

---

## Features

* Drag & drop or select multiple files
* File type restrictions: `.txt`, `.jpeg`, `.jpg`, `.png`
* Maximum file size: 5 MB per file
* Real-time upload progress bar
* Displays uploaded file link after successful upload
* Metadata logging (original filename, upload timestamp)
* Backend powered by Node.js + Express
* Files stored on AWS S3

---

## Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express, Multer
* **Storage:** AWS S3
* **Other:** AWS SDK v3, dotenv, CORS

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd FileUploader-Backend
```

2. Install backend dependencies:

```bash
npm install
```

3. Create a `.env` file in `FileUploader-Backend`:

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name
PORT=3000
```

4. Start the backend server:

```bash
node index.js
```

5. Open `index.html` in your browser or host it via a simple web server.

---

## Usage

1. Drag & drop files or click **Choose files**.
2. Files will be validated for type and size.
3. Click **Upload All** to upload files to S3.
4. Uploaded files will display clickable links pointing to S3.

---

## Folder Structure

```
FileUploader-Backend/
├── node_modules/
├── .env
├── index.js          # Backend server
├── package.json
├── package-lock.json
FileUploader-Frontend/
├── index.html        # Frontend UI
├── styles.css
├── index.js          # Frontend JS logic
```

---

## Notes

* Ensure **CORS** is enabled on the S3 bucket or backend for cross-origin requests.
* The backend currently uses presigned URLs or public-read objects for S3 access.
* `.env` and `node_modules/` are ignored in git.

---

## Live Demo

[Click here to access the live uploader](http://simple-file-uploader-sushan.s3-website.ap-south-1.amazonaws.com/)

---
