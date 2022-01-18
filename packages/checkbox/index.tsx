import { useEffect, useMemo, useState } from 'react';
import { MDCCheckboxFoundation } from '@material/checkbox';
import cn from 'classnames';

export interface CheckboxProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox(props: CheckboxProps): JSX.Element {
  const [checked, setChecked] = useState(props.checked || false);
  const [indeterminate, setIndeterminate] = useState(props.indeterminate || false);
  const [classList, setClassList] = useState(new Set<string>());
  const foundation = useMemo(() => new MDCCheckboxFoundation({
    addClass(className: string): void {
      setClassList((prev) => {
        prev.add(className);
        return prev;
      });
    },
    forceLayout: () => {},
    hasNativeControl: () => true,
    isAttachedToDOM: () => true,
    isChecked: () => checked,
    isIndeterminate: () => indeterminate,
    removeClass(className: string): void {
      setClassList((prev) => {
        prev.delete(className);
        return prev;
      });
    },
    removeNativeControlAttr(attr: string): void {},
    setNativeControlAttr(attr: string, value: string): void {},
    setNativeControlDisabled(disabled: boolean): void {},
  })), []);
  useEffect(() => {
    foundation.init();
    return foundation.destroy;
  }, []);
  return (
    <div className={cn('mdc-checkbox', classList, props.className)}>
      <input type='checkbox'
             id='basic-disabled-checkbox'
             className='mdc-checkbox__native-control'
             disabled />
      <div className='mdc-checkbox__background'>
        <svg className='mdc-checkbox__checkmark'
             viewBox='0 0 24 24'>
          <path className='mdc-checkbox__checkmark-path'
                fill='none'
                d='M1.73,12.91 8.1,19.28 22.79,4.59'/>
        </svg>
        <div className='mdc-checkbox__mixedmark'></div>
      </div>
      <div className='mdc-checkbox__ripple'></div>
    </div>
  );
}
