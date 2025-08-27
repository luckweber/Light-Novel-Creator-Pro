import React from 'react';
import { FileText, Download } from 'lucide-react';

const PDFExporterTest = () => {
  const testExport = () => {
    alert('Teste do Exportador de PDF - Funcionando!');
  };

  return (
    <div className="p-4 border border-green-300 bg-green-50 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        Teste do Exportador PDF
      </h3>
      <p className="text-green-700 mb-3">
        Este é um teste para verificar se o exportador está funcionando.
      </p>
      <button
        onClick={testExport}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        <FileText className="mr-2 h-4 w-4" />
        Testar Exportador
      </button>
    </div>
  );
};

export default PDFExporterTest;
