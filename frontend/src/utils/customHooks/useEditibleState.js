import { useState } from 'react';

export function useEditableState(initialTitle) {
  const [workingTitle, setWorkingTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);

  function startEditing() {
    setWorkingTitle(initialTitle);
    setIsEditing(true);
  }

  function cancelEdit() {
    setWorkingTitle(initialTitle);
    setIsEditing(false);
  }

  function updateTitle(newTitle) {
    setWorkingTitle(newTitle);
  }

  function finishEdit() {
    setIsEditing(false);
    return workingTitle;
  }

  return {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit,
  };
}
