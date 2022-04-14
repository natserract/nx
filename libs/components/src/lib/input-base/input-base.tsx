import styles from './input-base.module.scss';

/* eslint-disable-next-line */
export interface InputBaseProps {}

export function InputBase(props: InputBaseProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to InputBase!</h1>
    </div>
  );
}

export default InputBase;
