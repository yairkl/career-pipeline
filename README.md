# CareerPipeline

🚀 **Automate, tailor, and deploy your CV with GitHub Actions and AI.**

CareerPipeline is an open-source template that treats your resume as **"Content as Code"**, using GitHub Actions as the CI/CD engine and LLMs (Google Gemini) as the intelligent transformation layer. It now includes a **Dynamic Interactive Portfolio** to showcase your work beautifully and manage it via an admin dashboard.

---

## Quick Start

### 1. Use This Repository as a template for your own career pipeline.

click the "Use this template" button at the top of the repo to create your own copy.

### 2. Set Up Secrets

Go to **Settings > Secrets and variables > Actions** and add:

- `GEMINI_API_KEY`: Get it from [Google AI Studio](https://ai.google.dev/)

### 3. Allow github actions to create pull requests

Go to **Settings > Actions > General** and under "Pull request permissions" select "Read and write".

### 3. Edit Your CV

Update [CV.md](CV.md) with your professional information. This is your "master resume" — the source of truth for all tailored versions.

### 4. Start an Application

1. Go to **Issues** tab
2. Click **New Issue**
3. Select the **"New Application"** template
4. Fill in:
   - Company name
   - Job role
   - Full job description
5. Click **Submit new issue**

The pipeline will automatically:
- 🤖 Use AI to tailor your CV to the job
- 📝 Create a draft PR with the tailored version
- 📄 Generate a PDF
- 🔄 Allow you to iterate with comments

---

## Architecture

```
User Opens Issue
       ↓
Tailor Workflow Triggered
       ↓
Python Script Calls Gemini API
       ↓
LLM Tailors CV to Job Description
       ↓
Draft PR Created with Tailored CV
       ↓
PDF Generated & Attached
       ↓
User Reviews & Iterates
       ↓
Merge to Master → Deploy to GitHub Pages & Portfolio
```

### Portfolio Architecture
The portfolio is a standalone React application that serves as your public-facing brand.
- **Dynamic Content**: Powered by Firebase (Firestore + Storage).
- **Admin Dashboard**: Securely manage projects, skills, and bio via `/login`.
- **Self-Service**: Reusable by anyone by simply changing Firebase environment variables.

---

## File Structure

```
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── new_application.md      # Standardized job application form
│   ├── scripts/
│   │   ├── tailor_engine.py        # LLM orchestration (brain)
│   │   └── utils.py                # Helper functions
│   └── workflows/
│       ├── tailor.yml              # Issue → PR workflow
│       ├── document-gen.yml        # MD → PDF conversion
│       └── web-deploy.yml          # Deploy to GitHub Pages
├── CV.md                           # Your master resume
├── assets/
│   └── style.css                   # Styling for PDF & web
├── .env.example                    # Environment template
├── requirements.txt                # Python dependencies
└── README.md                       # This file
```

---

## How It Works

### Phase 1: Ingestion (You)
You open an Issue with a job description.

### Phase 2: Transformation (AI)
The **Tailor Engine** uses Google's Gemini API to:
- Analyze your master CV
- Extract keywords from the job description
- Rewrite your experience to highlight relevant skills
- Maintain truthfulness (no hallucinations)

### Phase 3: Staging (Git)
A new branch (`tailor/issue-number`) is created with the tailored CV.
A draft PR is opened for review.

### Phase 4: Formatting (PDF)
A PDF is automatically generated and attached to the PR.

### Phase 5: Iteration (You)
You can:
- Comment on the PR with refinements
- Request emphasis on specific skills
- The system can be extended to auto-update based on comments

### Phase 6: Deployment (CI/CD)
Merge the PR to `master` → CV auto-updates on your GitHub Pages portfolio.

---

## Security & Privacy

- **API Keys**: Stored in GitHub Secrets (never committed to repo)
- **Sensitive Data**: You can configure the system to "blind" fields like phone/address in the public web version while keeping them in PDFs
- **Local Control**: Everything runs on your GitHub account

---

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY=your_api_key_here
```

For GitHub Actions, add these as **Secrets** (Settings → Secrets and variables).

---

## Customization

### 1. Update Your CV Template
Edit [CV.md](CV.md) with your actual experience, skills, and education.

### 2. Customize Styling
Modify [assets/style.css](assets/style.css) for PDF and web appearance.

### 3. Adjust the Tailor Prompt
Edit the `create_system_prompt()` method in [.github/scripts/tailor_engine.py](.github/scripts/tailor_engine.py) to change how the AI tailors your CV.

### 4. Enable GitHub Pages
Go to **Settings > Pages** and set the source to `gh-pages` branch.

---

## Interactive Portfolio Setup (New!)

The `portfolio/` directory contains a high-end React template that connects to Firebase for dynamic management.

### 1. Firebase Setup
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore**, **Authentication** (Google), and **Storage**.
3. In Project Settings, add a **Web App** and copy the configuration.

### 2. Configure Portfolio
1. Create `portfolio/.env` (copy from `portfolio/.env.example`).
2. Fill in your Firebase config keys.

### 3. Deploy Infrastructure
```bash
cd portfolio
npm install
firebase login
firebase use --add [your-project-id]
firebase deploy --only firestore,storage
```

### 4. Fix CORS (One-time)
To allow local uploads, run:
```bash
gsutil cors set storage_cors.json gs://[your-bucket-name]
```

### 5. Launch & Manage
Run `npm run dev` and navigate to `/login` to start building your professional showcase!

---

## Roadmap (V2.0)

- [ ] Support for multiple LLM providers (OpenAI, Claude)
- [ ] Comment-based iteration (e.g., `/action Emphasize Python skills`)
- [ ] Email notifications for completed PRs
- [ ] Web UI for managing applications
- [ ] Export tailored CVs to Word/Google Docs
- [ ] Analytics on application performance

---

## Contributing

Found a bug or have a feature idea? Open an Issue or submit a PR!

---

## License

MIT License — Feel free to fork and customize for your needs.

---

## Support

Need help? Check the [Issues](../../issues) section or create a new one.

**Happy job hunting! 🎯**


5. **Using the Template**: 
   - Open an issue with a job description using the provided template in `.github/ISSUE_TEMPLATE/new_application.md`.
   - The system will automatically generate a tailored CV and create a draft pull request for your review.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- Thanks to the open-source community for their contributions and support.
- Special thanks to the developers of the LLM APIs used in this project.