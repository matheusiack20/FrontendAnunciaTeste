import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '../ui/skeleton';

interface ValuesType {
  value: string;
  label: string;
  id?: number;
  nome?: string;
  codigo?: string;
  descricaoCurta?: string;
  formato?: string;
  imagemURL?: string;
  preco?: number;
  precoCusto?: number;
  situacao?: string;
  tipo?: string;
  quantity?: number;
}

interface ProductTableProps {
  selectedProducts: ValuesType[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ValuesType[]>>;
}

export function ProductTable({
  selectedProducts,
  setSelectedProducts,
}: ProductTableProps) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const calculatePrice = () => {
    return selectedProducts.reduce((acc, product) => {
      if (product.preco) {
        const valuePrice = product.quantity
          ? product.preco * product.quantity
          : product.preco * 1;
        return acc + valuePrice;
      }

      return acc;
    }, 0);
  };

  const calculateCostPrice = () => {
    return selectedProducts.reduce((acc, product) => {
      if (product.precoCusto) {
        const valuePrice = product.quantity
          ? product.precoCusto * product.quantity
          : product.precoCusto * 1;
        return acc + valuePrice;
      }
      return acc;
    }, 0);
  };

  const [totalPrice, setTotalPrice] = React.useState(0);
  const [costPrice, setCostPrice] = React.useState(0);

  React.useEffect(() => {
    const calculatedTotalPrice = calculatePrice();
    const calculatedCostPrice = calculateCostPrice();
    setTotalPrice(calculatedTotalPrice);
    setCostPrice(calculatedCostPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts]);

  const handleRemoveProduct = (id?: number) => {
    if (id) {
      setSelectedProducts((prev) =>
        prev.filter((product) => product.id !== id),
      );
    }
  };

  const handleQuantityChange = (id: number, value: number) => {
    if (Number.isInteger(value)) {
      setSelectedProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, quantity: value } : product,
        ),
      );
    }
  };

  const columns: ColumnDef<ValuesType>[] = [
    {
      accessorKey: 'imagemURL',
      header: 'Imagem',
      cell: ({ row }) => {
        const product = row.original;
        return product.imagemURL ? (
          <Image
            width={50}
            height={50}
            alt={product.nome || 'Produto'}
            src={product.imagemURL}
          />
        ) : (
          <Skeleton className="w-[50px] h-[50px]" />
        );
      },
    },
    {
      accessorKey: 'nome',
      header: 'Nome',
      cell: ({ row }) => <div>{row.getValue('nome')}</div>,
    },
    {
      accessorKey: 'codigo',
      header: 'Código',
      cell: ({ row }) => <div>{row.getValue('codigo')}</div>,
    },
    {
      accessorKey: 'preco',
      header: 'Preço',
      cell: ({ row }) => {
        const preco = row.getValue('preco');
        return <div>{preco ? `R$${preco}` : 'R$00'}</div>;
      },
    },
    {
      accessorKey: 'precoCusto',
      header: 'Preço de Custo',
      cell: ({ row }) => {
        const precoCusto = row.getValue('precoCusto');
        return <div>{precoCusto ? `R$${precoCusto}` : 'R$00'}</div>;
      },
    },
    {
      id: 'quantity',
      header: 'Quantidade',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <input
            type="text"
            value={product.quantity ?? 1}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                handleQuantityChange(product.id || -1, value);
              }
            }}
            className="w-full border rounded-md p-1"
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Trash
            width={16}
            height={16}
            className="duration-200 ease-in-out cursor-pointer w-5 h-5 text-black hover:text-red-600"
            onClick={() => handleRemoveProduct(product.id)}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: selectedProducts,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center mt-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
      {selectedProducts && selectedProducts.length > 0 && (
        <div className="flex gap-4">
          <div className="flex flex-col mt-4 ">
            <span className="font-medium text-white-500">
              Preço total de venda
            </span>
            <p className="text-white text-center bg-gray-800 items-center py-2 px-4 rounded-lg font-bold">
              R${totalPrice.toFixed(2)}
            </p>
          </div>
          <div className="flex flex-col  mt-4 ">
            <span className="font-medium text-white-500">
              Preço Total de Custo
            </span>
            <p className="text-white text-center bg-gray-800 items-center py-2 px-4 rounded-lg font-bold">
              R${costPrice.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
