export default function Input({
  label,
  type = "text",
  placeholder,
  name,
  required = false,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div className="gap-1">
      <label htmlFor="password">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className="bg-primary p-[10px] w-full ring-0 rounded-[8px] outline-0 outline-transparent focus:outline-green focus:outline-1 transition-all duration-300"
        required={required}
      />
    </div>
  );
}
