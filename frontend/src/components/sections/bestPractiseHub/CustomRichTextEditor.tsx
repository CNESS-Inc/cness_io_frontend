import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  List,
  ListOrdered,
} from "lucide-react";
import React, { useRef, useEffect, useState, useCallback } from "react";

interface CustomRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: boolean;
}

const CustomRichTextEditor: React.FC<CustomRichTextEditorProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = "Add your description here...",
  error = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  // Update active formats for this specific editor
  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;

    const commands = [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "insertUnorderedList",
      "insertOrderedList",
      "justifyLeft",
      "justifyCenter",
      "justifyRight",
    ];

    const active: string[] = commands.filter((cmd) =>
      document.queryCommandState(cmd)
    );
    setActiveFormats(active);
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFocus = () => {
    // Add selection change listener when this editor is focused
    document.addEventListener("selectionchange", updateActiveFormats);
  };

  const handleBlur = () => {
    // Remove selection change listener when this editor loses focus
    document.removeEventListener("selectionchange", updateActiveFormats);
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const inUnorderedList = document.queryCommandState("insertUnorderedList");
      const inOrderedList = document.queryCommandState("insertOrderedList");
      const inList = inUnorderedList || inOrderedList;

      // SHIFT + ENTER  → line break only
      if (e.shiftKey) {
        e.preventDefault();
        document.execCommand("insertLineBreak");
        return;
      }

      // ENTER → your full custom logic
      e.preventDefault();

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const li =
        range.startContainer instanceof Element
          ? (range.startContainer as HTMLElement).closest("li")
          : range.startContainer.parentElement?.closest("li");

      if (inList && li) {
        const liText = li.textContent?.trim() ?? "";

        if (liText === "") {
          // Remove empty bullet and exit list
          const parentList = li.closest("ul, ol");
          if (parentList) {
            const paragraph = document.createElement("div");
            paragraph.innerHTML = "<br>";

            parentList.removeChild(li);
            parentList.parentNode?.insertBefore(
              paragraph,
              parentList.nextSibling
            );

            if (!parentList.querySelector("li")) parentList.remove();

            const newRange = document.createRange();
            newRange.setStart(paragraph, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        } else {
          // Add new bullet
          const newLi = document.createElement("li");
          newLi.innerHTML = "<br>";

          if (li.nextSibling)
            li.parentNode!.insertBefore(newLi, li.nextSibling);
          else li.parentNode!.appendChild(newLi);

          const newRange = document.createRange();
          newRange.setStart(newLi, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }

        handleInput();
        return;
      }

      // Outside list → insert paragraph
      document.execCommand("insertParagraph");
    }

    // Tab → indent in lists
    if (e.key === "Tab" && !e.shiftKey) {
      const inUnorderedList = document.queryCommandState("insertUnorderedList");
      const inOrderedList = document.queryCommandState("insertOrderedList");
      if (inUnorderedList || inOrderedList) {
        e.preventDefault();
        document.execCommand("indent");
      }
    }

    // Shift+Tab → outdent
    if (e.key === "Tab" && e.shiftKey) {
      const inUnorderedList = document.queryCommandState("insertUnorderedList");
      const inOrderedList = document.queryCommandState("insertOrderedList");
      if (inUnorderedList || inOrderedList) {
        e.preventDefault();
        document.execCommand("outdent");
      }
    }
  };

  const formatText = (
    command: string,
    value: string | undefined = undefined
  ) => {
    if (editorRef.current) {
      // Save current selection
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // Focus editor and restore selection
      editorRef.current.focus();
      selection.removeAllRanges();
      selection.addRange(range);

      // Execute command
      document.execCommand(command, false, value);
      handleInput();

      // Update active formats for this editor
      updateActiveFormats();
    }
  };

  const isActive = (cmd: string) => activeFormats.includes(cmd);

  return (
    <div
      className={`border rounded-lg ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        {/* Bold */}
        <button
          type="button"
          onClick={() => formatText("bold")}
          className={`px-2 py-1 text-sm font-semibold rounded ${
            isActive("bold") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => formatText("italic")}
          className={`px-2 py-1 text-sm italic rounded ${
            isActive("italic") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          I
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => formatText("underline")}
          className={`px-2 py-1 text-sm underline rounded ${
            isActive("underline") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          U
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => formatText("strikeThrough")}
          className={`px-2 py-1 text-sm line-through rounded ${
            isActive("strikeThrough") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          S
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        {/* Unordered List */}
        <button
          type="button"
          onClick={() => formatText("insertUnorderedList")}
          className={`px-2 py-1 text-sm rounded ${
            isActive("insertUnorderedList")
              ? "bg-gray-300"
              : "hover:bg-gray-200"
          }`}
        >
          <List />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => formatText("insertOrderedList")}
          className={`px-2 py-1 text-sm rounded ${
            isActive("insertOrderedList") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          <ListOrdered />
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        {/* Font Size */}
        <select
          onChange={(e) => formatText("fontSize", e.target.value)}
          defaultValue="3"
          className="border border-gray-300 rounded px-1 text-sm bg-white"
        >
          <option value="1">10px</option>
          <option value="2">12px</option>
          <option value="3">14px</option>
          <option value="4">18px</option>
          <option value="5">24px</option>
        </select>

        <div className="border-l border-gray-300 mx-1"></div>

        {/* Align Left */}
        <button
          type="button"
          onClick={() => formatText("justifyLeft")}
          className={`px-2 py-1 text-sm rounded ${
            isActive("justifyLeft") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          <AlignLeft />
        </button>

        {/* Align Center */}
        <button
          type="button"
          onClick={() => formatText("justifyCenter")}
          className={`px-2 py-1 text-sm rounded ${
            isActive("justifyCenter") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          <AlignCenter />
        </button>

        {/* Align Right */}
        <button
          type="button"
          onClick={() => formatText("justifyRight")}
          className={`px-2 py-1 text-sm rounded ${
            isActive("justifyRight") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          <AlignRight />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        className="min-h-[150px] p-3 outline-none text-sm"
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      ></div>

      <style>
        {`
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF;
            pointer-events: none;
          }
          
          /* Enhanced list styling for better cross-browser compatibility */
          [contenteditable] ul, [contenteditable] ol {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
          }
          
          [contenteditable] ul {
            list-style-type: disc;
          }
          
          [contenteditable] ol {
            list-style-type: decimal;
          }
          
          [contenteditable] li {
            margin: 0.25rem 0;
            display: list-item;
          }
          
          /* Force list styling in WebKit browsers */
          [contenteditable] ul li::before {
            content: none !important;
          }
          
          [contenteditable] ol li::before {
            content: none !important;
          }
          
          /* Ensure proper list rendering */
          [contenteditable] div {
            margin: 0.25rem 0;
          }
        `}
      </style>
    </div>
  );
};

export default CustomRichTextEditor;