export function mdcTypoMixin(
  defaultTag,
  defaultClassModifier,
  name = `mdc-${defaultTag}`,
) {
  return {
    functional: true,
    props: {
      tag: {
        type: String,
        default: defaultTag,
      },
      classModifier: {
        type: String,
        default: defaultClassModifier,
      },
    },
    render(
      createElement,
      {
        props: { tag, classModifier },
        slots,
        listeners,
        data: { attrs },
      },
    ) {
      return createElement(
        tag,
        {
          class: {
            [name]: true,
            'mdc-typography': true,
            [`mdc-typography--${classModifier}`]: true,
          },
          attrs,
          on: listeners,
        },
        slots().default,
      );
    },
  };
}
