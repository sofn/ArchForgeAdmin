export interface QuartzFormItemProps {
  id?: number;
  jobName: string;
  jobGroup: string;
  description: string;
  beanName: string;
  methodName: string;
  methodParams: string;
  cron: string;
  misfirePolicy: number;
  concurrent: boolean;
}

export interface QuartzFormProps {
  formInline: QuartzFormItemProps;
}
