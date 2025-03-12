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
import { BlingFormType, BlingFormSchema } from '@/types/BlingFormTypes';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useBling } from '@/context/blingContext';
interface FileType {
  name: string;
  type: string;
  lastModified: number;
  size: number;
}
interface NewValuesType extends BlingFormType {
  variations: { [key: string]: string };
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | undefined
    | { [key: string]: string }
    | string[]
    | FileType[]
    | { url: string }[];
}

interface SheetDemoProps {
  rowData: NewValuesType;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

export function SheetDemo({ rowData, open, setOpen }: SheetDemoProps) {
  const { files } = useBling();
  const isSmallScreen = window.innerWidth < 1024;
  const side = isSmallScreen ? 'bottom' : 'right';
  const { variations, setVariations, setIsSavedVariations } = useBling();
  const [activeLabel, setActiveLabel] = React.useState<string | null>(
    'Dados básicos',
  );
  const [secondRendering, setSecondRendering] = React.useState<boolean>(false);

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
            (key) => variation.variations[key] === rowData.variations[key],
          );

          if (isSameVariation) {
            variationExists = true;
            return {
              ...variation,
              ...rowData,
            };
          }

          return variation;
        });

        if (!variationExists) {
          return [...updatedVariations, rowData];
        }

        return updatedVariations;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData]);

  const {
    register,
    control,
    trigger,
    getValues,
    reset,
    handleSubmit,
    watch,
    setValue,
  } = useForm<BlingFormType>({
    resolver: zodResolver(BlingFormSchema),
  });
  const values = getValues();
  const [initialValues, setInitialValues] = React.useState(getValues());
  const { errors } = useFormState({ control });

  React.useEffect(() => {
    if (secondRendering) {
      setInitialValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondRendering]);

  const [name, nameVariations] = getValues(['name', 'nameVariations']);

  React.useEffect(() => {
    setSecondRendering(true);
  }, []);

  const onSubmit: SubmitHandler<BlingFormType> = async (data) => {
    let hasDifference = false;
    if (
      data.urlsImages !== initialValues.urlsImages ||
      data.imagesVariation !== initialValues.imagesVariation ||
      data.nameVariations !== initialValues.name ||
      data.code !== initialValues.code
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
            icmsOwn: data.icmsOwn ? String(data.icmsOwn) : undefined,
            minimum: data.minimum ? String(data.minimum) : undefined,
            itemsPerBox: data.itemsPerBox
              ? String(data.itemsPerBox)
              : undefined,
            maximum: data.maximum ? String(data.maximum) : undefined,
            crossdocking: data.crossdocking
              ? String(data.crossdocking)
              : undefined,
            tributs: data.tributs ? String(data.tributs) : undefined,
            icmsStBase: data.icmsStBase ? String(data.icmsStBase) : undefined,
            pis: data.pis ? String(data.pis) : undefined,
            name: data.nameVariations || variation.name,
            price: data.price ? String(data.price) : '0',
            icmsSt: data.icmsSt ? String(data.icmsSt) : undefined,
            variations: {
              ...variation.variations,
            },
            usingFatherProducts: isChecked,
            imagesVariation: data.imagesVariation,
            urlsImages: data.urlsImages,
          } as NewValuesType;
        }
        return variation; // Aqui, certifique-se de que variation também é do tipo NewValuesType
      });

      setIsSavedVariations(true);
      setVariations(updatedVariations as NewValuesType[]); // Force a tipagem correta
      setOpen(false);
    } else {
      setOpen(false);
    }
  };

  const arraysAreEqual = (arr1: any[], arr2: any[]) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  const verifyDifferences: SubmitHandler<BlingFormType> = async (data) => {
    setOpenModal(false);

    // Garantir que strings sejam definidas e não vazias
    const nameVariations = data.nameVariations ?? '';
    const initialName = initialValues.name ?? '';
    const code = data.code ?? '';
    const initialCode = initialValues.code ?? '';

    if (
      !arraysAreEqual(
        data.imagesVariation ?? [],
        initialValues.imagesVariation ?? [],
      ) ||
      !arraysAreEqual(data.urlsImages ?? [], initialValues.urlsImages ?? []) ||
      nameVariations.trim() !== initialName.trim() ||
      code.trim() !== initialCode.trim()
    ) {
      setOpenModal(true);
    } else if (isChecked !== rowData.usingFatherProducts) {
      setOpenModal(true);
    } else {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    reset({ format: 'P' });
  }, [reset]);
  React.useEffect(() => {
    if (rowData) {
      const nameFromVariations = Object.entries(rowData.variations || {})
        .map(([key, value]) => `${key}:${value}`)
        .join(';');
      const newFormValues = {
        ...rowData,
        name: nameFromVariations || name,
        code: String(rowData.code) || '',
        nameVariations,
        usingFatherProducts: rowData.usingFatherProducts,
      };
      if (!nameVariations) {
        newFormValues.nameVariations =
          nameFromVariations || nameVariations || name;
      }
      reset(newFormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData, name, nameVariations, reset]);

  const renderActiveComponent = () => {
    const activeStep = steps.find((step) => step.label === activeLabel);
    if (activeStep) {
      const Component = activeStep.component;
      return (
        <Component
          watch={watch}
          setValue={setValue}
          isDisabled={isChecked}
          errors={errors}
          register={register}
          control={control}
          getValues={getValues}
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
                      activeLabel === step.label ? 'bg-primary' : 'bg-[#282828]'
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
                className="ml-2 border-red-600 text-red-600 hover:bg-red-600"
              >
                Fechar
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={handleSubmit(onSubmit)}
                className='border-primary text-primary hover:bg-primary'
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
              className="bg-primary text-white border-white hover:bg-[#C1C101] hover:text-white"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
