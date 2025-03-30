import React, { useState, useRef, useEffect } from 'react';
import { XIcon, CheckIcon } from './svg/icons';
import styles from './index.css';

export interface InputProps {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface contactInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  contacts?: InputProps[];
  selectedContacts?: InputProps[];
  onChange?: (contacts: InputProps[]) => void;
  onInputChange?: (value: string) => void;
  allowNewContacts?: boolean;
}

const getFilteredContacts = (inputValue: string, contacts: InputProps[]) =>
  contacts.filter(({ name, description }) => {
    const value = inputValue.toLowerCase();
    return name.toLowerCase().includes(value) || description?.toLowerCase().includes(value);
  });

const contactInput: React.FC<contactInputProps> = ({
  label = 'To',
  contacts = [],
  selectedContacts = [],
  onChange,
  onInputChange,
  allowNewContacts = true,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<InputProps[]>(selectedContacts);
  const [filteredContacts, setFilteredContacts] = useState<InputProps[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(selectedContacts);
  }, [selectedContacts]);

  useEffect(() => {
    if (inputValue.trim()) {
      setFilteredContacts(getFilteredContacts(inputValue, contacts));
    } else {
      setFilteredContacts([]);
    }
  }, [inputValue, contacts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      setIsOpen(true);
      setFilteredContacts(getFilteredContacts(value, contacts));
      setHighlightedIndex(-1);
    } else {
      setIsOpen(false);
      setFilteredContacts([]);
    }
    
    if (onInputChange) {
      onInputChange(value);
    }
  };

  const handleSelectContact = (contact: InputProps) => {
    if (!selected.some(c => c.id === contact.id)) {
      const newSelected = [...selected, contact];
      setSelected(newSelected);
      if (onChange) {
        onChange(newSelected);
      }
    }
    
    setInputValue('');
    setIsOpen(false);
    setFilteredContacts([]);
    inputRef.current?.focus();
  };

  const handleRemoveContact = (contactId: string) => {
    const newSelected = selected.filter(c => c.id !== contactId);
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };

  const handleAddCustomContact = () => {
    if (!inputValue.trim()) return;
    
    const newContact: InputProps = {
      id: `${Date.now()}`,
      name: inputValue.trim(),
    };
    
    const newSelected = [...selected, newContact];
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
    
    setInputValue('');
    setIsOpen(false);
    setFilteredContacts([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && filteredContacts?.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => 
        prevIndex < filteredContacts?.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp' && filteredContacts?.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => 
        prevIndex > 0 ? prevIndex - 1 : filteredContacts?.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      
      if (highlightedIndex >= 0 && filteredContacts?.length > 0) {
        handleSelectContact(filteredContacts[highlightedIndex]);
      } else if (allowNewContacts && inputValue.trim()) {
        handleAddCustomContact();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Backspace' && inputValue === '' && selected.length > 0) {
      handleRemoveContact(selected[selected.length - 1].id);
    }
  };

	return (
		<div
			ref={containerRef} 
			className={styles["contact-input-wrapper"]}
		>
			<div
				className={`${styles["contact-input-container"]} ${isFocused ? styles["contact-input-focused"] : ''}`}
				onClick={() => inputRef.current?.focus()}
			>
				{label && (
					<span className={styles["contact-input-label"]}>{label}</span>
				)}
				
				<div className={styles["contact-input-tags"]}>
					{selected.map((contact) => (
						<div
							key={contact.id}
							className={styles["contact-tag"]}
						>
							{contact.image ? (
								<img
									src={contact.image} 
									alt={contact.name}
									className={styles["contact-avatar"]}
								/>
							) : (
								null
							)}
							<span className={styles["contact-tag-name"]}>{contact.name}</span>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleRemoveContact(contact.id);
								}}
								className={styles["contact-tag-remove"]}
							>
								<XIcon />
							</button>
						</div>
					))}
					
					<input
						ref={inputRef}
						type="text"
						className={styles["contact-input"]}
						value={inputValue}
						onChange={handleInputChange}
						onFocus={() => {
							setIsFocused(true);
							if (inputValue.trim()) {
								setIsOpen(true);
							}
						}}
						onKeyDown={handleKeyDown}
						{...props}
					/>
				</div>
			</div>
			
			{isOpen && (
				<div className={styles["contact-suggestions"]}>
					<div className={styles["contact-suggestions-list"]}>
						{filteredContacts.length > 0 ? (
							filteredContacts.map((contact, index) => (
								<div
									key={contact.id}
									onClick={() => handleSelectContact(contact)}
									className={`${styles["contact-suggestion-item"]} ${highlightedIndex === index ? styles.highlighted : ''}`}
								>
									{contact.image ? (
										<img
											src={contact.image} 
											alt={contact.name}
											className={styles["contact-avatar"]}
										/>
									) : (
										null
									)}
									<div className={styles["suggestion-details"]}>
										<span className={styles["suggestion-name"]}>{contact.name}</span>
										{contact.description && (
											<span className={styles["suggestion-contact"]}>{contact.description}</span>
										)}
									</div>
									{highlightedIndex === index && (
										<span className={styles["suggestion-check"]}>
											<CheckIcon />
										</span>
									)}
								</div>
							))
						) : allowNewContacts && inputValue.trim() ? (
							<div 
								className={`${styles["contact-suggestion-item"]} ${styles.highlighted}`}
								onClick={handleAddCustomContact}
							>
								<div className={styles["suggestion-details"]}>
									<span className={styles["suggestion-name"]}>"{inputValue}"</span>
								</div>
								<span className={styles["suggestion-check"]}>
									<CheckIcon />
								</span>
							</div>
						) : null}
					</div>
				</div>
			)}
		</div>
	);
}
export default contactInput; 