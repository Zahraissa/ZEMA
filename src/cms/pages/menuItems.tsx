import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Search, Save, X, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCreateMenuItem, useMenuItemsQuery, useUpdateMenuItem } from "./services/useMenuItems";
import { menuService } from "../../../services/menuService";
import { useMenu } from "../../../hooks/useMenu";
import Swal from "sweetalert2";

export default function MenuItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    icon: "",
    status: "active" as "active" | "inactive",
    order: 1,
    menu_group_id: 0,
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    link: "",
    icon: "",
    status: "active" as "active" | "inactive",
    order: 1,
    menu_group_id: 0,
  });
  const [open, setOpen] = useState(false);

  const createMenuItemMutation = useCreateMenuItem();
  const updateMenuItemMutation = useUpdateMenuItem();
  const { data, isLoading, isError, error, refetch } = useMenuItemsQuery();
  const { forceRefresh } = useMenu();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const showSuccessNotification = (message: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: message,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMenuItemMutation.mutate(formData, {
      onSuccess: async () => {
        showSuccessNotification("Menu Item created successfully!");
        setOpen(false);
        setFormData({
          name: "",
          description: "",
          link: "",
          icon: "",
          status: "active",
          order: 1,
          menu_group_id: 0,
        });
        // Clear menu cache and refetch
        menuService.clearCache();
        await forceRefresh();
        refetch();
      },
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item.id);
    setEditFormData({
      name: item.name,
      description: item.description || "",
      link: item.link || "",
      icon: item.icon || "",
      status: item.status,
      order: item.order,
      menu_group_id: item.menu_group_id,
    });
  };

  const handleSaveEdit = (id: number) => {
    updateMenuItemMutation.mutate(
      { id, data: editFormData },
      {
        onSuccess: async () => {
          showSuccessNotification("Menu Item updated successfully!");
          setEditingItem(null);
          // Clear menu cache and refetch
          menuService.clearCache();
          await forceRefresh();
          refetch();
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleRefreshMenu = async () => {
    try {
      await forceRefresh();
      showSuccessNotification("Menu refreshed successfully!");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to refresh menu",
      });
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-normal tracking-tight">Menu Items</h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefreshMenu}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Menu
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Add Menu Item</AlertDialogTitle>
                <AlertDialogDescription>
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <Input
                      name="name"
                      placeholder="Menu Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="link"
                      placeholder="Link URL"
                      value={formData.link}
                      onChange={handleChange}
                    />
                    <Textarea
                      name="description"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleChange}
                      className="md:col-span-2"
                    />
                    <Input
                      name="icon"
                      placeholder="Icon (optional)"
                      value={formData.icon}
                      onChange={handleChange}
                    />
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <Input
                      type="number"
                      name="order"
                      placeholder="Order"
                      value={formData.order}
                      onChange={handleChange}
                      min="1"
                    />
                    <Input
                      type="number"
                      name="menu_group_id"
                      placeholder="Menu Group ID"
                      value={formData.menu_group_id}
                      onChange={handleChange}
                      required
                    />
                    <div className="md:col-span-2 flex justify-end gap-2">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction type="submit">Save</AlertDialogAction>
                    </div>
                  </form>
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Group ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                        className="w-32"
                      />
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        className="w-40"
                      />
                    ) : (
                      item.description || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input
                        name="link"
                        value={editFormData.link}
                        onChange={handleEditChange}
                        className="w-32"
                      />
                    ) : (
                      item.link || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleEditChange}
                        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <Badge variant={item.status === "active" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input
                        type="number"
                        name="order"
                        value={editFormData.order}
                        onChange={handleEditChange}
                        className="w-16"
                        min="1"
                      />
                    ) : (
                      item.order
                    )}
                  </TableCell>
                  <TableCell>{item.menu_group_id}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingItem === item.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSaveEdit(item.id)}
                          >
                            <Save className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancelEdit}
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-cms-danger" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
