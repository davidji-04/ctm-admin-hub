import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List } from "lucide-react";
import { useRef } from "react";

interface RichTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength: number;
  minLength?: number;
  required?: boolean;
  disabled?: boolean;
}

export const RichTextArea = ({
  value,
  onChange,
  placeholder,
  maxLength,
  minLength,
  required,
  disabled,
}: RichTextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  const handleBold = () => insertFormatting("**", "**");
  const handleItalic = () => insertFormatting("_", "_");
  const handleList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = value.substring(0, start);
    const after = value.substring(start);
    
    // Add bullet point at cursor
    const newText = `${before}\n• ${after}`;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 3, start + 3);
    }, 0);
  };

  const charCount = value?.length || 0;
  const isNearLimit = charCount > maxLength * 0.9;
  const isOverLimit = charCount > maxLength;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-t-md border border-b-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleList}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <div className="ml-auto text-sm">
          <span
            className={`font-medium ${
              isOverLimit
                ? "text-destructive"
                : isNearLimit
                ? "text-orange-500"
                : "text-muted-foreground"
            }`}
          >
            {charCount}
          </span>
          <span className="text-muted-foreground"> / {maxLength}</span>
        </div>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[150px] rounded-t-none resize-y"
        disabled={disabled}
        maxLength={maxLength}
      />
      {minLength && charCount < minLength && charCount > 0 && (
        <p className="text-sm text-muted-foreground">
          Minimum {minLength} characters required ({minLength - charCount} more needed)
        </p>
      )}
    </div>
  );
};
