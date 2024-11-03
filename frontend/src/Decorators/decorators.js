export const Decorators = {
  product_decorator: {
    schema: [
      {
        name: "sku",
        title: translationKeys.SKU,
        type: "text",
      },
      {
        name: "barcode",
        title: translationKeys.Barcode,
        type: "text",
      },
      {
        name: "weight",
        title: translationKeys.Weight,
        type: "number",
      },
      {
        name: "dimensions",
        title: translationKeys.Dimensions,
        type: "object",
        schema: [
          { name: "length", title: translationKeys.Length, type: "number" },
          { name: "width", title: translationKeys.Width, type: "number" },
          { name: "height", title: translationKeys.Height, type: "number" },
        ],
      },
    ],
  },
  service_decorator: {
    schema: [
      {
        name: "price",
        title: translationKeys.Price,
        type: "number",
      },
      {
        name: "duration",
        title: translationKeys.Duration,
        type: "number",
      },
      {
        name: "unit",
        title: translationKeys.Unit,
        type: "select",
        options: [
          { label: "Minutes", value: "minutes" },
          { label: "Hours", value: "hours" },
          { label: "Days", value: "days" },
        ],
      },
    ],
  },
  archive_decorator: {
    schema: [
      {
        name: "archivedAt",
        title: translationKeys.ArchivedAt,
        type: "date",
      },
      {
        name: "archivedBy",
        title: translationKeys.ArchivedBy,
        type: "ref",
        resource: "users",
        field: "fullname",
      },
      {
        name: "archiveReason",
        title: translationKeys.ArchiveReason,
        type: "text",
      },
    ],
  },
  favorite_decorator: {
    schema: [
      {
        name: "isFavorite",
        title: translationKeys.IsFavorite,
        type: "check",
      },
      {
        name: "favoritedAt",
        title: translationKeys.FavoritedAt,
        type: "date",
      },
    ],
  },
  reservation_decorator: {
    schema: [
      {
        name: "reservationStart",
        title: translationKeys.ReservationStart,
        type: "datetime",
      },
      {
        name: "reservationEnd",
        title: translationKeys.ReservationEnd,
        type: "datetime",
      },
      {
        name: "reservationStatus",
        title: translationKeys.ReservationStatus,
        type: "select",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Confirmed", value: "confirmed" },
          { label: "Cancelled", value: "cancelled" },
        ],
      },
    ],
  },
  scheduling_decorator: {
    schema: [
      {
        name: "scheduledDate",
        title: translationKeys.ScheduledDate,
        type: "date",
      },
      {
        name: "scheduledTime",
        title: translationKeys.ScheduledTime,
        type: "time",
      },
      {
        name: "recurringSchedule",
        title: translationKeys.RecurringSchedule,
        type: "select",
        options: [
          { label: "Daily", value: "daily" },
          { label: "Weekly", value: "weekly" },
          { label: "Monthly", value: "monthly" },
          { label: "Yearly", value: "yearly" },
        ],
      },
    ],
  },
  order_decorator: {
    schema: [
      {
        name: "orderStatus",
        title: translationKeys.OrderStatus,
        type: "select",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Processing", value: "processing" },
          { label: "Shipped", value: "shipped" },
          { label: "Delivered", value: "delivered" },
          { label: "Cancelled", value: "cancelled" },
        ],
      },
      {
        name: "paymentStatus",
        title: translationKeys.PaymentStatus,
        type: "select",
        options: [
          { label: "Unpaid", value: "unpaid" },
          { label: "Paid", value: "paid" },
          { label: "Refunded", value: "refunded" },
        ],
      },
      {
        name: "shippingAddress",
        title: translationKeys.ShippingAddress,
        type: "richtext",
      },
    ],
  },
  user_decorator: {
    schema: [
      {
        name:"firstName",
        title: translationKeys.FirstName,
        type: "text",
      },
      {
        name:"lastName",
        title: translationKeys.LastName,
        type: "text",
      },
      {
        name: "email",
        title: translationKeys.Email,
        type: "email",
      },
      {
        name: "password",
        title: translationKeys.Password,
        type: "password",
      },
      {
        name: "phoneNumbers",
        title: translationKeys.PhoneNumber,
        type: "tags",
      },
      {
        name: "title",
        title: translationKeys.Title,
        type: "select",
        options: [
          { label: "Mr", value: "mr" },
          { label: "Mrs", value: "mrs" },
          { label: "Miss", value: "miss" },
          { label: "Dr", value: "dr" },
          { label: "Prof", value: "prof" },
          { label: "Rev", value: "rev" },
        ],
      },
  
      {
        name: "lastLogin",
        title: translationKeys.LastLogin,
        type: "datetime",
      },
      {
        name: "isActive",
        title: translationKeys.IsActive,
        type: "check",
      },
      {
        name: "isVerified",
        title: translationKeys.IsVerified,
        type: "check",
      },
      {
        name: "preferredLanguage",
        title: translationKeys.PreferredLanguage,
        type: "select",
        options: [
          { label: "English", value: "en" },
          { label: "French", value: "fr" },
          { label: "Spanish", value: "es" },
          { label: "German", value: "de" },
        ],
      },
    ],
  },
  
  geo_location_decorator: {
    schema: [
      {
        name: "latitude",
        title: translationKeys.Latitude,
        type: "number",
      },
      {
        name: "longitude",
        title: translationKeys.Longitude,
        type: "number",
      },
    ],
  },
  
  version_control_decorator: {
    schema: [
      {
        name: "version",
        title: translationKeys.Version,
        type: "number",
      },
      {
        name: "changeLog",
        title: translationKeys.ChangeLog,
        type: "richtext",
      },
    ],
  },
  
  workflow_decorator: {
    schema: [
      {
        name: "workflowStatus",
        title: translationKeys.WorkflowStatus,
        type: "select",
        options: [
          { label: "Draft", value: "draft" },
          { label: "In Review", value: "in_review" },
          { label: "Approved", value: "approved" },
          { label: "Published", value: "published" },
        ],
      },
      {
        name: "currentAssignee",
        title: translationKeys.CurrentAssignee,
        type: "ref",
        resource: "users",
        field: "fullname",
      },
    ],
  },
  
  accessibility_decorator: {
    schema: [
      {
        name: "altText",
        title: translationKeys.AltText,
        type: "text",
      },
      {
        name: "ariaLabel",
        title: translationKeys.AriaLabel,
        type: "text",
      },
    ],
  },

  images_decorator: {
    schema: [
      {
        name: "images",
        title: translationKeys.Images,
        type: "image array",
      },
    ],
  },
};