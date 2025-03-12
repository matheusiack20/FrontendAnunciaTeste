import React, { FormEventHandler } from 'react';
import { Search, Trash } from 'lucide-react';
import { BlingFormComponentsProps } from '@/types/FormComponentsProps';
import { BlingFormType } from '@/types/BlingFormTypes';
import { UseFormGetValues } from 'react-hook-form';
import { useStepper } from '../stepper';
import { Button } from '../ui/button';
import SelectField from '../formComponents/SelectField';
import { Input } from '../ui/input';
import { UseRefreshToken } from '../BlingAuthConnect';
import { ComboboxDemo } from './ComboBox';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductTable } from './ProductTable';
import ErrorMessage from '../utils/ErrorMessage';
import { useBling } from '@/context/blingContext';
import { cadastrouAnuncio } from '../../../trackingMeta';
// import { ProductTable } from './ProductTable';

interface VariationProps extends BlingFormComponentsProps {
  getValues: UseFormGetValues<BlingFormType>;
}

interface Product {
  id: number;
  nome: string;
  codigo: string;
  descricaoCurta: string;
  formato: string;
  imagemURL: string;
  preco: number;
  precoCusto: number;
  situacao: string;
  tipo: string;
}

const stockType = [
  { value: 'F', label: 'Físico' },
  { value: 'V', label: 'Virtual' },
];

const postStock = [
  { value: 'P', label: 'Produto' },
  { value: 'M', label: 'Componentes' },
  { value: 'A', label: 'Produto e Componente' },
];

const Structure: React.FC<VariationProps> = ({
  control,
  trigger,
  setCurrentStep,
  errors,
  watch,
  isDisabled = false,
}) => {
  const { prevStep, isDisabledStep, nextStep, isLastStep } = useStepper();
  const [data, setData] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');

  const { selectedProducts, setSelectedProducts } = useBling();
  const [valueInput, setValueInput] = React.useState<string>('');
  const handleNextStep = async () => {
    const result = await trigger('name');
    if (!result) {
      return;
    }
    if (setCurrentStep) {
      setCurrentStep(2);
      nextStep();
    }
  };
  const formatValue = watch('format');
  const stock = watch('stockType');

  const accessToken = localStorage.getItem('accessToken');
  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setMessage('');
    setIsLoading(true);
    setData([]);

    try {
      if (!valueInput) {
        setMessage('Você deve digitar um nome');
        return;
      }

      if (valueInput.length === 1) {
        setMessage('Você deve digitar no mínimo 2 caracteres');
        return;
      }

      await UseRefreshToken();

      const url = `${process.env.NEXT_PUBLIC_URL}/getProducts?nameProduct=${valueInput}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
        if (result.length === 0) {
          setMessage('Nenhum produto encontrado');
        }
      } else {
        console.error('Erro ao buscar produtos:', response.statusText);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mappedValues = data.map((item) => ({
    value: item.id.toString(),
    label: item.nome,
    ...item,
  }));

  return (
    <div className="flex flex-col gap-5 ml-0 pl-0">
      <h3 className="text-white-700 mt-10 mb-2 text-3xl font-extrabold dark:text-white">
        Estrutura
      </h3>
      <div className="flex w-full gap-4">
        <SelectField
          placeholder="Virtual"
          label="Tipo de estoque"
          name="stockType"
          isDisabled={isDisabled}
          control={control}
          options={stockType}
          error={errors.unit?.message}
        />
        {stock === 'V' && (
          <SelectField
            placeholder="Produto"
            label="Lançar estoque"
            name="postStock"
            isDisabled={isDisabled}
            control={control}
            options={postStock}
            error={errors.unit?.message}
          />
        )}
      </div>
      <div>
        <Input
          type="text"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          placeholder="Procure por um produto"
        />
        {message && <ErrorMessage className="mb-2">{message}</ErrorMessage>}
        <Button type="button" onClick={handleButtonClick}>
          Enviar
        </Button>
      </div>

      {!isLoading && data && data.length > 0 && (
        <ComboboxDemo
          values={mappedValues}
          setSelectedProducts={setSelectedProducts}
          selectedProducts={selectedProducts}
        />
      )}
      {isLoading && <Skeleton className="h-10 w-[200px] sm:w-1/2 p-0" />}
      {selectedProducts && selectedProducts.length > 0 && (
        <ProductTable
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      )}
      {isLastStep && (
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
          <Button onClick={cadastrouAnuncio} className="w-1/2" type="submit" variant="default">
            <Search className="w-5 h-5 mr-2" />
            Cadastrar produto
          </Button>
        </div>
      )}
    </div>
  );
};

export default Structure;
