import React from 'react';
import { useIntl } from 'react-intl';
import { Box, Stack, TextInput } from '@strapi/design-system';
const CustomField = ({
                    description,
                    disabled,
                    error,
                    intlLabel,
                    name,
                    onChange,
                    placeholder,
                    required,
                    value
                  } : any) => {
  const show = true;
  const { formatMessage } = useIntl();
  return (
    <Stack spacing={1}>
      {show && <TextInput
        disabled={true}
        error={error}
        hint={description ? formatMessage(description) : ''}
        label={intlLabel ? formatMessage(intlLabel) : ''}
        name={name}
        onChange={(event : any) => {onChange({target: {name, value: event.target.value, type: 'string' }})}}
        placeholder={placeholder ? formatMessage(placeholder) : ''}
        required={required}
        value={value || ''}
      />}
    </Stack>
  );
};
export default CustomField;
