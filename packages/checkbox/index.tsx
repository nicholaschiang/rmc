import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MDCCheckboxAdapter, MDCCheckboxFoundation } from '@material/checkbox';
import cn from 'classnames';
import { strings } from '@material/checkbox/constants';

export interface CheckboxProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
  const [checked, setChecked] = useState(props.checked || false);
  const [indeterminate, setIndeterminate] = useState(
    props.indeterminate || false
  );
  const [classList, setClassList] = useState(new Set<string>());
  const [disabled, setDisabled] = useState(props.disabled || false);
  const foundation = useRef<MDCCheckboxFoundation>();
  const adapter = useRef<MDCCheckboxAdapter>();
  useEffect(() => {
    adapter.current = {
      addClass(className: string): void {
        setClassList((prev) => {
          prev.add(className);
          return prev;
        });
      },
      removeClass(className: string): void {
        setClassList((prev) => {
          prev.delete(className);
          return prev;
        });
      },
      hasNativeControl: () => true,
      isAttachedToDOM: () => true,
      isChecked: () => checked,
      isIndeterminate: () => indeterminate,
      setNativeControlAttr(attr: string, value: string): void {
        if (
          attr === strings.ARIA_CHECKED_ATTR &&
          value === strings.ARIA_CHECKED_INDETERMINATE_VALUE
        ) {
          setChecked(false);
          setIndeterminate(true);
        }
      },
      setNativeControlDisabled: setDisabled,
      removeNativeControlAttr(attr: string): void {
        if (attr === strings.ARIA_CHECKED_ATTR) setChecked(false);
      },
      forceLayout: () => {},
    };
    foundation.current?.handleChange();
  }, [checked, indeterminate]);
  useEffect(() => {
    foundation.current = new MDCCheckboxFoundation(adapter.current);
    foundation.current.init();
    return foundation.current.destroy;
  }, []);
  return (
    <div className={cn('mdc-checkbox', classList, props.className)}>
      <input
        type='checkbox'
        id='basic-disabled-checkbox'
        className='mdc-checkbox__native-control'
        disabled
      />
      <div className='mdc-checkbox__background'>
        <svg className='mdc-checkbox__checkmark' viewBox='0 0 24 24'>
          <path
            className='mdc-checkbox__checkmark-path'
            fill='none'
            d='M1.73,12.91 8.1,19.28 22.79,4.59'
          />
        </svg>
        <div className='mdc-checkbox__mixedmark'></div>
      </div>
      <div className='mdc-checkbox__ripple'></div>
    </div>
  );
}
