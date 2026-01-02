import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NewsQry, useCreateNews } from "./services/newsFerchQuery";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
import Swal from "sweetalert2";
import { MenuTypesQry, useCreateMenuTypes } from "./services/menuQry";

export default function MenuType() {
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    translation: "",
    description: "",
  });
  const createNewsMutation = useCreateMenuTypes();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { data, isLoading, isError, error } = MenuTypesQry();
  const [open, setOpen] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createNewsMutation.mutate(formData, {
      onSuccess: () => {
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
          title: "News article created successfully!",
        });
        setOpen(false); // Close the dialog
        setFormData({
          name: "",
          translation: "",
          description: "",
        });
        // Reset form
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong while creating the news.",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Menu Types</h1>
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent">
              <Plus className="w-4 h-4 mr-2" />
              Create Article
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add News</AlertDialogTitle>
              <AlertDialogDescription>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <Input
                      id="name"
                      name="name"
                      placeholder="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <Input
                      id="translation"
                      name="translation"
                      placeholder="translation"
                      value={formData.translation}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Image */}
                  <div>
                    <Input
                      id="description"
                      name="description"
                      placeholder="description "
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </form>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>Save</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* News Table */}
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Translation</TableHead>
                <TableHead>Descriptions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((menuType) => (
                <TableRow key={menuType.id}>
                  <TableCell>{menuType.id}</TableCell>
                  <TableCell>{menuType.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{menuType.translation}</Badge>
                  </TableCell>
                  <TableCell>{menuType.description}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-cms-danger" />
                      </Button>
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
