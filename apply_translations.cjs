const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const dict = require('./en_dict.json');

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
});

const skipDirs = ['components/ui', 'hooks', 'lib']; // Don't translate shadcn ui and generic utils

project.getSourceFiles().forEach(sourceFile => {
  const filePath = sourceFile.getFilePath();
  if (filePath.endsWith('.json')) return;
  if (skipDirs.some(dir => filePath.includes(`/src/${dir}/`))) return;

  let fileModified = false;

  // Track if we need to import useLanguage
  let needsI18nImport = false;

  sourceFile.forEachDescendant(node => {
     if (node.getKind() === SyntaxKind.JsxText) {
        const text = node.getText();
        const trimmed = text.trim();
        if (dict[trimmed]) {
           const en = dict[trimmed];
           node.replaceWithText(`{t(\`${trimmed.replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/`/g, '\\`')}\`, \`${en.replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/`/g, '\\`')}\`)}`);
           fileModified = true;
           needsI18nImport = true;
        }
     } else if (node.getKind() === SyntaxKind.StringLiteral || node.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral) {
         let text = node.getLiteralText ? node.getLiteralText() : node.getText().slice(1, -1);
         const trimmed = text.trim();
         
         // Only translate if it's in string and contains Greek chars
         if (dict[trimmed] && /[α-ωΑ-Ω]/.test(trimmed)) {
             // Let's ensure this is inside JSX expression or valid context
             const parent = node.getParent();
             const en = dict[trimmed];
             
             // Check if it's already wrapped in t()
             if (parent.getKind() === SyntaxKind.CallExpression) {
                const expression = parent.getExpression();
                if (expression.getText() === 't') return; // already translated
             }
             
             const isJsxAttribute = parent.getKind() === SyntaxKind.JsxAttribute;
             const newText = `t(\`${trimmed.replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/`/g, '\\`')}\`, \`${en.replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/`/g, '\\`')}\`)`;
             
             if (isJsxAttribute) {
                 node.replaceWithText(`{${newText}}`);
             } else {
                 node.replaceWithText(newText);
             }
             
             fileModified = true;
             needsI18nImport = true;
         }
     }
  });

  if (needsI18nImport && fileModified) {
    // Check if useLanguage is already imported
    const imports = sourceFile.getImportDeclarations();
    const hasI18nImport = imports.some(i => i.getModuleSpecifierValue().includes('lib/i18n'));
    
    if (!hasI18nImport) {
        // Calculate relative path to lib/i18n
        const srcDir = path.join(__dirname, 'src');
        const fileDir = path.dirname(filePath);
        let relPath = path.relative(fileDir, path.join(srcDir, 'lib/i18n'));
        if (!relPath.startsWith('.')) relPath = `./${relPath}`;
        
        sourceFile.addImportDeclaration({
            namedImports: ['useLanguage'],
            moduleSpecifier: relPath
        });
    }

    // Check if t is defined in the component
    // Best effort insertion of useLanguage
    let hasT = false;
    sourceFile.forEachDescendant(node => {
        if (node.getKind() === SyntaxKind.VariableDeclaration && node.getName() === 't') {
           hasT = true;
        }
    });

    if (!hasT) {
       // Find the default export or main function component
        const mainFunction = sourceFile.getFunctions().find(f => f.isExported() || f.hasDefaultKeyword()) || 
                             sourceFile.getVariableDeclarations().find(v => {
                                 const type = v.getType();
                                 return type && v.getName() !== 't' && (v.getInitializer()?.getKind() === SyntaxKind.ArrowFunction);
                             });
                             
        if (mainFunction) {
            let funcBody;
            if (mainFunction.getKind() === SyntaxKind.VariableDeclaration) {
                funcBody = mainFunction.getInitializer().getBody();
            } else if (mainFunction.getBody) {
                funcBody = mainFunction.getBody();
            }
            
            if (funcBody && funcBody.getKind() === SyntaxKind.Block) {
                 funcBody.insertStatements(0, "const { t } = useLanguage();");
            }
        }
    }
  }

  if (fileModified) {
      console.log(`Saved translations to ${filePath}`);
      sourceFile.saveSync();
  }
});
