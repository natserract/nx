import React from "react"

export type MouseEventT<T> = React.MouseEvent<T, MouseEvent>

export type HTMLElementT<T> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>
