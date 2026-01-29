"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Search,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// Types - Garde la même API simple !
export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  searchable = true,
  searchPlaceholder = "Rechercher...",
  pageSize = 10,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Fonction helper pour récupérer les valeurs nested
  const getValue = (item: T, key: string): unknown => {
    const keys = key.split(".");
    let value: unknown = item;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value;
  };

  // Convertir les Column<T> simples en ColumnDef de TanStack
  const tanstackColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = columns.map((col) => ({
      id: String(col.key),
      accessorFn: (row) => getValue(row, String(col.key)),
      header: ({ column }) => {
        if (col.sortable !== false) {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4 h-8 hover:bg-transparent"
            >
              {col.header}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        }
        return <div className="font-medium">{col.header}</div>;
      },
      cell: ({ row }) => {
        const item = row.original;
        if (col.render) {
          return col.render(item);
        }
        const value = getValue(item, String(col.key));
        return <div>{String(value ?? "")}</div>;
      },
      enableSorting: col.sortable !== false,
      enableColumnFilter: col.filterable !== false,
    }));

    // Ajouter la colonne Actions si nécessaire
    if (onView || onEdit || onDelete) {
      cols.push({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <TooltipProvider delayDuration={300}>
                {onView && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(item)}
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voir les détails</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {onEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Modifier</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Supprimer</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      });
    }

    return cols;
  }, [columns, onView, onEdit, onDelete]);

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Toolbar: Search + Column Visibility */}
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-9">
              <Settings2 className="mr-2 h-4 w-4" />
              Colonnes
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-50">
            {/* [200px] */}
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hhover:bg-transparent border-b border-border/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-muted/30 font-semibold text-foreground h-12"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-muted/50 border-b border-border/30 last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tanstackColumns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-sm">Aucune donnée disponible</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} résultat(s) au total
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Précédent
            </Button>
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} sur{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export du type Column pour l'utilisation
// export type { Column } from "@tanstack/react-table";
// export type { Column } from "@tanstack/react-table";
