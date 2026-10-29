import type { ComponentPropsWithRef } from "react";

interface InputProps extends ComponentPropsWithRef<'input'> {
    label: string;
    error?: string;
}

export default function Input(props: InputProps) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {props.label}
      </label>
      <input
        {...props}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:outline-none"
      />
      {props.error && <p className="mt-1 text-sm text-brand-500">{props.error}</p>}
    </div>
  );
}
