import Image from "next/image";
import { useState } from "react";

interface RetryImageProps {
  src: string;
  alt: string;
  className?: string;
  maxRetries?: number;
}

const RetryImage: React.FC<RetryImageProps> = ({
  src,
  alt,
  className,
  maxRetries = 3,
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1);
      setCurrentSrc(`${src}?retry=${retryCount + 1}`); // Append a query parameter to force reload
    }
  };

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      priority
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
};

export default RetryImage;
