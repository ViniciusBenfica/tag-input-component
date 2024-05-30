import * as React from 'react';
import styles from "./InputTag.css"

export const Thing = () => {
  const [emails, setEmails] = React.useState<string[]>([])

  function handleKeyDown(e: any) {
		if (e.key !== "Enter") return;
		e.preventDefault();
    setEmails((prev) => ([...prev, e.target.value]))
	}

  return (
  <>
    <div className={styles.inputContainer}>
      <input className={styles.input}
        placeholder='teste'
        onKeyDown={handleKeyDown}
      />
    </div>
  </>
  );
};
