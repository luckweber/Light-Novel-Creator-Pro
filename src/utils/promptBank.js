// Banco de Prompts para WorldBuilder
// Organização estruturada de prompts para geração de conteúdo com IA

// Configurações base para prompts
const PROMPT_CONFIG = {
  language: 'portuguese',
  format: 'json',
  style: 'light_novel',
  tone: 'creative_and_detailed'
};

// Regras gerais para todos os prompts
const RULES = {
  jsonFormat: `REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. NÃO inclua texto explicativo antes ou depois do JSON
3. NÃO use markdown ou blocos de código
4. Use aspas duplas para strings
5. Escape caracteres especiais nas strings`,
  
  contextAware: `CONTEXTO DO MUNDO:
- Nome: {worldName}
- Gênero: {genre}
- Nível Tecnológico: {techLevel}
- Descrição: {description}`,
  
  consistency: `REGRAS DE COERÊNCIA:
- Mantenha consistência com elementos existentes
- Evite contradições com a lore estabelecida
- Considere o nível tecnológico do mundo
- Respeite o gênero e atmosfera estabelecidos`
};

// Prompts base para diferentes tipos de elementos
export const BASE_PROMPTS = {
  // Regras gerais para todos os prompts
  rules: RULES,

  // Prompts para informações básicas do mundo
  worldInfo: {
    basic: `Crie informações básicas completas para um mundo de light novel. Inclua:

- Nome do mundo (criativo e memorável)
- Descrição geral detalhada (atmosfera, características principais, história geral)
- Gênero apropriado (fantasy, sci-fi, urban-fantasy, historical, modern, post-apocalyptic, steampunk, cyberpunk)
- Nível tecnológico (stone-age, bronze-age, iron-age, medieval, renaissance, industrial, modern, futuristic)

Considere criar um mundo único com:
- Elementos distintivos que o tornem memorável
- Atmosfera envolvente para uma light novel
- Possibilidades de narrativas interessantes
- Aspectos culturais e sociais ricos

${RULES.jsonFormat}

Formato exato:
{
  "name": "Nome do Mundo",
  "description": "Descrição detalhada do mundo...",
  "genre": "fantasy",
  "techLevel": "medieval"
}`
  },

  // Prompts para geografia
  geography: {
    location: {
      random: `Crie um local único e interessante para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome criativo e evocativo
- Tipo de local (cidade, floresta, castelo, etc.)
- Descrição visual detalhada
- História e significado cultural
- Habitantes típicos
- Pontos de interesse importantes
- Atmosfera e sensações únicas

Formato exato:
{
  "name": "Nome do Local",
  "type": "tipo",
  "description": "Descrição detalhada...",
  "climate": "Clima predominante",
  "population": "Informações sobre população",
  "culture": "Aspectos culturais",
  "government": "Sistema de governo",
  "economy": "Base econômica",
  "pointsOfInterest": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "atmosphere": "Descrição da atmosfera",
  "secrets": "Segredos ou mistérios do local"
}`,

      city: `Crie uma cidade fascinante para uma light novel com arquitetura única, distritos interessantes, e uma rica vida urbana.

${RULES.jsonFormat}

Formato exato:
{
  "name": "Nome da Cidade",
  "type": "cidade",
  "description": "Descrição detalhada...",
  "climate": "Clima predominante",
  "population": "Informações sobre população",
  "culture": "Aspectos culturais",
  "government": "Sistema de governo",
  "economy": "Base econômica",
  "pointsOfInterest": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "atmosphere": "Descrição da atmosfera",
  "secrets": "Segredos ou mistérios do local"
}`,
      
      wilderness: `Crie uma área selvagem misteriosa com paisagens únicas, criaturas interessantes e segredos ocultos.

${RULES.jsonFormat}

Formato exato:
{
  "name": "Nome da Área Selvagem",
  "type": "selvagem",
  "description": "Descrição detalhada...",
  "climate": "Clima predominante",
  "population": "Informações sobre população",
  "culture": "Aspectos culturais",
  "government": "Sistema de governo",
  "economy": "Base econômica",
  "pointsOfInterest": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "atmosphere": "Descrição da atmosfera",
  "secrets": "Segredos ou mistérios do local"
}`,
      
      mystical: `Crie um local mágico com propriedades sobrenaturais, energia mística e fenômenos inexplicáveis.

${RULES.jsonFormat}

Formato exato:
{
  "name": "Nome do Local Mágico",
  "type": "mágico",
  "description": "Descrição detalhada...",
  "climate": "Clima predominante",
  "population": "Informações sobre população",
  "culture": "Aspectos culturais",
  "government": "Sistema de governo",
  "economy": "Base econômica",
  "pointsOfInterest": ["Ponto 1", "Ponto 2", "Ponto 3"],
  "atmosphere": "Descrição da atmosfera",
  "secrets": "Segredos ou mistérios do local"
}`
    },

    region: `Crie uma região geográfica única e detalhada para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome da região
- Tipo geográfico (montanhoso, costeiro, desértico, etc.)
- Clima e variações sazonais
- Terreno e topografia
- Recursos naturais
- População e distribuição
- Principais assentamentos
- Rotas comerciais
- Características únicas
- Perigos naturais
- Importância estratégica

Formato exato:
{
  "name": "Nome da Região",
  "type": "Tipo Geográfico",
  "climate": "Clima Predominante",
  "seasonalVariations": "Variações Sazonais",
  "terrain": "Terreno e Topografia",
  "naturalResources": "Recursos Naturais",
  "population": "População Estimada",
  "distribution": "Distribuição",
  "settlements": "Principais Assentamentos e Cidades",
  "tradeRoutes": "Rotas Comerciais e de Transporte",
  "uniqueFeatures": "Características Ambientais Únicas",
  "dangers": "Perigos Naturais ou Sobrenaturais",
  "strategicImportance": "Importância Estratégica ou Econômica",
  "conflicts": "Conflitos Territoriais ou Disputas",
  "floraFauna": "Flora e Fauna Características",
  "waterResources": "Recursos Hídricos",
  "connectivity": "Conectividade com Outras Regiões"
}`,

    landmark: `Crie um marco ou ponto de referência único para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome do marco
- Tipo (natural, construído, místico, etc.)
- Importância histórica ou cultural
- Localização específica
- Características especiais
- Lendas associadas
- Como acessar
- Perigos ou desafios
- Impacto na narrativa

Formato exato:
{
  "name": "Nome do Marco",
  "type": "Tipo do Marco",
  "significance": "Importância Histórica",
  "location": "Localização Específica",
  "features": "Características Especiais",
  "legends": "Lendas Associadas",
  "access": "Como Acessar",
  "dangers": "Perigos ou Desafios",
  "narrativeImpact": "Impacto na Narrativa"
}`,

    resource: `Crie um recurso natural ou material único para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome do recurso
- Tipo (mineral, vegetal, animal, místico, etc.)
- Nível de raridade
- Principais usos
- Onde é encontrado
- Métodos de extração
- Valor econômico
- Propriedades especiais
- Impacto na sociedade

Formato exato:
{
  "name": "Nome do Recurso",
  "type": "Tipo do Recurso",
  "rarity": "Nível de Raridade",
  "uses": "Principais Usos",
  "location": "Onde é Encontrado",
  "extraction": "Métodos de Extração",
  "value": "Valor Econômico",
  "properties": "Propriedades Especiais",
  "impact": "Impacto na Sociedade"
}`
  },

  // Prompts para culturas
  cultures: {
    people: `Crie um povo ou raça para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome
- Classificação (humano, elfo, etc.)
- Descrição física e cultural
- Sociedade e estrutura política
- Tradições e costumes

Formato exato:
{
  "name": "Nome",
  "classification": "Classificação",
  "description": "Descrição",
  "society": "Sociedade",
  "traditions": "Tradições",
  "appearance": "Aparência"
}`,

    language: `Crie um idioma único para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome do idioma
- Família linguística
- Principais falantes
- Sistema de escrita
- Exemplos de palavras
- Dialetos regionais
- Influências culturais
- Status social
- Evolução histórica

Formato exato:
{
  "name": "Nome do Idioma",
  "family": "Família Linguística",
  "speakers": "Principais Falantes",
  "script": "Sistema de Escrita",
  "examples": "Exemplos de Palavras",
  "dialects": "Dialetos Regionais",
  "culturalInfluence": "Influências Culturais",
  "socialStatus": "Status Social",
  "evolution": "Evolução Histórica"
}`,

    religion: `Crie uma religião única para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome da religião
- Principais divindades ou conceitos
- Descrição das crenças centrais
- Práticas e rituais
- Seguidores principais
- Símbolos sagrados

Formato exato:
{
  "name": "Nome da Religião",
  "deities": "Divindades principais",
  "description": "Crenças centrais",
  "practices": "Práticas e rituais",
  "followers": "Principais seguidores",
  "symbols": "Símbolos sagrados"
}`,

    tradition: `Crie uma tradição cultural única para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome da tradição
- Tipo da tradição
- Origem histórica
- Como é praticada
- Significado cultural
- Quem participa
- Quando ocorre
- Elementos simbólicos
- Variações regionais
- Importância social
- Evolução histórica
- Conflitos ou controvérsias

Formato exato:
{
  "name": "Nome da Tradição",
  "type": "Tipo da Tradição",
  "origin": "Origem Histórica",
  "practice": "Como é Praticada",
  "meaning": "Significado Cultural",
  "participants": "Quem Participa",
  "frequency": "Quando Ocorre",
  "symbols": "Elementos Simbólicos",
  "variations": "Variações Regionais",
  "importance": "Importância Social",
  "evolution": "Evolução Histórica",
  "conflicts": "Conflitos ou Controvérsias"
}`
  },

  // Prompts para sistemas
  systems: {
    magic: `Crie um sistema de magia único para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome do sistema
- Descrição detalhada
- Regras e funcionamento
- Fonte de poder
- Limitações e custos

Formato exato:
{
  "name": "Nome do Sistema",
  "description": "Descrição detalhada",
  "rules": "Regras de funcionamento",
  "source": "Fonte de poder",
  "limitations": "Limitações e custos"
}`,

    technology: `Crie uma tecnologia única para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome da tecnologia
- Nível tecnológico (ex: Medieval, Renascentista, Industrial, Futurista)
- Descrição detalhada de como funciona
- Principais aplicações e usos
- Impacto na sociedade

Formato exato:
{
  "name": "Nome da Tecnologia",
  "level": "Nível Tecnológico",
  "description": "Descrição detalhada",
  "applications": "Aplicações e usos",
  "impact": "Impacto na sociedade"
}`,

    government: `Crie um sistema político/governo único para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome do governo (ex: Império de Eldoria)
- Tipo de governo (ex: Monarquia, República, Teocracia)
- Descrição da estrutura de poder
- Título do líder (ex: Imperador, Presidente, Sumo Sacerdote)
- Leis e ideologias principais

Formato exato:
{
  "name": "Nome do Governo",
  "type": "Tipo de Governo",
  "description": "Estrutura de poder",
  "leaderTitle": "Título do Líder",
  "laws": "Leis e ideologias"
}`,

    economy: `Crie um sistema econômico único para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome do sistema econômico
- Tipo de economia (agrária, mercantil, industrial, etc.)
- Moeda principal
- Principais exportações
- Distribuição de riqueza
- Sistema de comércio
- Instituições financeiras
- Relações econômicas

Formato exato:
{
  "name": "Nome do Sistema Econômico",
  "type": "Tipo de Economia",
  "currency": "Moeda Principal",
  "mainExports": "Principais Exportações",
  "wealthDistribution": "Distribuição de Riqueza",
  "tradeSystem": "Sistema de Comércio",
  "financialInstitutions": "Instituições Financeiras",
  "economicRelations": "Relações Econômicas"
}`
  },

  // Prompts para história
  history: {
    event: `Crie um evento histórico para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome do evento
- Ano aproximado
- Tipo (político, guerra, descoberta, etc.)
- Descrição detalhada
- Impacto no mundo
- Principais participantes

Formato exato:
{
  "name": "Nome do Evento",
  "year": "Ano",
  "type": "Tipo",
  "description": "Descrição",
  "impact": "Impacto",
  "participants": "Participantes"
}`,

    era: `Crie uma era histórica para uma light novel.

${RULES.jsonFormat}

Inclua:
- Nome da era
- Período de tempo (anos de início e fim)
- Descrição geral da era
- Características principais
- Eventos marcantes
- Figuras importantes
- Mudanças culturais e tecnológicas

Formato exato:
{
  "name": "Nome da Era",
  "startYear": "Ano de início",
  "endYear": "Ano de fim",
  "description": "Descrição geral da era",
  "characteristics": "Características principais da era",
  "majorEvents": "Eventos marcantes da era",
  "keyFigures": "Figuras importantes da era",
  "culturalChanges": "Mudanças culturais",
  "technologicalAdvances": "Avanços tecnológicos"
}`
  },

  // Prompts para personagens
  characters: {
    basic: `Crie um personagem para uma light novel usando o CONTEXTO DO MUNDO fornecido. O personagem deve ser coeso com o universo descrito.

Considere as seguintes características:
- Nome único e interessante, apropriado para a cultura local (se aplicável).
- Idade e aparência física detalhada, influenciada pela etnia ou povo da região de origem.
- Personalidade complexa com virtudes e defeitos.
- Histórico pessoal interessante, conectado à história ou eventos do mundo.
- Objetivos e motivações claras.
- Habilidades ou talentos especiais, consistentes com os sistemas de magia ou tecnologia do mundo.

${RULES.jsonFormat}

Formato da resposta em JSON:
{
  "name": "",
  "age": "",
  "appearance": "",
  "personality": "",
  "background": "",
  "goals": "",
  "abilities": ""
}`,
    
    detailed: `Crie um personagem profundamente desenvolvido para uma light novel, usando o CONTEXTO DO MUNDO fornecido:

INFORMAÇÕES BÁSICAS:
- Nome completo (com significado)
- Idade, gênero, altura, peso
- Aparência detalhada (cabelos, olhos, estilo)

PERSONALIDADE:
- Traços principais de personalidade
- Virtudes e defeitos
- Medos e inseguranças
- Forma de falar e maneirismos

HISTÓRIA:
- Origem e família
- Eventos importantes do passado
- Relacionamentos significativos
- Traumas ou experiências marcantes

HABILIDADES E PAPEL:
- Talentos naturais
- Habilidades aprendidas
- Papel na história (protagonista, antagonista, etc.)
- Arco de desenvolvimento

${RULES.jsonFormat}

Formate como JSON estruturado.`
  },

  // Prompts para lore
  lore: {
    legend: `Crie uma lenda para uma light novel baseado no CONTEXTO DO MUNDO fornecido. A lenda deve ser coesa com o universo.

${RULES.jsonFormat}

Responda APENAS com o código JSON, seguindo esta estrutura exata:
{
  "name": "Título da Lenda",
  "description": "A história completa da lenda.",
  "origin": "Onde ou como a lenda surgiu.",
  "significance": "Qual a importância ou lição moral da lenda.",
  "characters": "Personagens míticos envolvidos.",
  "locations": "Locais onde a lenda acontece."
}`,
    
    artifact: `Desenvolva um artefato para uma light novel, baseado no CONTEXTO DO MUNDO.

${RULES.jsonFormat}

Responda APENAS com o código JSON, seguindo esta estrutura exata:
{
  "name": "Nome do Artefato",
  "description": "Aparência e história do artefato.",
  "origin": "Quem o criou e como.",
  "significance": "Qual sua importância para a história.",
  "effects": "Quais seus poderes, habilidades e custos/limitações."
}`,

    myth: `Crie um mito para uma light novel baseado no CONTEXTO DO MUNDO fornecido.

${RULES.jsonFormat}

Formato exato:
{
  "name": "Título do Mito",
  "description": "História completa do mito",
  "origin": "Origem do mito",
  "significance": "Significado cultural",
  "characters": "Personagens divinos envolvidos",
  "lessons": "Lições ou ensinamentos",
  "variations": "Variações regionais",
  "influence": "Influência na sociedade"
}`,

    prophecy: `Crie uma profecia para uma light novel baseado no CONTEXTO DO MUNDO fornecido.

${RULES.jsonFormat}

Formato exato:
{
  "name": "Título da Profecia",
  "description": "Texto da profecia",
  "origin": "Origem da profecia",
  "interpretation": "Interpretações possíveis",
  "fulfillment": "Como pode ser cumprida",
  "significance": "Importância para a história",
  "prophet": "Quem fez a profecia",
  "conditions": "Condições para cumprimento"
}`
  },

  // Prompts para narrativa
  narrative: {
    plot: `Gere um ponto de enredo interessante para uma light novel.

${RULES.jsonFormat}

Inclua:
- Evento ou situação principal
- Personagens envolvidos
- Conflito ou tensão
- Possíveis consequências
- Como se conecta com a história maior

Formato exato:
{
  "name": "Nome do Ponto de Enredo",
  "description": "Descrição do evento",
  "characters": "Personagens envolvidos",
  "conflict": "Conflito ou tensão",
  "consequences": "Possíveis consequências",
  "connection": "Conexão com a história maior",
  "timeline": "Quando acontece",
  "locations": "Locais envolvidos",
  "stakes": "O que está em jogo"
}`,

    // Prompts para campos específicos de narrativa
    plotPoints_description: `Gere uma descrição detalhada para um ponto de enredo de light novel.

${RULES.jsonFormat}

Considere:
- O contexto do mundo e personagens existentes
- A tensão dramática do momento
- O impacto na narrativa geral
- Os elementos visuais e emocionais

Responda apenas com a descrição, sem formatação JSON.`,

    plotPoints_characters: `Gere uma lista de personagens envolvidos em um ponto de enredo.

${RULES.jsonFormat}

Considere:
- Personagens principais e secundários
- Suas motivações no momento
- Como eles se relacionam com o conflito
- O papel de cada um na cena

Responda apenas com a lista de personagens, sem formatação JSON.`,

    plotPoints_locations: `Gere locais relevantes para um ponto de enredo.

${RULES.jsonFormat}

Considere:
- Onde a ação acontece
- A atmosfera do local
- Como o ambiente influencia a cena
- Detalhes visuais importantes

Responda apenas com os locais, sem formatação JSON.`,

    plotPoints_consequences: `Gere as consequências de um ponto de enredo.

${RULES.jsonFormat}

Considere:
- O impacto imediato na história
- Mudanças nos personagens
- Repercussões futuras
- Como isso afeta o mundo

Responda apenas com as consequências, sem formatação JSON.`,

    plotPoints_timeline: `Gere informações sobre o timing de um ponto de enredo.

${RULES.jsonFormat}

Considere:
- Quando na história isso acontece
- A duração da cena/evento
- O ritmo da narrativa
- Como se relaciona com outros eventos

Responda apenas com as informações de tempo, sem formatação JSON.`,

    plotPoints_notes: `Gere notas adicionais para um ponto de enredo.

${RULES.jsonFormat}

Considere:
- Detalhes importantes para lembrar
- Ideias para desenvolvimento futuro
- Elementos que podem ser expandidos
- Observações sobre a qualidade da cena

Responda apenas com as notas, sem formatação JSON.`,

    storyArcs_description: `Gere uma descrição para um arco de história.

${RULES.jsonFormat}

Considere:
- O tema central do arco
- A jornada dos personagens
- O desenvolvimento da trama
- O clímax e resolução

Responda apenas com a descrição, sem formatação JSON.`,

    themes_description: `Gere uma descrição para um tema narrativo.

${RULES.jsonFormat}

Considere:
- O significado do tema
- Como se manifesta na história
- Sua importância para os personagens
- A mensagem que transmite

Responda apenas com a descrição, sem formatação JSON.`,

    conflicts_description: `Gere uma descrição para um conflito narrativo.

${RULES.jsonFormat}

Considere:
- A natureza do conflito
- Os lados envolvidos
- As causas e consequências
- Como se desenvolve

Responda apenas com a descrição, sem formatação JSON.`,

    resolutions_description: `Gere uma descrição para uma resolução narrativa.

${RULES.jsonFormat}

Considere:
- Como o conflito é resolvido
- O crescimento dos personagens
- A satisfação da conclusão
- O impacto final

Responda apenas com a descrição, sem formatação JSON.`,
    
    dialogue: `Crie um diálogo natural entre personagens para uma light novel.

${RULES.jsonFormat}

Considere:
- Personalidades dos personagens
- Inclua subtext e emoções
- Mantenha o tom apropriado
- Avance a história ou desenvolva personagens

Formato exato:
{
  "characters": ["Personagem 1", "Personagem 2"],
  "dialogue": "Texto do diálogo",
  "emotions": "Emoções expressas",
  "subtext": "Subtexto implícito",
  "purpose": "Propósito do diálogo",
  "tone": "Tom da conversa",
  "advancement": "Como avança a história"
}`,

    storyArc: `Crie um arco de história para uma light novel.

${RULES.jsonFormat}

Formato exato:
{
  "name": "Nome do Arco",
  "description": "Descrição do arco",
  "characters": "Personagens principais",
  "locations": "Locais envolvidos",
  "conflicts": "Conflitos principais",
  "resolution": "Como se resolve",
  "timeline": "Duração do arco",
  "themes": "Temas explorados",
  "development": "Desenvolvimento dos personagens"
}`,

    theme: `Identifique e desenvolva um tema para uma light novel.

${RULES.jsonFormat}

Formato exato:
{
  "name": "Nome do Tema",
  "description": "Descrição do tema",
  "manifestations": "Como se manifesta na história",
  "characters": "Personagens que representam o tema",
  "conflicts": "Conflitos relacionados",
  "resolution": "Como o tema é resolvido",
  "significance": "Significado para a história",
  "lessons": "Lições aprendidas"
}`
  },

  // Prompts para análise e insights
  analysis: {
    projectAnalysis: `Analise o projeto atual e forneça insights estruturados em JSON:

{
  "qualityTips": [
    "Dica específica sobre qualidade do projeto",
    "Sugestão para melhorar coerência"
  ],
  "volumeInsights": [
    "Insight sobre estrutura narrativa",
    "Sugestão para desenvolvimento de volumes"
  ],
  "developmentSuggestions": [
    "Sugestão de desenvolvimento específica",
    "Oportunidade narrativa identificada"
  ],
  "coherenceScore": "8",
  "priorityAreas": [
    "Área que precisa de mais desenvolvimento",
    "Elemento que pode ser expandido"
  ]
}

Mantenha as dicas práticas e específicas para o contexto do projeto.`,

    qualityTips: `Com base no projeto atual, forneça 3-5 dicas específicas de qualidade para melhorar a light novel:

CONTEXTO:
- Mundo: {worldName}
- Gênero: {genre}
- Volumes: {volumesCount}
- Capítulos: {chaptersCount}

Forneça dicas práticas e específicas que possam ser aplicadas imediatamente.`,

    volumeInsights: `Analise o projeto atual e forneça insights específicos para o desenvolvimento de volumes e capítulos:

CONTEXTO:
- Mundo: {worldName}
- Gênero: {genre}
- Elementos do Mundo: {elementsCount} tipos

Forneça insights sobre:
1. Estrutura narrativa recomendada
2. Elementos que podem ser explorados
3. Pontos de tensão e desenvolvimento
4. Oportunidades narrativas`
  }
};

// Funções utilitárias para manipulação de prompts
export const PromptUtils = {
  // Substitui placeholders no prompt
  replacePlaceholders: (prompt, placeholders) => {
    let result = prompt;
    Object.entries(placeholders).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
  },

  // Combina prompts com contexto
  combineWithContext: (basePrompt, context) => {
    let contextualPrompt = basePrompt;
    
    if (context.worldName) {
      contextualPrompt = `Para o mundo "${context.worldName}":\n\n${contextualPrompt}`;
    }

    if (context.existingElements?.length > 0) {
      contextualPrompt += `\n\nElementos existentes para referência:\n${context.existingElements.map(el => `- ${el.name}: ${el.description}`).join('\n')}`;
    }

    if (context.characters?.length > 0) {
      contextualPrompt += `\n\nPersonagens relacionados:\n${context.characters.map(char => `- ${char.name}: ${char.description}`).join('\n')}`;
    }

    return contextualPrompt;
  },

  // Gera prompt contextualizado para um tipo específico
  generateContextualPrompt: (elementType, elementName, worldData) => {
    const contextAnalysis = {
      worldName: worldData?.name || 'Mundo da Light Novel',
      genre: worldData?.genre || 'fantasy',
      techLevel: worldData?.techLevel || 'medieval',
      description: worldData?.description || 'Um mundo de fantasia',
      existingElements: [],
      characters: []
    };

    // Adiciona elementos existentes relevantes
    if (worldData?.locations) contextAnalysis.existingElements.push(...worldData.locations);
    if (worldData?.peoples) contextAnalysis.existingElements.push(...worldData.peoples);
    if (worldData?.religions) contextAnalysis.existingElements.push(...worldData.religions);

    return PromptUtils.combineWithContext(
      BASE_PROMPTS[elementType]?.[elementName] || BASE_PROMPTS[elementType],
      contextAnalysis
    );
  },

  // Obtém prompt específico do banco
  getPrompt: (category, subcategory = null, type = null) => {
    if (subcategory && type) {
      return BASE_PROMPTS[category]?.[subcategory]?.[type];
    } else if (subcategory) {
      return BASE_PROMPTS[category]?.[subcategory];
    } else {
      return BASE_PROMPTS[category];
    }
  },

  // Lista todos os prompts disponíveis
  listAllPrompts: () => {
    const prompts = {};
    Object.entries(BASE_PROMPTS).forEach(([category, categoryPrompts]) => {
      prompts[category] = {};
      if (typeof categoryPrompts === 'object' && !categoryPrompts.jsonFormat) {
        Object.entries(categoryPrompts).forEach(([subcategory, subcategoryPrompts]) => {
          if (typeof subcategoryPrompts === 'object' && !subcategoryPrompts.jsonFormat) {
            prompts[category][subcategory] = Object.keys(subcategoryPrompts);
          } else {
            prompts[category][subcategory] = subcategoryPrompts;
          }
        });
      }
    });
    return prompts;
  }
};

// Exporta o banco de prompts
export default BASE_PROMPTS;
