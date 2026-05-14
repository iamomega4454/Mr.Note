# Mr.Note

Mr.Note is a full-stack note and file vault built with React, Vite, Node.js, Express, and MongoDB. It supports nested folders, subfolders, file uploads, vault search, and PIN-protected management actions for sensitive operations.

## Features

- Create folders at the root level or inside any folder
- Create unlimited nested subfolders
- Upload files into the current folder
- Rename and delete folders and files
- Browse folder hierarchy from the sidebar
- Search files and folders across the vault
- PIN-protected create, rename, upload, and delete actions
- Recent files panel for quick access

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Zustand, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, Multer

## Project Structure

```text
Mr.Note/
├─ client/   # React + Vite frontend
├─ server/   # Express + MongoDB backend
└─ README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/iamomega4454/Mr.Note.git
cd Mr.Note
```

### 2. Install dependencies

Install dependencies in both apps:

```bash
cd client
npm install
cd ../server
npm install
```

### 3. Configure environment variables

Create a `server/.env` file from `server/.env.example`.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notevault
CLIENT_URL=http://localhost:5173
OWNER_PIN=004454
```

## Run the App

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Frontend:
`http://localhost:5173`

Backend:
`http://localhost:5000`

## Available Scripts

### Client

```bash
npm run dev
npm run build
npm run preview
```

### Server

```bash
npm run dev
npm run start
```

## Security Note

Owner-restricted actions require the configured `OWNER_PIN`. Do not commit your real `.env` file to GitHub.

## Future Improvements

- User authentication and accounts
- Role-based access control
- File previews
- Drag-and-drop uploads
- Folder move UI
- Better validation and activity logs

## License

This project is for personal and educational use unless you add your own license.
