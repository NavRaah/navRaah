export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; message?: string } => {
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  return { isValid: true };
};

export const validateForm = (formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required fields
  if (!formData.name.trim()) {
    errors.push('Name is required');
  } else {
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.message!);
    }
  }

  if (!formData.phone.trim()) {
    errors.push('Phone number is required');
  } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.push('Please enter a valid phone number');
  }

  if (!formData.email.trim()) {
    errors.push('Email is required');
  } else if (!validateEmail(formData.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!formData.password) {
    errors.push('Password is required');
  } else {
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.message!);
    }
  }

  if (!formData.confirmPassword) {
    errors.push('Please confirm your password');
  } else if (formData.password !== formData.confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
