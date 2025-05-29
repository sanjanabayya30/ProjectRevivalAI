"""
File parser module for handling different file formats
"""
import os
import zipfile
import fitz  # PyMuPDF
from docx import Document
from typing import Dict, List, Optional, Tuple
import magic

class FileParser:
    """
    Handles parsing of different file formats (ZIP, PDF, DOCX)
    """
    
    @staticmethod
    def detect_file_type(file_content: bytes) -> str:
        """
        Detect file type using python-magic
        """
        mime = magic.Magic(mime=True)
        file_type = mime.from_buffer(file_content)
        return file_type
    
    @staticmethod
    def parse_zip(file_path: str) -> Dict[str, str]:
        """
        Parse ZIP file and extract code files
        """
        code_files = {}
        code_extensions = {'.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.java', '.cpp', '.c', '.go', '.rs'}
        
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            for file_info in zip_ref.filelist:
                if any(file_info.filename.endswith(ext) for ext in code_extensions):
                    with zip_ref.open(file_info.filename) as f:
                        try:
                            content = f.read().decode('utf-8')
                            code_files[file_info.filename] = content
                        except UnicodeDecodeError:
                            # Skip binary files
                            continue
        
        return code_files
    
    @staticmethod
    def parse_pdf(file_path: str) -> str:
        """
        Parse PDF file and extract text
        """
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
    
    @staticmethod
    def parse_docx(file_path: str) -> str:
        """
        Parse DOCX file and extract text
        """
        doc = Document(file_path)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])
    
    @staticmethod
    def save_uploaded_file(file_content: bytes, file_name: str, upload_dir: str) -> str:
        """
        Save uploaded file to disk
        """
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file_name)
        
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        return file_path
    
    @staticmethod
    def cleanup_files(file_paths: List[str]) -> None:
        """
        Clean up temporary files
        """
        for file_path in file_paths:
            try:
                os.remove(file_path)
            except OSError:
                pass