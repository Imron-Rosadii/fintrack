import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [keyword, setKeyword] = useState(value);

  useEffect(() => {
    setKeyword(value);
  }, [value]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onChange(keyword);
      }}
      className="relative flex gap-2"
    >
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
        />

        <Input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={placeholder}
          className="rounded-xl pr-9 pl-10"
        />

        {keyword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setKeyword("")}
            className="absolute top-1/2 right-1.5 -translate-y-1/2 p-1.5"
          >
            <X size={15} />
          </Button>
        )}
      </div>

      <Button type="submit">Search</Button>
    </form>
  );
}

export default SearchInput;
