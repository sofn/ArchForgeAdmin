// Component tests resolve every `~icons/...` import (unplugin-icons virtual modules) to this inert stub.
import { defineComponent, h } from "vue";

export default defineComponent({ name: "IconStub", render: () => h("i") });
