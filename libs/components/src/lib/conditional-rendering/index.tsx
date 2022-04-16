import React from "react";

type ConditionalRenderProps<T> = {
  items: Array<T>,
  RenderComponent: (items: Array<T>) => JSX.Element,
  EmptyComponent?: (children) => JSX.Element,
}

export function ConditionalRender<T>(props: ConditionalRenderProps<T>) {
  const {
    items,
    EmptyComponent,
    RenderComponent,
  } = props

  if (!isValidItems(items)) return (
    EmptyComponent ?
      <EmptyComponent /> : (<div>Empty Items</div>)
  )

  return RenderComponent(items)
}

function isValidItems<A>(items: Array<A>) {
  return items && items.length
}

export default ConditionalRender
