// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id?: number;
  /** 角色名称 */
  name: string;
  /** 角色编号 */
  code: string;
  /** 备注 */
  remark: string;
  /** 数据权限范围 */
  dataScope?: number;
  /** 自定义数据权限部门ID列表 */
  customDeptIds?: number[];
}
interface FormProps {
  formInline: FormItemProps;
}

interface DataScopeFormProps {
  id: number;
  /** 数据权限范围 */
  dataScope: number;
  /** 自定义数据权限部门ID列表 */
  deptIds: number[];
}

export type { FormItemProps, FormProps, DataScopeFormProps };
