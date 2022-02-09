import { ReactNode, useCallback, useRef } from 'react';
import { MDCRipple } from '@material/ripple';
import cn from 'classnames';

export interface ButtonProps {
  disabled?: boolean;
  label?: ReactNode;
  outlined?: boolean;
  raised?: boolean;
  unelevated?: boolean;
}

export function Button({
  disabled,
  label,
  outlined,
  raised,
  unelevated,
}: ButtonProps): JSX.Element {
  const ripple = useRef<MDCRipple>();
  const root = useCallback((el: HTMLButtonElement) => {
    ripple.current?.destroy();
    ripple.current = new MDCRipple(el);
  }, []);
  return (
    <button
      ref={root}
      disabled={disabled}
      className={cn('mdc-button', {
        'mdc-button--outlined': outlined,
        'mdc-button--raised': raised,
        'mdc-button--unelevated': unelevated,
      })}
    >
      <span className='mdc-button__ripple' />
      <span className='mdc-button__label'>{label}</span>
    </button>
  );
}
