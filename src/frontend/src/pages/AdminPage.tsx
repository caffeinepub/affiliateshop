import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  EyeOff,
  FolderOpen,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Package,
  Pencil,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category, Product } from "../backend.d";
import {
  useCreateCategory,
  useCreateProduct,
  useDeleteCategory,
  useDeleteProduct,
  useGetCategories,
  useGetProducts,
  useUpdateCategory,
  useUpdateProduct,
} from "../hooks/useQueries";

// ── PIN Storage ───────────────────────────────────────────────────────────────

const PIN_KEY = "affiliateshop_admin_pin";
const DEFAULT_PIN = "1234";

function getStoredPin(): string {
  return localStorage.getItem(PIN_KEY) ?? DEFAULT_PIN;
}

function setStoredPin(pin: string) {
  localStorage.setItem(PIN_KEY, pin);
}

// ── PIN Gate ──────────────────────────────────────────────────────────────────

interface PinGateProps {
  onSuccess: () => void;
}

function PinGate({ onSuccess }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === getStoredPin()) {
      setError("");
      onSuccess();
    } else {
      setError("Incorrect password");
      setPin("");
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Admin Access
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Enter your password to continue
          </p>
        </div>

        <Card className="border-border shadow-card">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pin-input" className="font-body text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="pin-input"
                    data-ocid="admin.pin.input"
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your password"
                    className="font-body text-sm pr-10"
                    autoFocus
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPin ? "Hide password" : "Show password"}
                  >
                    {showPin ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {error && (
                  <p
                    data-ocid="admin.pin.error_state"
                    className="font-body text-xs text-destructive mt-1"
                  >
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                data-ocid="admin.pin.submit_button"
                className="btn-cta w-full h-11 font-body text-sm border-0"
              >
                Enter
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

// ── Product Form ──────────────────────────────────────────────────────────────

interface ProductFormData {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  category: string;
  affiliateLink: string;
  featured: boolean;
}

const emptyProductForm: ProductFormData = {
  title: "",
  description: "",
  imageUrl: "",
  price: "",
  category: "",
  affiliateLink: "",
  featured: false,
};

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  categories: Category[];
}

function ProductDialog({
  open,
  onClose,
  product,
  categories,
}: ProductDialogProps) {
  const isEdit = !!product;
  const [form, setForm] = useState<ProductFormData>(
    product
      ? {
          title: product.title,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          category: product.category,
          affiliateLink: product.affiliateLink,
          featured: product.featured,
        }
      : emptyProductForm,
  );

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleChange = (
    field: keyof ProductFormData,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price.trim()) {
      toast.error("Title and price are required.");
      return;
    }
    try {
      if (isEdit && product) {
        await updateMutation.mutateAsync({ id: product.id, ...form });
        toast.success("Product updated!");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("Product created!");
      }
      onClose();
    } catch {
      toast.error("Failed to save product.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="admin.product.modal"
        className="max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-title" className="font-body text-sm">
              Title *
            </Label>
            <Input
              id="p-title"
              data-ocid="admin.product.form.input"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Product title"
              className="font-body text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-desc" className="font-body text-sm">
              Description
            </Label>
            <Textarea
              id="p-desc"
              data-ocid="admin.product.form.textarea"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Short product description"
              className="font-body text-sm min-h-[80px]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-price" className="font-body text-sm">
                Price *
              </Label>
              <Input
                id="p-price"
                data-ocid="admin.product.price.input"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="$29.99"
                className="font-body text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-cat" className="font-body text-sm">
                Folder
              </Label>
              <Input
                id="p-cat"
                data-ocid="admin.product.folder.input"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="e.g. Electronics"
                list="folder-suggestions"
                className="font-body text-sm"
              />
              <datalist id="folder-suggestions">
                {categories.map((c) => (
                  <option key={String(c.id)} value={c.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-img" className="font-body text-sm">
              Image URL
            </Label>
            <Input
              id="p-img"
              data-ocid="admin.product.image.input"
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://..."
              className="font-body text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-link" className="font-body text-sm">
              Affiliate Link
            </Label>
            <Input
              id="p-link"
              data-ocid="admin.product.link.input"
              value={form.affiliateLink}
              onChange={(e) => handleChange("affiliateLink", e.target.value)}
              placeholder="https://amazon.com/..."
              className="font-body text-sm"
            />
          </div>

          <div className="flex items-center gap-3 py-1">
            <Switch
              id="p-featured"
              data-ocid="admin.product.form.switch"
              checked={form.featured}
              onCheckedChange={(v) => handleChange("featured", v)}
            />
            <Label
              htmlFor="p-featured"
              className="font-body text-sm cursor-pointer"
            >
              Mark as Featured
            </Label>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              data-ocid="admin.product.form.cancel_button"
              className="font-body text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="admin.product.form.submit_button"
              className="btn-cta font-body text-sm border-0"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isEdit ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Products Tab ──────────────────────────────────────────────────────────────

function ProductsTab() {
  const { data: products, isLoading, isError } = useGetProducts();
  const { data: categories = [] } = useGetCategories();
  const deleteMutation = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Products
          </h2>
          <p className="font-body text-xs text-muted-foreground">
            {products?.length ?? 0} total
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(undefined);
            setDialogOpen(true);
          }}
          data-ocid="admin.product.add_button"
          className="btn-cta font-body text-sm gap-1.5 border-0"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div data-ocid="admin.products.loading_state" className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => `psk-${i}`).map((k) => (
            <Skeleton
              key={k}
              className="h-12 w-full skeleton-shimmer rounded-lg"
            />
          ))}
        </div>
      ) : isError ? (
        <div
          data-ocid="admin.products.error_state"
          className="text-center py-10"
        >
          <p className="font-body text-sm text-destructive">
            Failed to load products.
          </p>
        </div>
      ) : !products || products.length === 0 ? (
        <div
          data-ocid="admin.products.empty_state"
          className="text-center py-12 border border-dashed border-border rounded-xl space-y-3"
        >
          <Package className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="font-body text-sm text-muted-foreground">
            No products yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary">
                <TableHead className="font-body font-semibold text-xs text-muted-foreground">
                  Product
                </TableHead>
                <TableHead className="font-body font-semibold text-xs text-muted-foreground hidden sm:table-cell">
                  Folder
                </TableHead>
                <TableHead className="font-body font-semibold text-xs text-muted-foreground hidden md:table-cell">
                  Price
                </TableHead>
                <TableHead className="font-body font-semibold text-xs text-muted-foreground hidden lg:table-cell">
                  Featured
                </TableHead>
                <TableHead className="font-body font-semibold text-xs text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, i) => (
                <TableRow
                  key={String(product.id)}
                  data-ocid={`admin.products.row.${i + 1}`}
                  className="hover:bg-secondary/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-9 h-9 rounded-md object-cover border border-border flex-shrink-0"
                        />
                      )}
                      <span className="font-body text-sm font-medium text-foreground line-clamp-1 max-w-[200px]">
                        {product.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {product.category && (
                      <Badge variant="secondary" className="font-body text-xs">
                        {product.category}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="font-body text-sm font-semibold">
                      {product.price}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.featured ? (
                      <Badge className="bg-accent text-accent-foreground font-body text-xs">
                        Featured
                      </Badge>
                    ) : (
                      <span className="font-body text-xs text-muted-foreground">
                        —
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        data-ocid={`admin.product.edit_button.${i + 1}`}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(product)}
                        data-ocid={`admin.product.delete_button.${i + 1}`}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Product dialog */}
      <ProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        product={editingProduct}
        categories={categories}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="admin.product.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm">
              This will permanently remove "{deleteTarget?.title}". This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.product.delete.cancel_button"
              className="font-body text-sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.product.delete.confirm_button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body text-sm"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Folders Tab ───────────────────────────────────────────────────────────────

function FoldersTab() {
  const { data: categories, isLoading, isError } = useGetCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createMutation.mutateAsync(newName.trim());
      setNewName("");
      toast.success("Folder created!");
    } catch {
      toast.error("Failed to create folder.");
    }
  };

  const handleUpdate = async (id: bigint) => {
    if (!editName.trim()) return;
    try {
      await updateMutation.mutateAsync({ id, name: editName.trim() });
      setEditingId(null);
      toast.success("Folder updated!");
    } catch {
      toast.error("Failed to update folder.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Folder deleted.");
    } catch {
      toast.error("Failed to delete folder.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Folders
        </h2>
        <p className="font-body text-xs text-muted-foreground">
          {categories?.length ?? 0} total
        </p>
      </div>

      {/* Add form */}
      <form onSubmit={handleCreate} className="flex gap-2 max-w-md">
        <Input
          data-ocid="admin.folder.form.input"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New folder name..."
          className="font-body text-sm"
          required
        />
        <Button
          type="submit"
          disabled={createMutation.isPending || !newName.trim()}
          data-ocid="admin.folder.add_button"
          className="btn-cta font-body text-sm gap-1.5 border-0 flex-shrink-0"
        >
          {createMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add
        </Button>
      </form>

      {/* List */}
      {isLoading ? (
        <div data-ocid="admin.folders.loading_state" className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => `csk-${i}`).map((k) => (
            <Skeleton
              key={k}
              className="h-12 w-full skeleton-shimmer rounded-lg"
            />
          ))}
        </div>
      ) : isError ? (
        <div
          data-ocid="admin.folders.error_state"
          className="text-center py-10"
        >
          <p className="font-body text-sm text-destructive">
            Failed to load folders.
          </p>
        </div>
      ) : !categories || categories.length === 0 ? (
        <div
          data-ocid="admin.folders.empty_state"
          className="text-center py-12 border border-dashed border-border rounded-xl space-y-3"
        >
          <FolderOpen className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="font-body text-sm text-muted-foreground">
            No folders yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <div
              key={String(cat.id)}
              data-ocid={`admin.folders.item.${i + 1}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors"
            >
              <FolderOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />

              {editingId === cat.id ? (
                <div className="flex gap-2 flex-1">
                  <Input
                    data-ocid="admin.folder.form.input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="font-body text-sm h-8 flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdate(cat.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(cat.id)}
                    disabled={updateMutation.isPending}
                    data-ocid="admin.folder.form.save_button"
                    className="btn-cta h-8 font-body text-xs border-0"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                    data-ocid="admin.folder.form.cancel_button"
                    className="h-8 font-body text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <span className="font-body text-sm font-medium text-foreground flex-1">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditName(cat.name);
                      }}
                      data-ocid={`admin.folder.edit_button.${i + 1}`}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(cat)}
                      data-ocid={`admin.folder.delete_button.${i + 1}`}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="admin.folder.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Folder?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm">
              This will permanently remove "{deleteTarget?.name}". Products in
              this folder will not be deleted but may lose their folder
              assignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.folder.delete.cancel_button"
              className="font-body text-sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.folder.delete.confirm_button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body text-sm"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────

function SettingsTab() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleChangePIN = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPin !== getStoredPin()) {
      toast.error("Current password is incorrect.");
      return;
    }
    if (newPin.length < 4) {
      toast.error("New password must be at least 4 characters.");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsPending(true);
    setTimeout(() => {
      setStoredPin(newPin);
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      setIsPending(false);
      toast.success("Password updated successfully");
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Settings
        </h2>
        <p className="font-body text-xs text-muted-foreground">
          Manage your admin panel preferences
        </p>
      </div>

      {/* Change Password */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-muted-foreground" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePIN} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <Label htmlFor="current-pin" className="font-body text-sm">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current-pin"
                  data-ocid="settings.current_pin.input"
                  type={showCurrent ? "text" : "password"}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="Enter current password"
                  className="font-body text-sm pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="new-pin" className="font-body text-sm">
                New Password{" "}
                <span className="text-muted-foreground text-xs">
                  (min 4 chars)
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="new-pin"
                  data-ocid="settings.new_pin.input"
                  type={showNew ? "text" : "password"}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new password"
                  className="font-body text-sm pr-10"
                  autoComplete="new-password"
                  minLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm-pin" className="font-body text-sm">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-pin"
                  data-ocid="settings.confirm_pin.input"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Repeat new password"
                  className="font-body text-sm pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                isPending ||
                !currentPin.trim() ||
                !newPin.trim() ||
                !confirmPin.trim()
              }
              data-ocid="settings.save_pin.button"
              className="btn-cta font-body text-sm border-0 gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isPending ? "Saving..." : "Save Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────

export function AdminPage() {
  // PIN gate state — only tracked in session memory, not persisted
  const [pinVerified, setPinVerified] = useState(false);

  // Step 1: Password gate — only step needed
  if (!pinVerified) {
    return <PinGate onSuccess={() => setPinVerified(true)} />;
  }

  // Step 2: Admin dashboard — directly accessible after password
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin top bar */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg btn-cta flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-cta-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                Affiliate<span className="text-accent">Shop</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 ml-1 bg-primary/10 text-primary text-xs font-body font-semibold px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                Admin
              </span>
            </div>

            {/* Lock / Exit */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPinVerified(false)}
              data-ocid="admin.logout.button"
              className="font-body text-xs gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Lock
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="flex-1">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-7"
          >
            <h1 className="font-display text-2xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              Manage your store's products and folders
            </p>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="products">
            <TabsList className="mb-6 bg-secondary rounded-xl p-1 gap-1">
              <TabsTrigger
                value="products"
                data-ocid="admin.products.tab"
                className="font-body text-sm gap-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="folders"
                data-ocid="admin.folders.tab"
                className="font-body text-sm gap-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FolderOpen className="w-4 h-4" />
                Folders
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                data-ocid="admin.settings.tab"
                className="font-body text-sm gap-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>
            <TabsContent value="folders">
              <FoldersTab />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
