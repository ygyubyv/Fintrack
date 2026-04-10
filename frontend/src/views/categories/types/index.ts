export interface ICategory {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCategory {
  title: string;
}

export interface IUpdateCategory {
  title?: string;
}

export interface IImportCategories {
  file: File;
}
