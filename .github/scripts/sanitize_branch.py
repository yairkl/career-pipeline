#!/usr/bin/env python3
"""
Sanitize a string to be a valid git branch name.
"""

import argparse
import sys
from pathlib import Path

# Add scripts directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from utils import sanitize_branch_name

def main():
    parser = argparse.ArgumentParser(description="Sanitize a string to be a valid git branch name")
    parser.add_argument(
        "name",
        help="The name to sanitize"
    )
    
    args = parser.parse_args()
    sanitized = sanitize_branch_name(args.name)
    print(sanitized)

if __name__ == "__main__":
    main()
