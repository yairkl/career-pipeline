import os
import sys
import argparse
import json
from pathlib import Path

# Add scripts directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

import google.genai as genai
from dotenv import load_dotenv
from utils import parse_markdown_sections, save_markdown

load_dotenv()

class TailorEngine:
    """
    The TailorEngine uses Google's Gemini API to tailor a CV based on a job description.
    It enforces impact-driven language and prevents hallucinations through careful prompting.
    """
    
    def __init__(self, cv_path, api_key):
        self.cv_path = cv_path
        self.client = genai.Client(api_key=api_key)
        self.model_id = 'gemini-3.1-flash-lite'
            
    def load_cv(self):
        """Load the master CV from file."""
        with open(self.cv_path, 'r', encoding='utf-8') as file:
            return file.read()
    
    def create_system_prompt(self):
        """Create the system prompt that guides the LLM behavior."""
        return """You are an expert resume tailor. Your job is to rewrite CV sections to align with job descriptions while:
1. Extract the top 10 ATS keywords the recruiter will scan for in the job description and ensure they are prominently featured in the CV where relevant.
2. Keeping all information truthful and factual (no hallucinations)
3. Using impact-driven language (action verbs, quantified results, technical keywords)
4. Matching the target role's terminology and requirements
5. Preserving the original structure and markdown formatting
6. Only modifying content that is relevant to the JD

Do NOT invent skills, projects, or achievements not in the original CV.
DO emphasize existing experiences that match the target role."""
    
    def transform_cv(self, job_description):
        """
        Use the Gemini API to tailor the CV to the job description.
        Returns the tailored CV as a markdown string.
        """
        cv_content = self.load_cv()
        
        prompt = f"""{self.create_system_prompt()}

---

ORIGINAL CV:
{cv_content}

---

TARGET JOB DESCRIPTION:
{job_description}

---

Please tailor the CV above to align with the job description. 
Return ONLY the modified markdown CV, preserving the original structure.
Highlight keywords and experiences from the JD that match the candidate's background."""
        
        try:
            response = self.client.models.generate_content(
                            model=self.model_id,
                            contents=prompt
                        )
            return response.text
        except Exception as e:
            raise Exception(f"Error calling Gemini API: {str(e)}")
    
    def save_tailored_cv(self, tailored_cv, output_path):
        """Save the tailored CV to a file."""
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write(tailored_cv)
        print(f"✓ Tailored CV saved to {output_path}")

def main():
    """Main entry point for the tailor engine."""
    parser = argparse.ArgumentParser(description="Tailor CV to job description using LLM")
    parser.add_argument(
        "--cv",
        default="CV.md",
        help="Path to master CV file (default: CV.md)"
    )
    parser.add_argument(
        "--jd",
        required=True,
        help="Job description text"
    )
    parser.add_argument(
        "--output",
        "-o",
        default="CV.md",
        help="Output file for tailored CV (default: CV.md)"
    )
    parser.add_argument(
        "--title",
        help="Application title (e.g., 'Google - Alg Eng')"
    )
    
    args = parser.parse_args()
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    
    cv_path = args.cv
    if not Path(cv_path).exists():
        raise FileNotFoundError(f"CV file not found at {cv_path}")
    
    # Job description is always the content passed directly
    job_description = args.jd
    
    engine = TailorEngine(cv_path, api_key)
    if args.title:
        print(f"Tailoring CV for: {args.title}")
    
    tailored_cv = engine.transform_cv(job_description)
    engine.save_tailored_cv(tailored_cv, args.output)

if __name__ == "__main__":
    main()