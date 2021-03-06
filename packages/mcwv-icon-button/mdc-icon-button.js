import MDCIconButtonToggleFoundation from '@material/icon-button/foundation';
import { RippleBase } from '@mcwv/ripple';

export default {
  name: 'mdc-icon-button',
  model: {
    prop: 'isOn',
    event: 'change',
  },
  props: {
    isOn: Boolean,
  },
  data() {
    return {
      classes: {
        'mdc-icon-button': 1,
        'material-icons': 1,
      },
      styles: {},
    };
  },

  watch: {
    isOn: 'onOn_',
  },
  render(createElement) {
    const isLink = Boolean(this.$attrs.href);
    const tag = isLink ? 'a' : 'button';
    return createElement(
      tag,
      {
        class: this.classes,
        style: this.styles,
        on: { click: evt => this.foundation.handleClick(evt) },
        attrs: { ...this.$attrs, 'aria-pressed': 'false' },
      },
      this.$slots.default,
    );
  },
  mounted() {
    this.foundation = new MDCIconButtonToggleFoundation({
      addClass: className => this.$set(this.classes, className, true),
      removeClass: className => this.$delete(this.classes, className),
      hasClass: className => Boolean(this.classes[className]),
      setAttr: (attrName, attrValue) =>
        this.$el.setAttribute(attrName, attrValue),
      notifyChange: evtData => {
        this.$emit(MDCIconButtonToggleFoundation.strings.CHANGE_EVENT, evtData);

        this.$emit('change', evtData.isOn);
      },
    });
    this.foundation.init();

    this.ripple = new RippleBase(this, {
      isUnbounded: () => true,
    });
    this.ripple.init();

    this.foundation.toggle(this.isOn);
  },

  beforeDestroy() {
    this.ripple.destroy();
    this.foundation.destroy();
  },
  methods: {
    onOn_(isOn) {
      if (this.isOn !== isOn) {
        this.foundation.toggle(isOn);
      }
    },
  },
};
