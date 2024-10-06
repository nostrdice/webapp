interface FormattedDateDisplayProps {
  timestamp: number;
}

export const FormattedDateDisplay = ({ timestamp }: FormattedDateDisplayProps) => {
  const date = new Date(timestamp * 1000);
  const formatted = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <small className="align-middle text-sm text-gray-500 dark:text-gray-400">
      ({formatted})
    </small>
  );
};
