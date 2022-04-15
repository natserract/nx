
import NextImage, { ImageProps as NextImageProps } from "next/image"

type ImageProps = Partial<{
  classes: string;
}> & NextImageProps;

const Image: React.FC<ImageProps> = (props) => {
  const {
    width,
    height,
    layout,
    classes,
    objectFit,
    src,
    alt,
    ...other
  } = props

  return (
    <NextImage
      className={classes}
      layout={layout}
      width={width}
      height={height}
      objectFit={objectFit || "contain"}
      src={src}
      alt={alt || ""}
      draggable={false}
      {...other}
    />
  )
}

export default Image
