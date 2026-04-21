'use client';

import Image from 'next/image';
import { Box, Typography } from '@mui/material';

type BrandLogoProps = {
  size?: number;
  title?: string;
  subtitle?: string;
  titleVariant?: 'h4' | 'h5' | 'h6' | 'body1';
  subtitleVariant?: 'body2' | 'caption' | 'overline';
  gap?: number;
};

export default function BrandLogo({
  size = 52,
  title = 'Primis',
  subtitle,
  titleVariant = 'h6',
  subtitleVariant = 'caption',
  gap = 1.5,
}: BrandLogoProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap }}>
      <Box
        sx={{
          width: size,
          height: size,
          position: 'relative',
          flexShrink: 0,
          overflow: 'hidden',
          borderRadius: '16px',
        }}
      >
        <Image src="/logo.png" alt="Primis logo" fill sizes={`${size}px`} style={{ objectFit: 'cover' }} priority />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant={titleVariant} sx={{ fontWeight: 800, lineHeight: 1.1 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant={subtitleVariant} color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}
