export interface FormItem {
  type: string;
  name: string;
  label?: string;
  rules?: any;
  dic?: { data: Category[] | SelectType[]; label: string; value: string };
  show?: boolean;
  activeText?: string;
  inactiveText?: string;
  allowCreate?: boolean;
  multiple?: boolean;
  filterable?: boolean;
  dateType?: string;
}

export interface Category {
  name: string;
  id: string;
}

export interface SelectType {
  label: string;
  value: string;
}
