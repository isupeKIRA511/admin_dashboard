const EMPTY_DOTNET_DATE = '0001-01-01T00:00:00Z';

export const isSoftDeleted = (deletedAt?: string | null) => {
  return Boolean(deletedAt && deletedAt !== EMPTY_DOTNET_DATE);
};
