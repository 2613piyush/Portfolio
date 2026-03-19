# Portfolio Contact Form Setup

This project now includes a Node.js backend to handle contact form submissions via Gmail.

## Prerequisites

1.  **Node.js**: You must have Node.js installed on your computer.
    - Download it from [nodejs.org](https://nodejs.org/).
    - Verify installation by running `node -v` and `npm -v` in your terminal.

## Setup Instructions

1.  **Install Dependencies**:
    Open your terminal in the project folder and run:
    ```bash
    npm install express nodemailer cors dotenv
    ```

2.  **Configure Gmail**:
    - Follow the [Gmail App Password Setup Guide](file:///C:/Users/Pavilion/.gemini/antigravity/brain/c572ffd3-d467-482f-a2d3-64c7b1b2951c/gmail_setup_guide.md) to get your 16-character app password.
    - Open the `.env` file in this folder.
    - Replace `your-16-character-app-password` with your actual App Password (remove any spaces).

3.  **Run the Server**:
    In your terminal, run:
    ```bash
    node server.js
    ```
    You should see: `Server is running on http://localhost:5000`.

## Integration

- The frontend is already configured in `script.js` to send data to `http://localhost:5000/send-email`.
- Ensure the backend server is running while you test the form on your website.
