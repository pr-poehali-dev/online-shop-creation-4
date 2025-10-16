import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export interface Ad {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  type: 'horizontal' | 'vertical' | 'square';
  active: boolean;
}

interface AdBannerProps {
  ad: Ad;
  onClose?: () => void;
}

export const AdBanner = ({ ad, onClose }: AdBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [clicks, setClicks] = useState(0);
  const [impressions, setImpressions] = useState(0);

  useEffect(() => {
    setImpressions(prev => prev + 1);
    const savedClicks = localStorage.getItem(`ad_clicks_${ad.id}`);
    const savedImpressions = localStorage.getItem(`ad_impressions_${ad.id}`);
    
    if (savedClicks) setClicks(parseInt(savedClicks));
    if (savedImpressions) setImpressions(parseInt(savedImpressions));
  }, [ad.id]);

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    localStorage.setItem(`ad_clicks_${ad.id}`, newClicks.toString());
    
    const newImpressions = impressions + 1;
    localStorage.setItem(`ad_impressions_${ad.id}`, newImpressions.toString());
    
    if (ad.link) {
      window.open(ad.link, '_blank');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible || !ad.active) return null;

  const getLayoutClasses = () => {
    switch (ad.type) {
      case 'horizontal':
        return 'flex-row items-center gap-4 p-4';
      case 'vertical':
        return 'flex-col gap-3 p-4';
      case 'square':
        return 'flex-col gap-3 p-4 aspect-square';
      default:
        return 'flex-row items-center gap-4 p-4';
    }
  };

  return (
    <Card className={`relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-card to-muted/30 border-2 ${getLayoutClasses()}`}>
      <Badge className="absolute top-2 left-2 text-[10px] bg-muted text-muted-foreground">
        Реклама
      </Badge>
      
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          <Icon name="X" size={14} />
        </Button>
      )}

      <div 
        className="flex flex-1 cursor-pointer"
        onClick={handleClick}
        style={{ flexDirection: ad.type === 'horizontal' ? 'row' : 'column' }}
      >
        {ad.image && (
          <div className={`flex-shrink-0 overflow-hidden rounded bg-muted ${
            ad.type === 'horizontal' ? 'w-32 h-24' : 
            ad.type === 'square' ? 'w-full h-32' : 
            'w-full h-40'
          }`}>
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="font-semibold text-sm mb-1 line-clamp-2">{ad.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {ad.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-primary">
            <span className="font-medium">Подробнее</span>
            <Icon name="ArrowRight" size={12} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-1 right-2 text-[9px] text-muted-foreground opacity-50">
        Показы: {impressions} | Клики: {clicks}
      </div>
    </Card>
  );
};
