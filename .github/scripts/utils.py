"""
Utility functions for markdown parsing, PDF generation, and file handling.
"""

import re
from pathlib import Path
from typing import Dict, List

def read_file(file_path: str) -> str:
    """Read the contents of a file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def write_file(file_path: str, content: str) -> None:
    """Write content to a file."""
    path = Path(file_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)

def parse_markdown_sections(markdown_content: str) -> Dict[str, str]:
    """
    Parse a markdown file into sections (headers and their content).
    
    Args:
        markdown_content: The full markdown text
        
    Returns:
        A dictionary where keys are section headers and values are section content
    """
    sections = {}
    current_section = "header"
    section_content = []
    
    for line in markdown_content.split('\n'):
        if line.startswith('#'):
            if current_section and section_content:
                sections[current_section] = '\n'.join(section_content).strip()
            current_section = line.lstrip('#').strip()
            section_content = []
        else:
            section_content.append(line)
    
    if current_section and section_content:
        sections[current_section] = '\n'.join(section_content).strip()
    
    return sections

def save_markdown(content: str, output_path: str) -> None:
    """Save markdown content to a file."""
    write_file(output_path, content)

def extract_keywords_from_jd(job_description: str) -> List[str]:
    """
    Extract technical keywords and skill terms from a job description.
    
    Args:
        job_description: The full job description text
        
    Returns:
        A list of extracted keywords
    """
    # Common technical skill patterns
    skill_patterns = [
        r'\b(Python|JavaScript|Java|C\+\+|Go|Rust|TypeScript)\b',
        r'\b(AWS|Azure|GCP|Kubernetes|Docker)\b',
        r'\b(Machine Learning|ML|AI|Deep Learning|NLP)\b',
        r'\b(React|Vue|Angular|Node\.js)\b',
        r'\b(SQL|NoSQL|PostgreSQL|MongoDB)\b',
    ]
    
    keywords = set()
    for pattern in skill_patterns:
        matches = re.findall(pattern, job_description, re.IGNORECASE)
        keywords.update(matches)
    
    return list(keywords)

def generate_pdf_from_markdown(markdown_path: str, output_pdf_path: str) -> None:
    """
    Generate a PDF from a markdown file using pandoc.
    Assumes pandoc is installed on the system.
    
    Args:
        markdown_path: Path to the markdown file
        output_pdf_path: Path where the PDF should be saved
    """
    import subprocess
    
    try:
        subprocess.run([
            'pandoc',
            markdown_path,
            '-o',
            output_pdf_path,
            '--pdf-engine=xelatex',
            '-V', 'fontsize=11pt',
            '-V', 'mainfont=Calibri',
            '-V', 'geometry:margin=0.5in'
        ], check=True)
    except subprocess.CalledProcessError as e:
        raise Exception(f"Error generating PDF: {str(e)}")
    except FileNotFoundError:
        raise Exception("pandoc is not installed. Please install it to generate PDFs.")

def format_cv_with_css(markdown_content: str, css_path: str = 'assets/style.css') -> str:
    """
    Wrap markdown content with HTML and CSS for web display.
    
    Args:
        markdown_content: The markdown content
        css_path: Path to the CSS file
        
    Returns:
        HTML string with embedded CSS
    """
    try:
        import markdown
    except ImportError:
        raise ImportError("markdown package is required. Install with: pip install markdown")
    
    css_content = ""
    if Path(css_path).exists():
        with open(css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
    
    html_content = markdown.markdown(markdown_content, extensions=['tables', 'codehilite'])
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional CV</title>
    <style>
        {css_content}
    </style>
</head>
<body>
    <div class="cv-container">
        {html_content}
    </div>
</body>
</html>"""
    
    return html

def sanitize_branch_name(issue_title: str) -> str:
    """
    Convert an issue title to a valid git branch name.
    
    Args:
        issue_title: The GitHub issue title
        
    Returns:
        A sanitized branch name
    """
    # Convert to lowercase and replace spaces with hyphens
    branch = issue_title.lower()
    # <company> - <role>
    match = re.match(r'^\s*(.+?)\s*-\s*(.+?)\s*$', branch)
    if match:
        company = match.group(1).strip().replace(' ', '-')
        role = match.group(2).strip().replace(' ', '-')
        branch = f"{company}-{role}"
    # Remove characters that are not alphanumeric or hyphens
    branch = re.sub(r'[^a-z0-9-]', '', branch)
    # Limit length
    branch = branch[:50]
    
    return branch if branch else "application"

def sanitize_input(user_input: str) -> str:
    """Sanitize user input to prevent injection attacks."""
    return user_input.replace('<', '&lt;').replace('>', '&gt;')