type ErrorWithStatus = Error & {
  status?: number;
};

export const logError = (message: string, error?: unknown) => {
  if (!import.meta.env.DEV) return;

  if (error instanceof Error) {
    const details: Record<string, unknown> = {
      name: error.name,
      message: error.message,
    };
    const status = (error as ErrorWithStatus).status;
    if (status) details.status = status;
    console.error(message, details);
    return;
  }

  console.error(message);
};
