import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

export type Student = {
    id: number;
    name: string;
    email: string;
    date_of_birth: string;
};

export function StudentsTable() {
    const [isDialogOpen, setDialogOpen] = React.useState(false);
    const isDialogOpenRef = React.useRef(isDialogOpen);
    isDialogOpenRef.current = isDialogOpen;

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/student/all");
                const sampleStudent = response.data[0];
                console.log("Sample Student:", sampleStudent);
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDateString = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
            year: "numeric",
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        return formattedDate;
    };

    const handleDeleteStudent = async (id: number) => {
        try {
            // Send a DELETE request to delete the student
            const response = await axios.delete(`http://localhost:5000/student/${id}`);

            // Handle success, e.g., show a success message or update state
            console.log("Student deleted successfully:", response.data);

            // Update the students state by removing the deleted student
            const updatedStudents = students.filter((student) => student.id !== id);
            setStudents(updatedStudents);

            // Close the dialog
            setDialogOpen(false);
        } catch (error) {
            console.error("Error deleting student:", error);

            // Handle error, e.g., show an error message
        }
    };

    const columns: ColumnDef<Student>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "Student ID",
            cell: ({ row }) => <div className="container">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className="">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => <div className="container lowercase">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "date_of_birth",
            header: "Date of Birth",
            cell: ({ row }) => <div>{formatDateString(row.getValue("date_of_birth"))}</div>,
        },
        {
            accessorKey: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="space-x-4 ml-10">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Assign Class</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Assign Class</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="className" className="text-right">
                                        Enter Class Name
                                    </Label>
                                    <Input id="className" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Assign</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input id="name" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input id="email" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            console.log("Deleting student with ID:", row.original.id);
                            handleDeleteStudent(row.original.id);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [editedName, setEditedName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

    const table = useReactTable({
        data: students,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    // const handleEditProfileSubmit = async () => {
    //     console.log("Save changes button clicked"); // Add this line
    //     if (selectedRowId !== null) {
    //         try {
    //             // Prepare the request body
    //             const requestBody = {
    //                 name: editedName,
    //                 email: editedEmail,
    //             };

    //             console.log("Submitting request to update student profile:", requestBody);

    //             // Send a PUT request to update the student profile
    //             const response = await axios.put(
    //                 `http://localhost:5000/student/${selectedRowId}`,
    //                 requestBody
    //             );

    //             // Handle success, e.g., show a success message or update state
    //             console.log("Response from server:", response.data);
    //             console.log("Student profile edited successfully.");

    //             // Update the students state with the modified data
    //             const updatedStudents = students.map((student) =>
    //                 student.id === selectedRowId
    //                     ? { ...student, name: editedName, email: editedEmail }
    //                     : student
    //             );

    //             setStudents(updatedStudents);

    //             // Close the dialog
    //             setDialogOpen(false);
    //         } catch (error) {
    //             console.error("Error editing student profile:", error);

    //             // Handle error, e.g., show an error message
    //         }
    //     }
    // };

    const handleEditProfileSubmit = () => {
        console.log("Button clicked");
    };

    useEffect(() => {
        console.log("useEffect - isDialogOpen:", isDialogOpen);
        if (!isDialogOpen) {
            // Perform any cleanup or additional actions here
            setSelectedRowId(null);
        }
    }, [isDialogOpen]);

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search students..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {isDialogOpen && (
                <Dialog>
                    {/* ... (other JSX) */}
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editedName" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="editedName"
                                value={editedName}
                                onChange={(event) => setEditedName(event.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editedEmail" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="editedEmail"
                                value={editedEmail}
                                onChange={(event) => setEditedEmail(event.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleEditProfileSubmit}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}
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
                                    data-state={row.getIsSelected() && "selected"}
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
