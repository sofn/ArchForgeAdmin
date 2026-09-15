interface FormItemProps {
  id?: number;
  name: string;
  slug: string;
  sortOrder: number;
  status: number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
