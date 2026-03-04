"use client";

import { useEffect, useMemo, useState } from "react";
import NextImage from "next/image";

export default function SafeImage({
  src,
  fallbackSrc = "/placeholder.jpg",
  onError,
  ...props
}) {
  const resolvedSrc = useMemo(() => {
    if (typeof src === "string") {
      return src.trim() ? src : fallbackSrc;
    }

    return src || fallbackSrc;
  }, [src, fallbackSrc]);

  const [imageSrc, setImageSrc] = useState(resolvedSrc);

  useEffect(() => {
    setImageSrc(resolvedSrc);
  }, [resolvedSrc]);

  const handleError = (event) => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }

    if (onError) {
      onError(event);
    }
  };

  return <NextImage {...props} src={imageSrc} onError={handleError} />;
}
