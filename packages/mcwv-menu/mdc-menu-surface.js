/* eslint-disable quote-props */
import { MDCMenuSurfaceFoundation } from '@material/menu-surface/foundation';
import { emitCustomEvent } from '@mcwv/base';
import * as util from '@material/menu-surface/util';

export default {
  name: 'mdc-menu-surface',
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
      classes: {
        'mdc-menu': 1,
        'mdc-menu-surface': 1,
      },
      styles: {},
    };
  },
  provide() {
    return { mdcMenu: this };
  },
  watch: {
    open: 'onOpen_',
    quickOpen(nv) {
      this.foundation.setQuickOpen(nv);
    },
  },

  render(createElement) {
    return createElement(
      'div',
      {
        class: this.classes,
        on: {
          keydown: evt => this.handleKeydown(evt),
          'MDCMenuSurface:opened': evt => this.registerBodyClickListener(evt),
          'MDCMenuSurface:closed': evt => this.deregisterBodyClickListener(evt),
        },
      },
      this.$slots.default,
    );
  },
  mounted() {
    this._previousFocus = undefined;

    this.foundation = new MDCMenuSurfaceFoundation(
      Object.assign(
        {
          addClass: className => this.$set(this.classes, className, true),
          removeClass: className => this.$delete(this.classes, className),
          hasClass: className => this.$el.classList.contains(className),
          hasAnchor: () => !!this.anchorElement,
          notifyClose: () => {
            emitCustomEvent(
              this.$el,
              MDCMenuSurfaceFoundation.strings.CLOSED_EVENT,
              {},
            );

            this.$emit('change', false);
          },
          notifyOpen: () => {
            emitCustomEvent(
              this.$el,
              MDCMenuSurfaceFoundation.strings.OPENED_EVENT,
              {},
            );

            this.$emit('change', true);
          },
          isElementInContainer: el => this.$el === el || this.$el.contains(el),
          isRtl: () =>
            getComputedStyle(this.$el).getPropertyValue('direction') === 'rtl',
          setTransformOrigin: origin => {
            this.$el.style[
              `${util.getTransformPropertyName(window)}-origin`
            ] = origin;
          },
        },
        this.getFocusAdapterMethods(),
        this.getDimensionAdapterMethods(),
      ),
    );

    if (
      this.$el.parentElement &&
      this.$el.parentElement.classList.contains(
        MDCMenuSurfaceFoundation.cssClasses.ANCHOR,
      )
    ) {
      this.anchorElement = this.$el.parentElement;
    }

    this.foundation.init();
  },
  beforeDestroy() {
    this._previousFocus = null;

    this.foundation.destroy();
  },

  methods: {
    handleBodyClick(evt) {
      this.foundation.handleBodyClick(evt);
    },

    registerBodyClickListener() {
      document.body.addEventListener('click', this.handleBodyClick);
    },
    deregisterBodyClickListener() {
      document.body.removeEventListener('click', this.handleBodyClick);
    },
    handleKeydown(evt) {
      this.foundation.handleKeydown(evt);
    },
    getFocusAdapterMethods() {
      return {
        isFocused: () => document.activeElement === this.$el,
        saveFocus: () => {
          this.previousFocus_ = document.activeElement;
        },
        restoreFocus: () => {
          if (this.$el.contains(document.activeElement)) {
            if (this.previousFocus_ && this.previousFocus_.focus) {
              this.previousFocus_.focus();
            }
          }
        },
        isFirstElementFocused: () =>
          this.firstFocusableElement_ &&
          this.firstFocusableElement_ === document.activeElement,
        isLastElementFocused: () =>
          this.lastFocusableElement_ &&
          this.lastFocusableElement_ === document.activeElement,
        focusFirstElement: () =>
          this.firstFocusableElement_ &&
          this.firstFocusableElement_.focus &&
          this.firstFocusableElement_.focus(),
        focusLastElement: () =>
          this.lastFocusableElement_ &&
          this.lastFocusableElement_.focus &&
          this.lastFocusableElement_.focus(),
      };
    },
    getDimensionAdapterMethods() {
      return {
        getInnerDimensions: () => {
          return {
            width: this.$el.offsetWidth,
            height: this.$el.offsetHeight,
          };
        },
        getAnchorDimensions: () =>
          this.anchorElement && this.anchorElement.getBoundingClientRect(),
        getWindowDimensions: () => {
          return { width: window.innerWidth, height: window.innerHeight };
        },
        getBodyDimensions: () => {
          return {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
          };
        },
        getWindowScroll: () => {
          return { x: window.pageXOffset, y: window.pageYOffset };
        },
        setPosition: position => {
          this.$el.style.left = 'left' in position ? position.left : null;
          this.$el.style.right = 'right' in position ? position.right : null;
          this.$el.style.top = 'top' in position ? position.top : null;
          this.$el.style.bottom = 'bottom' in position ? position.bottom : null;
        },
        setMaxHeight: height => {
          this.$el.style.maxHeight = height;
        },
      };
    },

    onOpen_(value) {
      if (value) {
        const focusableElements = this.$el.querySelectorAll(
          MDCMenuSurfaceFoundation.strings.FOCUSABLE_ELEMENTS,
        );
        this.firstFocusableElement_ =
          focusableElements.length > 0 ? focusableElements[0] : null;
        this.lastFocusableElement_ =
          focusableElements.length > 0
            ? focusableElements[focusableElements.length - 1]
            : null;
        this.foundation.open();
      } else {
        this.foundation.close();
      }
    },
    hoistMenuToBody() {
      document.body.appendChild(this.$el.parentElement.removeChild(this.$el));
      this.setIsHoisted(true);
    },
    setIsHoisted(isHoisted) {
      this.foundation.setIsHoisted(isHoisted);
    },
    setMenuSurfaceAnchorElement(element) {
      this.anchorElement = element;
    },
    setFixedPosition(isFixed) {
      if (isFixed) {
        this.$el.classList.add(MDCMenuSurfaceFoundation.cssClasses.FIXED);
      } else {
        this.$el.classList.remove(MDCMenuSurfaceFoundation.cssClasses.FIXED);
      }

      this.foundation.setFixedPosition(isFixed);
    },
    setAbsolutePosition(x, y) {
      this.foundation.setAbsolutePosition(x, y);
      this.setIsHoisted(true);
    },
    setAnchorCorner(corner) {
      this.foundation.setAnchorCorner(corner);
    },
    setAnchorMargin(margin) {
      this.foundation.setAnchorMargin(margin);
    },
    show(options) {
      this.foundation.open(options);
    },
    hide() {
      this.foundation.close();
    },
    isOpen() {
      return this.foundation ? this.foundation.isOpen() : false;
    },
  },
};
