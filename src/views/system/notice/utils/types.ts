interface FormItemProps {
  id?: number;
  noticeId?: number;
  noticeTitle: string;
  noticeType: number;
  noticeContent: string;
  status: number;
  remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
