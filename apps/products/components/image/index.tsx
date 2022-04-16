
import NextImage, { ImageProps as NextImageProps } from "next/image"

type ImageProps = Partial<{
  classes: string;
}> & NextImageProps;

const Image: React.FC<ImageProps> = (props) => {
  const {
    classes,
    objectFit,
    alt,
    ...other
  } = props

  return (
    <NextImage
      className={classes}
      objectFit={objectFit || "contain"}
      alt={alt || ""}
      draggable={false}
      {...other}
    />
  )
}

export default Image
