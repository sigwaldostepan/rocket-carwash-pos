'use client';

import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group';
import { Button } from './button';
import { EyeClosed, Eye } from 'lucide-react';

export const PasswordInput = ({ className, type, ...props }: React.ComponentProps<'input'>) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <InputGroup>
      <InputGroupInput {...props} type={showPassword ? 'text' : 'password'} />
      <InputGroupAddon align='inline-end'>
        <Button variant='ghost' size='icon-sm' type='button' onClick={toggleShowPassword}>
          {showPassword ? <EyeClosed /> : <Eye />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};
