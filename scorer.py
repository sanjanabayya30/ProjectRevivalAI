"""
Project scoring module for evaluating project quality and potential
"""
from typing import Dict, List, Optional, Tuple

class ProjectScorer:
    """
    Handles project scoring and evaluation
    """
    
    @staticmethod
    def calculate_code_completeness(code_files: Dict[str, str]) -> int:
        """
        Calculate code completeness score (0-10)
        """
        if not code_files:
            return 0
            
        total_score = 0
        weights = {
            'has_readme': 2,
            'has_tests': 2,
            'has_documentation': 2,
            'code_structure': 2,
            'implementation': 2
        }
        
        # Check for README
        has_readme = any(name.lower().startswith('readme') for name in code_files.keys())
        total_score += weights['has_readme'] if has_readme else 0
        
        # Check for tests
        has_tests = any('test' in name.lower() for name in code_files.keys())
        total_score += weights['has_tests'] if has_tests else 0
        
        # Check for documentation
        has_docs = any(name.lower().endswith(('.md', '.rst', '.txt')) for name in code_files.keys())
        total_score += weights['has_documentation'] if has_docs else 0
        
        # Basic code structure analysis
        code_files_count = len(code_files)
        if code_files_count > 10:
            total_score += weights['code_structure']
        elif code_files_count > 5:
            total_score += weights['code_structure'] / 2
        
        # Basic implementation check
        total_lines = sum(len(content.split('\n')) for content in code_files.values())
        if total_lines > 500:
            total_score += weights['implementation']
        elif total_lines > 200:
            total_score += weights['implementation'] / 2
        
        return min(10, total_score)
    
    @staticmethod
    def calculate_documentation_quality(doc_content: Optional[str]) -> int:
        """
        Calculate documentation quality score (0-10)
        """
        if not doc_content:
            return 0
            
        total_score = 0
        weights = {
            'length': 3,
            'sections': 4,
            'code_examples': 3
        }
        
        # Check document length
        doc_lines = len(doc_content.split('\n'))
        if doc_lines > 100:
            total_score += weights['length']
        elif doc_lines > 50:
            total_score += weights['length'] / 2
        
        # Check for common documentation sections
        common_sections = [
            'introduction', 'overview', 'installation', 'usage', 'api',
            'requirements', 'setup', 'configuration', 'examples'
        ]
        found_sections = sum(1 for section in common_sections if section in doc_content.lower())
        section_score = (found_sections / len(common_sections)) * weights['sections']
        total_score += section_score
        
        # Check for code examples
        code_indicators = ['```', 'example:', 'usage:', '    ', '\t']
        has_code = any(indicator in doc_content for indicator in code_indicators)
        total_score += weights['code_examples'] if has_code else 0
        
        return min(10, total_score)
    
    @staticmethod
    def calculate_revival_potential(
        code_completeness: int,
        doc_quality: int,
        code_files: Dict[str, str]
    ) -> int:
        """
        Calculate revival potential score (0-10)
        """
        total_score = 0
        weights = {
            'code_completeness': 4,
            'doc_quality': 3,
            'project_structure': 3
        }
        
        # Factor in code completeness
        total_score += (code_completeness / 10) * weights['code_completeness']
        
        # Factor in documentation quality
        total_score += (doc_quality / 10) * weights['doc_quality']
        
        # Analyze project structure
        has_frontend = any(name.endswith(('.html', '.css', '.js', '.jsx', '.tsx')) for name in code_files.keys())
        has_backend = any(name.endswith(('.py', '.rb', '.php', '.java')) for name in code_files.keys())
        has_config = any(name.endswith(('.json', '.yml', '.yaml', '.toml')) for name in code_files.keys())
        
        structure_score = sum([has_frontend, has_backend, has_config]) * (weights['project_structure'] / 3)
        total_score += structure_score
        
        return min(10, round(total_score))
    
    @staticmethod
    def determine_fix_difficulty(
        code_completeness: int,
        doc_quality: int,
        revival_potential: int
    ) -> str:
        """
        Determine fix difficulty (Easy, Medium, Hard)
        """
        average_score = (code_completeness + doc_quality + revival_potential) / 3
        
        if average_score >= 7:
            return "Easy"
        elif average_score >= 4:
            return "Medium"
        else:
            return "Hard"
    
    @staticmethod
    def generate_project_score(
        code_files: Dict[str, str],
        doc_content: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Generate complete project score
        """
        code_completeness = ProjectScorer.calculate_code_completeness(code_files)
        doc_quality = ProjectScorer.calculate_documentation_quality(doc_content)
        revival_potential = ProjectScorer.calculate_revival_potential(
            code_completeness,
            doc_quality,
            code_files
        )
        fix_difficulty = ProjectScorer.determine_fix_difficulty(
            code_completeness,
            doc_quality,
            revival_potential
        )
        
        return {
            "code_completeness": code_completeness,
            "documentation_quality": doc_quality,
            "revival_potential": revival_potential,
            "fix_difficulty": fix_difficulty
        }