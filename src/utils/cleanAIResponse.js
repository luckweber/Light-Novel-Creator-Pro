// Sistema de Correção Inteligente usando IA
// Usa a própria IA para corrigir e adaptar respostas malformadas

class AICorrectionAgent {
  constructor(aiService) {
    this.aiService = aiService;
  }

  // Prompt para correção de JSON malformado
  getCorrectionPrompt(originalResponse, expectedStructure) {
    return `
Você é um especialista em correção de JSON. Sua tarefa é analisar uma resposta de IA que pode estar malformada e corrigi-la para um JSON válido.

RESPOSTA ORIGINAL DA IA:
${originalResponse}

ESTRUTURA ESPERADA (exemplo):
${JSON.stringify(expectedStructure, null, 2)}

INSTRUÇÕES:
1. Analise a resposta original e identifique os problemas
2. Extraia todas as informações úteis, mesmo que malformadas
3. Reconstrua um JSON válido seguindo a estrutura esperada
4. Se algum campo estiver faltando ou malformado, use informações do contexto para preenchê-lo
5. Mantenha o máximo possível do conteúdo original
6. Certifique-se de que o JSON seja válido e bem estruturado

RESPONDA APENAS COM O JSON CORRIGIDO, sem explicações adicionais.
`;
  }

  // Prompt para extração inteligente de campos
  getExtractionPrompt(originalResponse, fieldType) {
    const fieldExamples = {
      magicSystem: {
        name: "Nome do sistema mágico",
        description: "Descrição detalhada do sistema",
        rules: "Regras e mecânicas do sistema",
        source: "Fonte de poder mágico",
        limitations: "Limitações e custos"
      },
      government: {
        name: "Nome do governo",
        type: "Tipo de governo",
        description: "Descrição do sistema político",
        leaderTitle: "Título do líder",
        laws: "Leis principais"
      },
      language: {
        name: "Nome da língua",
        family: "Família linguística",
        speakers: "Quem fala esta língua",
        script: "Sistema de escrita",
        examples: "Exemplos de palavras"
      }
    };

    const examples = fieldExamples[fieldType] || fieldExamples.magicSystem;

    return `
Você é um especialista em extração de dados. Analise a resposta malformada e extraia as informações relevantes.

RESPOSTA ORIGINAL:
${originalResponse}

CAMPOS ESPERADOS:
${JSON.stringify(examples, null, 2)}

TAREFA:
1. Identifique e extraia cada campo da resposta original
2. Se um campo estiver malformado, use o contexto para inferir o valor correto
3. Se um campo estiver faltando, crie um valor apropriado baseado no contexto
4. Retorne um JSON válido com todos os campos preenchidos

RESPONDA APENAS COM O JSON CORRIGIDO.
`;
  }

  // Prompt para validação e melhoria
  getValidationPrompt(jsonObject, fieldType) {
    return `
Você é um especialista em validação de dados. Analise este JSON e melhore-o se necessário.

JSON ATUAL:
${JSON.stringify(jsonObject, null, 2)}

TIPO: ${fieldType}

TAREFA:
1. Verifique se todos os campos obrigatórios estão presentes
2. Melhore a qualidade e coerência dos dados
3. Adicione detalhes que possam estar faltando
4. Mantenha a estrutura original, apenas melhore o conteúdo
5. Certifique-se de que o JSON seja válido e bem estruturado

RESPONDA APENAS COM O JSON MELHORADO.
`;
  }

  // Método principal de correção usando IA
  async correctWithAI(originalResponse, fieldType = 'magicSystem') {
    try {
      console.log('🤖 Iniciando correção com IA...');
      
      // ESTRATÉGIA 1: Tentativa de correção direta
      try {
        const correctionPrompt = this.getCorrectionPrompt(originalResponse, this.getExpectedStructure(fieldType));
        const correctedResponse = await this.aiService.generateText(correctionPrompt);
        
        if (correctedResponse && typeof correctedResponse === 'object') {
          console.log('✅ Correção direta bem-sucedida');
          return this.addMetadata(correctedResponse);
        }
      } catch (error) {
        console.log('❌ Correção direta falhou, tentando extração...');
      }

      // ESTRATÉGIA 2: Extração inteligente de campos
      try {
        const extractionPrompt = this.getExtractionPrompt(originalResponse, fieldType);
        const extractedResponse = await this.aiService.generateText(extractionPrompt);
        
        if (extractedResponse && typeof extractedResponse === 'object') {
          console.log('✅ Extração bem-sucedida');
          return this.addMetadata(extractedResponse);
        }
      } catch (error) {
        console.log('❌ Extração falhou, tentando validação...');
      }

      // ESTRATÉGIA 3: Validação e melhoria de objeto parcial
      try {
        const partialObject = this.extractPartialObject(originalResponse);
        if (partialObject && Object.keys(partialObject).length > 0) {
          const validationPrompt = this.getValidationPrompt(partialObject, fieldType);
          const validatedResponse = await this.aiService.generateText(validationPrompt);
          
          if (validatedResponse && typeof validatedResponse === 'object') {
            console.log('✅ Validação bem-sucedida');
            return this.addMetadata(validatedResponse);
          }
        }
      } catch (error) {
        console.log('❌ Validação falhou, usando fallback...');
      }

      // ESTRATÉGIA 4: Fallback inteligente
      console.log('🔄 Usando fallback inteligente...');
      return this.createIntelligentFallback(originalResponse, fieldType);

    } catch (error) {
      console.error('Erro na correção com IA:', error);
      return this.createBasicFallback(originalResponse, fieldType);
    }
  }

  // Extrai objeto parcial da resposta malformada
  extractPartialObject(response) {
    try {
      // Tenta extrair JSON válido da resposta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const partialJson = jsonMatch[0];
        
        // Tenta corrigir problemas básicos
        let cleaned = partialJson
          .replace(/[""]/g, '"')
          .replace(/['']/g, "'")
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/,\s*,/g, ',');
        
        // Adiciona fechamentos faltantes
        const openBraces = (cleaned.match(/\{/g) || []).length;
        const closeBraces = (cleaned.match(/\}/g) || []).length;
        if (openBraces > closeBraces) {
          cleaned += '}'.repeat(openBraces - closeBraces);
        }
        
        const parsed = JSON.parse(cleaned);
        return parsed;
      }
    } catch (error) {
      console.log('Não foi possível extrair objeto parcial');
    }
    
    return null;
  }

  // Cria fallback inteligente baseado no contexto
  createIntelligentFallback(response, fieldType) {
    const fallbacks = {
      magicSystem: {
        name: this.extractName(response) || 'Sistema Mágico Misterioso',
        description: this.extractDescription(response) || 'Um sistema de magia único e poderoso',
        rules: 'Regras e mecânicas do sistema mágico',
        source: 'Fonte de poder mágico',
        limitations: 'Limitações e custos do sistema'
      },
      government: {
        name: this.extractName(response) || 'Sistema Político',
        type: this.extractType(response) || 'Democracia',
        description: this.extractDescription(response) || 'Sistema de governo bem estruturado',
        leaderTitle: 'Líder do governo',
        laws: 'Leis e regulamentações principais'
      },
      language: {
        name: this.extractName(response) || 'Língua Local',
        family: 'Família linguística',
        speakers: 'Falantes nativos',
        script: 'Sistema de escrita',
        examples: { hello: 'Olá', goodbye: 'Adeus', water: 'Água' }
      }
    };

    const fallback = fallbacks[fieldType] || fallbacks.magicSystem;
    return this.addMetadata({
      ...fallback,
      error: 'Resposta processada com correção inteligente',
      originalResponse: response.substring(0, 200) + '...'
    });
  }

  // Cria fallback básico
  createBasicFallback(response, fieldType) {
    return this.addMetadata({
      name: 'Item Gerado',
      description: 'Item gerado automaticamente',
      error: 'Falha no processamento da resposta da IA',
      fieldType: fieldType,
      originalResponse: response.substring(0, 100) + '...',
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    });
  }

  // Extrai nome da resposta
  extractName(response) {
    const nameMatch = response.match(/"name"\s*:\s*"([^"]*)"/);
    return nameMatch ? nameMatch[1] : null;
  }

  // Extrai descrição da resposta
  extractDescription(response) {
    const descMatch = response.match(/"description"\s*:\s*"([^"]*)"/);
    return descMatch ? descMatch[1] : null;
  }

  // Extrai tipo da resposta
  extractType(response) {
    const typeMatch = response.match(/"type"\s*:\s*"([^"]*)"/);
    return typeMatch ? typeMatch[1] : null;
  }

  // Adiciona metadados ao objeto
  addMetadata(obj) {
    return {
      ...obj,
      generatedBy: 'AI',
      createdAt: new Date().toISOString(),
      correctedBy: 'AICorrectionAgent'
    };
  }

  // Retorna estrutura esperada para cada tipo
  getExpectedStructure(fieldType) {
    const structures = {
      magicSystem: {
        name: "Nome do sistema mágico",
        description: "Descrição detalhada",
        rules: "Regras e mecânicas",
        source: "Fonte de poder",
        limitations: "Limitações e custos"
      },
      government: {
        name: "Nome do governo",
        type: "Tipo de governo",
        description: "Descrição do sistema",
        leaderTitle: "Título do líder",
        laws: "Leis principais"
      },
      language: {
        name: "Nome da língua",
        family: "Família linguística",
        speakers: "Falantes",
        script: "Sistema de escrita",
        examples: "Exemplos de palavras"
      }
    };

    return structures[fieldType] || structures.magicSystem;
  }
}

// Instância global do agente (será inicializada quando necessário)
let aiCorrectionAgent = null;

// Função principal de limpeza adaptativa usando IA
export async function cleanAIResponse(response, fieldType = 'magicSystem', aiService = null) {
  if (!response) return null;
  
  // Se já é um objeto, apenas adiciona metadados
  if (typeof response === 'object' && response !== null) {
    if (!response.generatedBy) {
      response.generatedBy = 'AI';
      response.createdAt = new Date().toISOString();
    }
    return response;
  }
  
  // Se não temos aiService, usa fallback síncrono
  if (!aiService) {
    console.log('⚠️ Sem aiService, usando fallback síncrono...');
    return cleanAIResponseSync(response, fieldType);
  }
  
  console.log('🧠 Usando IA para corrigir resposta malformada...');
  
  try {
    // Inicializa o agente se necessário
    if (!aiCorrectionAgent) {
      aiCorrectionAgent = new AICorrectionAgent(aiService);
    }
    
    // Usa o agente de IA para corrigir
    const corrected = await aiCorrectionAgent.correctWithAI(response, fieldType);
    console.log('✅ Resposta corrigida com sucesso pela IA');
    return corrected;
  } catch (error) {
    console.error('❌ Erro na correção com IA:', error);
    
    // Fallback para método anterior se a IA falhar
    return {
      name: 'Item Gerado',
      description: 'Item gerado automaticamente',
      error: 'Falha na correção com IA',
      fieldType: fieldType,
      generatedBy: 'AI',
      createdAt: new Date().toISOString()
    };
  }
}

// Função síncrona para compatibilidade (usa fallback)
export function cleanAIResponseSync(response, fieldType = 'magicSystem') {
  if (!response) return null;
  
  if (typeof response === 'object' && response !== null) {
    if (!response.generatedBy) {
      response.generatedBy = 'AI';
      response.createdAt = new Date().toISOString();
    }
    return response;
  }
  
  // Fallback síncrono simples
  const fallback = aiCorrectionAgent.createIntelligentFallback(response, fieldType);
  return fallback;
}

export default cleanAIResponse;