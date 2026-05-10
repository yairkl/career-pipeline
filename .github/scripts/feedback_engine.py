import os
import sys
import argparse
from pathlib import Path

# Add scripts directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

import google.genai as genai
from dotenv import load_dotenv
from utils import parse_markdown_sections, save_markdown

load_dotenv()


class FeedbackEngine:
    """
    The FeedbackEngine processes user feedback on a tailored CV and makes targeted updates.
    It uses Gemini API to apply refinements based on feedback while maintaining the overall structure.
    """
    
    def __init__(self, cv_path, api_key):
        self.cv_path = cv_path
        self.client = genai.Client(api_key=api_key)
        self.model_id = 'gemini-3.1-flash-lite'
            
    def load_cv(self):
        """Load the current CV from file."""
        with open(self.cv_path, 'r', encoding='utf-8') as file:
            return file.read()
    
    def create_system_prompt(self):
        """Create the system prompt that guides the LLM behavior for feedback processing."""
        return """You are an expert resume editor. Your job is to refine a CV based on specific feedback while:
1. Applying the requested changes exactly as specified in the feedback
2. Keeping all information truthful and factual (no hallucinations)
3. Maintaining the original markdown structure and formatting
4. Ensuring consistency with the job description requirements
5. Preserving sections that don't need changes
6. Improving language where needed based on feedback

IMPORTANT RULES:
- DO NOT remove or rewrite sections not mentioned in the feedback
- DO preserve the exact structure (headers, bullet points, etc.)
- DO apply changes surgically - only modify what's requested
- DO NOT invent new information
- DO NOT hallucinate skills or achievements"""
    
    def apply_feedback(self, feedback, job_description):
        """
        Use the Gemini API to apply feedback to the CV.
        Returns the updated CV as a markdown string.
        """
        cv_content = self.load_cv()
        
        prompt = f"""{self.create_system_prompt()}

---

CURRENT CV:
{cv_content}

---

TARGET JOB DESCRIPTION:
{job_description}

---

USER FEEDBACK/REQUESTED CHANGES:
{feedback}

---

Please apply the user's feedback to the CV above. Make targeted changes based on the feedback while:
1. Keeping the CV aligned with the job description
2. Maintaining all original information not mentioned in the feedback
3. Returning ONLY the modified markdown CV

Apply the feedback changes now:"""
        
        try:
            response = self.client.models.generate_content(
                            model=self.model_id,
                            contents=prompt
                        )
            return response.text
        except Exception as e:
            raise Exception(f"Error calling Gemini API: {str(e)}")
    
    def save_updated_cv(self, updated_cv, output_path=None):
        """Save the updated CV to a file."""
        if output_path is None:
            output_path = self.cv_path
            
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write(updated_cv)
        print(f"✓ Updated CV saved to {output_path}")


def main():
    """Main entry point for the feedback engine."""
    parser = argparse.ArgumentParser(description="Apply feedback to tailored CV using LLM")
    parser.add_argument(
        "--cv",
        default="CV.md",
        help="Path to CV file to update (default: CV.md)"
    )
    parser.add_argument(
        "--feedback",
        required=True,
        help="User feedback or requested changes"
    )
    parser.add_argument(
        "--jd",
        default="",
        help="Job description for context (optional but recommended)"
    )
    parser.add_argument(
        "--company-role",
        default="",
        help="Company and role for reference (optional)"
    )
    parser.add_argument(
        "--output",
        "-o",
        default=None,
        help="Output path for updated CV (default: same as input)"
    )
    
    args = parser.parse_args()
    
    # Validate inputs
    if not os.path.exists(args.cv):
        print(f"❌ CV file not found: {args.cv}")
        sys.exit(1)
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY environment variable not set")
        sys.exit(1)
    
    try:
        # Initialize feedback engine
        engine = FeedbackEngine(args.cv, api_key)
        
        # Apply feedback
        print(f"📝 Applying feedback to CV...")
        if args.company_role:
            print(f"   Role: {args.company_role}")
        
        updated_cv = engine.apply_feedback(args.feedback, args.jd)
        
        # Save updated CV
        engine.save_updated_cv(updated_cv, args.output)
        print("✓ CV feedback processing complete!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
