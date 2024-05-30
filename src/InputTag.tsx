import React from 'react';
import styles from './InputTag.css';
import CloseSvg from './svg/close';

interface InputTag {
  placeholder?: string;
  tags?: string[];
  addTag?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag?: (item: string) => void;
}

export const Thing = ({ placeholder, tags, addTag, removeTag }: InputTag) => {
  return (
    <>
      <div className={styles.inputContainer}>
        <div className={styles.emailContainer}>
          {tags?.map((item, index) => (
            <div key={index} className={styles.tag}>
              <div>{item}</div>
              {removeTag && (
              <button
                onClick={() => removeTag(item)}
              >
                <CloseSvg />
              </button>
                
              )}
            </div>
          ))}
        </div>
        <input
          placeholder={placeholder}
          onKeyDown={addTag}
        />
      </div>
    </>
  );
};