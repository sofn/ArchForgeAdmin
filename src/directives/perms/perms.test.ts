import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { perms } from "./index";

const { mockHasPerms } = vi.hoisted(() => ({ mockHasPerms: vi.fn() }));

vi.mock("@/utils/auth", () => ({
  hasPerms: mockHasPerms
}));

const Host = defineComponent({
  props: { value: { type: Array as () => string[], required: true } },
  template: `<div><button v-perms="value">secret</button></div>`
});

describe("v-perms directive", () => {
  it("removes the element when the user lacks permission", () => {
    mockHasPerms.mockReturnValue(false);

    const wrapper = mount(Host, {
      props: { value: ["btn.edit"] },
      global: { directives: { perms } }
    });

    expect(wrapper.find("button").exists()).toBe(false);
    expect(mockHasPerms).toHaveBeenCalledWith(["btn.edit"]);
  });

  it("keeps the element when the user has permission", () => {
    mockHasPerms.mockReturnValue(true);

    const wrapper = mount(Host, {
      props: { value: ["btn.edit"] },
      global: { directives: { perms } }
    });

    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("rejects usage without a perms value", () => {
    const Bad = defineComponent({
      template: `<button v-perms="">secret</button>`
    });

    expect(() =>
      mount(Bad, { global: { directives: { perms } } })
    ).toThrowError(/\[Directive: perms\]: need perms!/);
  });
});
