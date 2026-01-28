import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

interface MenuGroupProps {
  title: string;
  items: MenuItem[];
}

export default function MenuGroup({ title, items }: MenuGroupProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-2">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-gray-200 p-4 flex items-center gap-4 hover:border-black hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 bg-gray-100 group-hover:bg-black flex items-center justify-center transition-colors">
                <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-black">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-gray-500">{item.description}</div>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
