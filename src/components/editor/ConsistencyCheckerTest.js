import React, { useState } from 'react';
import {
  AlertTriangle,
  Book,
  Star,
  CheckCircle,
  X
} from 'lucide-react';

const ConsistencyCheckerTest = () => {
  const [showTest, setShowTest] = useState(false);

  const testFeedback = {
    overallScore: 6,
    strengths: [
      'Projeto iniciado com sucesso',
      'Interface funcional',
      'Estrutura básica implementada'
    ],
    weaknesses: [
      'Poucos personagens criados',
      'World building limitado',
      'Sistema de magia não definido'
    ],
    suggestions: [
      'Adicione pelo menos 3 personagens principais',
      'Crie um sistema de magia básico',
      'Desenvolva locais importantes para a história'
    ],
    elements: {
      characterDevelopment: { score: 4, feedback: 'Apenas 1 personagem criado. Recomenda-se pelo menos 3-5 personagens principais.' },
      worldBuilding: { score: 3, feedback: 'World building muito básico. Adicione locais, cultura e história.' },
      plotStructure: { score: 5, feedback: 'Estrutura narrativa básica. Desenvolva arcos de história.' },
      dialogueQuality: { score: 6, feedback: 'Diálogos podem ser melhorados com mais naturalidade.' },
      pacing: { score: 5, feedback: 'Pacing adequado para início de projeto.' },
      tropes: { score: 4, feedback: 'Poucos elementos típicos de light novel identificados.' },
      emotionalImpact: { score: 4, feedback: 'Desenvolvimento emocional dos personagens pode ser expandido.' },
      originality: { score: 6, feedback: 'Elementos originais presentes, mas podem ser desenvolvidos.' }
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Book className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Teste do Sistema de Feedback
          </h1>
          <p className="text-muted-foreground text-lg">
            Clique no botão abaixo para testar o sistema de feedback de light novel
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowTest(true)}
            className="btn-primary flex items-center mx-auto"
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            Testar Sistema de Feedback
          </button>
        </div>

        {/* Modal de Teste */}
        {showTest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <Book className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Feedback de Light Novel - Teste</h2>
                    <p className="text-sm text-muted-foreground">Demonstração do sistema funcionando</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTest(false)}
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
                      <div className="text-3xl font-bold text-primary">{testFeedback.overallScore}/10</div>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testFeedback.overallScore
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
                      style={{ width: `${(testFeedback.overallScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Análise por Elementos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {Object.entries(testFeedback.elements).map(([key, element]) => (
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
                    {testFeedback.strengths.map((strength, index) => (
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
                    {testFeedback.weaknesses.map((weakness, index) => (
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
                    <Book className="h-5 w-5 text-blue-500 mr-2" />
                    Sugestões de Melhoria
                  </h3>
                  <div className="space-y-2">
                    {testFeedback.suggestions.map((suggestion, index) => (
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
                    onClick={() => setShowTest(false)}
                    className="btn-outline"
                  >
                    Fechar
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        alert('Sistema funcionando corretamente! 🎉');
                      }}
                      className="btn-primary flex items-center"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Sistema Funcionando!
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

export default ConsistencyCheckerTest;
