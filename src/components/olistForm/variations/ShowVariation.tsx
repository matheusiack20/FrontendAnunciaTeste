import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import BasicData from '../BasicData';
import Characteristics from '../Characteristics';
import Images from '../Images';
import Stock from '../Stock';
import Taxation from '../Taxation';
import { useForm, useFormState, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import { useOlist } from '@/context/olistContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { OlistFormSchema, OlistFormType } from '@/types/OlistFormTypes';

interface NewValuesType extends OlistFormType {
  code: string; 
  price: number;
  variations: { [key: string]: string };
  [key: string]:
    | string
    | number
    | boolean
    | object
    | Date
    | {}
    | null
    | undefined
    | { [key: string]: string };
}


interface SheetDemoProps {
  rowData: NewValuesType;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

export function SheetDemo({ rowData, open, setOpen }: SheetDemoProps) {
  const isSmallScreen = window.innerWidth < 1024;
  const side = isSmallScreen ? 'bottom' : 'right';
  const { variations, setVariations, setIsSavedVariations } = useOlist();
  const [activeLabel, setActiveLabel] = React.useState<string | null>(
    'Dados básicos',
  );

  const steps = [
    { label: 'Dados básicos', component: BasicData },
    { label: 'Características', component: Characteristics },
    { label: 'Imagens', component: Images },
    { label: 'Estoque', component: Stock },
    { label: 'Tributação', component: Taxation },
  ];

  const handleLabelClick = (label: string) => {
    setActiveLabel(label);
  };
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isChecked, setIsChecked] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (rowData && typeof rowData.usingFatherProducts === 'boolean') {
      setIsChecked(rowData.usingFatherProducts);
    }
  }, [rowData]);

  React.useEffect(() => {
    if (rowData) {
      setVariations((prevVariations) => {
        let variationExists = false;
    
        const updatedVariations = prevVariations.map((variation) => {
            const isSameVariation = Object.keys(rowData.variations).every(
                (key) => variation.variations[key] === rowData.variations[key]
            );
    
            if (isSameVariation) {
                variationExists = true;
                return {
                    ...variation,
                    ...rowData
                };
            }
    
            return variation;
        });
    
        if (!variationExists) {
            return [...updatedVariations, { ...rowData, variations: { ...rowData.variations } }]; // Ensure rowData fits NewValuesType
        }
    
        return updatedVariations;
    });
    
    }
  }, [rowData, setVariations]);

  const { register, control, trigger, getValues, reset, handleSubmit, watch } =
    useForm<OlistFormType>({
      resolver: zodResolver(OlistFormSchema),
    });
  const [initialValues, setInitialValues] = React.useState(getValues());
  const { errors } = useFormState({ control });

  React.useEffect(() => {
    const values = getValues();
    setInitialValues(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [name, nameVariations] = getValues(['sku', 'nameVariations']);

  const onSubmit: SubmitHandler<OlistFormType> = async (data) => {
    let hasDifference = false;
    if (
      data.nameVariations !== initialValues.sku ||
      data.sku !== initialValues.sku
    ) {
      hasDifference = true;
    }

    if (isChecked !== rowData.usingFatherProducts) {
      hasDifference = true;
    }

    if (hasDifference) {
      const updatedVariations = variations.map((variation) => {
        const isSameVariation = Object.keys(rowData.variations).every(
          (key) => variation.variations[key] === rowData.variations[key],
        );

        if (isSameVariation) {
          return {
            ...variation,
            ...data,
            name: data.nameVariations ? data.nameVariations : variation.name,
            price: data.precos?.preco ? data.precos.preco : 0,
            variations: {
              ...variation.variations,
            },
            usingFatherProducts: isChecked,
          };
        }
        return variation;
      });

      setIsSavedVariations(true);
      setVariations(updatedVariations);
      setOpen(false);
    } else {
      setOpen(false);
    }
  };

  const verifyDifferences: SubmitHandler<OlistFormType> = async (data) => {
    setOpenModal(false);
    if (
      data.nameVariations !== initialValues.sku ||
      data.sku !== initialValues.sku
    ) {
      setOpenModal(true);
    } else if (isChecked !== rowData.usingFatherProducts) {
      setOpenModal(true);
    } else {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    reset({ type: 'P' });
  }, [reset]);

  React.useEffect(() => {
    if (rowData) {
      setVariations((prevVariations) => {
        let variationExists = false;

        const updatedVariations = prevVariations.map((variation) => {
          const isSameVariation = Object.keys(rowData.variations).every(
            (key) => variation.variations[key] === rowData.variations[key],
          );

          if (isSameVariation) {
            variationExists = true;
            return {
              ...variation,
              ...rowData,
              code: rowData.code || variation.code, // Garantindo que 'code' esteja presente
              price: rowData.price || variation.price, // Garantindo que 'price' esteja presente
            };
          }

          return variation;
        });

        // Se a variação não existe, adiciona uma nova variação
        if (!variationExists) {
          updatedVariations.push({
            ...rowData,
            code: rowData.code || '', // Defina um valor padrão para 'code'
            price: rowData.price || 0, // Defina um valor padrão para 'price'
          });
        }

        return updatedVariations;
      });
    }
  }, [rowData, setVariations]);

  const renderActiveComponent = () => {
    const activeStep = steps.find((step) => step.label === activeLabel);
    if (activeStep) {
      const Component = activeStep.component;
      return (
        <Component
          watch={watch}
          isDisabled={isChecked}
          errors={errors}
          getValues={null as any}
          setValue={null as any}
          register={register}
          control={control}
          trigger={trigger}
          isVariation={true}
        />
      );
    }
    return <p>Selecione uma opção para ver detalhes.</p>;
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleSubmit(verifyDifferences);
          } else {
            setOpen(isOpen);
          }
        }}
      >
        <SheetContent side={side}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <SheetHeader className="flex justify-between flex-row">
              <SheetTitle>Sua variação</SheetTitle>
              <button
                onClick={handleSubmit(verifyDifferences)}
                className="!cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
              >
                <X className="h-4 w-4 " />
                <span className="sr-only ">Close</span>
              </button>
            </SheetHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <ul className="flex flex-wrap gap-2">
                {steps.map((step) => (
                  <li
                    key={step.label}
                    className={`cursor-pointer select-none p-2 rounded ${
                      activeLabel === step.label ? 'bg-gray-200' : 'bg-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLabelClick(step.label);
                    }}
                  >
                    {step.label}
                  </li>
                ))}
              </ul>
              <div className="flex items-center space-x-2">
                <Switch
                  id="usingFatherProducts"
                  checked={isChecked}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="usingFatherProducts">
                  Utilizar informações do produto pai
                </Label>
              </div>
              <div className="mt-4">{renderActiveComponent()}</div>
            </div>
            <SheetFooter>
              <Button
                variant="outline"
                type="button"
                onClick={handleSubmit(verifyDifferences)}
                className="ml-2"
              >
                Fechar
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={handleSubmit(onSubmit)}
              >
                Salvar
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-black">
              Você possui uma alteração não salva
            </DialogTitle>
            <DialogDescription className="text-black">
              Você deseja sair?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setOpenModal(false);
                setOpen(false);
              }}
              className="ml-2 bg-gray-800 text-white border-white hover:bg-gray-700 hover:text-white"
            >
              Sair
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="bg-blue-600 text-white border-white hover:bg-blue-500 hover:text-white"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
