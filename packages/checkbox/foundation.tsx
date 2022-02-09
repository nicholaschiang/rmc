import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { EventType, SpecificEventListener } from '@material/base/types';
import { MDCCheckboxAdapter, MDCCheckboxFoundation } from '@material/checkbox';
import { MDCRippleAdapter, MDCRippleFoundation } from '@material/ripple';
import { MDCRipplePoint } from '@material/ripple/types';
import cn from 'classnames';
import log from 'loglevel';
import { matches } from '@material/dom/ponyfill';

export interface CheckboxProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
  const [checked, setChecked] = useState(props.checked || false);
  useEffect(() => {
    setChecked((prev) => props.checked ?? prev);
  }, [props.checked]);
  const [indeterminate, setIndeterminate] = useState(
    props.indeterminate || false
  );
  useEffect(() => {
    setIndeterminate((prev) => props.indeterminate ?? prev);
  }, [props.indeterminate]);
  const [classList, setClassList] = useState(new Set<string>());
  const [disabled, setDisabled] = useState(props.disabled || false);
  useEffect(() => {
    setDisabled((prev) => props.disabled ?? prev);
  }, [props.disabled]);
  const foundation = useRef(new MDCCheckboxFoundation());
  const state = useRef({ checked, indeterminate });
  const rootEl = useRef<HTMLDivElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);
  useEffect(() => {
    log.debug('Handling change...');
    state.current.checked = checked;
    state.current.indeterminate = indeterminate;
    // Setting indeterminate directly on <input> is not supported by React but
    // is required for the `:indeterminate` selector MDC Web's SCSS uses.
    // https://github.com/facebook/react/issues/1798#issuecomment-333414857
    if (inputEl.current) inputEl.current.indeterminate = indeterminate;
    foundation.current.setDisabled(disabled);
    foundation.current.handleChange();
  }, [checked, disabled, indeterminate]);
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
        // Do nothing; we already set `aria-checked` which is all MDC Web's
        // foundation does with this method anyways.
      },
      setNativeControlDisabled(disable: boolean): void {
        log.debug(`Setting native control disabled (${disable})...`);
        setDisabled(disable);
      },
      removeNativeControlAttr(attr: string): void {
        log.debug(`Removing native control attr (${attr})...`);
        // Do nothing; we already set `aria-checked` which is all MDC Web's
        // foundation does with this method anyways.
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
  useEffect(() => {
    const adapter: MDCRippleAdapter = {
      browserSupportsCssVars(): boolean {
        return true;
      },
      isUnbounded(): boolean {
        return true;
      },
      isSurfaceActive(): boolean {
        return matches(inputEl.current as Element, ':active');
      },
      isSurfaceDisabled(): boolean {
        return Boolean(inputEl.current?.disabled);
      },
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
      containsEventTarget(target: EventTarget | null): boolean {
        return !!inputEl.current?.contains(target as Node);
      },
      registerInteractionHandler<K extends EventType>(
        evtType: K,
        handler: SpecificEventListener<K>
      ): void {
        inputEl.current?.addEventListener(evtType, handler);
      },
      deregisterInteractionHandler<K extends EventType>(
        evtType: K,
        handler: SpecificEventListener<K>
      ): void {
        inputEl.current?.addEventListener(evtType, handler);
      },
      registerDocumentInteractionHandler<K extends EventType>(
        evtType: K,
        handler: SpecificEventListener<K>
      ): void {
        document.documentElement.addEventListener(evtType, handler);
      },
      deregisterDocumentInteractionHandler<K extends EventType>(
        evtType: K,
        handler: SpecificEventListener<K>
      ): void {
        document.documentElement.removeEventListener(evtType, handler);
      },
      registerResizeHandler(handler: SpecificEventListener<'resize'>): void {
        window.addEventListener('resize', handler);
      },
      deregisterResizeHandler(handler: SpecificEventListener<'resize'>): void {
        window.removeEventListener('resize', handler);
      },
      updateCssVariable(varName: string, value: string | null): void {
        inputEl.current?.style.setProperty(varName, value);
      },
      computeBoundingRect(): ClientRect {
        return (inputEl.current as Element).getBoundingClientRect();
      },
      getWindowPageOffset(): MDCRipplePoint {
        return { x: window.pageXOffset, y: window.pageYOffset };
      },
    };
    const base = new MDCRippleFoundation(adapter);
    base.init();
    return () => base.destroy();
  }, []);

  return (
    <div
      ref={rootEl}
      className={cn('mdc-checkbox', props.className, ...classList)}
      onAnimationEnd={() => foundation.current.handleAnimationEnd()}
    >
      <input
        ref={inputEl}
        type='checkbox'
        className='mdc-checkbox__native-control'
        checked={checked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : checked}
        onChange={(evt) => {
          log.debug('Change:', evt);
          log.debug('Checked:', evt.currentTarget.checked);
          setChecked(evt.currentTarget.checked);
          if (props.onChange) props.onChange(evt);
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
