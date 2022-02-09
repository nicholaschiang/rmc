import {
  ChangeEvent,
  Dispatch,
  Ref,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MDCCheckbox } from '@material/checkbox';
import cn from 'classnames';

function usePropState<T>(
  initial: T,
  prop?: T
): [T, Dispatch<SetStateAction<T>>] {
  const [control, setControl] = useState<T>(prop ?? initial);
  useEffect(() => {
    setControl((prev) => prop ?? prev);
  }, [prop]);
  return useMemo(() => [control, setControl], [control, setControl]);
}

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
  value?: string | number | string[];
}

export function Checkbox(p: CheckboxProps): JSX.Element {
  const checkbox = useRef<MDCCheckbox>();
  const root = useCallback((el: HTMLDivElement) => {
    checkbox.current?.destroy();
    checkbox.current = new MDCCheckbox(el);
  }, []);

  const [checked, setChecked] = usePropState(false, p.checked);
  useEffect(() => {
    if (checkbox.current) checkbox.current.checked = checked;
  }, [checked]);

  const [indeterminate, setIndeterminate] = usePropState(
    false,
    p.indeterminate
  );
  useEffect(() => {
    if (checkbox.current) checkbox.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const [disabled, setDisabled] = usePropState(false, p.disabled);
  useEffect(() => {
    if (checkbox.current) checkbox.current.disabled = disabled;
  }, [disabled]);

  return (
    <div ref={root} className={cn('mdc-checkbox', p.className)}>
      <input
        id={p.id}
        ref={p.inputRef}
        value={p.value}
        type='checkbox'
        className='mdc-checkbox__native-control'
        onChange={(evt) => {
          if (p.onChange) p.onChange(evt);
          if (!checkbox.current) return;
          setChecked(checkbox.current.checked);
          setIndeterminate(checkbox.current.indeterminate);
          setDisabled(checkbox.current.disabled);
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
        <div className='mdc-checkbox__mixedmark' />
      </div>
      <div className='mdc-checkbox__ripple' />
    </div>
  );
}
