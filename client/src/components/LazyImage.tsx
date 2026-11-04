import { memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
}

// Always expose the image URL to the browser. Native lazy loading handles
// off-screen images without a second observer or a load-dependent opacity gate.
const LazyImage = memo(function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  sizes,
  priority = false,
}: LazyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      decoding="async"
      sizes={sizes}
      {...{ fetchpriority: priority ? 'high' : 'auto' }}
    />
  );
});

export default LazyImage;
