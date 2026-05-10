#!/usr/bin/env python3
"""
Generate PDF from markdown file using pandoc.
"""

import argparse
import subprocess
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description="Generate PDF from markdown file")
    parser.add_argument(
        "input",
        help="Input markdown file"
    )
    parser.add_argument(
        "--output",
        "-o",
        help="Output PDF file (default: input with .pdf extension)"
    )    parser.add_argument(
        "--css",
        help="CSS file for styling (optional)"
    )    parser.add_argument(
        "--css",
        help="CSS file for styling (optional)"
    )
    
    args = parser.parse_args()
    
    input_file = Path(args.input)
    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {args.input}")
    
    # Determine output file
    output_file = args.output or input_file.with_suffix(".pdf")
    
    # Ensure output directory exists
    Path(output_file).parent.mkdir(parents=True, exist_ok=True)
    
    # Build pandoc command
    cmd = [
        "pandoc",
        str(input_file),
        "-o",
        str(output_file),
        "--pdf-engine=xelatex",
        "-V", "fontsize=11pt",
        "-V", "mainfont=Calibri",
        "-V", "geometry:margin=0.5in"
    ]
    
    # Add CSS if provided
    if args.css and Path(args.css).exists():
        cmd.extend(["-c", args.css])
    
    try:
        subprocess.run(cmd, check=True)
        print(f"✓ PDF generated: {output_file}")
    except subprocess.CalledProcessError as e:
        raise Exception(f"Error generating PDF: {str(e)}")
    except FileNotFoundError:
        raise Exception("pandoc is not installed. Install with: apt-get install pandoc texlive-xetex")

if __name__ == "__main__":
    main()
