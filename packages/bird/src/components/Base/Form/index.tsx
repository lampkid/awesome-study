import React, { useState, useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router";

import _ from "lodash";

import FormItem from "@/components/Base/FormItem";
import Field from "@/components/Base/Field";

import {
  validateByRules,
  getFormRules,
  isRequired,
  isFormat
} from "@/utils/validator";

import { IFormProps } from "./Form_d";

import "./index.less";

type TRule = {} | string;

function keyBy(list, keys) {
  const [valueKey, textKey] = keys;
  return list.reduce(
    (prevMap, item) => ({
      ...prevMap,
      [item[valueKey]]: item[textKey]
    }),
    {}
  );
}

export default function Form(props: IFormProps) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [changeVars, setChangeVars] = useState({});

  const formMeta = useRef({});

  const { fields: fieldList, onChange, form, options, children } = props;
  formMeta.current.formRules = getFormRules(fieldList);

  const ref = useRef({});

  ref.current = {
    getFieldsValue: () => {
      return formData;
    },
    resetFields: () => {
      setFormData({});
    },
    validateFields: () => {
      return validateByRules(formMeta.current.formRules, formData)
        .then(() => {
          return Promise.resolve(formData);
        })
        .catch(errs => {
          setErrors({ ...errs });
        });
    }
  };

  if (typeof form === "function") {
    form(ref.current);
  }

  useEffect(() => {
    // 这里的逻辑也可以直接在onChange和blur去做
    const changedVarNames = Object.keys(changeVars).filter(
      key => changeVars[key]
    );

    if (changedVarNames.length <= 0) {
      return;
    }
    const toBeValidated = [
      _.pick(formMeta.current.formRules, changedVarNames),
      _.pick(formData, changedVarNames)
    ];
    validateByRules(...toBeValidated)
      .then(() => {
        const resetErrors = changedVarNames.reduce(
          (prevResetErrors, varName) => ({
            ...prevResetErrors,
            [varName]: undefined
          }),
          {}
        );
        setErrors({ ...errors, ...resetErrors });
      })
      .catch(errs => {
        console.log("errs:", errs);
        setErrors({ ...errors, ...errs });
      });
  }, [formData, changeVars]);

  // todo: _.debounce
  const fieldChangeHandler = (value: React.SyntheticEvent, field) => {
    const { key } = field;
    let val;
    const event = value;
    val = event.currentTarget ? event.currentTarget.value : value;
    setFormData({ ...formData, [key]: isFormat(field, "number") ? +val : val });
    setChangeVars({ [key]: true });
  };

  const fieldBlurHandler = (event: React.SyntheticEvent, field) => {
    const { key } = field;
    setChangeVars({ [key]: false });
  };

  return (
    <div className="X-form">
      {fieldList.map((item, index) => {
        const {
          key,
          type,
          label,
          rules,
          provider,
          providerKeyBy,
          ...otherFieldProps
        } = item;
        const fieldProps = {
          key,
          type,
          value: formData[key]
        };

        if (provider) {
          const fieldOptions = options[provider] || [];
          fieldProps.options = providerKeyBy
            ? keyBy(fieldOptions, providerKeyBy)
            : fieldOptions;
        }
        return (
          <FormItem
            key={index}
            label={label}
            required={isRequired(rules)}
            error={errors[key]}
          >
            <Field
              {...fieldProps}
              {...otherFieldProps}
              onChange={(event: React.SyntheticEvent) =>
                fieldChangeHandler(event, item)
              }
              onBlur={event => fieldBlurHandler(event, item)}
            />
          </FormItem>
        );
      })}
      {children}
    </div>
  );
}
