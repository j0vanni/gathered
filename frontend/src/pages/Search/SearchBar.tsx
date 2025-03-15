import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
function SearchBar({
  className = "",
  value,
  onChange,
  onSubmit,
}: {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}) {
  return (
    <div
      className={`flex flex-col flex-1 justify-center items-center p-4 ${className}`}
    >
      <div className="flex flex-row w-full max-w-4xl px-4 sm:px-6 mx-auto gap-3">
        <Input
          className="w-full"
          placeholder="Search for movies or TV shows.."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit(value);
            }
          }}
        />
        {/* <ToggleGroup
            type="single"
            // onValueChange={"multi"}
            defaultChecked
            defaultValue="multi"
          >
            <ToggleGroupItem value="multi">All</ToggleGroupItem>
            <ToggleGroupItem value="tv">TV</ToggleGroupItem>
            <ToggleGroupItem value="movie">Mov</ToggleGroupItem>
          </ToggleGroup> */}
      </div>
      <Separator className="w-5/6 max-w-4xl mx-auto my-4" />
    </div>
  );
}

export default SearchBar;
