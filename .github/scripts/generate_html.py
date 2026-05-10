#!/usr/bin/env python3
"""
Generate HTML from CV markdown file.
"""

import argparse
import sys
from pathlib import Path

# Add scripts directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from utils import read_file, format_cv_with_css, write_file

def main():
    parser = argparse.ArgumentParser(description="Generate HTML from CV markdown")
    parser.add_argument(
        "--input",
        default="CV.md",
        help="Input markdown file (default: CV.md)"
    )
    parser.add_argument(
        "--output",
        default="dist/index.html",
        help="Output HTML file (default: dist/index.html)"
    )
    parser.add_argument(
        "--css",
        default="assets/style.css",
        help="CSS file path (default: assets/style.css)"
    )
    
    args = parser.parse_args()
    
    # Ensure output directory exists
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    
    # Read CV and generate HTML
    cv_content = read_file(args.input)
    html = format_cv_with_css(cv_content, args.css)
    write_file(args.output, html)
    
    print(f"✓ HTML generated: {args.output}")

if __name__ == "__main__":
    main()
