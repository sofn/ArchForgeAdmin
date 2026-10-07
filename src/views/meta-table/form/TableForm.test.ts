import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ElementPlus from "element-plus";
import { defineComponent, nextTick } from "vue";

// the form's dialogs, toasts and icons pull in the whole app shell (i18n, layout) — not what this test is about
vi.mock("@/components/ReDialog", () => ({ addDialog: vi.fn() }));
vi.mock("@/utils/message", () => ({ message: vi.fn() }));
vi.mock("@/components/ReIcon/src/hooks", () => ({ useRenderIcon: () => "i" }));
vi.mock("../design/FieldForm.vue", () => ({
  default: defineComponent({ name: "FieldForm", render: () => null })
}));

import TableForm from "./TableForm.vue";

const blank = {
  tableCode: "",
  tableName: "",
  description: "",
  tablePrefix: "meta_",
  status: 1,
  columns: []
};
const loaded = {
  tableCode: "orders",
  tableName: "订单",
  description: "",
  tablePrefix: "meta_",
  status: 1,
  columns: []
};

describe("TableForm on the design page", () => {
  it("follows the definition the page loads after mounting", async () => {
    // the design page mounts the form with defaults, then swaps in the detail it fetched by tableCode
    const wrapper = mount(TableForm, {
      props: { formInline: { ...blank } },
      global: { plugins: [ElementPlus] }
    });
    await wrapper.setProps({ formInline: { ...loaded } });
    await nextTick();

    expect(
      (
        wrapper.vm as unknown as { getForm: () => { tableCode: string } }
      ).getForm().tableCode
    ).toBe("orders");
  });

  it("locks the table code while editing, without relying on a database id", async () => {
    const wrapper = mount(TableForm, {
      props: { formInline: { ...loaded }, editing: true },
      global: { plugins: [ElementPlus] }
    });
    await nextTick();

    const code = wrapper.find('input[placeholder="小写字母、数字、下划线"]');
    expect(code.attributes("disabled")).toBeDefined();
  });

  it("leaves the table code editable when creating", async () => {
    const wrapper = mount(TableForm, {
      props: { formInline: { ...blank } },
      global: { plugins: [ElementPlus] }
    });
    await nextTick();

    const code = wrapper.find('input[placeholder="小写字母、数字、下划线"]');
    expect(code.attributes("disabled")).toBeUndefined();
  });
});
