export const dataProcessing = {
  processDataTable(dataTable: any): string[] {
    return dataTable.raw().map((row: string[]) => row[0]);
  },

  processFormData(dataTable: any): Record<string, string> {
    return dataTable.raw().reduce((acc: Record<string, string>, [field, value]: string[]) => {
      acc[field] = value;
      return acc;
    }, {});
  }
}; 