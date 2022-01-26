import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MDCCheckboxAdapter, MDCCheckboxFoundation } from '@material/checkbox';
import cn from 'classnames';
import log from 'loglevel';

export interface CheckboxProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [classList, setClassList] = useState(new Set<string>());
  const [disabled, setDisabled] = useState(false);
  const foundation = useRef<MDCCheckboxFoundation>();
  const state = useRef({ checked, indeterminate });
  const rootEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    log.debug('Handling change...');
    state.current.checked = checked;
    state.current.indeterminate = indeterminate;
    foundation.current?.handleChange();
  }, [checked, indeterminate]);
  useEffect(() => {
    log.debug('Initializing foundation...');
    const adapter: MDCCheckboxAdapter = {
      addClass(className: string): void {
        log.debug(`Adding class (${className})...`);
        setClassList((prev) => {
          const list = new Set(prev);
          list.add(className);
          return list;
        });
      },
      removeClass(className: string): void {
        log.debug(`Removing class (${className})...`);
        setClassList((prev) => {
          const list = new Set(prev);
          list.delete(className);
          return list;
        });
      },
      hasNativeControl(): boolean {
        log.debug(`Has native control? ${true}`);
        return true;
      },
      isAttachedToDOM(): boolean {
        log.debug(`Is attached to DOM? ${true}`);
        return true;
      },
      isChecked(): boolean {
        log.debug(`Is checked? ${state.current.checked}`);
        return state.current.checked;
      },
      isIndeterminate(): boolean {
        log.debug(`Is indeterminate? ${state.current.indeterminate}`);
        return state.current.indeterminate;
      },
      setNativeControlAttr(attr: string, value: string): void {
        log.debug(`Setting native control attr (${attr}:${value})...`);
        if (attr === 'aria-checked' && value === 'mixed') {
          setChecked(false);
          setIndeterminate(true);
        }
      },
      setNativeControlDisabled(disable: boolean): void {
        log.debug(`Setting native control disabled (${disable})...`);
        setDisabled(disable);
      },
      removeNativeControlAttr(attr: string): void {
        log.debug(`Removing native control attr (${attr})...`);
      },
      forceLayout(): void {
        log.debug('Forcing layout...');
        void rootEl.current?.offsetWidth;
      },
    };
    const base = new MDCCheckboxFoundation(adapter);
    foundation.current = base;
    foundation.current.init();
    return () => base.destroy();
  }, []);
  return (
    <div
      ref={rootEl}
      className={cn('mdc-checkbox', props.className, ...classList)}
    >
      <input
        type='checkbox'
        id='basic-disabled-checkbox'
        className='mdc-checkbox__native-control'
        checked={checked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : checked}
        onChange={(evt) => {
          log.debug('Change:', evt);
          log.debug('Checked:', evt.currentTarget.checked);
          setChecked(evt.currentTarget.checked);
        }}
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
