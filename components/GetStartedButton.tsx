'use me';
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IGetStartedButtonProps {
  text?: string;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function GetStartedButton({
  text = 'Get started',
  className,
  onClick,
  href = '/signup',
}: IGetStartedButtonProps) {
  const buttonEl = (
    <div className="min-h-12 w-48 flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group/start flex h-12 w-44 items-center justify-center gap-3 rounded-lg bg-amber-100 p-2 font-bold transition-colors duration-100 ease-in-out hover:bg-orange-600 cursor-pointer shadow-xl',
          className
        )}
      >
        <span
          className={cn(
            'text-orange-600 transition-colors duration-100 ease-in-out group-hover/start:text-amber-100 text-sm font-bold'
          )}
        >
          {text}
        </span>
        <div
          className={cn(
            'relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full transition-transform duration-100',
            'bg-orange-600 group-hover/start:bg-amber-100'
          )}
        >
          <div className="absolute left-0 flex h-7 w-14 -translate-x-1/2 items-center justify-center transition-transform duration-200 ease-in-out group-hover/start:translate-x-0">
            <ArrowRight
              size={16}
              className={cn(
                'size-7 transform p-1 text-orange-600 opacity-0 group-hover/start:opacity-100'
              )}
            />
            <ArrowRight
              size={16}
              className={cn(
                'size-7 transform p-1 text-amber-100 opacity-100 transition-transform duration-300 ease-in-out group-hover/start:opacity-0'
              )}
            />
          </div>
        </div>
      </button>
    </div>
  );

  if (href && !onClick) {
    return <Link href={href}>{buttonEl}</Link>;
  }

  return buttonEl;
}
