import { Search, X } from "lucide-react";

import Input from "../atoms/Input";
import Button from "../atoms/Button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchInput({
  value,
  onChange,
  placeholder = "Search transactions...",
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
      />

      <Input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-xl pr-10 pl-10"
      />

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-1.5 -translate-y-1/2 p-1.5"
        >
          <X size={15} />
        </Button>
      )}
    </div>
  );
}

export default SearchInput;
