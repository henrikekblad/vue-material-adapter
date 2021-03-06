import { RippleBase } from '@mcwv/ripple';

export default {
  name: 'mdc-material-icon',
  props: {
    hasRipple: Boolean,
    icon: String,
  },
  data() {
    return {
      classes: {
        'mdc-material-icon': 1,
        'material-icons': true,
        'material-icons--ripple-surface': this.hasRipple,
      },
      styles: {},
    };
  },
  render(createElement) {
    return createElement(
      'i',
      {
        class: this.classes,
        on: this.$listeners,
        style: this.styles,
      },
      this.icon,
    );
  },
  mounted() {
    if (this.hasRipple) {
      this.ripple = new RippleBase(this, {
        isUnbounded: () => true,
      });
      this.ripple.init();
    }
  },

  beforeDestroy() {
    if (this.ripple) {
      this.ripple.destroy();
    }
  },
  methods: {},

  computed: {},
};
