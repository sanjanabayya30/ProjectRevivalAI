import { parse as parseImports } from 'es-module-lexer';

interface ProjectFile {
  name: string;
  content: string;
  type: string;
}

interface AnalysisResult {
  summary: string;
  abandonmentReasons: string[];
  missingComponents: string[];
  rebootSteps: string[];
  suggestedTechnologies: string[];
  projectScore: {
    codeCompleteness: number;
    documentationQuality: number;
    revivalPotential: number;
    fixDifficulty: 'Easy' | 'Medium' | 'Hard';
  };
}

interface CodeMetrics {
  functions: string[];
  classes: string[];
  imports: string[];
  hasTests: boolean;
  hasAPI: boolean;
  hasDatabase: boolean;
  documentationLevel: number;
}

export class ProjectAnalyzer {
  private detectFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py':
        return 'Python';
      case 'js':
      case 'jsx':
        return 'JavaScript';
      case 'ts':
      case 'tsx':
        return 'TypeScript';
      case 'html':
        return 'HTML';
      case 'css':
      case 'scss':
        return 'CSS';
      case 'md':
        return 'Markdown';
      case 'sql':
        return 'SQL';
      default:
        return 'Unknown';
    }
  }

  private async analyzeCodeFile(file: ProjectFile): Promise<CodeMetrics> {
    const metrics: CodeMetrics = {
      functions: [],
      classes: [],
      imports: [],
      hasTests: false,
      hasAPI: false,
      hasDatabase: false,
      documentationLevel: 0
    };

    const lines = file.content.split('\n');
    let docLines = 0;

    // Count documentation lines
    lines.forEach(line => {
      if (line.trim().startsWith(('"""')) || 
          line.trim().startsWith("'''") || 
          line.trim().startsWith('//') || 
          line.trim().startsWith('/*') || 
          line.trim().startsWith('*') || 
          line.trim().startsWith('#')) {
        docLines++;
      }
    });

    metrics.documentationLevel = Math.min(10, Math.round((docLines / lines.length) * 10));

    if (file.type === 'Python') {
      // Analyze Python code
      const functionRegex = /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
      const classRegex = /class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[\(:]?/g;
      const importRegex = /from\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+import|import\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;

      let match;
      while ((match = functionRegex.exec(file.content)) !== null) {
        metrics.functions.push(match[1]);
      }
      while ((match = classRegex.exec(file.content)) !== null) {
        metrics.classes.push(match[1]);
      }
      while ((match = importRegex.exec(file.content)) !== null) {
        metrics.imports.push(match[1] || match[2]);
      }

      metrics.hasAPI = file.content.includes('@app.route') || 
                      file.content.includes('FastAPI');
      metrics.hasDatabase = file.content.includes('SQLAlchemy') || 
                           file.content.includes('cursor.execute');

    } else if (file.type === 'JavaScript' || file.type === 'TypeScript') {
      // Analyze JavaScript/TypeScript code
      const functionRegex = /(?:function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)|(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:function|\([^)]*\)\s*=>))/g;
      const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;

      let match;
      while ((match = functionRegex.exec(file.content)) !== null) {
        metrics.functions.push(match[1] || match[2]);
      }
      while ((match = classRegex.exec(file.content)) !== null) {
        metrics.classes.push(match[1]);
      }

      try {
        const [imports] = await parseImports(file.content);
        metrics.imports = imports.map(imp => imp.n || '').filter(Boolean);
      } catch (error) {
        console.error('Error parsing imports:', error);
      }

      metrics.hasAPI = file.content.includes('express') || 
                      file.content.includes('fetch') || 
                      file.content.includes('axios');
      metrics.hasDatabase = file.content.includes('mongoose') || 
                           file.content.includes('sequelize') ||
                           file.content.includes('prisma');
    }

    metrics.hasTests = file.name.includes('test') || 
                      file.name.includes('spec') ||
                      file.content.includes('describe(') || 
                      file.content.includes('test(') ||
                      file.content.includes('pytest');

    return metrics;
  }

  public async analyzeProject(files: ProjectFile[]): Promise<AnalysisResult> {
    const metrics = await Promise.all(files.map(file => this.analyzeCodeFile(file)));
    
    const allMetrics = metrics.reduce((acc, curr) => ({
      functions: [...acc.functions, ...curr.functions],
      classes: [...acc.classes, ...curr.classes],
      imports: [...acc.imports, ...curr.imports],
      hasTests: acc.hasTests || curr.hasTests,
      hasAPI: acc.hasAPI || curr.hasAPI,
      hasDatabase: acc.hasDatabase || curr.hasDatabase,
      documentationLevel: Math.max(acc.documentationLevel, curr.documentationLevel)
    }), {
      functions: [] as string[],
      classes: [] as string[],
      imports: [] as string[],
      hasTests: false,
      hasAPI: false,
      hasDatabase: false,
      documentationLevel: 0
    });

    const abandonmentReasons: string[] = [];
    const missingComponents: string[] = [];
    const rebootSteps: string[] = [];
    const suggestedTechnologies: string[] = [];

    // Analyze project structure
    if (!allMetrics.hasAPI) {
      missingComponents.push('API endpoints and routes');
      abandonmentReasons.push('Incomplete API implementation');
      rebootSteps.push('Create RESTful API endpoints');
      suggestedTechnologies.push('FastAPI or Express.js for API development');
    }

    if (!allMetrics.hasDatabase) {
      missingComponents.push('Database integration');
      abandonmentReasons.push('No data persistence layer');
      rebootSteps.push('Implement database models and queries');
      suggestedTechnologies.push('PostgreSQL with Prisma or SQLAlchemy');
    }

    if (!allMetrics.hasTests) {
      missingComponents.push('Test coverage');
      abandonmentReasons.push('Lack of testing');
      rebootSteps.push('Add unit and integration tests');
      suggestedTechnologies.push('Jest or Pytest for testing');
    }

    if (allMetrics.documentationLevel < 5) {
      missingComponents.push('Comprehensive documentation');
      abandonmentReasons.push('Poor documentation');
      rebootSteps.push('Add detailed documentation and comments');
    }

    // Calculate project scores
    const codeCompleteness = Math.min(10, Math.round(
      ((allMetrics.functions.length + allMetrics.classes.length) / 10) +
      (allMetrics.hasAPI ? 2 : 0) +
      (allMetrics.hasDatabase ? 2 : 0) +
      (allMetrics.hasTests ? 2 : 0)
    ));

    const documentationQuality = allMetrics.documentationLevel;

    const revivalPotential = Math.min(10, Math.round(
      (codeCompleteness * 0.4) +
      (documentationQuality * 0.3) +
      (allMetrics.hasTests ? 2 : 0) +
      (allMetrics.imports.length > 5 ? 2 : 1)
    ));

    const fixDifficulty: 'Easy' | 'Medium' | 'Hard' = 
      revivalPotential >= 7 ? 'Easy' :
      revivalPotential >= 4 ? 'Medium' : 'Hard';

    return {
      summary: `This ${this.detectMainTechnology(files)} project contains ${
        allMetrics.functions.length} functions and ${
        allMetrics.classes.length} classes. It ${
        allMetrics.hasAPI ? 'includes' : 'lacks'} API implementation and ${
        allMetrics.hasDatabase ? 'has' : 'needs'} database integration. The project appears to be in the ${
        this.determineProjectStage(allMetrics)} stage.`,
      abandonmentReasons,
      missingComponents,
      rebootSteps,
      suggestedTechnologies,
      projectScore: {
        codeCompleteness,
        documentationQuality,
        revivalPotential,
        fixDifficulty
      }
    };
  }

  private detectMainTechnology(files: ProjectFile[]): string {
    const technologies = files.map(f => this.detectFileType(f.name));
    const counts = technologies.reduce((acc, tech) => {
      acc[tech] = (acc[tech] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)[0][0];
  }

  private determineProjectStage(metrics: CodeMetrics): string {
    if (metrics.functions.length === 0 && metrics.classes.length === 0) {
      return 'initial planning';
    }
    if (!metrics.hasAPI && !metrics.hasDatabase) {
      return 'early development';
    }
    if (metrics.hasAPI && !metrics.hasDatabase) {
      return 'API development';
    }
    if (metrics.hasAPI && metrics.hasDatabase && !metrics.hasTests) {
      return 'integration';
    }
    return 'testing and documentation';
  }
}