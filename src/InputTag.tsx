import React, { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import styles from './InputTag.css';
import CloseSvg from './svg/close';

interface InputTag extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  tags: string[];
  addTag?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag?: (item: string) => void;
}

export const Thing = ({ placeholder, tags, addTag, removeTag, ...inputProps }: InputTag) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState('20px');

  const updateInputWidth = () => {
    if (spanRef.current && inputRef.current) {
      const textContent = inputRef.current.value || placeholder || '';
      spanRef.current.textContent = textContent;
      const spanWidth = spanRef.current.offsetWidth;
      setInputWidth(`${spanWidth + 20}px`);
    }
  };

  useEffect(() => {
    updateInputWidth();
    const handleInput = () => updateInputWidth();
    if (inputRef.current) {
      inputRef.current.addEventListener('input', handleInput);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('input', handleInput);
      }
    };
  }, [placeholder, tags]);

  useEffect(() => {
    updateInputWidth();
  }, [tags]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  return (
    <>
      <div className={styles.inputContainer} onClick={handleContainerClick}>
        {tags?.map((item, index) => (
          <div key={index} className={styles.tag}>
            <div>{item}</div>
            {removeTag && (
              <button onClick={() => removeTag(item)}>
                <CloseSvg />
              </button>
            )}
          </div>
        ))}
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            style={{ maxWidth: inputWidth }}
            placeholder={tags.length === 0 ? placeholder : ''}
            onKeyDown={addTag}
            {...inputProps}
          />
          <span ref={spanRef} className={styles.hiddenSpan}></span>
        </div>
      </div>
    </>
  );
};
