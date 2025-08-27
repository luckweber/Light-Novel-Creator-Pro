import React, { useState, useRef } from 'react';
import {
  Upload,
  Image,
  X,
  Edit,
  Trash2,
  Eye,
  Download,
  Plus,
  Save,
  RotateCw
} from 'lucide-react';
import useStore from '../../store/useStore';

const CoverManager = ({ onClose, type = 'volume', itemId = null }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [cropData, setCropData] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const { 
    currentProject, 
    projectStructure, 
    updateVolume, 
    updateChapter,
    addVolumeCover,
    addChapterCover,
    removeVolumeCover,
    removeChapterCover
  } = useStore();

  // Encontrar o item atual (volume ou capítulo)
  const getCurrentItem = () => {
    if (type === 'volume') {
      return projectStructure?.volumes?.find(v => v.id === itemId);
    } else {
      for (const volume of projectStructure?.volumes || []) {
        const chapter = volume.chapters?.find(c => c.id === itemId);
        if (chapter) return { ...chapter, volumeId: volume.id };
      }
    }
    return null;
  };

  const currentItem = getCurrentItem();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        setEditMode(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentItem) return;

    setIsUploading(true);
    try {
      // Simular upload - em produção, isso seria enviado para um servidor
      const coverData = {
        id: `${type}_${itemId}_${Date.now()}`,
        url: previewUrl,
        filename: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        uploadedAt: new Date().toISOString(),
        cropData: cropData
      };

      if (type === 'volume') {
        await addVolumeCover(itemId, coverData);
      } else {
        await addChapterCover(currentItem.volumeId, itemId, coverData);
      }

      setSelectedFile(null);
      setPreviewUrl(null);
      setEditMode(false);
      setCropData(null);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCover = async () => {
    if (!currentItem) return;

    try {
      if (type === 'volume') {
        await removeVolumeCover(itemId);
      } else {
        await removeChapterCover(currentItem.volumeId, itemId);
      }
    } catch (error) {
      console.error('Erro ao remover capa:', error);
    }
  };

  const handleCrop = () => {
    if (!canvasRef.current || !previewUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Definir dimensões do canvas (proporção 3:4 para capas de light novel)
      const maxWidth = 300;
      const maxHeight = 400;
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setPreviewUrl(croppedDataUrl);
      setCropData({
        width: canvas.width,
        height: canvas.height,
        ratio: ratio
      });
    };
    
    img.src = previewUrl;
  };

  const getCurrentCover = () => {
    if (type === 'volume') {
      return currentItem?.cover;
    } else {
      return currentItem?.cover;
    }
  };

  const currentCover = getCurrentCover();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Image className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">
                Gerenciar Capa - {type === 'volume' ? 'Volume' : 'Capítulo'}
              </h2>
              <p className="text-sm text-gray-600">
                {currentItem?.title || 'Item não encontrado'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Upload de Capa</h3>
              
              {/* Current Cover */}
              {currentCover && !editMode && (
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-3">Capa Atual</h4>
                  <div className="relative">
                    <img
                      src={currentCover.url}
                      alt="Capa atual"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => setEditMode(true)}
                        className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleRemoveCover}
                        className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <p>Arquivo: {currentCover.filename}</p>
                    <p>Tamanho: {(currentCover.size / 1024).toFixed(1)} KB</p>
                    <p>Upload: {new Date(currentCover.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              {(!currentCover || editMode) && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {!previewUrl ? (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Clique para selecionar uma imagem
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        PNG, JPG, JPEG até 5MB
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Selecionar Imagem
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCrop}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          <RotateCw className="h-4 w-4 inline mr-1" />
                          Ajustar
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setEditMode(false);
                          }}
                          className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Button */}
              {previewUrl && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Fazendo Upload...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Capa
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Visualização</h3>
              
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Como aparecerá</h4>
                
                {/* Volume Cover Preview */}
                {type === 'volume' && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                    <div className="w-32 h-40 mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                      {currentCover ? (
                        <img
                          src={currentCover.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Capa do Volume
                    </p>
                  </div>
                )}

                {/* Chapter Cover Preview */}
                {type === 'chapter' && (
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg">
                    <div className="w-24 h-32 mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                      {currentCover ? (
                        <img
                          src={currentCover.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Capa do Capítulo
                    </p>
                  </div>
                )}
              </div>

              {/* Guidelines */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                  Diretrizes para Capas
                </h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Resolução mínima: 300x400 pixels</li>
                  <li>• Formato: PNG, JPG, JPEG</li>
                  <li>• Tamanho máximo: 5MB</li>
                  <li>• Proporção recomendada: 3:4</li>
                  <li>• Evite texto pequeno ou detalhes finos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hidden Canvas for Cropping */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CoverManager;
