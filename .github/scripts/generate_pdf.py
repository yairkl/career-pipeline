#!/usr/bin/env python3
"""
Generate PDF from markdown file using pandoc.
"""

import os
import argparse
import pypandoc

def convert_md_to_pdf(md_file, pdf_file):
    """
    Convert a Markdown file to PDF using pypandoc.
    
    Args:
        md_file (str): Path to the input Markdown file.
        pdf_file (str): Path to the output PDF file.
    """
    if not os.path.exists(md_file):
        raise FileNotFoundError(f"Markdown file '{md_file}' not found.")
    
    # Options to make PDF compact and fit on one page
    extra_args = [
        '--variable', 'geometry:margin=0.3in',  # Minimal margins
        '--variable', 'fontsize=8pt',           # Very small font size
        '--variable', 'geometry:letterpaper',   # Letter paper size
        '--variable', 'linestretch=0.8',        # Very tight line spacing
        '--variable', 'mainfont=DejaVuSans',    # Sans-serif font
        '--variable', 'colorlinks=true',        # Color links
        '--variable', 'linkcolor=blue',         # Blue links
        '--variable', 'linkbordercolor=white',  # Remove link borders
        '--variable', 'documentclass=article',  # Compact article class
    ]
    
    try:
        pypandoc.convert_file(md_file, 'pdf', outputfile=pdf_file, extra_args=extra_args)
        print(f"Successfully converted '{md_file}' to '{pdf_file}'")
    except Exception as e:
        print(f"Error during conversion: {e}")
        print("Note: This script requires pandoc to be installed on your system.")
        print("Install pandoc from https://pandoc.org/installing.html")
        raise

def main():
    parser = argparse.ArgumentParser(description="Convert Markdown CV to PDF")
    parser.add_argument("input", help="Path to the input Markdown file")
    parser.add_argument("output", help="Path to the output PDF file")
    parser.add_argument("--css", help="Path to CSS file for styling (optional)")
    
    args = parser.parse_args()
    convert_md_to_pdf(args.input, args.output)

if __name__ == "__main__":
    main()
