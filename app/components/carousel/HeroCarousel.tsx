import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRef, useEffect } from 'react';
import { Link } from '@remix-run/react';
import { Maybe } from '@shopify/hydrogen/customer-account-api-types';
import { Collection, Image } from '@shopify/hydrogen/storefront-api-types';

export type HeroCarouselProps = {
    nodes:{
        image?: Maybe<Pick<Image, "altText" | "width" | "height" | "url">>,
        id:string,
        title:string,
        handle:string,
    }[]

}
export default function HeroCarousel({ featuredCollections }: {featuredCollections: HeroCarouselProps}) {
    const autoplayTimeLeftRef = useRef(0);
    const activePaginationIndex = useRef(0);

    const onAutoplayTimeLeft = (swiper: any, time: number, progress: number) => {
        autoplayTimeLeftRef.current = time;
    };

    const onSlideChange = (swiper: any) => {
        activePaginationIndex.current = swiper.activeIndex;
        updatePaginationProgress();
    };

    useEffect(() => {
        const interval = setInterval(() => {
            updatePaginationProgress();
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const updatePaginationProgress = () => {
        const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
        paginationBullets.forEach((bullet, index) => {
            const progressElement = bullet.querySelector('div');
            if (progressElement) {
                if (index === activePaginationIndex.current) {
                    progressElement.style.width = `${(autoplayTimeLeftRef.current / 2500) * 100}%`;
                    progressElement.style.height = `${(autoplayTimeLeftRef.current / 2500) * 100}%`;
                } else {
                    progressElement.style.width = '0%';
                    progressElement.style.height = '0%';
                }
            }
        });
    };    

    return (
        <div className='w-full h-[460px] relative'>
            <Swiper
                effect={'fade'}
                navigation={false}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<div class="${className} w-4 h-4 rounded-full relative">
                            <div class="absolute bg-white w-4 h-4 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>`;
                    },
                    dynamicBullets: true
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: true
                }}
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                onSlideChange={onSlideChange}
                className="mySwiper h-96 w-full"
            >
                {
                    featuredCollections?.nodes?.map(collection=>{
                        if(collection.image){
                            const { image,id:linkURL,handle,title}=collection;
                            return <SwiperSlide >
                                <SwiperSlide className=' bg-yellow-200'>
                                    <CarouselOverlay
                                        linkTitle={`Shop ${title}`}
                                        linkURL={linkURL}
                                        image={image}
                                        heading={title}
                                    />
                                </SwiperSlide>
                            </SwiperSlide>
                        }
                    })
                }              
            </Swiper>
        </div>
    );
}


type CarouselOverlayProps = {
    heading:string;
    linkTitle: string;
    linkURL: string;
    image?: Maybe<Pick<Image, "altText" | "width" | "height" | "url">>,

}

const CarouselOverlay: React.FC<CarouselOverlayProps> = ({ linkTitle, linkURL ,heading,image}) => {
    return (
        <figure className="relative w-full h-full overflow-hidden bg-theme-bg">
            <img
                src={image?.url}
                width={4049}
                height={1531}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover scale-110 transition-transform group-hover:scale-100"
                alt="Slide 1"
            />
            <figcaption className="absolute inset-0  bg-gradient-to-t w-full  from-black/50 to-transparent z-20 p-6 flex items-end">
                <div className="max-w-2xl text-white mx-auto md:mx-0 text-center">
                    <h2 className="text-2xl font-bold">{heading}</h2>
                    <Link
                        to={linkURL}
                        className="mt-4 min-w-32 inline-block uppercase px-6 py-3 text-sm font-medium text-black bg-white rounded hover:bg-gray-200"
                    >
                        {linkTitle}
                    </Link>
                </div>
            </figcaption>
        </figure >
    );
}