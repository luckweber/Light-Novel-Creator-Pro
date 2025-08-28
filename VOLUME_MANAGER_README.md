# 📚 Gerenciador de Volumes

Uma página dedicada para gerenciar volumes e capítulos de forma eficiente e organizada.

## 🎯 Funcionalidades Principais

### 📊 **Dashboard de Estatísticas**
- **Total de Volumes**: Contagem de todos os volumes criados
- **Total de Capítulos**: Contagem de todos os capítulos
- **Total de Palavras**: Soma de todas as palavras escritas
- **Média por Capítulo**: Média de palavras por capítulo
- **Capítulos por Volume**: Média de capítulos por volume

### 🔍 **Sistema de Busca e Filtros**
- **Busca em tempo real**: Pesquise por título ou descrição de volumes e capítulos
- **Ordenação flexível**: Por título, data, número de palavras ou número de capítulos
- **Ordenação ascendente/descendente**: Controle a direção da ordenação

### 📝 **Gerenciamento de Volumes**
- **Criar Volume**: Adicione novos volumes com título e descrição
- **Editar Volume**: Modifique título e descrição de volumes existentes
- **Excluir Volume**: Remova volumes e todos os seus capítulos
- **Expandir/Recolher**: Visualize ou oculte capítulos de cada volume
- **Gerenciar Capas**: Adicione imagens de capa para volumes

### 📄 **Gerenciamento de Capítulos**
- **Criar Capítulo**: Adicione novos capítulos a qualquer volume
- **Editar Capítulo**: Modifique título e descrição de capítulos
- **Excluir Capítulo**: Remova capítulos específicos
- **Gerenciar Capas**: Adicione imagens de capa para capítulos
- **Contagem de Palavras**: Visualize automaticamente o número de palavras

### ✅ **Seleção Múltipla**
- **Selecionar Itens**: Marque volumes e capítulos individualmente
- **Ações em Massa**: Exclua múltiplos itens de uma vez
- **Limpar Seleção**: Remova todas as seleções

### 🎨 **Interface Responsiva**
- **Design Moderno**: Interface limpa e intuitiva
- **Modo Escuro**: Suporte completo ao tema escuro
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Animações**: Transições suaves e feedback visual

## 🚀 Como Usar

### 1. **Acessando o Gerenciador**
- Navegue até **"Gerenciador de Volumes"** no menu lateral
- Ou acesse diretamente: `/volume-manager`

### 2. **Criando um Volume**
1. Clique no botão **"Novo Volume"** no canto superior direito
2. Preencha o **título** do volume (obrigatório)
3. Adicione uma **descrição** (opcional)
4. Clique em **"Criar"**

### 3. **Adicionando Capítulos**
1. Clique no ícone de **seta** ao lado do volume para expandir
2. Clique em **"Adicionar Capítulo"**
3. Preencha o **título** do capítulo (obrigatório)
4. Adicione uma **descrição** (opcional)
5. Clique em **"Criar"**

### 4. **Editando Itens**
- Clique no ícone de **lápis** ao lado do volume ou capítulo
- Modifique os campos desejados
- Clique em **"Atualizar"**

### 5. **Gerenciando Capas**
- Clique no ícone de **imagem** ao lado do volume ou capítulo
- Faça upload de uma imagem
- Ajuste o recorte se necessário
- Salve a capa

### 6. **Usando Busca e Filtros**
- Digite no campo de **busca** para encontrar itens específicos
- Use o **seletor de ordenação** para organizar os resultados
- Clique no **ícone de ordenação** para alternar entre ascendente/descendente

### 7. **Seleção Múltipla**
- Marque as **caixas de seleção** ao lado dos itens
- Use **"Expandir Tudo"** ou **"Recolher Tudo"** para facilitar a seleção
- Execute **ações em massa** nos itens selecionados

## 📋 Atalhos e Dicas

### **Atalhos de Teclado**
- `Ctrl/Cmd + F`: Focar no campo de busca
- `Enter`: Confirmar criação/edição
- `Escape`: Cancelar operação ou fechar modal

### **Dicas de Uso**
- **Organize por Volume**: Agrupe capítulos relacionados em volumes temáticos
- **Use Descrições**: Adicione descrições para facilitar a identificação
- **Gerenciar Capas**: Adicione capas para tornar seus volumes mais atrativos
- **Busca Rápida**: Use a busca para encontrar rapidamente capítulos específicos
- **Estatísticas**: Monitore seu progresso através do dashboard de estatísticas

## 🔧 Integração com o Sistema

### **Store Integration**
O VolumeManager utiliza o `useStore` para:
- Gerenciar a estrutura de volumes e capítulos
- Persistir dados automaticamente
- Sincronizar com outras partes da aplicação

### **Componentes Relacionados**
- **CoverManager**: Gerenciamento de capas de volumes e capítulos
- **ChapterNavigator**: Navegação entre capítulos no editor
- **NovelReader**: Leitura de volumes e capítulos

### **Funcionalidades Avançadas**
- **Auto-expansão**: Volumes são expandidos automaticamente ao adicionar capítulos
- **Validação**: Campos obrigatórios são validados antes de salvar
- **Feedback**: Notificações toast para confirmar ações
- **Confirmação**: Diálogos de confirmação para ações destrutivas

## 🎨 Personalização

### **Temas**
O VolumeManager suporta:
- **Tema Claro**: Interface limpa e moderna
- **Tema Escuro**: Reduz fadiga visual em ambientes com pouca luz

### **Cores**
- **Azul**: Cor principal para ações e destaque
- **Verde**: Para capítulos e elementos secundários
- **Vermelho**: Para ações destrutivas
- **Cinza**: Para elementos neutros e texto

## 📱 Responsividade

### **Desktop (1024px+)**
- Layout completo com sidebar
- Todas as funcionalidades disponíveis
- Estatísticas em grid de 5 colunas

### **Tablet (768px - 1023px)**
- Layout adaptado para telas médias
- Estatísticas em grid de 2-3 colunas
- Controles reorganizados

### **Mobile (< 768px)**
- Layout otimizado para telas pequenas
- Estatísticas em coluna única
- Navegação simplificada

## 🔮 Próximas Funcionalidades

### **Planejadas**
- **Drag & Drop**: Reordenar volumes e capítulos por arrastar
- **Import/Export**: Importar e exportar estrutura de volumes
- **Templates**: Templates pré-definidos para volumes
- **Tags**: Sistema de tags para categorização
- **Progresso**: Indicadores de progresso de escrita
- **Backup**: Backup automático da estrutura

### **Melhorias**
- **Performance**: Otimização para grandes quantidades de dados
- **Acessibilidade**: Melhor suporte a leitores de tela
- **Internacionalização**: Suporte a múltiplos idiomas
- **Analytics**: Estatísticas mais detalhadas

## 🐛 Solução de Problemas

### **Problemas Comuns**

**Volume não aparece na lista**
- Verifique se o título foi preenchido
- Tente recarregar a página
- Verifique se há erros no console

**Capítulo não é criado**
- Certifique-se de que um volume está selecionado
- Verifique se o título foi preenchido
- Confirme se não há erros de validação

**Busca não funciona**
- Verifique se o termo de busca está correto
- Tente limpar o campo de busca
- Verifique se há filtros ativos

**Interface não carrega**
- Verifique a conexão com a internet
- Limpe o cache do navegador
- Verifique se o JavaScript está habilitado

### **Suporte**
Para problemas específicos:
1. Verifique o console do navegador para erros
2. Tente recarregar a página
3. Limpe o cache e cookies
4. Entre em contato com o suporte

## 📄 Licença

Este componente faz parte do sistema de gerenciamento de light novels e está sujeito aos mesmos termos de licença do projeto principal.
