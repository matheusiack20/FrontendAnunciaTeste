import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import { cn } from '@/lib/utils';
import { SheetDemo } from './variations/ShowVariation';
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormTrigger,
} from 'react-hook-form';
import { OlistFormType } from '@/types/OlistFormTypes';
import { useOlist } from '@/context/olistContext';

interface NewValuesType extends OlistFormType {
  variations: { [key: string]: string };
  [key: string]: any;
  code: string;
  price: number;
}

interface TableProps {
  register: UseFormRegister<OlistFormType>;
  control: Control<OlistFormType>;
  errors: FieldErrors<OlistFormType>;
  getValues: UseFormGetValues<OlistFormType>;
  trigger: UseFormTrigger<OlistFormType>;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
}

const DataTable: React.FC<TableProps> = ({ getValues }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedRowData, setSelectedRowData] =
    React.useState<NewValuesType | null>(null);
  const { attributesOfVariations, variations, setVariations } = useOlist();
  React.useEffect(() => {
    const generateCombinations = (arrays: string[][]): string[][] => {
      if (arrays.length === 0) return [[]];
      const [firstArray, ...restArrays] = arrays;
      const combinations = generateCombinations(restArrays);
      return firstArray.flatMap((item) =>
        combinations.map((combination) => [item, ...combination]),
      );
    };

    const values = getValues();

    const newCombinations = generateCombinations(
      attributesOfVariations.map((v) => v.options),
    );

    const allValues = newCombinations.flatMap((combination) => {
      const variationObject = attributesOfVariations.reduce(
        (acc, variation: any, index) => {
          acc[variation.nameVariation] = combination[index];
          return acc;
        },
        {} as { [key: string]: string },
      );

      const existingVariation = variations.find((existingItem) =>
        Object.keys(variationObject).every(
          (key) => existingItem.variations[key] === variationObject[key],
        ),
      );

      if (existingVariation) {
        return { ...existingVariation };
      } else {
        const [price] = getValues(['precos.preco']);
        const newVariation = {
          variations: variationObject,
          type: getValues('type'),
          ...values,
          usingFatherProducts: true,
        } as NewValuesType;

        return newVariation;
      }
    });

    const uniqueValues = allValues.reduce((acc, item) => {
      const exists = acc.find(
        (existingItem) =>
          JSON.stringify(existingItem.variations) ===
          JSON.stringify(item.variations),
      );
      if (!exists) {
        acc.push(item);
      }
      return acc;
    }, [] as NewValuesType[]);

    setVariations(uniqueValues as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributesOfVariations]);

  const handleRowClick = (rowData: NewValuesType) => {
    const selectedRow = variations.find((item) =>
      Object.keys(rowData.variations).every(
        (key) => item.variations[key] === rowData.variations[key],
      ),
    );

    if (selectedRow) {
      setSelectedRowData(selectedRow);
      setOpen(true);
    }
  };

  return (
    <div className="overflow-x-auto max-w-full">
      <Table className="table-fixed border-collapse border border-gray-200 text-sm">
        <TableHeader>
          <TableRow>
            <TableCell
              className="border border-gray-300 w-[150px] truncate px-4 py-2 text-left font-bold"
              title="Code"
            >
              Code
            </TableCell>
            <TableCell
              className="border border-gray-300 w-[150px] truncate px-4 py-2 text-left font-bold"
              title="Price"
            >
              Price
            </TableCell>
            {attributesOfVariations.map((variation, index) => (
              <TableCell
                key={index}
                className="border border-gray-300 px-4 py-2 truncate w-[150px] text-left font-bold"
                title={variation.nameVariation}
              >
                {variation.nameVariation}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {variations.map((rowData, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={cn('border-t', rowIndex % 2 && 'bg-primary')}
              onClick={() => handleRowClick(rowData)}
            >
              <TableCell
                className="border border-gray-300 truncate px-4 py-2 text-left"
                title={rowData.code}
              >
                {rowData.code}
              </TableCell>
              <TableCell
                className="border border-gray-300 truncate px-4 py-2 text-left"
                title={String(rowData.price)}
              >
                {rowData.price}
              </TableCell>
              {attributesOfVariations.map((variation, index) => (
                <TableCell
                  key={index}
                  className="border border-gray-300 truncate px-4 py-2 text-left"
                  title={rowData.variations[variation.nameVariation]}
                >
                  {rowData.variations[variation.nameVariation]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedRowData && open && (
        <SheetDemo rowData={selectedRowData} open={open} setOpen={setOpen} />
      )}
    </div>
  );
};

export default DataTable;
