interface FormItemProps {
  configId?: number;
  configName: string;
  configKey: string;
  configValue: string;
  configType: number;
  remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
