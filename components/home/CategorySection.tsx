import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { 
    id: 'all', 
    name: '전체', 
    image: '/images/category-all.png',
    href: '/?category=all' 
  },
  { 
    id: 'camping', 
    name: '캠핑', 
    image: '/images/category-camping.png',
    href: '/?category=camping' 
  },
  { 
    id: 'golf', 
    name: '골프', 
    image: '/images/category-golf.png',
    href: '/?category=golf' 
  },
  { 
    id: 'fashion', 
    name: '패션', 
    image: '/images/category-fashion.png',
    href: '/?category=fashion' 
  },
  { 
    id: 'beauty', 
    name: '뷰티', 
    image: '/images/category-beauty.png',
    href: '/?category=beauty' 
  },
  { 
    id: 'electronics', 
    name: '전자기기', 
    image: '/images/category-electronics.png',
    href: '/?category=electronics' 
  },
];

export default function CategorySection() {
  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-white border-b border-gray-200">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {CATEGORIES.map((category) => {
            return (
              <Link
                key={category.id}
                href={category.href}
                className="flex flex-col items-center gap-1.5 sm:gap-3 p-2 sm:p-4 border border-gray-200 hover:border-black hover:shadow-lg transition-all group"
              >
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain transition-transform group-hover:scale-110"
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-black uppercase tracking-wide">{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
