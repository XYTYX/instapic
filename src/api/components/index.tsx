import React from "react";

interface InputProps {
  type?: string;
  value: string;
  onChange(value: string): void;
}

export function Input(props: InputProps) {
  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    props.onChange(ev.target.value);
  }

  const type = props.type ? props.type : "text";

  return <input type={type} value={props.value} onChange={onChange}></input>;
}

interface FormProps {
  children: React.ReactNode;
  onSubmit(): void;
}

export function Form(props: FormProps) {
  function onSubmit() {
    props.onSubmit();
  }

  return <form onSubmit={onSubmit}>{props.children}</form>;
}
