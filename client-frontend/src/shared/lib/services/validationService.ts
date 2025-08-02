export const validationService = {
  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validatePhone(phone: string): boolean {
    if (!phone) return true;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

    const phoneRegex = /^(\+?[1-9]\d{1,14}|8\d{10})$/;

    return (
      phoneRegex.test(cleanPhone) &&
      cleanPhone.length >= 10 &&
      cleanPhone.length <= 15
    );
  },
};
