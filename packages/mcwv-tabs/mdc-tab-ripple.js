import { RippleBase } from '@mcwv/ripple';

export default {
  name: 'mdc-tab-ripple',

  data() {
    return {
      classes: {
        'mdc-tab__ripple': 1,
        'mdc-tab-ripple': 1,
      },
      styles: {},
    };
  },
  render(createElement) {
    return createElement('span', { class: this.classes, style: this.styles });
  },
  mounted() {
    this.ripple = new RippleBase(this);
    this.ripple.init();
  },

  beforeDestroy() {
    this.ripple.destroy();
  },
};
