import { CSSProperties, ChangeEventHandler, KeyboardEventHandler } from 'react';

export interface ITextInputProps<T> {
  id?: string;
  name?: string;
  type?: string;
  value?: string | number;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  readOnly?: boolean;
  checked?: boolean;
  rows?: number;
  autoFocus?: boolean;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  onChange?: ChangeEventHandler<T> | undefined;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: () => void;
  onKeyDown?: KeyboardEventHandler<T> | undefined;
}
