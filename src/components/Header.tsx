import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  cartItemsCount: number;
  onCartOpen: () => void;
}

export const Header = ({ cartItemsCount, onCartOpen }: HeaderProps) => {
  const [activeSection, setActiveSection] = useState('catalog');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-tight">DIGITAL STORE</h1>
          
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveSection('catalog')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === 'catalog' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Каталог
            </button>
            <button
              onClick={() => setActiveSection('about')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === 'about' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              О компании
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={onCartOpen}
          >
            <Icon name="ShoppingCart" size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Icon name="User" size={20} />
          </Button>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Icon name="Menu" size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => setActiveSection('catalog')}
                  className="text-left text-sm font-medium"
                >
                  Каталог
                </button>
                <button
                  onClick={() => setActiveSection('about')}
                  className="text-left text-sm font-medium"
                >
                  О компании
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
