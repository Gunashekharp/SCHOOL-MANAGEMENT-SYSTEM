import React, { useState } from 'react';

type BrandSize = 'sm' | 'lg';

interface SchoolBrandProps {
  size?: BrandSize;
  centered?: boolean;
}

const sizeStyles: Record<BrandSize, { logo: string }> = {
  sm: {
    logo: 'h-14 w-[220px]',
  },
  lg: {
    logo: 'h-20 w-[300px]',
  },
};

export const SchoolBrand: React.FC<SchoolBrandProps> = ({
  size = 'sm',
  centered = false,
}: SchoolBrandProps) => {
  const styles = sizeStyles[size];
  const fallbackSources = ['/school-logo.png', '/school-logo-fallback.png', 'https://www.bvreddyschool.in/images/logo.png'];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const handleLogoError = () => {
    if (sourceIndex < fallbackSources.length - 1) {
      setSourceIndex((prev: number) => prev + 1);
      return;
    }

    setShowPlaceholder(true);
  };

  return (
    <div className={`flex items-center ${centered ? 'justify-center' : ''}`}>
      {showPlaceholder ? (
        <div className={`${styles.logo} rounded-md bg-brand-navy text-white border border-slate-200 flex items-center justify-center text-xs font-bold`}>
          SCHOOL LOGO
        </div>
      ) : (
        <img
          src={fallbackSources[sourceIndex]}
          alt="BV Reddy Senior Secondary School"
          className={`${styles.logo} rounded-md object-contain border border-slate-200 bg-white p-1`}
          referrerPolicy="no-referrer"
          onError={handleLogoError}
        />
      )}
    </div>
  );
};
