import React, { InputHTMLAttributes } from "react";
import { validateGraphInputString } from "../../util/graph-string";
import Styles from "./input.module.scss";

interface ValidatedGraphInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}
export default function ValidatedGraphInput(props: ValidatedGraphInputProps) {
  const { onChange, value } = props;

  // Handle Change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let str = e.target.value;
    e.target.value = validateGraphInputString(str);
    onChange && onChange(e);
  }

  return (
    <div className={Styles.divInput}>
      <h3>
        Please enter your graph value
      </h3>
      <input
        {...props}
        type="text"
        value={value}
        className={Styles.graphInput}
        onChange={(e) => handleChange(e)}
      />
    </div>

  );
}
