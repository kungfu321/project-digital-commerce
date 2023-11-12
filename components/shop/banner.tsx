import Carousel, { CarouselItem } from "@/components/ui/carousel";
import { Banner } from "@prisma/client";

interface BannerProps {
  data: Banner[];
}

const Banner: React.FC<BannerProps> = ({ data }) => {
  return (
    <div className="mt-2">
      <Carousel imageCount={data?.length}>
        {
          data?.map((item, index) => <CarouselItem
            key={index}
            url={item.url}
            image={item.backgroundUrl}
            title={item.title} />)
        }
      </Carousel>
    </div>
  )
}

export default Banner;
