# Sistema de Versionamento - Light Novel Creator Pro

## 📋 Visão Geral

O sistema de versionamento implementado oferece controle completo sobre as mudanças no seu projeto de light novel, permitindo rastrear, comparar e reverter versões do texto com facilidade.

## 🚀 Funcionalidades Principais

### 1. **Versionamento Automático**
- **Auto-save inteligente**: Cria versões automaticamente a cada 5 minutos de mudanças significativas
- **Detecção de mudanças**: Identifica quando há alterações importantes no texto
- **Configuração flexível**: Intervalos e limites personalizáveis

### 2. **Versionamento Manual**
- **Criação sob demanda**: Salve versões quando quiser com mensagens personalizadas
- **Tipos de versão**: Manual, Major, Minor, Patch
- **Descrições detalhadas**: Adicione contexto às suas versões

### 3. **Histórico Completo**
- **Timeline visual**: Veja todas as versões em ordem cronológica
- **Estatísticas**: Contagem de palavras, caracteres e mudanças
- **Metadados**: Autor, data, tipo de versão

### 4. **Comparação de Versões**
- **Diff visual**: Veja exatamente o que mudou entre versões
- **Estatísticas de mudanças**: Adições, remoções, modificações
- **Análise detalhada**: Palavras e caracteres alterados

### 5. **Revertimento Seguro**
- **Restauração de versões**: Volte para qualquer versão anterior
- **Confirmação**: Diálogos de segurança para evitar perda de dados
- **Histórico preservado**: Mantém todas as versões mesmo após revert

## 🎯 Como Usar

### Acessando o Sistema de Versionamento

1. **No Editor Principal**:
   - Clique no botão "Versões" na barra de ferramentas
   - Ou use o menu "Ferramentas" → "Controle de Versões"

2. **Atalhos de Teclado**:
   - `Ctrl + S`: Salvar versão manual (quando configurado)

### Criando Versões Manuais

1. **Abrir o Painel de Versões**
2. **Clicar em "Nova Versão"**
3. **Preencher os campos**:
   - **Mensagem**: Descrição breve das mudanças
   - **Descrição**: Detalhes adicionais (opcional)
   - **Tipo**: Manual, Major, Minor, Patch
4. **Clicar em "Criar Versão"**

### Visualizando o Histórico

1. **Abrir o Painel de Versões**
2. **Ver lista de versões** com:
   - Mensagem da versão
   - Data e hora
   - Autor
   - Estatísticas de mudanças
   - Tipo de versão

### Comparando Versões

1. **Selecionar duas versões** na lista
2. **Clicar em "Comparar"**
3. **Analisar as diferenças**:
   - Estatísticas de mudanças
   - Lista detalhada de alterações
   - Conteúdo antes e depois

### Revertendo para uma Versão

1. **Encontrar a versão desejada** no histórico
2. **Clicar no ícone de revert** (↻)
3. **Confirmar a ação** no diálogo
4. **O conteúdo será restaurado** para aquela versão

## ⚙️ Configurações

### Versionamento Automático

```javascript
const AUTO_VERSION_CONFIG = {
  enabled: true,           // Habilitar/desabilitar
  interval: 5 * 60 * 1000, // Intervalo (5 minutos)
  minChanges: 50,          // Mínimo de caracteres alterados
  maxVersions: 20          // Máximo de versões automáticas
};
```

### Tipos de Versão

- **Manual**: Versões criadas pelo usuário
- **Auto**: Versões automáticas do sistema
- **Major**: Mudanças significativas na história
- **Minor**: Melhorias e ajustes
- **Patch**: Correções pequenas
- **Merge**: Mesclagem de branches
- **Revert**: Reversão de mudanças

## 📊 Estatísticas e Métricas

### Por Versão
- **Contagem de palavras**
- **Contagem de caracteres**
- **Número de linhas**
- **Mudanças realizadas**
- **Tempo de criação**

### Comparação Entre Versões
- **Palavras adicionadas/removidas**
- **Caracteres alterados**
- **Tipos de mudanças**
- **Percentual de alteração**

## 🔧 Integração com o Editor

### Notificações Automáticas
- **Indicador visual** quando versão é criada
- **Toast notifications** para ações importantes
- **Status de sincronização**

### Auto-save Inteligente
- **Detecção de mudanças significativas**
- **Prevenção de perda de dados**
- **Configuração de intervalos**

## 🛡️ Segurança e Backup

### Proteção de Dados
- **Armazenamento local** seguro
- **Backup automático** das versões
- **Integridade de dados** verificada

### Recuperação
- **Restauração de versões** perdidas
- **Exportação** de histórico completo
- **Importação** de dados de versionamento

## 📈 Melhorias Futuras

### Funcionalidades Planejadas
- **Branches avançados** para diferentes linhas narrativas
- **Merge automático** de conflitos
- **Sincronização em nuvem** das versões
- **Colaboração** em tempo real
- **Análise de tendências** de escrita

### Integração com IA
- **Sugestões automáticas** de versionamento
- **Análise de qualidade** entre versões
- **Detecção de melhorias** automática

## 🎓 Dicas de Uso

### Boas Práticas
1. **Crie versões frequentes** durante a escrita
2. **Use mensagens descritivas** para facilitar a busca
3. **Organize por tipos** de mudança
4. **Revise o histórico** regularmente
5. **Faça backups** das versões importantes

### Fluxo de Trabalho Recomendado
1. **Início de sessão**: Criar versão inicial
2. **Durante a escrita**: Versões automáticas
3. **Marcos importantes**: Versões manuais
4. **Final de sessão**: Versão de conclusão
5. **Revisão**: Comparar versões para melhorias

## 🔍 Solução de Problemas

### Problemas Comuns

**Versões não estão sendo criadas automaticamente**
- Verificar se o versionamento automático está habilitado
- Confirmar se há mudanças significativas no texto
- Verificar as configurações de intervalo

**Erro ao reverter versão**
- Confirmar que a versão existe
- Verificar permissões de escrita
- Tentar recarregar a página

**Histórico não aparece**
- Verificar se há um projeto ativo
- Confirmar que o localStorage está funcionando
- Tentar limpar cache do navegador

### Suporte
Para problemas específicos ou sugestões, consulte a documentação completa ou entre em contato com o suporte técnico.

---

**Sistema de Versionamento v1.0** - Light Novel Creator Pro
