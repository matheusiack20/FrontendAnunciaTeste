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
import { BlingFormType } from '@/types/BlingFormTypes';
import { useBling } from '@/context/blingContext';

interface NewValuesType extends BlingFormType {
  variations: { [key: string]: string };
  [key: string]: any;
}

interface TableProps {
  register: UseFormRegister<BlingFormType>;
  control: Control<BlingFormType>;
  errors: FieldErrors<BlingFormType>;
  getValues: UseFormGetValues<BlingFormType>;
  trigger: UseFormTrigger<BlingFormType>;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
}

const DataTable: React.FC<TableProps> = ({ getValues }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedRowData, setSelectedRowData] =
    React.useState<NewValuesType | null>(null);
  const { attributesOfVariations, variations, setVariations, files, links } =
    useBling();
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
        (acc, variation, index) => {
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
        const newVariation = {
          variations: variationObject,
          format: getValues('format'),
          ...values,
          usingFatherProducts: true,
          imagesVariation: files,
          urlsImages: links,
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
    setVariations(uniqueValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributesOfVariations]);

  const handleRowClick = (rowData: NewValuesType) => {
    const selectedRow = variations.find((item) => {
      return Object.keys(rowData.variations).every((key) => {
        return item.variations[key] === rowData.variations[key];
      });
    });

    if (selectedRow) {
      setSelectedRowData(selectedRow);
      setOpen(true);
    }
  };

  return (
    <div className="overflow-x-auto max-w-full cursor-pointer">
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
          {variations.map((variationItem, rowIndex) => {
            return (
              <TableRow
                key={rowIndex}
                className={cn('border-t', rowIndex % 2 && 'bg-primary')}
                onClick={() => handleRowClick(variationItem)}
              >
                <TableCell
                  className="border border-gray-300 truncate px-4 py-2 text-left"
                  title={variationItem.code}
                >
                  {variationItem.code}
                </TableCell>
                <TableCell
                  className="border border-gray-300 truncate px-4 py-2 text-left"
                  title={String(variationItem.price)}
                >
                  {variationItem.price}
                </TableCell>
                {attributesOfVariations.map((variation, index) => (
                  <TableCell
                    key={index}
                    className="border border-gray-300 truncate px-4 py-2 text-left"
                    title={variationItem.variations[variation.nameVariation]}
                  >
                    {variationItem.variations[variation.nameVariation]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {selectedRowData && open && (
        <SheetDemo rowData={selectedRowData} open={open} setOpen={setOpen} />
      )}
    </div>
  );
};

export default DataTable;
