interface EventCardActionsProps {
  isOnSale: boolean;
  formattedPrice: string;
}

export function EventCardActions({
  isOnSale,
  formattedPrice,
}: EventCardActionsProps) {
  return (
    <div className="mt-auto pt-3 flex items-center justify-between gap-3">
      {isOnSale ? (
        <button
          className="px-8 py-2 bg-[#3C74FF] text-white text-sm font-bold hover:bg-[#3C74FF] transition-colors whitespace-nowrap"
          aria-label="Get reminded when tickets go on sale"
        >
          GET REMINDED
        </button>
      ) : (
        <button
          className="px-8 py-2 bg-[#3C74FF] text-white text-sm font-semibold hover:bg-[#3C74FF] transition-colors whitespace-nowrap"
          aria-label="Book tickets now"
        >
          BOOK NOW
        </button>
      )}
      <div
        className="text-sm font-semibold ml-auto flex flex-col items-end"
        aria-label="Starting price"
      >
        <span className="opacity-50 text-m">From</span>
        <span className="text-lg">{formattedPrice}</span>
      </div>
    </div>
  );
}
