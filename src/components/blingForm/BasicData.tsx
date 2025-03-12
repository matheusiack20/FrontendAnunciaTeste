import React, {useEffect, useState} from 'react';
import { useStepper } from '../stepper';
import InputField from '../formComponents/InputField';
import SelectField from '../formComponents/SelectField';
import { Button } from '../ui/button';
import { BlingFormComponentsProps } from '@/types/FormComponentsProps';
import { useBling } from '@/context/blingContext';
import { UseRefreshToken } from '../BlingAuthConnect';

const unitOptions = [
  { value: 'UN', label: 'Un' },
  { value: 'KG', label: 'Kg' },
  { value: 'PÇ', label: 'Pç' },
  { value: 'GR', label: 'Gr' },
];

const formatOptions = [
  { value: 'S', label: 'Simples' },
  { value: 'V', label: 'Variação' },
  { value: 'E', label: 'Com composição' },
];

const conditionOptions = [
  { value: '0', label: 'Não especificado' },
  { value: '1', label: 'Novo' },
  { value: '2', label: 'Usado' },
  { value: '3', label: 'Recondicionado' },

];


const BasicData: React.FC<BlingFormComponentsProps> = ({
  register,
  control,
  errors,
  
  trigger,
  isVariation,
  isDisabled = false,
}) => {
  const { nextStep, prevStep, isDisabledStep } = useStepper();

  interface Category {
    id: number;
    descricao: string;
  }
  
  const [categoryOptions, setCategoryOptions] = useState([{ value: 'noCategory', label: 'Sem categoria' }]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      
      await UseRefreshToken();
      const accessToken = localStorage.getItem('accessToken');
      
      try {
        const url = `${process.env.NEXT_PUBLIC_URL}/getCategory`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(response)
        
        if (response.ok) {
          const data: Category[] = await response.json();
          
          // Garantir que as categorias sejam únicas, utilizando um Set para verificar os IDs
          const uniqueCategories = Array.from(new Set(data.map(cat => cat.id)))
          .map(id => data.find(cat => cat.id === id))
          .filter(Boolean) as Category[];
          
          const categories = uniqueCategories.map((cat) => ({
            value: cat.id.toString(),
            label: cat.descricao,
          }));
          
          setCategoryOptions((prevOptions) => {
            // Filtra as categorias já presentes para não adicionar duplicadas ao estado
            const allCategories = [...prevOptions, ...categories];
            return allCategories.filter((option, index, self) =>
              index === self.findIndex((t) => t.value === option.value)
          );
        });
        } else {
          console.error('Erro ao buscar categorias interno:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias externo:', error);
        console.log(error);
      }
    };
    
    fetchCategories();
  }, []);
    
  const handleNextStepClick = async () => {

    const result = await trigger(['name', 'format']);
    if (!result) {
      return;
    }
    if (!isVariation) {
      nextStep();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-white-700 mt-10 mb-2 text-3xl font-extrabold dark:text-white">
        Dados básicos
      </h3>
      <div className="flex flex-col items-start w-full gap-3 sm:flex-row">
        <InputField
          label={isVariation ? 'Variação' : 'Nome do produto'}
          required
          placeholder={
            isVariation
              ? 'Digite o nome da sua variação'
              : 'Digite o nome do seu produto'
          }
          register={register(isVariation ? 'nameVariations' : 'name')}
          error={
            isVariation ? errors.nameVariations?.message : errors.name?.message
          }
        />
        <div className="flex flex-col sm:flex-row w-full sm:w-full gap-2">
          <InputField
            label="Código(SKU)"
            placeholder="Digite um código único"
            register={register('code')}
            error={errors.code?.message}
          />
          <InputField
            label="Preço de venda"
            placeholder="99,99"
            isDisabled={isDisabled}
            register={register('price')}
            error={errors.price?.message}
          />
        </div>
      </div>
      <div className="flex flex-col w-full gap-3 sm:flex-row">
        <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
          <SelectField
            label="Unidade"
            name="unit"
            isDisabled={isDisabled}
            control={control}
            options={unitOptions}
            placeholder="Un, Kg, Pç, Gr"
            error={errors.unit?.message}
          />
          {!isVariation && (
            <SelectField
              label="Formato"
              name="format"
              isDisabled={isDisabled}
              required
              control={control}
              options={formatOptions}
              error={errors.format?.message}
            />
          )}
        </div>
        <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
          <SelectField
            label="Condição"
            isDisabled={isDisabled}
            name="condition"
            control={control}
            options={conditionOptions}
            placeholder="Não especificado"
            error={errors.condition?.message}
          />
          <SelectField
            label="Categoria"
            name="category"
            control={control}
            isDisabled={isDisabled}
            options={categoryOptions}
            placeholder="Sem categoria"
            error={errors.category?.message}
          />
        </div>
      </div>
      {!isVariation && (
        <div className="flex gap-5 justify-end">
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="lg"
            variant="secondary"
            type="button"
          >
            Voltar
          </Button>
          <Button onClick={handleNextStepClick} size="lg" type="button">
            Avançar
          </Button>
        </div>
      )}
    </div>
  );
};

export default BasicData;
