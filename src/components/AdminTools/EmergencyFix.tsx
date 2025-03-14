import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Componente para correções de emergência destinado apenas para administradores
 */
const EmergencyFix: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // Carregar dados do usuário atual
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}api/user/current`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setUserData(response.data);
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
      }
    };
    
    fetchUserData();
  }, []);

  const handleFixSubscription = async () => {
    if (!confirm('Tem certeza que deseja corrigir sua assinatura?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Obter token de autenticação
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Você precisa estar autenticado');
      }
      
      // Chamar o endpoint de correção
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/diagnostic/fix-user-subscription`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="border p-4 rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Ferramentas de Emergência</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Corrigir Minha Assinatura</h3>
        
        {userData && (
          <div className="mb-3 text-sm">
            <p><strong>Usuário:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-3">
          Use este botão apenas em caso de emergência para corrigir sua assinatura.
          Esta ferramenta atualiza diretamente os dados da assinatura na sua conta.
        </p>
        
        <button
          onClick={handleFixSubscription}
          disabled={loading}
          className={`px-4 py-2 rounded ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}
        >
          {loading ? 'Corrigindo...' : 'Corrigir Minha Assinatura'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-800">
          <strong>Erro:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
          <h4 className="font-bold">Resultado:</h4>
          <pre className="mt-2 text-sm overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default EmergencyFix;
