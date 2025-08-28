// Sistema de Versionamento para Light Novel Creator Pro

// Configurações do sistema de versionamento
export const VERSION_CONFIG = {
  MAX_VERSIONS_PER_BRANCH: 100,
  MAX_BRANCHES_PER_PROJECT: 20,
  MAX_VERSION_SIZE: 1024 * 1024,
  MIN_AUTO_VERSION_INTERVAL: 5 * 60 * 1000,
  AUTO_VERSION_RETENTION_DAYS: 30,
  MANUAL_VERSION_RETENTION_DAYS: 365 * 10
};

// Tipos de versão
export const VERSION_TYPES = {
  AUTO: 'auto',
  MANUAL: 'manual',
  MAJOR: 'major',
  MINOR: 'minor',
  PATCH: 'patch',
  MERGE: 'merge',
  REVERT: 'revert'
};

// Status de versão
export const VERSION_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  MERGED: 'merged',
  REVERTED: 'reverted'
};

class VersionControl {
  constructor() {
    this.versions = new Map();
    this.branches = new Map();
    this.currentBranch = 'main';
    this.currentVersion = null;
    this.autoVersionEnabled = true;
    this.lastAutoVersion = null;
  }

  init(projectId) {
    this.projectId = projectId;
    this.loadVersions();
    this.loadBranches();
    
    if (!this.branches.has('main')) {
      this.createBranch('main', 'Branch principal');
    }
    
    this.currentBranch = 'main';
  }

  createVersion(content, options = {}) {
    const {
      type = VERSION_TYPES.MANUAL,
      message = '',
      description = '',
      tags = [],
      author = 'Usuário',
      isAuto = false
    } = options;

    if (isAuto && !this.shouldCreateAutoVersion()) {
      return null;
    }

    const versionId = this.generateVersionId();
    const timestamp = new Date().toISOString();
    
    const previousVersion = this.getCurrentVersion();
    const previousContent = previousVersion ? previousVersion.content : '';
    
    const changes = this.calculateChanges(previousContent, content);
    const stats = this.calculateStats(content, changes);
    
    const version = {
      id: versionId,
      branch: this.currentBranch,
      type,
      status: VERSION_STATUS.PUBLISHED,
      content,
      message,
      description,
      tags,
      author,
      timestamp,
      changes,
      stats,
      parent: previousVersion ? previousVersion.id : null,
      children: [],
      metadata: {
        wordCount: this.countWords(content),
        charCount: content.length,
        lineCount: content.split('\n').length,
        isAuto
      }
    };

    this.versions.set(versionId, version);
    
    const branch = this.branches.get(this.currentBranch);
    if (branch) {
      branch.versions.push(versionId);
      branch.lastVersion = versionId;
      branch.lastUpdated = timestamp;
    }
    
    this.currentVersion = versionId;
    
    if (previousVersion) {
      previousVersion.children.push(versionId);
    }
    
    this.saveVersions();
    this.saveBranches();
    
    return version;
  }

  createBranch(name, description = '') {
    if (this.branches.has(name)) {
      throw new Error(`Branch "${name}" já existe`);
    }
    
    const branch = {
      name,
      description,
      versions: [],
      lastVersion: null,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      parent: this.currentBranch,
      parentVersion: this.currentVersion
    };
    
    this.branches.set(name, branch);
    this.saveBranches();
    
    return branch;
  }

  switchBranch(branchName) {
    if (!this.branches.has(branchName)) {
      throw new Error(`Branch "${branchName}" não existe`);
    }
    
    this.currentBranch = branchName;
    const branch = this.branches.get(branchName);
    this.currentVersion = branch.lastVersion;
    
    return branch;
  }

  getVersionHistory(branch = null, limit = 50) {
    const targetBranch = branch || this.currentBranch;
    const branchData = this.branches.get(targetBranch);
    
    if (!branchData) {
      return [];
    }
    
    const history = [];
    let currentVersionId = branchData.lastVersion;
    
    while (currentVersionId && history.length < limit) {
      const version = this.versions.get(currentVersionId);
      if (version) {
        history.push(version);
        currentVersionId = version.parent;
      } else {
        break;
      }
    }
    
    return history;
  }

  compareVersions(versionId1, versionId2) {
    const version1 = this.versions.get(versionId1);
    const version2 = this.versions.get(versionId2);
    
    if (!version1 || !version2) {
      throw new Error('Versão não encontrada');
    }
    
    const changes = this.calculateChanges(version1.content, version2.content);
    const stats = this.calculateStats(version2.content, changes);
    
    return {
      from: version1,
      to: version2,
      changes,
      stats
    };
  }

  revertVersion(versionId, options = {}) {
    const version = this.versions.get(versionId);
    if (!version) {
      throw new Error('Versão não encontrada');
    }
    
    const previousVersion = this.versions.get(version.parent);
    if (!previousVersion) {
      throw new Error('Não é possível reverter a primeira versão');
    }
    
    const revertVersion = this.createVersion(previousVersion.content, {
      type: VERSION_TYPES.REVERT,
      message: `Revert: ${version.message}`,
      description: `Revertendo para versão ${versionId}`,
      author: options.author || 'Sistema',
      tags: ['revert', versionId]
    });
    
    version.status = VERSION_STATUS.REVERTED;
    this.saveVersions();
    
    return revertVersion;
  }

  calculateChanges(oldContent, newContent) {
    const changes = [];
    
    if (oldContent === newContent) {
      return changes;
    }
    
    // Diferença simples por caracteres
    const oldWords = oldContent.split(/\s+/);
    const newWords = newContent.split(/\s+/);
    
    let position = 0;
    const maxLength = Math.max(oldWords.length, newWords.length);
    
    for (let i = 0; i < maxLength; i++) {
      const oldWord = oldWords[i] || '';
      const newWord = newWords[i] || '';
      
      if (oldWord !== newWord) {
        if (oldWord && !newWord) {
          changes.push({
            type: 'deletion',
            content: oldWord,
            position,
            length: oldWord.length
          });
        } else if (!oldWord && newWord) {
          changes.push({
            type: 'addition',
            content: newWord,
            position,
            length: newWord.length
          });
        } else {
          changes.push({
            type: 'modification',
            oldContent: oldWord,
            newContent: newWord,
            position,
            length: Math.max(oldWord.length, newWord.length)
          });
        }
      }
      
      position += Math.max(oldWord.length, newWord.length) + 1;
    }
    
    return changes;
  }

  calculateStats(content, changes) {
    const additions = changes.filter(c => c.type === 'addition');
    const deletions = changes.filter(c => c.type === 'deletion');
    
    return {
      additions: additions.length,
      deletions: deletions.length,
      totalChanges: changes.length,
      wordsAdded: additions.reduce((sum, c) => sum + this.countWords(c.content), 0),
      wordsRemoved: deletions.reduce((sum, c) => sum + this.countWords(c.content), 0),
      charactersAdded: additions.reduce((sum, c) => sum + c.length, 0),
      charactersRemoved: deletions.reduce((sum, c) => sum + c.length, 0)
    };
  }

  countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  shouldCreateAutoVersion() {
    if (!this.autoVersionEnabled) return false;
    
    if (!this.lastAutoVersion) return true;
    
    const now = Date.now();
    const timeSinceLastAuto = now - this.lastAutoVersion;
    
    return timeSinceLastAuto >= VERSION_CONFIG.MIN_AUTO_VERSION_INTERVAL;
  }

  getCurrentVersion() {
    return this.currentVersion ? this.versions.get(this.currentVersion) : null;
  }

  generateVersionId() {
    return `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  saveVersions() {
    try {
      const versionsData = Object.fromEntries(this.versions);
      localStorage.setItem(`versions_${this.projectId}`, JSON.stringify(versionsData));
    } catch (error) {
      console.error('Erro ao salvar versões:', error);
    }
  }

  loadVersions() {
    try {
      const versionsData = localStorage.getItem(`versions_${this.projectId}`);
      if (versionsData) {
        const parsed = JSON.parse(versionsData);
        this.versions = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Erro ao carregar versões:', error);
    }
  }

  saveBranches() {
    try {
      const branchesData = Object.fromEntries(this.branches);
      localStorage.setItem(`branches_${this.projectId}`, JSON.stringify(branchesData));
    } catch (error) {
      console.error('Erro ao salvar branches:', error);
    }
  }

  loadBranches() {
    try {
      const branchesData = localStorage.getItem(`branches_${this.projectId}`);
      if (branchesData) {
        const parsed = JSON.parse(branchesData);
        this.branches = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Erro ao carregar branches:', error);
    }
  }
}

const versionControl = new VersionControl();

export default versionControl;

// Funções de conveniência
export const createVersion = (content, options) => versionControl.createVersion(content, options);
export const createBranch = (name, description) => versionControl.createBranch(name, description);
export const switchBranch = (branchName) => versionControl.switchBranch(branchName);
export const getVersionHistory = (branch, limit) => versionControl.getVersionHistory(branch, limit);
export const compareVersions = (versionId1, versionId2) => versionControl.compareVersions(versionId1, versionId2);
export const revertVersion = (versionId, options) => versionControl.revertVersion(versionId, options);
export const getCurrentVersion = () => versionControl.getCurrentVersion();
