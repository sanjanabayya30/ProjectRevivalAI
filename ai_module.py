"""
Enhanced AI module for generating personalized project analysis
"""
import json
from typing import Dict, List, Optional, Any
import re

class ProjectAnalyzer:
    """
    Advanced project analyzer that generates unique insights based on actual content
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the ProjectAnalyzer"""
        self.api_key = api_key
    
    def extract_code_insights(self, code_files: Dict[str, str]) -> Dict[str, Any]:
        """
        Extract meaningful insights from code files
        """
        insights = {
            "functions": [],
            "classes": [],
            "imports": set(),
            "routes": [],
            "database_operations": False,
            "has_tests": False,
            "has_frontend": False,
            "has_api": False,
            "framework_usage": set(),
            "documentation_level": 0
        }
        
        for filename, content in code_files.items():
            # Detect file type
            is_python = filename.endswith('.py')
            is_javascript = filename.endswith(('.js', '.jsx', '.ts', '.tsx'))
            is_frontend = filename.endswith(('.html', '.css', '.js', '.jsx', '.tsx'))
            
            if is_frontend:
                insights["has_frontend"] = True
            
            lines = content.split('\n')
            doc_lines = 0
            
            for line in lines:
                line = line.strip()
                
                # Extract functions
                if is_python:
                    if line.startswith('def '):
                        func_name = re.search(r'def\s+([a-zA-Z_][a-zA-Z0-9_]*)', line)
                        if func_name:
                            insights["functions"].append(func_name.group(1))
                    
                    # Extract classes
                    elif line.startswith('class '):
                        class_name = re.search(r'class\s+([a-zA-Z_][a-zA-Z0-9_]*)', line)
                        if class_name:
                            insights["classes"].append(class_name.group(1))
                    
                    # Check for FastAPI/Flask routes
                    elif '@app.route' in line or '@app.get' in line or '@app.post' in line:
                        insights["has_api"] = True
                        insights["routes"].append(line)
                    
                    # Check for database operations
                    elif any(db_term in line.lower() for db_term in ['select', 'insert', 'update', 'delete', 'create table']):
                        insights["database_operations"] = True
                    
                    # Extract imports
                    elif line.startswith('import ') or line.startswith('from '):
                        imports = re.findall(r'import\s+(\w+)|from\s+(\w+)', line)
                        for imp in imports:
                            insights["imports"].update(imp)
                
                elif is_javascript:
                    # Extract functions
                    if 'function' in line or '=>' in line:
                        func_match = re.search(r'(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:function|async\s+function|\([^)]*\)\s*=>))', line)
                        if func_match:
                            func_name = func_match.group(1) or func_match.group(2)
                            if func_name:
                                insights["functions"].append(func_name)
                    
                    # Extract classes
                    elif 'class ' in line:
                        class_match = re.search(r'class\s+(\w+)', line)
                        if class_match:
                            insights["classes"].append(class_match.group(1))
                    
                    # Check for API routes
                    elif '.get(' in line or '.post(' in line or '.put(' in line or '.delete(' in line:
                        insights["has_api"] = True
                        insights["routes"].append(line)
                
                # Count documentation lines
                if line.startswith(('"""', "'''", '//', '/*', '*', '#')):
                    doc_lines += 1
            
            # Calculate documentation level
            insights["documentation_level"] = min(10, int((doc_lines / len(lines)) * 10))
            
            # Detect framework usage
            frameworks = {
                'react': ['react', 'useState', 'useEffect'],
                'vue': ['Vue.', 'createApp'],
                'angular': ['@Component', '@Injectable'],
                'django': ['django', 'models.Model'],
                'flask': ['Flask(', '@app.route'],
                'fastapi': ['FastAPI(', '@app'],
                'express': ['express(', 'app.use'],
            }
            
            for framework, patterns in frameworks.items():
                if any(pattern in content for pattern in patterns):
                    insights["framework_usage"].add(framework)
        
        # Convert sets to lists for JSON serialization
        insights["imports"] = list(insights["imports"])
        insights["framework_usage"] = list(insights["framework_usage"])
        
        return insights
    
    def extract_doc_insights(self, doc_content: Optional[str]) -> Dict[str, Any]:
        """
        Extract insights from documentation
        """
        if not doc_content:
            return {
                "has_requirements": False,
                "has_setup_instructions": False,
                "has_api_docs": False,
                "sections": [],
                "mentioned_technologies": set(),
                "project_goals": [],
                "known_issues": []
            }
        
        insights = {
            "has_requirements": False,
            "has_setup_instructions": False,
            "has_api_docs": False,
            "sections": [],
            "mentioned_technologies": set(),
            "project_goals": [],
            "known_issues": []
        }
        
        # Common section headers
        sections = [
            "introduction",
            "requirements",
            "installation",
            "setup",
            "usage",
            "api",
            "endpoints",
            "configuration",
            "deployment",
            "contributing"
        ]
        
        # Technology keywords
        tech_keywords = {
            "frontend": ["react", "vue", "angular", "javascript", "typescript", "html", "css"],
            "backend": ["python", "node", "java", "go", "ruby", "php"],
            "database": ["sql", "mongodb", "postgresql", "mysql", "redis"],
            "tools": ["docker", "kubernetes", "git", "aws", "azure", "gcp"]
        }
        
        # Process documentation content
        content_lower = doc_content.lower()
        
        # Detect sections
        for section in sections:
            if section in content_lower:
                insights["sections"].append(section)
                
                if section in ["requirements", "dependencies"]:
                    insights["has_requirements"] = True
                elif section in ["installation", "setup"]:
                    insights["has_setup_instructions"] = True
                elif section in ["api", "endpoints"]:
                    insights["has_api_docs"] = True
        
        # Detect technologies
        for category, terms in tech_keywords.items():
            for term in terms:
                if term in content_lower:
                    insights["mentioned_technologies"].add(term)
        
        # Extract project goals
        goals_section = re.search(r'(?:goals?|objectives?|purpose)(.*?)(?:\n\n|\n#|$)', content_lower, re.DOTALL)
        if goals_section:
            goals = re.findall(r'[-*]\s*(.+)', goals_section.group(1))
            insights["project_goals"] = [goal.strip() for goal in goals if goal.strip()]
        
        # Extract known issues
        issues_section = re.search(r'(?:issues?|bugs?|limitations?|todo)(.*?)(?:\n\n|\n#|$)', content_lower, re.DOTALL)
        if issues_section:
            issues = re.findall(r'[-*]\s*(.+)', issues_section.group(1))
            insights["known_issues"] = [issue.strip() for issue in issues if issue.strip()]
        
        # Convert sets to lists for JSON serialization
        insights["mentioned_technologies"] = list(insights["mentioned_technologies"])
        
        return insights
    
    def generate_analysis(
        self,
        code_insights: Dict[str, Any],
        doc_insights: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate personalized analysis based on extracted insights
        """
        # Determine project status
        if code_insights["documentation_level"] >= 7 and len(code_insights["functions"]) > 10:
            status = "Nearly Complete"
        elif code_insights["documentation_level"] >= 4 and len(code_insights["functions"]) > 5:
            status = "Incomplete"
        else:
            status = "Early Stage"
        
        # Determine current stage
        current_stage = []
        if code_insights["has_frontend"]:
            current_stage.append("Frontend implementation")
        if code_insights["has_api"]:
            current_stage.append("API development")
        if code_insights["database_operations"]:
            current_stage.append("Database integration")
        current_stage = " and ".join(current_stage) if current_stage else "Initial development"
        
        # Identify failure points
        failure_points = []
        if not code_insights["has_frontend"] and code_insights["has_api"]:
            failure_points.append("Missing frontend implementation")
        if not code_insights["has_api"] and code_insights["has_frontend"]:
            failure_points.append("Missing backend API")
        if code_insights["documentation_level"] < 5:
            failure_points.append("Insufficient documentation")
        if not code_insights["has_tests"]:
            failure_points.append("No test coverage")
        if not doc_insights["has_setup_instructions"]:
            failure_points.append("Missing setup instructions")
        
        # Identify missing components
        missing_components = []
        if not code_insights["has_frontend"]:
            missing_components.append("Frontend UI")
        if not code_insights["has_api"]:
            missing_components.append("Backend API")
        if not code_insights["database_operations"]:
            missing_components.append("Database integration")
        if not doc_insights["has_api_docs"] and code_insights["has_api"]:
            missing_components.append("API documentation")
        if not code_insights["has_tests"]:
            missing_components.append("Test suite")
        
        # Generate fix steps
        fix_steps = []
        for component in missing_components:
            if component == "Frontend UI":
                fix_steps.append(f"Implement frontend using {', '.join(code_insights['framework_usage']) or 'React/Vue.js'}")
            elif component == "Backend API":
                fix_steps.append("Create RESTful API endpoints")
            elif component == "Database integration":
                fix_steps.append("Set up database schema and operations")
            elif component == "API documentation":
                fix_steps.append("Document API endpoints using OpenAPI/Swagger")
            elif component == "Test suite":
                fix_steps.append("Implement unit and integration tests")
        
        # Add documentation steps if needed
        if code_insights["documentation_level"] < 5:
            fix_steps.append("Improve code documentation and add JSDoc/docstring comments")
        if not doc_insights["has_setup_instructions"]:
            fix_steps.append("Add detailed setup and installation instructions")
        
        # Recommend technologies
        recommended_technologies = []
        if not code_insights["has_frontend"]:
            recommended_technologies.extend(["React", "TailwindCSS", "Vite"])
        if not code_insights["has_api"]:
            recommended_technologies.extend(["FastAPI", "Express"])
        if not code_insights["database_operations"]:
            recommended_technologies.extend(["PostgreSQL", "Prisma"])
        if not code_insights["has_tests"]:
            recommended_technologies.extend(["Jest", "Pytest"])
        
        # Generate action items
        action_items = []
        if missing_components:
            action_items.append(f"Start with implementing {missing_components[0]}")
        if code_insights["documentation_level"] < 5:
            action_items.append("Add comprehensive documentation")
        if not doc_insights["has_setup_instructions"]:
            action_items.append("Create detailed setup guide")
        if not code_insights["has_tests"]:
            action_items.append("Set up testing framework")
        action_items.append("Review and update dependencies")
        
        return {
            "status": status,
            "project_summary": f"Project includes {len(code_insights['functions'])} functions and {len(code_insights['classes'])} classes",
            "current_stage": current_stage,
            "failure_points": failure_points[:5],
            "missing_components": missing_components[:5],
            "fix_steps": fix_steps[:5],
            "recommended_technologies": recommended_technologies[:5],
            "action_items": action_items[:5]
        }
    
    async def analyze_project(
        self,
        code_files: Dict[str, str],
        doc_content: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze project and generate personalized insights
        """
        # Extract insights from code and documentation
        code_insights = self.extract_code_insights(code_files)
        doc_insights = self.extract_doc_insights(doc_content)
        
        # Generate analysis
        analysis = self.generate_analysis(code_insights, doc_insights)
        
        return analysis