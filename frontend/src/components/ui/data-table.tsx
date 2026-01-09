"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    VisibilityState,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ChevronDown, ChevronsUpDown, ChevronUp, Loader2, Search, Columns3 } from "lucide-react";

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    isLoading?: boolean;
    filterKey?: string;
}

export function DataTable<TData>({
    columns,
    data,
    isLoading = false,
    filterKey
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            columnFilters,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: "includesString",
    });

    return (
        <div className="w-full space-y-4">
            {/* Enhanced Toolbar with Card Background */}
            <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
                {/* Search Input with Icon */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Search ${filterKey ? filterKey : "all columns"}...`}
                        value={filterKey
                            ? (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
                            : globalFilter}
                        onChange={(e) => {
                            if (filterKey) {
                                table.getColumn(filterKey)?.setFilterValue(e.target.value);
                            } else {
                                setGlobalFilter(e.target.value);
                            }
                        }}
                        className="pl-9 bg-background/50"
                    />
                </div>

                {/* Column Visibility Dropdown with Icon */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Columns3 className="h-4 w-4" />
                            Columns
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {table
                            .getAllLeafColumns()
                            .filter((col) => col.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {typeof column.columnDef.header === "string"
                                        ? column.columnDef.header
                                        : column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Enhanced Table with Better Colors */}
            <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="font-semibold text-foreground w-16">#</TableHead>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold text-foreground">
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={
                                                    header.column.getCanSort()
                                                        ? "flex items-center space-x-2 cursor-pointer select-none hover:text-primary transition-colors"
                                                        : ""
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <span>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </span>
                                                {header.column.getCanSort() && (
                                                    <span className="ml-2">
                                                        {header.column.getIsSorted() === "asc" ? (
                                                            <ChevronUp className="h-4 w-4 text-primary" />
                                                        ) : header.column.getIsSorted() === "desc" ? (
                                                            <ChevronDown className="h-4 w-4 text-primary" />
                                                        ) : (
                                                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <span className="text-sm text-muted-foreground">Loading data...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted/30 transition-colors"
                                >
                                    <TableCell className="font-medium text-muted-foreground">
                                        {row.index + 1 + table.getState().pagination.pageIndex * table.getState().pagination.pageSize}
                                    </TableCell>
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
                                    colSpan={columns.length + 1}
                                    className="h-32 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                            <Search className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">No results found</p>
                                            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Enhanced Pagination with Card Background */}
            <div className="flex items-center justify-between px-2 py-4 bg-card rounded-lg border">
                <div className="flex-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{table.getFilteredRowModel().rows.length}</span> row(s) total
                </div>
                <div className="flex items-center gap-6 lg:gap-8">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[120px] items-center justify-center text-sm font-medium">
                        <span className="text-muted-foreground">Page</span>
                        <span className="mx-1 text-foreground">{table.getState().pagination.pageIndex + 1}</span>
                        <span className="text-muted-foreground">of {table.getPageCount()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronDown className="h-4 w-4 rotate-90" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Next</span>
                            <ChevronDown className="h-4 w-4 -rotate-90" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}