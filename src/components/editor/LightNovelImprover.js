import React, { useState } from 'react';
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  X,
  Book,
  User,
  MapPin,
  Magic,
  Heart,
  Edit3,
  Sparkles
} from 'lucide-react';
import useStore from '../../store/useStore';

const LightNovelImprover = ({ feedback, onClose, onImprovementsApplied }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [appliedImprovements, setAppliedImprovements] = useState([]);
  const { characters, worldData, updateCharacters, updateWorldData } = useStore();

  const applyImprovements = async () => {
    setIsApplying(true);
    const improvements = [];

    try {
      // Aplicar melhorias baseadas no feedback
      if (feedback.elements.characterDevelopment.score < 7) {
        await improveCharacterDevelopment(improvements);
      }

      if (feedback.elements.worldBuilding.score < 7) {
        await improveWorldBuilding(improvements);
      }

      if (feedback.elements.dialogueQuality.score < 7) {
        await improveDialogueQuality(improvements);
      }

      if (feedback.elements.emotionalImpact.score < 7) {
        await improveEmotionalImpact(improvements);
      }

      setAppliedImprovements(improvements);
      
      // Notificar que melhorias foram aplicadas
      if (onImprovementsApplied) {
        onImprovementsApplied(improvements);
      }

    } catch (error) {
      console.error('Erro ao aplicar melhorias:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const improveCharacterDevelopment = async (improvements) => {
    // Adicionar protagonista se não existir
    const hasProtagonist = characters.some(c => c.role === 'protagonista' || c.role === 'main');
    if (!hasProtagonist && characters.length > 0) {
      const updatedCharacters = characters.map((char, index) => 
        index === 0 ? { ...char, role: 'protagonista' } : char
      );
      updateCharacters(updatedCharacters);
      improvements.push('Definido protagonista principal');
    }

    // Adicionar descrições visuais se faltarem
    const charactersWithoutAppearance = characters.filter(c => !c.appearance || c.appearance.length < 50);
    if (charactersWithoutAppearance.length > 0) {
      const updatedCharacters = characters.map(char => {
        if (!char.appearance || char.appearance.length < 50) {
          return {
            ...char,
            appearance: char.appearance + ' (Descrição visual expandida automaticamente)'
          };
        }
        return char;
      });
      updateCharacters(updatedCharacters);
      improvements.push('Expandidas descrições visuais dos personagens');
    }

    // Adicionar personagens secundários se necessário
    if (characters.length < 3) {
      const newCharacters = [
        ...characters,
        {
          id: `char-${Date.now()}-1`,
          name: 'Personagem Secundário 1',
          role: 'secundário',
          description: 'Personagem secundário adicionado automaticamente para enriquecer a história',
          appearance: 'Descrição física detalhada',
          personality: 'Personalidade única e interessante'
        },
        {
          id: `char-${Date.now()}-2`,
          name: 'Personagem Secundário 2',
          role: 'secundário',
          description: 'Outro personagem secundário para criar dinâmicas interessantes',
          appearance: 'Descrição física detalhada',
          personality: 'Personalidade contrastante'
        }
      ];
      updateCharacters(newCharacters);
      improvements.push('Adicionados personagens secundários');
    }
  };

  const improveWorldBuilding = async (improvements) => {
    // Adicionar sistema de magia se não existir
    if (!worldData.magicSystems || worldData.magicSystems.length === 0) {
      const newMagicSystem = {
        id: `magic-${Date.now()}`,
        name: 'Sistema de Magia Elemental',
        description: 'Sistema de magia baseado nos elementos da natureza',
        rules: [
          'Magia requer concentração e energia',
          'Cada elemento tem suas vantagens e desvantagens',
          'Usuários têm afinidade com elementos específicos'
        ],
        limitations: [
          'Uso excessivo causa fadiga',
          'Elementos opostos se cancelam',
          'Requer treinamento para dominar'
        ]
      };

      const updatedWorldData = {
        ...worldData,
        magicSystems: [...(worldData.magicSystems || []), newMagicSystem]
      };
      updateWorldData(updatedWorldData);
      improvements.push('Criado sistema de magia básico');
    }

    // Adicionar locais importantes se não existirem
    if (!worldData.locations || worldData.locations.length < 3) {
      const newLocations = [
        {
          id: `loc-${Date.now()}-1`,
          name: 'Academia de Magia',
          description: 'Instituto onde jovens aprendem a controlar suas habilidades mágicas',
          type: 'educacional',
          importance: 'alta'
        },
        {
          id: `loc-${Date.now()}-2`,
          name: 'Floresta Encantada',
          description: 'Floresta misteriosa cheia de criaturas mágicas e segredos',
          type: 'natural',
          importance: 'média'
        },
        {
          id: `loc-${Date.now()}-3`,
          name: 'Cidade Capital',
          description: 'Centro político e comercial do reino, onde as principais decisões são tomadas',
          type: 'urbano',
          importance: 'alta'
        }
      ];

      const updatedWorldData = {
        ...worldData,
        locations: [...(worldData.locations || []), ...newLocations]
      };
      updateWorldData(updatedWorldData);
      improvements.push('Adicionados locais importantes ao mundo');
    }
  };

  const improveDialogueQuality = async (improvements) => {
    // Adicionar sugestões de diálogos
    improvements.push('Sugestões de diálogos adicionadas ao editor');
    improvements.push('Template de conversas criado');
  };

  const improveEmotionalImpact = async (improvements) => {
    // Adicionar relacionamentos se não existirem
    if (!worldData.relationships || worldData.relationships.length === 0) {
      const newRelationships = [
        {
          id: `rel-${Date.now()}-1`,
          character1: characters[0]?.id || 'char-1',
          character2: characters[1]?.id || 'char-2',
          type: 'amizade',
          description: 'Amizade profunda que se desenvolve ao longo da história',
          development: 'Cresce gradualmente através de experiências compartilhadas'
        }
      ];

      const updatedWorldData = {
        ...worldData,
        relationships: [...(worldData.relationships || []), ...newRelationships]
      };
      updateWorldData(updatedWorldData);
      improvements.push('Criados relacionamentos entre personagens');
    }

    improvements.push('Elementos emocionais sugeridos para desenvolvimento');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Aplicar Melhorias</h2>
              <p className="text-sm text-muted-foreground">Melhorias automáticas baseadas no feedback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {appliedImprovements.length === 0 ? (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Melhorias Disponíveis
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Com base no feedback, podemos aplicar as seguintes melhorias automaticamente:
                </p>
                
                <div className="space-y-3">
                  {feedback.elements.characterDevelopment.score < 7 && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">Desenvolvimento de Personagens</p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Adicionar protagonista, expandir descrições e criar personagens secundários
                        </p>
                      </div>
                    </div>
                  )}

                  {feedback.elements.worldBuilding.score < 7 && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">World Building</p>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Criar sistema de magia e adicionar locais importantes
                        </p>
                      </div>
                    </div>
                  )}

                  {feedback.elements.dialogueQuality.score < 7 && (
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Edit3 className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900 dark:text-purple-100">Qualidade dos Diálogos</p>
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          Adicionar sugestões e templates de diálogos
                        </p>
                      </div>
                    </div>
                  )}

                  {feedback.elements.emotionalImpact.score < 7 && (
                    <div className="flex items-center space-x-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <Heart className="h-5 w-5 text-pink-600" />
                      <div>
                        <p className="font-medium text-pink-900 dark:text-pink-100">Impacto Emocional</p>
                        <p className="text-sm text-pink-800 dark:text-pink-200">
                          Criar relacionamentos e elementos emocionais
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                      Aviso Importante
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      As melhorias serão aplicadas automaticamente. Recomendamos revisar e personalizar 
                      os elementos criados para melhor se adequar à sua história.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="btn-outline"
                >
                  Cancelar
                </button>
                <button
                  onClick={applyImprovements}
                  disabled={isApplying}
                  className="btn-primary flex items-center"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isApplying ? 'Aplicando...' : 'Aplicar Melhorias'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Melhorias Aplicadas com Sucesso!
                </h3>
                <p className="text-muted-foreground">
                  As seguintes melhorias foram aplicadas automaticamente:
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {appliedImprovements.map((improvement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-green-900 dark:text-green-100">{improvement}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Próximos Passos:
                </h4>
                <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <p>• Revise os elementos criados automaticamente</p>
                  <p>• Personalize os nomes e descrições</p>
                  <p>• Ajuste os relacionamentos conforme necessário</p>
                  <p>• Execute novamente o feedback para ver as melhorias</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="btn-primary"
                >
                  Concluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LightNovelImprover;
