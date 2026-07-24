interface FormItemProps {
  id?: number;
  title: string;
  description?: string;
  status?: string;
  statusLabel?: string;
  uid?: number;
  createTime?: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
