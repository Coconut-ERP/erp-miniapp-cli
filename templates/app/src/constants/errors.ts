export const APP_ERROR = {
  title: "Something went wrong",
} as const;

export const APP_NOT_FOUND = {
  title: "Page not found",
  description: "This page does not exist or was moved.",
  action: "Back to dashboard",
} as const;
