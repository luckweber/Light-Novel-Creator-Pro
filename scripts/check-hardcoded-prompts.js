#!/usr/bin/env node

/**
 * Script para verificar prompts hardcoded que precisam ser migrados
 * para o sistema unificado de prompts
 */

const fs = require('fs');
const path = require('path');

// Padrões para identificar prompts hardcoded
const HARDCODED_PATTERNS = [
  /Crie um.*para uma light novel/gi,
  /AI_PROMPTS\./gi,
  /const prompts = {/gi,
  /let fullPrompt =/gi,
  /const tipsPrompt =/gi,
  /const insightsPrompt =/gi,
  /const analysisPrompt =/gi,
  /const contextualPrompt =/gi,
  /const basePrompt =/gi,
  /const finalPrompt =/gi,
  /const smartPrompt =/gi,
  /const enhancedPrompt =/gi,
  /const worldContext =/gi,
  /const projectContext =/gi,
  /const contextAnalysis =/gi
];

// Arquivos que devem ser verificados
const TARGET_FILES = [
  'src/pages/WorldBuilder.js',
  'src/pages/CharacterGenerator.js',
  'src/pages/LoreGenerator.js',
  'src/pages/NarrativeGenerator.js',
  'src/pages/AIAssistant.js',
  'src/hooks/useAIAgent.js',
  'src/utils/aiProviders.js'
];

// Categorias de prompts que devem estar no promptBank
const EXPECTED_CATEGORIES = [
  'geography',
  'cultures', 
  'systems',
  'history',
  'characters',
  'lore',
  'narrative',
  'analysis',
  'worldInfo'
];

function checkFile(filePath) {
  console.log(`\n🔍 Verificando: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${filePath}`);
    return { file: filePath, found: false, issues: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const lines = content.split('\n');

  // Verificar padrões hardcoded
  HARDCODED_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const lineNumber = lines.findIndex(line => line.includes(match)) + 1;
        issues.push({
          type: 'hardcoded_prompt',
          pattern: pattern.source,
          match: match.substring(0, 100) + (match.length > 100 ? '...' : ''),
          line: lineNumber,
          severity: 'high'
        });
      });
    }
  });

  // Verificar uso de AI_PROMPTS
  const aiPromptsUsage = content.match(/AI_PROMPTS\.(\w+)/g);
  if (aiPromptsUsage) {
    aiPromptsUsage.forEach(usage => {
      const lineNumber = lines.findIndex(line => line.includes(usage)) + 1;
      issues.push({
        type: 'ai_prompts_usage',
        usage: usage,
        line: lineNumber,
        severity: 'medium',
        suggestion: `Substituir por UnifiedPromptIntegration`
      });
    });
  }

  // Verificar funções que precisam ser migradas
  const functionsToMigrate = [
    'generateLocation',
    'generatePeople', 
    'generateEvent',
    'generateMagicSystem',
    'generateReligion',
    'generateTechnology',
    'generateGovernment',
    'generateEconomy',
    'generateBasicInfo',
    'generateFullCharacter',
    'generateFullLoreItem',
    'generateAIResponse',
    'getQualityTips',
    'getVolumeInsights',
    'analyzeProject',
    'generateSmartElement'
  ];

  functionsToMigrate.forEach(funcName => {
    if (content.includes(funcName)) {
      const lineNumber = lines.findIndex(line => line.includes(funcName)) + 1;
      issues.push({
        type: 'function_to_migrate',
        function: funcName,
        line: lineNumber,
        severity: 'medium',
        suggestion: `Migrar para usar UnifiedPromptIntegration`
      });
    }
  });

  return {
    file: filePath,
    found: true,
    issues: issues,
    totalIssues: issues.length
  };
}

function checkPromptBank() {
  console.log('\n📚 Verificando Prompt Bank...');
  
  const promptBankPath = 'src/utils/promptBank.js';
  if (!fs.existsSync(promptBankPath)) {
    console.log('❌ Prompt Bank não encontrado!');
    return;
  }

  const content = fs.readFileSync(promptBankPath, 'utf8');
  const missingCategories = [];

  EXPECTED_CATEGORIES.forEach(category => {
    if (!content.includes(`// Prompts para ${category}`) && 
        !content.includes(`${category}: {`)) {
      missingCategories.push(category);
    }
  });

  if (missingCategories.length > 0) {
    console.log('⚠️  Categorias faltando no Prompt Bank:');
    missingCategories.forEach(cat => console.log(`   - ${cat}`));
  } else {
    console.log('✅ Todas as categorias esperadas estão presentes no Prompt Bank');
  }

  // Verificar se há prompts duplicados
  const duplicatePatterns = [
    /Crie um local.*para uma light novel/gi,
    /Crie um povo.*para uma light novel/gi,
    /Crie um evento.*para uma light novel/gi
  ];

  duplicatePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches && matches.length > 1) {
      console.log(`⚠️  Possível duplicação encontrada: ${pattern.source}`);
    }
  });
}

function generateMigrationReport(results) {
  console.log('\n📊 RELATÓRIO DE MIGRAÇÃO DE PROMPTS');
  console.log('=====================================');

  let totalIssues = 0;
  let highSeverityIssues = 0;
  let filesWithIssues = 0;

  results.forEach(result => {
    if (result.found && result.issues.length > 0) {
      filesWithIssues++;
      totalIssues += result.issues.length;
      
      console.log(`\n📁 ${result.file}`);
      console.log(`   ${result.issues.length} problemas encontrados`);
      
      result.issues.forEach(issue => {
        const icon = issue.severity === 'high' ? '🔴' : '🟡';
        console.log(`   ${icon} Linha ${issue.line}: ${issue.type}`);
        console.log(`      ${issue.match || issue.usage || issue.function}`);
        if (issue.suggestion) {
          console.log(`      💡 ${issue.suggestion}`);
        }
        
        if (issue.severity === 'high') {
          highSeverityIssues++;
        }
      });
    }
  });

  console.log('\n📈 RESUMO:');
  console.log(`   Arquivos verificados: ${results.length}`);
  console.log(`   Arquivos com problemas: ${filesWithIssues}`);
  console.log(`   Total de problemas: ${totalIssues}`);
  console.log(`   Problemas de alta severidade: ${highSeverityIssues}`);

  if (highSeverityIssues > 0) {
    console.log('\n🚨 AÇÃO NECESSÁRIA:');
    console.log('   Migrar prompts hardcoded para o sistema unificado');
  } else {
    console.log('\n✅ SITUAÇÃO:');
    console.log('   Todos os prompts já estão migrados ou não há problemas críticos');
  }
}

function generateMigrationSteps(results) {
  console.log('\n🛠️  PASSOS PARA MIGRAÇÃO:');
  console.log('========================');

  const steps = [];

  // Passo 1: Importar UnifiedPromptIntegration
  const filesNeedingImport = results.filter(r => 
    r.found && r.issues.some(i => i.type === 'function_to_migrate')
  );
  
  if (filesNeedingImport.length > 0) {
    steps.push({
      step: 1,
      title: 'Adicionar Import',
      description: 'Importar UnifiedPromptIntegration nos arquivos',
      files: filesNeedingImport.map(r => r.file)
    });
  }

  // Passo 2: Substituir funções hardcoded
  const functionsToReplace = new Set();
  results.forEach(result => {
    result.issues.forEach(issue => {
      if (issue.type === 'function_to_migrate') {
        functionsToReplace.add(issue.function);
      }
    });
  });

  if (functionsToReplace.size > 0) {
    steps.push({
      step: 2,
      title: 'Substituir Funções',
      description: 'Substituir funções hardcoded por UnifiedPromptIntegration',
      functions: Array.from(functionsToReplace)
    });
  }

  // Passo 3: Remover AI_PROMPTS
  const filesWithAIPrompts = results.filter(r => 
    r.found && r.issues.some(i => i.type === 'ai_prompts_usage')
  );

  if (filesWithAIPrompts.length > 0) {
    steps.push({
      step: 3,
      title: 'Remover AI_PROMPTS',
      description: 'Remover uso de AI_PROMPTS e substituir por sistema unificado',
      files: filesWithAIPrompts.map(r => r.file)
    });
  }

  steps.forEach(step => {
    console.log(`\n${step.step}. ${step.title}`);
    console.log(`   ${step.description}`);
    if (step.files) {
      console.log(`   Arquivos: ${step.files.join(', ')}`);
    }
    if (step.functions) {
      console.log(`   Funções: ${step.functions.join(', ')}`);
    }
  });
}

// Executar verificação
console.log('🔍 VERIFICANDO PROMPTS HARDCODED');
console.log('================================');

const results = TARGET_FILES.map(checkFile);
checkPromptBank();
generateMigrationReport(results);
generateMigrationSteps(results);

console.log('\n📖 Para mais informações, consulte:');
console.log('   - UNIFIED_PROMPT_INTEGRATION_README.md');
console.log('   - src/utils/promptBank.js');
console.log('   - src/utils/unifiedPromptIntegration.js');
