import { DispatchFocusMixin, VMAUniqueIdMixin } from '@mcwv/base';
import { RippleBase } from '@mcwv/ripple';
import MDCSwitchFoundation from '@material/switch/foundation';

export default {
  name: 'mdc-switch',
  mixins: [DispatchFocusMixin, VMAUniqueIdMixin],
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: Boolean,
    disabled: Boolean,
    value: String,
    label: String,
    alignEnd: Boolean,
    name: String,
  },
  data() {
    return {
      classes: { 'mdc-switch': 1 },
      styles: {},
    };
  },
  computed: {
    hasLabel() {
      return this.label || this.$slots.default;
    },
  },
  watch: {
    checked(value) {
      this.foundation && this.foundation.setChecked(value);
    },
    disabled(value) {
      this.foundation && this.foundation.setDisabled(value);
    },
  },
  render(createElement) {
    const nodes = [
      createElement('div', { class: this.classes, style: this.styles }, [
        createElement('div', { class: { 'mdc-switch__track': 1 } }),
        createElement('div', { class: { 'mdc-switch__thumb-underlay': 1 } }, [
          createElement('div', { class: { 'mdc-switch__thumb': 1 } }, [
            createElement('input', {
              class: { 'mdc-switch__native-control': 1 },
              attrs: {
                name: this.name,
                id: this.vma_uid_,
                value: this.value,
                type: 'checkbox',
                role: 'switch',
              },
              ref: 'control',
              on: { change: evt => this.onChanged(evt) },
            }),
          ]),
        ]),
      ]),
    ];

    if (this.hasLabel) {
      const labelEl = createElement(
        'label',
        {
          class: { 'mdc-switch-label': 1 },
          attrs: { for: this.vma_uid_ },
        },
        this.$slots.default || this.label,
      );
      nodes.push(labelEl);
    }

    return createElement(
      'div',
      {
        class: {
          'mdc-switch-wrapper': 1,
          'mdc-form-field': this.hasLabel,
          'mdc-form-field--align-end': this.hasLabel && this.alignEnd,
        },
      },
      nodes,
    );
  },
  mounted() {
    this.foundation = new MDCSwitchFoundation({
      addClass: className => this.$set(this.classes, className, true),
      removeClass: className => this.$delete(this.classes, className),
      setNativeControlChecked: checked =>
        (this.$refs.control.checked = checked),
      setNativeControlDisabled: disabled =>
        (this.$refs.control.disabled = disabled),
    });
    this.foundation.init();
    this.foundation.setChecked(this.checked);
    this.foundation.setDisabled(this.disabled);

    this.ripple = new RippleBase(this);
    this.ripple.init();
  },
  beforeDestroy() {
    this.foundation && this.foundation.destroy();
    this.ripple && this.ripple.destroy();
  },
  methods: {
    onChanged(event) {
      this.foundation && this.foundation.handleChange(event);
      this.$emit('change', event.target.checked);
    },
  },
};
