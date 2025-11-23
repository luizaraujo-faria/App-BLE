import { useState, useEffect } from 'react';

type OptionItem = {
  label: string;
  value: string;
};

const useDropdown = (defaultItems: OptionItem[]) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [items, setItems] = useState<OptionItem[]>([]);

    useEffect(() => {
        setItems(defaultItems);
    }, []);

    return { open, setOpen, value, setValue, items, setItems };
};

export default useDropdown;