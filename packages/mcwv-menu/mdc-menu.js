/* eslint-disable quote-props */
import { MDCMenuFoundation } from '@material/menu/foundation';
import { emitCustomEvent } from '@mcwv/base';

export default {
  name: 'mdc-menu',
  model: {
    prop: 'open',
    event: 'change',
  },
  props: {
    open: [Boolean, Object],
    'quick-open': Boolean,
    'anchor-corner': [String, Number],
    'anchor-margin': Object,
  },
  data() {
    return {
      classes: {},
      styles: {},
    };
  },
  provide() {
    return { mdcMenu: this };
  },
  watch: {
    // anchorCorner(nv) {
    //   this.foundation.setAnchorCorner(Number(nv))
    // },
    // anchorMargin(nv) {
    //   this.foundation.setAnchorMargin(nv)
    // }
  },
  render(createElement) {
    return createElement(
      'mdc-menu-surface',
      {
        class: { 'mdc-menu': 1 },
        ref: 'root',
        attrs: { 'quick-open': this.quickOpen, open: this.open },
        on: {
          change: evt => this.onChange(evt),
          keydown: evt => this.handleKeydown(evt),
        },
      },
      [
        createElement(
          'mdc-list',
          {
            ref: 'list',
            nativeOn: { 'MDCList:action': evt => this.handleAction(evt) },
          },
          this.$slots.default,
        ),
      ],
    );
  },
  mounted() {
    this._previousFocus = undefined;

    this.foundation = new MDCMenuFoundation({
      addClassToElementAtIndex: (index, className) => {
        const list = this.items;
        list[index].classList.add(className);
      },
      removeClassFromElementAtIndex: (index, className) => {
        const list = this.items;
        list[index].classList.remove(className);
      },
      addAttributeToElementAtIndex: (index, attr, value) => {
        const list = this.items;
        list[index].setAttribute(attr, value);
      },
      removeAttributeFromElementAtIndex: (index, attr) => {
        const list = this.items;
        list[index].removeAttribute(attr);
      },
      elementContainsClass: (element, className) =>
        element.classList.contains(className),
      closeSurface: () => {
        this.$emit('change', false);
      },
      getElementIndex: element => {
        return this.items.indexOf(element);
      },
      getParentElement: element => element.parentElement,
      getSelectedElementIndex: selectionGroup => {
        const idx = this.items.indexOf(
          selectionGroup.querySelector(
            `.${MDCMenuFoundation.cssClasses.MENU_SELECTED_LIST_ITEM}`,
          ),
        );
        return idx;
      },
      notifySelected: evtData => {
        emitCustomEvent(this.$el, MDCMenuFoundation.strings.SELECTED_EVENT, {
          index: evtData.index,
          item: this.items[evtData.index],
        });

        this.$emit('select', {
          index: evtData.index,
          item: this.items[evtData.index],
        });
      },
    });

    this.foundation.init();
  },
  beforeDestroy() {
    this._previousFocus = null;
    this.foundation.destroy();
  },

  computed: {
    items() {
      return this.$refs.list.listElements;
    },
  },

  methods: {
    handleAction({ detail: { index } }) {
      this.foundation.handleItemAction(this.items[index]);
    },

    handleKeydown(evt) {
      this.foundation.handleKeydown(evt);
    },
    onChange(item) {
      this.$emit('change', item);
    },
    // onOpen_(value) {
    //   if (value) {
    //     this.foundation.open(typeof value === 'object' ? value : void 0)
    //   } else {
    //     this.foundation.close()
    //   }
    // },
    // show(options) {
    //   this.foundation.open(options)
    // },
    // hide() {
    //   this.foundation.close()
    // },
    // isOpen() {
    //   return this.foundation ? this.foundation.isOpen() : false
    // }
  },
};
