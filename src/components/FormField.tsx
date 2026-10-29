interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "password";
  autoComplete?: string;
  defaultValue?: string;
}

export function FormField({
  id,
  name,
  label,
  type,
  autoComplete,
  defaultValue,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-blue-900">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-950 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      />
    </div>
  );
}
