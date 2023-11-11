'use client';

import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CarouselProps {
  showDots?: boolean;
  children?: React.ReactNode;
  imageCount: number;
}

export interface CarouselItemProps extends React.HTMLAttributes<HTMLElement> {
  image: string;
  title: string;
  url: string;
  imageOptions?: ImageProps
}

export const CarouselItem: React.FC<CarouselItemProps> = ({
  image,
  title,
  className,
  imageOptions,
  url
}) => {
  return (
    <Link href={url} className={cn(
      "w-full relative aspect-[5/2] flex-grow-0 flex-shrink-0",
      className
    )}>
      <Image
        src={image}
        fill
        alt={title}
        className='rounded-lg'
        {...imageOptions}
      />
    </Link>
  )
}

const Carousel: React.FC<CarouselProps> = ({ children, imageCount }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return (
    <div className='relative'>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="backface-hidden flex touch-pan-y">
          {children}
        </div>
      </div>
      {
        imageCount > 1 &&
        <div className="bottom-3 absolute left-[50%] transform -translate-x-1/2">
          <div className='space-x-2'>
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  'w-2 h-2 rounded-full bg-foreground',
                  'lg:w-3 lg:h-3',
                  index === selectedIndex && "bg-primary"
                )}
              />
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default Carousel;
