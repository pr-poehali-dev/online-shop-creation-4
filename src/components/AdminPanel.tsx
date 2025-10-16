import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { Product } from './ProductCard';

interface AdminPanelProps {
  products: Product[];
  currency: string;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onToggleHit: (id: number) => void;
  onChangeCurrency: (currency: string) => void;
  hitProducts: number[];
}

export const AdminPanel = ({
  products,
  currency,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleHit,
  onChangeCurrency,
  hitProducts
}: AdminPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: ''
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) return;

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || 'https://cdn.poehali.dev/projects/0598ef78-45b2-4d7a-9b03-ab91c1dc224f/files/a215575b-0932-4713-97d3-b3a1d9252724.jpg'
    };

    if (editingProduct) {
      onEditProduct({ ...productData, id: editingProduct.id });
    } else {
      onAddProduct(productData);
    }

    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image
    });
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="rounded-full shadow-lg h-14 px-6">
            <Icon name="Settings" size={20} className="mr-2" />
            Админ-панель
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Управление магазином</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <Label className="text-sm font-semibold mb-3 block">Валюта магазина</Label>
              <Select value={currency} onValueChange={onChangeCurrency}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">$ USD</SelectItem>
                  <SelectItem value="€">€ EUR</SelectItem>
                  <SelectItem value="₽">₽ RUB</SelectItem>
                  <SelectItem value="£">£ GBP</SelectItem>
                  <SelectItem value="¥">¥ JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Товары ({products.length})</h3>
                <Button onClick={() => { resetForm(); setIsOpen(true); }}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить товар
                </Button>
              </div>

              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{product.name}</h4>
                        {hitProducts.includes(product.id) && (
                          <Badge variant="destructive" className="text-xs">ХИТ</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                      <p className="text-sm font-medium mt-1">{currency}{product.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={hitProducts.includes(product.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToggleHit(product.id)}
                      >
                        <Icon name="Star" size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Icon name="Pencil" size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteProduct(product.id)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Название товара *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="price">Цена *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Категория</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="image">URL изображения</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {editingProduct ? 'Сохранить' : 'Добавить'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { resetForm(); setIsOpen(false); }}>
                Отмена
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
