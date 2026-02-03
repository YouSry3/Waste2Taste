import { PrefilledListingData } from "../types";

export const getListingSuggestions = (data: PrefilledListingData) => {
  const basePrice = data.price || 15.0;
  const stock = data.stock || 1;
  const pickupTime = getPickupTimeSuggestions(data.status);

  return {
    title: `${data.name || "Surprise Bag"} - ${getUrgencyLabel(data.status)}`,
    category: data.category || "bakery",
    quantity: stock,
    description: getDescriptionSuggestions(data),
    originalPrice: basePrice.toFixed(2),
    salePrice: (basePrice * 0.3).toFixed(2),
    pickupTime: pickupTime,
  };
};

export const getUrgencyLabel = (status?: string) => {
  switch (status) {
    case "critical":
      return "Last Chance!";
    case "low":
      return "Limited Time";
    case "medium":
      return "Fresh Today";
    default:
      return "Special Offer";
  }
};

export const getDescriptionSuggestions = (data: PrefilledListingData) => {
  const urgencyLabels = {
    critical: "âš ï¸ URGENT: Must sell today! Expiring very soon.",
    low: "Last chance to enjoy these fresh items.",
    medium: "Fresh items available for pickup today.",
    good: "Great value on quality items.",
  };

  const urgencyMsg = data.status
    ? urgencyLabels[data.status as keyof typeof urgencyLabels]
    : "";

  return `${urgencyMsg}\n\nA selection of ${data.name || "fresh bakery items"} in perfect condition. All items are surplus but still delicious and ready to enjoy. Pick up today and help reduce food waste!`;
};

export const getPickupTimeSuggestions = (status?: string) => {
  const now = new Date();

  switch (status) {
    case "critical": {
      const criticalStart = new Date(now.getTime() + 30 * 60000);
      const criticalEnd = new Date(now.getTime() + 2 * 60 * 60000);
      return `${formatTime(criticalStart)} - ${formatTime(criticalEnd)}`;
    }
    case "low": {
      const lowStart = new Date(now.getTime() + 60 * 60000);
      const lowEnd = new Date(now.getTime() + 4 * 60 * 60000);
      return `${formatTime(lowStart)} - ${formatTime(lowEnd)}`;
    }
    default:
      return "5:00 PM - 8:00 PM";
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
