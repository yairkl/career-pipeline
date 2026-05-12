# 🚀 Professional Interactive Portfolio Template

A high-end, editorial-style portfolio application designed for software engineers and creatives. This template is **fully dynamic**, meaning once setup is complete, you can manage 100% of your content (Bio, Skills, Experience, and Projects) through a secure Admin Dashboard without touching any code.

Built with **React 19**, **Tailwind CSS v4**, and **Firebase (Firestore + Storage + Auth)**.

---

## ✨ Features

- **🎨 Editorial Aesthetic**: Premium typography, glassmorphism, and responsive layouts inspired by high-end design systems.
- **🔐 Secure Admin Dashboard**: Manage your entire brand identity via a private `/login` route.
- **📦 Project Management**: Add, edit, and delete projects with support for images, icons, GitHub links, and live previews.
- **📈 Real-time Sync**: Changes made in the dashboard reflect instantly on the public site.
- **🖼️ Image Uploads**: Direct integration with Firebase Storage for profile pictures and project thumbnails.
- **👔 Career Journey**: Built-in sections for Employment History and Academic Foundation.

---

## ⚡ Quick Start: Deploy to GitHub Pages

This project is optimized for **GitHub Actions**. Follow these steps to get your portfolio live in minutes.

### 1. Firebase Cloud Setup
1.  Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Authentication** (Google & Email/Password), **Firestore**, and **Storage**.
3.  **Authorize Your Domain**:
    - In the Firebase Console, go to **Authentication > Settings > Authorized domains**.
    - Add your GitHub Pages domain (e.g., `yourusername.github.io`).
4.  Register a **Web App** in Project Settings and copy the configuration keys.

### 2. Configure GitHub Secrets
Production deployments use **GitHub Secrets** to keep your keys safe.
1. In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
2. Add the following secrets (copied from your Firebase Config):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 3. Activate GitHub Pages
1. Go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **"GitHub Actions"**.
3. Every push to the `master` branch will now automatically build and deploy your site.

---

## 🛠️ Infrastructure Setup

Before your first deployment, you must deploy the security rules to your Firebase project. You can do this in one of two ways:

### Option A: Via Firebase Console (No Install Needed)
1.  **Firestore**: Open [`portfolio/firestore.rules`](firestore.rules), copy the content, and paste it into the **Rules** tab of your Firestore Database in the Firebase Console. Click **Publish**.
2.  **Storage**: Open [`portfolio/storage.rules`](storage.rules), copy the content, and paste it into the **Rules** tab of your Storage section in the Firebase Console. Click **Publish**.

### Option B: Via Firebase CLI
1.  **Initialize**: `npm install -g firebase-tools` (if not already installed).
2.  **Login & Link**:
    ```bash
    firebase login
    firebase use --add [your-project-id]
    ```
3.  **Deploy**:
    ```bash
    firebase deploy --only firestore,storage
    ```

---

## 🔒 Security & Setup Mode

This portfolio is designed with a seamless but secure **Setup Mode**. It ensures that your database is tightly locked down without requiring you to manually configure user IDs or complex environment variables.

### How to Claim Your Portfolio
1. After deploying your site (or running it locally) and configuring Firebase, navigate to the `/admin` or `/login` route.
2. Sign in using your preferred Google account.
3. The system will detect that this is a fresh installation and present you with a **"Welcome Curator"** screen.
4. Click the **"Claim Portfolio"** button. This securely registers your specific Google account as the sole owner.
5. From this point forward, **only you** can edit the portfolio. Anyone else attempting to log in will be met with an "Access Denied" screen and promptly signed out.

### Resetting or Changing Ownership
If you ever need to transfer ownership or accidentally locked yourself out, you can reset the system by deleting the master configuration document directly in Firebase:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Firestore Database**.
3. Locate the `config` collection, and inside it, delete the `system` document.
4. The next person to log into the `/admin` portal will be prompted to claim the portfolio again.

---

## 📂 Project Structure

- `src/hooks/usePortfolioData.ts`: Central data hub and TypeScript interfaces.
- `src/pages/PublicPortfolio.tsx`: The high-end landing page.
- `src/pages/AdminDashboard.tsx`: Content management headquarters.
- `src/components/`: Reusable UI components (Modals, Layouts, Forms).

---

## 💻 Local Development (Optional)

If you wish to test or customize the application locally before pushing:

### 1. Environment Variables
Create a `portfolio/.env` file with your Firebase keys:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Run the App
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

### 3. Fix CORS for Local Uploads
To allow local development to upload images to Firebase Storage, run this from the `portfolio/` directory:
```bash
gsutil cors set storage_cors.json gs://[your-project-id].firebasestorage.app
```

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for the Developer Community.**
