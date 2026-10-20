"use client";

import {Field} from "@base-ui/react/field";
import {Select} from "@base-ui/react/select";
import {Check, ChevronDown} from "lucide-react";

import * as styles from "./select-field.css";
import * as textFieldStyles from "./text-field.css";

type SelectFieldOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type Props<TValue extends string> = {
  description?: string;
  error?: string;
  isDisabled?: boolean;
  label: string;
  onValueChange: (value: TValue) => unknown;
  options: SelectFieldOption<TValue>[];
  value: TValue;
};

type SelectFieldPopupProps<TValue extends string> = Pick<
  Props<TValue>,
  "options"
>;

const SelectFieldPopup = <TValue extends string>({
  options
}: SelectFieldPopupProps<TValue>) => (
  <Select.Portal>
    <Select.Positioner alignItemWithTrigger={false} sideOffset={4}>
      <Select.Popup className={styles.popup}>
        {options.map(option => (
          <Select.Item
            className={styles.item}
            key={option.value}
            value={option.value}
          >
            <Select.ItemText>{option.label}</Select.ItemText>
            <Select.ItemIndicator className={styles.itemIndicator}>
              <Check size={16} />
            </Select.ItemIndicator>
          </Select.Item>
        ))}
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
);

const SelectField = <TValue extends string>({
  description,
  error,
  isDisabled = false,
  label,
  onValueChange,
  options,
  value
}: Props<TValue>) => (
  <Field.Root
    className={textFieldStyles.root}
    disabled={isDisabled}
    invalid={error !== undefined}
  >
    <Field.Label className={textFieldStyles.label}>{label}</Field.Label>
    <Select.Root
      items={options}
      onValueChange={selectedValue => {
        if (selectedValue !== null) {
          onValueChange(selectedValue);
        }
      }}
      value={value}
    >
      <Select.Trigger className={styles.trigger}>
        <Select.Value />
        <ChevronDown size={16} />
      </Select.Trigger>
      <SelectFieldPopup options={options} />
    </Select.Root>
    {description !== undefined && (
      <Field.Description className={textFieldStyles.description}>
        {description}
      </Field.Description>
    )}
    <Field.Error className={textFieldStyles.error} match={error !== undefined}>
      {error}
    </Field.Error>
  </Field.Root>
);

export {SelectField};
export type {SelectFieldOption};
