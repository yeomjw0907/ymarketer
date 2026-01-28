export function ProductCardSkeleton() {
  return (
    <div className="bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200 mb-2" />
      <div className="px-0.5">
        <div className="h-2 bg-gray-200 w-1/3 mb-1" />
        <div className="h-3 bg-gray-200 w-full mb-1" />
        <div className="h-3 bg-gray-200 w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 w-1/2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="container mx-auto px-4 py-8">
        <div className="h-6 bg-gray-200 w-20 mb-8" />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-20 bg-gray-200" />
              <div className="h-20 bg-gray-200" />
              <div className="h-20 bg-gray-200" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 w-1/4" />
            <div className="h-10 bg-gray-200 w-full" />
            <div className="h-32 bg-gray-200 w-full" />
            <div className="h-16 bg-gray-200 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 bg-gray-200 w-48 mb-8" />
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 w-full" />
          <div className="h-32 bg-gray-200 w-full" />
          <div className="h-32 bg-gray-200 w-full" />
        </div>
      </div>
    </div>
  );
}
