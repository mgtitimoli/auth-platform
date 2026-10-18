const getUniqueConstraintName = (tableName: string, columns: string[]) =>
  [tableName, ...columns, "unique"].join("_");

export {getUniqueConstraintName};
