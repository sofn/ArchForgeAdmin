interface FormItemProps {
  id?: number;
  categoryId: number | null;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageFileId?: number | null;
  coverImageUrl?: string;
  status: number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
