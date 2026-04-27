import React, { useState } from 'react';

type BrandSize = 'sm' | 'lg';

interface SchoolBrandProps {
  size?: BrandSize;
  centered?: boolean;
}

const sizeStyles: Record<BrandSize, { logo: string; title: string; subtitle: string }> = {
  sm: {
    logo: 'h-10 w-10',
    title: 'text-lg',
    subtitle: 'text-[10px]',
  },
  lg: {
    logo: 'h-14 w-14',
    title: 'text-3xl',
    subtitle: 'text-sm',
  },
};

export const SchoolBrand: React.FC<SchoolBrandProps> = ({
  size = 'sm',
  centered = false,
}: SchoolBrandProps) => {
  const styles = sizeStyles[size];
  const [logoSrc, setLogoSrc] = useState('/school-logo.png');

  return (
    <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
      <img
        src={logoSrc}
        alt="BV Reddy Senior Secondary School"
        className={`${styles.logo} rounded-full object-cover border border-slate-200`}
        referrerPolicy="no-referrer"
        onError={() => setLogoSrc('https://www.bvreddyschool.in/images/logo.png')}
      />
      <div className="leading-none">
        <div className={`font-extrabold tracking-tight text-brand-navy ${styles.title}`}>B.V REDDY</div>
        <div className={`font-bold tracking-wider text-red-600 ${styles.subtitle}`}>SENIOR SECONDARY SCHOOL</div>
      </div>
    </div>
  );
};
