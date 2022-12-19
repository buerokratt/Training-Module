import { useEffect, useState } from 'react';

const useSelectionState = () => {
  const [selection, setSelection] = useState<string | null>();

  useEffect(() => {
    const handleSelection = () => {
      const selection = document.getSelection();
      console.log(selection);
      if (selection?.toString().length) {
        setSelection(selection.toString());
      } else {
        setSelection(null);
      }
    };

    document.addEventListener('mouseup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  return selection;
};

export default useSelectionState;
