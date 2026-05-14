const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');
const { Project, SyntaxKind } = require('ts-morph');
require('dotenv').config();

// Simple cache to avoid re-translating and hitting rate limits quickly
const transCache = {};

async function translateStrings(strings) {
    const map = {};
    for (let i = 0; i < strings.length; i++) {
        const text = strings[i];
        if (transCache[text]) {
            map[text] = transCache[text];
            continue;
        }
        
        try {
            console.log(`Translating ${i+1}/${strings.length}:`, text.substring(0, 30));
            const resp = await translate(text, { to: 'en' });
            map[text] = resp.text;
            transCache[text] = resp.text;
            
            // tiny sleep to avoid rate limits
            await new Promise(r => setTimeout(r, 200));
        } catch (e) {
            console.error("Translation fail for:", text, e.message);
            // fallback
            map[text] = text;
        }
    }
    return map;
}

// Ensure the local `t` logic handles translations. Wait, if we rewrite the file, we can just inject `{t('Greek', 'English')}`!

async function run() {
    const project = new Project();
    project.addSourceFilesAtPaths("src/**/*.tsx");
    
    // First, collect all Greek strings directly from AST!
    const greekRegex = /[\u0370-\u03FF\u1F00-\u1FFF]/;
    const allGreek = new Set();
    
    const filesToModify = [];

    for (const sourceFile of project.getSourceFiles()) {
        const filepath = sourceFile.getFilePath();
        let hasGreek = false;
        
        sourceFile.forEachDescendant(node => {
            if (node.getKind() === SyntaxKind.JsxText) {
                const text = node.getLiteralText();
                if (greekRegex.test(text) && text.trim().length > 0) {
                    allGreek.add(text.trim());
                    hasGreek = true;
                }
            } else if (node.getKind() === SyntaxKind.StringLiteral) {
                const text = node.getLiteralValue();
                if (greekRegex.test(text) && text.trim().length > 0) {
                    allGreek.add(text.trim());
                    hasGreek = true;
                }
            }
        });
        
        if (hasGreek) filesToModify.push(sourceFile);
    }
    
    console.log(`Found ${allGreek.size} Greek strings in ${filesToModify.length} files.`);
    const stringsArray = Array.from(allGreek);
    const translationMap = await translateStrings(stringsArray);
    
    for (const sourceFile of filesToModify) {
        const filepath = sourceFile.getFilePath();
        let needsImport = false;
        
        // Let's iterate and replace
        // Since replacing AST nodes can invalidate previous nodes, we do it carefully or just replace all in one pass.
        // Actually, the simplest is to find them, record translations, and do a string replace on the source to be safe,
        // or just use node.replaceWithText().
        // When replacing from bottom up, it preserves positions.
        
        const nodesToReplace = [];
        sourceFile.forEachDescendant(node => {
            if (node.getKind() === SyntaxKind.JsxText) {
                const text = node.getLiteralText();
                if (greekRegex.test(text) && text.trim().length > 0) {
                    nodesToReplace.push({ type: 'JsxText', node, text: text.trim() });
                }
            } else if (node.getKind() === SyntaxKind.StringLiteral) {
                const text = node.getLiteralValue();
                // Check if it's inside a JsxAttribute
                const parent = node.getParent();
                if (greekRegex.test(text) && text.trim().length > 0 && parent && parent.getKind() === SyntaxKind.JsxAttribute) {
                    nodesToReplace.push({ type: 'JsxAttributeString', node, text: text.trim() });
                }
            }
        });
        
        if (nodesToReplace.length === 0) continue;
        needsImport = true;
        
        // Reverse array to avoid offset invalidation
        nodesToReplace.reverse().forEach(({ type, node, text }) => {
            const en = (translationMap[text] || text).replace(/`/g, "\\`").replace(/\$/g, "\\$");
            const safeText = text.replace(/`/g, "\\`").replace(/\$/g, "\\$");
            if (type === 'JsxText') {
                node.replaceWithText(`{t(\`${safeText}\`, \`${en}\`)}`);
            } else if (type === 'JsxAttributeString') {
                 // wrap string literal in JSX Expression
                 node.replaceWithText(`{t(\`${safeText}\`, \`${en}\`)}`);
            }
        });
        
        if (needsImport) {
            // Find the main component function to inject `const { t } = useLanguage();`
            const functions = sourceFile.getFunctions();
            // or arrow functions in variable declarations
            sourceFile.getVariableDeclarations().forEach(vd => {
                const init = vd.getInitializer();
                if (init && (init.getKind() === SyntaxKind.ArrowFunction || init.getKind() === SyntaxKind.FunctionExpression)) {
                     // Check if it returns JSX
                     if (init.getBodyText() && init.getBodyText().includes('<')) {
                          if (!init.getBodyText().includes('useLanguage()')) {
                              init.insertStatements(0, 'const { t } = useLanguage();');
                          }
                     }
                }
            });
            
            functions.forEach(fn => {
                 if (fn.getBodyText() && fn.getBodyText().includes('<')) {
                      if (!fn.getBodyText().includes('useLanguage()')) {
                          fn.insertStatements(0, 'const { t } = useLanguage();');
                      }
                 }
            });
            
            // Add import if missing
            const projectRoot = path.resolve(__dirname, 'src');
            const targetMod = path.join(projectRoot, 'lib', 'i18n');
            let rel = path.relative(path.dirname(filepath), targetMod);
            if (!rel.startsWith('.')) rel = './' + rel;
            const libPath = rel;
            
            const importDecs = sourceFile.getImportDeclarations();
            const hasI18n = importDecs.some(id => id.getModuleSpecifierValue().includes('i18n'));
            if (!hasI18n) {
                sourceFile.addImportDeclaration({
                    namedImports: ['useLanguage'],
                    moduleSpecifier: libPath
                });
            }
        }
    }
    
    await project.save();
    console.log("Translation injection completed.");
}

run().catch(console.error);
