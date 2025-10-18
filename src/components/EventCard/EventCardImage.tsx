interface EventCardImageProps {
  imageUrl: string | null;
  eventName: string;
  isFeatured: boolean;
  hasAudioClip: boolean;
  isOnSale: boolean;
  saleDate: string;
  saleTime: string;
}

export function EventCardImage({
  imageUrl,
  eventName,
  isFeatured,
  hasAudioClip,
  isOnSale,
  saleDate,
  saleTime,
}: EventCardImageProps) {
  return (
    <div className="relative w-full pb-[100%] bg-gray-200 flex-shrink-0">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={eventName}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      {isFeatured && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs font-bold uppercase">
          Featured
        </div>
      )}

      {hasAudioClip && (
        <button
          className="absolute bottom-0  w-8 h-8 bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
          aria-label="Play audio preview"
        >
          <svg
            className="w-6 h-6 text-white ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {isOnSale && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs font-semibold z-10">
          On sale {saleDate} {saleTime}
        </div>
      )}
    </div>
  );
}
