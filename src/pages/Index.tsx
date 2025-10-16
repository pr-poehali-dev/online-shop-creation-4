import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ProductCard, type Product } from '@/components/ProductCard';
import { Cart } from '@/components/Cart';
import { AdminPanel } from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Профессиональное ПО для бизнеса',
    description: 'Комплексное решение для автоматизации бизнес-процессов и управления проектами',
    price: 299.00,
    category: 'Программное обеспечение',
    image: 'https://cdn.poehali.dev/projects/0598ef78-45b2-4d7a-9b03-ab91c1dc224f/files/a215575b-0932-4713-97d3-b3a1d9252724.jpg'
  },
  {
    id: 2,
    name: 'Электронная книга "Цифровой маркетинг"',
    description: 'Полное руководство по современным стратегиям цифрового маркетинга',
    price: 49.00,
    category: 'Электронные книги',
    image: 'https://cdn.poehali.dev/projects/0598ef78-45b2-4d7a-9b03-ab91c1dc224f/files/91b40dd2-9a08-4cd5-bc4d-38fb9aa93067.jpg'
  },
  {
    id: 3,
    name: 'Онлайн-курс "Веб-разработка"',
    description: 'Профессиональный курс по созданию современных веб-приложений',
    price: 199.00,
    category: 'Онлайн-курсы',
    image: 'https://cdn.poehali.dev/projects/0598ef78-45b2-4d7a-9b03-ab91c1dc224f/files/b8fb4711-8547-43d6-b23e-60880d818579.jpg'
  },
  {
    id: 4,
    name: 'Шаблоны для презентаций',
    description: 'Набор профессиональных шаблонов для бизнес-презентаций',
    price: 29.00,
    category: 'Шаблоны',
    image: 'https://cdn.poehali.dev/projects/0598ef78-45b2-4d7a-9b03-ab91c1dc224f/files/a215575b-0932-4713-97d3-b3a1d9252724.jpg'
  },
  {
    id: 5,
    name: 'Аудиокнига "Управление временем"',
    description: 'Практическое руководство по эффективному управлению временем',
    price: 39.00,
    category: 'Аудиокниги',
    image: 'https://cdn.poehali.dev/projects/0598ef78-45b2-4d7a-9b03-ab91c1dc224f/files/91b40dd2-9a08-4cd5-bc4d-38fb9aa93067.jpg'
  },
  {
    id: 6,
    name: 'Курс "Финансовая грамотность"',
    description: 'Комплексный курс по управлению личными финансами',
    price: 149.00,
    category: 'Онлайн-курсы',
    image: 'https://cdn.poehali.dev/projects/0598ef78-45b2-4d7a-9b03-ab91c1dc224f/files/b8fb4711-8547-43d6-b23e-60880d818579.jpg'
  }
];

const Index = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [currency, setCurrency] = useState<string>('$');
  const [hitProducts, setHitProducts] = useState<number[]>([1, 3]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'catalog' | 'about'>('catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedCurrency = localStorage.getItem('currency');
    const savedHits = localStorage.getItem('hitProducts');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedHits) setHitProducts(JSON.parse(savedHits));
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('hitProducts', JSON.stringify(hitProducts));
  }, [hitProducts]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = {
      ...productData,
      id: Math.max(0, ...products.map(p => p.id)) + 1
    };
    setProducts([...products, newProduct]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    setHitProducts(hitProducts.filter(hitId => hitId !== id));
  };

  const handleToggleHit = (id: number) => {
    setHitProducts(prev => 
      prev.includes(id) ? prev.filter(hitId => hitId !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower);

    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = product.price >= min && product.price <= max;

    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartOpen={() => setIsCartOpen(true)}
      />

      <main className="container py-8">
        {currentView === 'catalog' ? (
          <>
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Каталог цифровых товаров
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Профессиональные цифровые продукты для развития бизнеса и карьеры
              </p>
            </div>

            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Цена:</span>
                  <Input
                    type="number"
                    placeholder="От"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="До"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-24"
                  />
                  {(minPrice || maxPrice || searchQuery) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                        setSearchQuery('');
                      }}
                    >
                      <Icon name="X" size={16} className="mr-1" />
                      Очистить
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Найдено товаров: {filteredProducts.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up opacity-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    currency={currency}
                    isHit={hitProducts.includes(product.id)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold tracking-tight mb-4">О компании</h2>
            </div>

            <div className="space-y-8">
              <section className="bg-card rounded-lg p-8 border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon name="Store" size={28} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Наша миссия</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Мы предоставляем доступ к качественным цифровым продуктам, которые помогают
                      профессионалам и компаниям развиваться в современной цифровой среде.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-card rounded-lg p-8 border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon name="Award" size={28} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Качество</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Все продукты проходят тщательный отбор и проверку. Мы работаем только
                      с проверенными авторами и разработчиками.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-card rounded-lg p-8 border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon name="Users" size={28} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Поддержка</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Наша команда всегда готова помочь с выбором продукта и ответить на любые
                      вопросы о покупке и использовании цифровых товаров.
                    </p>
                  </div>
                </div>
              </section>

              <div className="text-center pt-8">
                <Button size="lg" onClick={() => setCurrentView('catalog')}>
                  <Icon name="ShoppingBag" size={20} className="mr-2" />
                  Перейти в каталог
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-16">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Digital Store. Все права защищены.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => setCurrentView('catalog')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Каталог
              </button>
              <button
                onClick={() => setCurrentView('about')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                О компании
              </button>
            </div>
          </div>
        </div>
      </footer>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <AdminPanel
        products={products}
        currency={currency}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onToggleHit={handleToggleHit}
        onChangeCurrency={setCurrency}
        hitProducts={hitProducts}
      />
    </div>
  );
};

export default Index;