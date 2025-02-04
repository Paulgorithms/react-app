import { useState } from "react";

interface ExpandableTextProps {
  children: string;
  maxChars?: number;
}
const ExpandableText: React.FC<ExpandableTextProps> = ({
  children,
  maxChars = 100,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (children.length <= maxChars) return <p>{children}</p>;

  const text = isExpanded ? children : children.substring(0, maxChars);

  return (
    <p>
      {text}...
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </p>
  );
};

export default ExpandableText;
