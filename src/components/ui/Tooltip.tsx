import React, { useState, useRef } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLElement>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') hide();
  };

  const childWithProps = React.cloneElement(children, {
    ref: childRef,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    onKeyDown: handleKeyDown,
    'aria-describedby': visible ? 'tooltip-content' : undefined,
  });

  if (!visible) return childWithProps;

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-primary-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-primary-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-primary-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-primary-900',
  };

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      {childWithProps}
      <div
        ref={tooltipRef}
        id="tooltip-content"
        className={`${positions[position]} absolute z-50 px-3 py-2 text-xs font-medium text-white bg-primary-900 rounded-lg shadow-lg whitespace-nowrap animate-fade-in`}
        role="tooltip"
      >
        {content}
        <div className={`${arrows[position]} absolute w-0 h-0 border-4 border-transparent`} />
      </div>
    </div>
  );
}