# Tag Input Component

## Demo
![img](demo.gif)

## Installation
```
npm install tag-input-component
```

## Usage Example

```javascript
import React, { useState } from "react";
import { TagInput } from "tag-input-component";

export default function Home() {
	const [tags, setTags] = useState<{id: string, text: string}[]>([])

	function addItem(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key !== "Enter") return;
		e.preventDefault();
		const target = e.target as HTMLInputElement;
		const newTag = { id: Date.now().toString(), text: target.value };
		setTags((prev) => [...prev, newTag]);
		target.value = "";
	  }
	
	  function removeItem(id: string) {
		setTags((prev) => prev.filter((tag) => tag.id !== id));
	  }

	return (
		<main>
			<div style={{width: '400px'}}>
				<TagInput
					tags={tags}
					placeholder={'Tags'}
					addTag={addItem}
					removeTag={removeItem}
				/>
			</div>
		</main>
	);
}

```

## Next.js

#### To use this component in a Next.js project, make sure to include "use client" at the top of the file containing the React component.

## Options

Option | Type | Default | Description
--- | --- | --- | ---
| [`tags`](#tags) | `Array` | `[]` |  **Required**. An array of objects, each containing `id` and `text` values. |
| [`addTag`](#addTag) | `Function` | `undefined` | **Required**. Function to add a new tag.|
| [`removeTag`](#removeTag) | `Function` | `undefined` | **Required**. Function to remove a tag. |
| [`placeholder`](#placeholder) | `String` | `undefined` | Placeholder text to display when the input is empty. |
| [`maxTags`](#maxTags) | `Number` | `undefined` | The maximum number of tags allowed. |