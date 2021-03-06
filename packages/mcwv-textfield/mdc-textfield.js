/* eslint-disable quote-props */
import MDCTextfieldFoundation from '@material/textfield/foundation';
import TextfieldHelperText from './textfield-helper-text.js';
import TextfieldIcon from './textfield-icon.js';

import { DispatchFocusMixin, VMAUniqueIdMixin, applyPassive } from '@mcwv/base';
import { RippleBase } from '@mcwv/ripple';

export default {
  name: 'mdc-textfield',
  mixins: [DispatchFocusMixin, VMAUniqueIdMixin],
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'model',
  },
  props: {
    value: [String, Number],
    type: {
      type: String,
      default: 'text',
      validator: function(value) {
        return (
          [
            'text',
            'email',
            'search',
            'password',
            'tel',
            'url',
            'number',
          ].indexOf(value) !== -1
        );
      },
    },
    dense: Boolean,
    label: String,
    outline: Boolean,
    disabled: Boolean,
    required: Boolean,
    valid: { type: Boolean, default: undefined },
    fullwidth: Boolean,
    multiline: Boolean,
    size: { type: [Number, String], default: 20 },
    minlength: { type: [Number, String], default: undefined },
    maxlength: { type: [Number, String], default: undefined },
    rows: { type: [Number, String], default: 8 },
    cols: { type: [Number, String], default: 40 },
    id: { type: String },
    helptext: String,
    helptextPersistent: Boolean,
    helptextValidation: Boolean,
  },
  data: function() {
    return {
      text: this.value,
      rootClasses: {
        'mdc-textfield': true,
        'mdc-text-field': true,
        'mdc-text-field--upgraded': true,
        'mdc-text-field--disabled': this.disabled,
        'mdc-text-field--dense': this.dense,
        'mdc-text-field--fullwidth': this.fullwidth,
        'mdc-text-field--textarea': this.multiline,
        'mdc-text-field--outlined': !this.fullwidth && this.outline,
        'mdc-text-field--with-leading-icon': Boolean(this.$slots.leadingIcon),
        'mdc-text-field--with-trailing-icon': Boolean(this.$slots.trailingIcon),

        'mdc-text-field--no-label': !this.label,
      },
      inputClasses: {
        'mdc-text-field__input': true,
      },
      labelClasses: {
        'mdc-floating-label': true,
      },
      lineRippleClasses: {
        'mdc-line-ripple': true,
      },
      lineRippleStyles: {},
      outlineClasses: {},
      notchStyles: {},
    };
  },
  render(createElement) {
    const rootNodes = [];

    if (this.$slots.leadingIcon) {
      rootNodes.push(
        createElement(
          'textfield-icon',
          { ref: 'leadingIconEl' },
          this.$slots.leadingIcon,
        ),
      );
    }

    if (this.multiline) {
      rootNodes.push(
        createElement('textarea', {
          class: this.inputClasses,
          attrs: {
            ...this.$attrs,
            id: this.vma_uid_,
            minlength: this.minlength,
            maxlength: this.maxlength,
            placeholder: this.inputPlaceHolder,
            'aria-label': this.inputPlaceHolder,
            'aria-controls': this.inputAriaControls,
            rows: this.rows,
            cols: this.cols,
          },
          ref: 'input',
          on: {
            ...this.$listeners,
            input: evt => this.updateValue(evt.target.value),
          },
        }),
      );
    } else {
      rootNodes.push(
        createElement('input', {
          class: this.inputClasses,
          attrs: {
            ...this.$attrs,
            id: this.vma_uid_,
            type: this.type,
            minlength: this.minlength,
            maxlength: this.maxlength,
            placeholder: this.inputPlaceHolder,
            'aria-label': this.inputPlaceHolder,
            'aria-controls': this.inputAriaControls,
          },
          ref: 'input',
          on: {
            ...this.$listeners,
            input: evt => this.updateValue(evt.target.value),
          },
        }),
      );
    }

    if (this.hasLabel) {
      rootNodes.push(
        createElement(
          'mdc-floating-label',
          {
            attrs: { for: this.vma_uid_ },
            ref: 'labelEl',
          },
          this.label,
        ),
      );
    }

    if (this.$slots.trailingIcon) {
      rootNodes.push(
        createElement(
          'textfield-icon',
          { ref: 'trailingIconEl' },
          this.$slots.trailingIcon,
        ),
      );
    }

    if (this.hasOutline) {
      rootNodes.push(
        createElement(
          'mdc-notched-outline',
          {
            ref: 'labelEl',
          },
          this.label,
        ),
      );
    }

    if (this.hasLineRipple) {
      rootNodes.push(
        createElement('mdc-line-ripple', {
          ref: 'lineRippleEl',
        }),
      );
    }

    const rootEl = createElement(
      'div',
      {
        class: this.rootClasses,
        ref: 'root',
      },
      rootNodes,
    );

    const nodes = [rootEl];
    if (this.hasHelptext) {
      nodes.push(
        createElement(
          'textfield-helper-text',
          {
            attrs: {
              id: `help${this.vma_uid_}`,
              helptext: this.helpText,
              persistent: this.helptextPersistent,
              validation: this.helptextValidation,
            },
            ref: 'helpertextEl',
          },
          this.$slots.helpText,
        ),
      );
    }

    return createElement(
      'div',
      {
        class: { 'mdc-textfield-wrapper': 1 },
        style: { width: this.fullwidth ? '100%' : void 0 },
        attrs: { id: this.id },
      },
      nodes,
    );
  },
  components: { TextfieldHelperText, TextfieldIcon },
  computed: {
    inputPlaceHolder() {
      return this.fullwidth ? this.label : undefined;
    },
    inputAriaControls() {
      return this.help ? 'help-' + this.vma_uid_ : undefined;
    },
    hasLabel() {
      return !this.fullwidth && !this.outline && this.label;
    },

    hasOutlineLabel() {
      return this.hasOutline && this.label;
    },
    hasOutline() {
      return !this.fullwidth && this.outline;
    },
    hasLineRipple() {
      return !this.hasOutline && !this.multiline;
    },

    hasHelptext() {
      return this.$slots.helpText || this.helptext;
    },
  },
  watch: {
    disabled() {
      this.foundation && this.foundation.setDisabled(this.disabled);
    },
    required() {
      this.$refs.input && (this.$refs.input.required = this.required);
    },
    valid() {
      if (typeof this.valid !== 'undefined') {
        this.foundation && this.foundation.setValid(this.valid);
      }
    },
    dense() {
      this.$set(this.rootClasses, 'mdc-text-field--dense', this.dense);
    },
    value(value) {
      if (this.foundation) {
        if (value !== this.foundation.getValue()) {
          this.foundation.setValue(value);
        }
      }
    },
  },
  mounted() {
    this.foundation = new MDCTextfieldFoundation(
      Object.assign(
        {
          addClass: className => {
            this.$set(this.rootClasses, className, true);
          },
          removeClass: className => {
            this.$delete(this.rootClasses, className);
          },
          hasClass: className => {
            this.$refs.root.classList.contains(className);
          },
          registerTextFieldInteractionHandler: (evtType, handler) => {
            this.$refs.root.addEventListener(evtType, handler);
          },
          deregisterTextFieldInteractionHandler: (evtType, handler) => {
            this.$refs.root.removeEventListener(evtType, handler);
          },
          isFocused: () => {
            return document.activeElement === this.$refs.input;
          },

          registerValidationAttributeChangeHandler: handler => {
            const getAttributesList = mutationsList =>
              mutationsList.map(mutation => mutation.attributeName);
            const observer = new MutationObserver(mutationsList =>
              handler(getAttributesList(mutationsList)),
            );
            const targetNode = this.$refs.input;
            const config = { attributes: true };
            observer.observe(targetNode, config);
            return observer;
          },
          deregisterValidationAttributeChangeHandler: observer => {
            observer.disconnect();
          },
        },
        this.getInputAdapterMethods(),
        this.getLabelAdapterMethods(),
        this.getLineRippleAdapterMethods(),
        this.getOutlineAdapterMethods(),
      ),
      {
        helperText: this.$refs.helpertextEl
          ? this.$refs.helpertextEl.foundation
          : void 0,
        leadingIcon: this.$refs.leadingIconEl
          ? this.$refs.leadingIconEl.foundation
          : void 0,
        trailingIcon: this.$refs.trailingIconEl
          ? this.$refs.trailingIconEl.foundation
          : void 0,
      },
    );
    this.foundation.init();
    this.foundation.setValue(this.value);
    this.foundation.setDisabled(this.disabled);
    this.$refs.input && (this.$refs.input.required = this.required);
    if (typeof this.valid !== 'undefined') {
      this.foundation.setValid(this.valid);
    }

    if (this.textbox) {
      this.ripple = new RippleBase(this);
      this.ripple.init();
    }
  },
  beforeDestroy() {
    this.foundation && this.foundation.destroy();
    this.ripple && this.ripple.destroy();
  },
  methods: {
    getInputAdapterMethods() {
      return {
        registerInputInteractionHandler: (evtType, handler) => {
          this.$refs.input.addEventListener(evtType, handler, applyPassive());
        },
        deregisterInputInteractionHandler: (evtType, handler) => {
          this.$refs.input.removeEventListener(
            evtType,
            handler,
            applyPassive(),
          );
        },
        getNativeInput: () => {
          return this.$refs.input;
        },
      };
    },
    getLabelAdapterMethods() {
      return {
        shakeLabel: shouldShake => {
          this.$refs.labelEl && this.$refs.labelEl.shake(shouldShake);
        },
        floatLabel: shouldFloat => {
          this.$refs.labelEl && this.$refs.labelEl.float(shouldFloat);
        },
        hasLabel: () => {
          return !!this.$refs.labelEl || !!this.$refs.notchedEl;
        },
        getLabelWidth: () => {
          return this.$refs.labelEl && this.$refs.labelEl.getWidth();
        },
      };
    },
    getLineRippleAdapterMethods() {
      return {
        deactivateLineRipple: () => {
          if (this.$refs.lineRippleEl) {
            this.$refs.lineRippleEl.deactivate();
          }
        },
        activateLineRipple: () => {
          if (this.$refs.lineRippleEl) {
            this.$refs.lineRippleEl.activate();
          }
        },
        setLineRippleTransformOrigin: normalizedX => {
          if (this.$refs.lineRippleEl) {
            this.$refs.lineRippleEl.setRippleCenter(normalizedX);
          }
        },
      };
    },
    getOutlineAdapterMethods() {
      return {
        hasOutline: () => !!this.hasOutline,
        notchOutline: (notchWidth, isRtl) =>
          this.$refs.labelEl.notch(notchWidth, isRtl),
        closeOutline: () => this.$refs.labelEl.closeNotch(),
      };
    },
    updateValue(value) {
      this.$emit('model', value);
    },
    focus() {
      this.$refs.input && this.$refs.input.focus();
    },
    blur() {
      this.$refs.input && this.$refs.input.blur();
    },
  },
};
