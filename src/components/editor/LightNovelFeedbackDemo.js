import React, { useState } from 'react';
import {
  Book,
  Star,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Zap,
  RefreshCw,
  X
} from 'lucide-react';

const LightNovelFeedbackDemo = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [demoFeedback, setDemoFeedback] = useState(null);

  const generateDemoFeedback = () => {
    // Simular feedback de uma light novel de exemplo
    const feedback = {
      overallScore: 7,
      strengths: [
        'Protagonista bem definido com objetivos claros',
        'Sistema de magia interessante e bem estruturado',
        'World building rico com locais diversos',
        'Diálogos naturais e envolventes'
      ],
      weaknesses: [
        'Poucos personagens secundários desenvolvidos',
        'Relacionamentos podem ser mais explorados',
        'Algumas cenas precisam de mais descrições visuais'
      ],
      suggestions: [
        'Adicione mais personagens secundários com arcos próprios',
        'Desenvolva relacionamentos românticos e de amizade',
        'Expanda descrições de cenas de ação',
        'Crie mais conflitos internos para os personagens'
      ],
      elements: {
        characterDevelopment: { score: 8, feedback: 'Bom desenvolvimento do protagonista, mas personagens secundários precisam de mais atenção' },
        worldBuilding: { score: 9, feedback: 'Mundo rico e bem construído com sistema de magia interessante' },
        plotStructure: { score: 7, feedback: 'Estrutura narrativa sólida com alguns pontos de melhoria' },
        dialogueQuality: { score: 8, feedback: 'Diálogos naturais e bem escritos' },
        pacing: { score: 7, feedback: 'Pacing adequado, mas algumas cenas podem ser expandidas' },
        tropes: { score: 8, feedback: 'Uso inteligente de tropes do gênero' },
        emotionalImpact: { score: 6, feedback: 'Impacto emocional pode ser fortalecido' },
        originality: { score: 7, feedback: 'Elementos originais bem integrados à história' }
      }
    };

    setDemoFeedback(feedback);
    setShowDemo(true);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Book className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sistema de Feedback para Light Novels
          </h1>
          <p className="text-muted-foreground text-lg">
            Análise especializada para otimizar sua história no gênero light novel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              Análise Completa
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Desenvolvimento de personagens</li>
              <li>• World building e sistema de magia</li>
              <li>• Estrutura narrativa e pacing</li>
              <li>• Qualidade dos diálogos</li>
              <li>• Uso de tropes do gênero</li>
              <li>• Impacto emocional</li>
              <li>• Originalidade e criatividade</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Zap className="h-5 w-5 text-blue-500 mr-2" />
              Melhorias Automáticas
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Criação de personagens secundários</li>
              <li>• Expansão do sistema de magia</li>
              <li>• Adição de locais importantes</li>
              <li>• Desenvolvimento de relacionamentos</li>
              <li>• Sugestões de diálogos</li>
              <li>• Templates de cenas</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={generateDemoFeedback}
            className="btn-primary flex items-center mx-auto"
          >
            <Book className="mr-2 h-5 w-5" />
            Ver Demonstração
          </button>
        </div>

        {/* Modal de Demonstração */}
        {showDemo && demoFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <Book className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Feedback de Light Novel - Demo</h2>
                    <p className="text-sm text-muted-foreground">Exemplo de análise para uma história fictícia</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDemo(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto h-full">
                {/* Pontuação Geral */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Pontuação Geral</h3>
                    <div className="flex items-center space-x-2">
                      <div className="text-3xl font-bold text-primary">{demoFeedback.overallScore}/10</div>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < demoFeedback.overallScore
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(demoFeedback.overallScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Análise por Elementos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {Object.entries(demoFeedback.elements).map(([key, element]) => (
                    <div key={key} className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-bold text-primary">{element.score}/10</span>
                          <div className="flex">
                            {[...Array(10)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < element.score
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{element.feedback}</p>
                    </div>
                  ))}
                </div>

                {/* Pontos Fortes */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Pontos Fortes
                  </h3>
                  <div className="space-y-2">
                    {demoFeedback.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-foreground">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pontos de Melhoria */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    Pontos de Melhoria
                  </h3>
                  <div className="space-y-2">
                    {demoFeedback.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-foreground">{weakness}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sugestões */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                    Sugestões de Melhoria
                  </h3>
                  <div className="space-y-2">
                    {demoFeedback.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-foreground">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ações Recomendadas */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Próximos Passos Recomendados:
                  </h3>
                  <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <p>1. Foque nos pontos de melhoria identificados</p>
                    <p>2. Implemente as sugestões de melhoria</p>
                    <p>3. Revise e refine os elementos com pontuação baixa</p>
                    <p>4. Continue desenvolvendo os pontos fortes</p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <button
                    onClick={() => setShowDemo(false)}
                    className="btn-outline"
                  >
                    Fechar
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        alert('Funcionalidade de aplicação automática disponível no ConsistencyChecker!');
                      }}
                      className="btn-primary flex items-center"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Aplicar Melhorias
                    </button>
                    <button
                      onClick={generateDemoFeedback}
                      className="btn-outline flex items-center"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Nova Análise
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LightNovelFeedbackDemo;
