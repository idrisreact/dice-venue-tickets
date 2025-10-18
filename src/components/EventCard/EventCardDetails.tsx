import { useState } from "react";
import type { DiceEvent } from "../../types/event";
import { truncateText } from "../../utils";
import { formatCurrencyForEvent } from "../../utils/eventHelpers";

interface EventCardDetailsProps {
  event: DiceEvent;
}

function formatTimeCompact(time: string): string {
  return time.replace(":00", "").replace(" ", "").toLowerCase();
}

export function EventCardDetails({ event }: EventCardDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDetails = event.description || event.lineup || event.ticket_types;

  if (!hasDetails) {
    return null;
  }

  return (
    <div className="mt-3 border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold bg-[#F2F2F2] text-gray-700 hover:text-gray-900 transition-colors px-3"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Hide details" : "Show more details"}
      >
        <span className="font-bold">More Info</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isExpanded ? "rotate-45" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-3 text-sm text-gray-600 bg-[#F2F2F2]">
          {event.description && (
            <p className="mb-3 text-bold">
              {truncateText(event.description, 255)}
            </p>
          )}

          {event.lineup && event.lineup.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-[#3C74FF]">LINE UP</h4>
              <div className="space-y-2">
                {event.lineup.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-900">
                      {item.details}{" "}
                      {item.time && (
                        <span className="font-bold">
                          - {formatTimeCompact(item.time)}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.ticket_types && event.ticket_types.length > 0 && (
            <div>
              <h4 className="font-semibold text-[#3C74FF] mb-2">TICKETS</h4>
              <div className="space-y-2">
                {event.ticket_types.map((ticket) => {
                  const formattedPrice = formatCurrencyForEvent(
                    ticket.price.total / 100,
                    event
                  );

                  return (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-900">
                        {ticket.name} —
                        {ticket.sold_out ? (
                          <span className="text-xs opacity-50 font-semibold">
                            SOLD OUT
                          </span>
                        ) : (
                          <span className="font-semibold">
                            {formattedPrice}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
