/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const ClientInfoForm = ({ onNext }: { onNext: (formData: any) => void }) => {
    const [formData, setFormData] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedData = sessionStorage.getItem('clientInfoForm');
            return savedData ? JSON.parse(savedData) : {
                nome: '', email: '', cpf: '', celular: '', cep: '', logradouro: '', numero: '', complemento: '', estado: '', cidade: '', bairro: ''
            };
        }
        return {
            nome: '', email: '', cpf: '', celular: '', cep: '', logradouro: '', numero: '', complemento: '', estado: '', cidade: '', bairro: ''
        };
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('clientInfoForm', JSON.stringify(formData));
        }
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let cep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cep.length <= 8) {
            setFormData({ ...formData, cep: cep.replace(/(\d{5})(\d{3})/, '$1-$2') });

            if (cep.length === 8) {
                try {
                    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                    const { logradouro, complemento, bairro, localidade, uf } = response.data;
                    setFormData((prevData: any) => ({
                        ...prevData,
                        logradouro,
                        complemento,
                        bairro,
                        cidade: localidade,
                        estado: uf,
                    }));
                } catch (error) {
                    console.error("Erro ao buscar o CEP:", error);
                }
            }
        }
    };

    return (
        <div className="w-full border rounded-xl h-auto p-2 py-3">
            <h1 className="font-bold">Informações de Contato</h1>
            <div className="w-full flex flex-row flex-wrap gap-2">
                <div className="w-2/5">
                    <h1>Nome<span className="text-red-700">*</span></h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="nome" 
                            value={formData.nome} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="Digite seu nome..."
                        />
                    </div>
                </div>
                <div className="w-2/5">
                    <h1>Email<span className="text-red-700">*</span></h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="Digite seu email..."
                        />
                    </div>
                </div>
                <div className="w-2/5">
                    <h1>CPF<span className="text-red-700">*</span></h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="cpf" 
                            value={formData.cpf} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="000.000.000-00"
                        />
                    </div>
                </div>
                <div className="w-1/2">
                    <h1>Celular com DDD<span className="text-red-700">*</span></h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="celular" 
                            value={formData.celular} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="(XX) 00000-0000"
                        />
                    </div>
                </div>
                <div className="w-1/2">
                    <h1>CEP<span className="text-red-700">*</span></h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="cep" 
                            value={formData.cep} 
                            onChange={handleCepChange} 
                            className="w-full border-none outline-none"
                            placeholder="00000-000"
                            maxLength={9}
                        />
                    </div>
                </div>
                <div className="w-3/4">
                    <h1>Logradouro<span className="text-red-700">*</span></h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="logradouro" 
                            value={formData.logradouro} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="Digite aqui seu endereço..."
                        />
                    </div>
                </div>
                <div className="w-1/6">
                    <h1>Número<span className="text-red-700">*</span></h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="numero" 
                            value={formData.numero} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="123,12A,13B..."
                        />
                    </div>
                </div>
                <div className="w-3/4">
                    <h1>Complemento</h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="complemento" 
                            value={formData.complemento} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="Apto, Bloco, etc..."
                        />
                    </div>
                </div>
                <div className="w-1/6">
                    <h1>Estado</h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <select 
                            name="estado" 
                            value={formData.estado} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none appearance-none bg-transparent"
                        >
                            <option value="">Selecione</option>
                            {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                        </select>
                    </div>
                </div>
                <div className="w-2/5">
                    <h1>Cidade</h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="cidade" 
                            value={formData.cidade} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="Digite sua cidade..."
                        />
                    </div>
                </div>
                <div className="w-1/2">
                    <h1>Bairro</h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="bairro" 
                            value={formData.bairro} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="Digite seu bairro..."
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center mt-4 gap-2">
                <button
                    className="w-36 bg-[#dafd00] text-black px-4 py-2 rounded-md hover:bg-[#979317] transition shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50"
                    onClick={() => {
                        console.log("Form Data:", formData);
                        onNext(formData);
                    }}
                >
                    Avançar
                </button>
            </div>
        </div>
    );
}

export default ClientInfoForm;