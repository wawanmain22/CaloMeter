import Swal from 'sweetalert2';

// Custom SweetAlert2 configuration with consistent styling
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

// Success notification
export const showSuccess = (message: string, title: string = 'Berhasil!') => {
  return Toast.fire({
    icon: 'success',
    title: title,
    text: message,
    background: '#f0fdf4',
    color: '#15803d',
    iconColor: '#22c55e'
  });
};

// Error notification
export const showError = (message: string, title: string = 'Oops...') => {
  return Toast.fire({
    icon: 'error',
    title: title,
    text: message,
    background: '#fef2f2',
    color: '#dc2626',
    iconColor: '#ef4444'
  });
};

// Warning notification
export const showWarning = (message: string, title: string = 'Peringatan!') => {
  return Toast.fire({
    icon: 'warning',
    title: title,
    text: message,
    background: '#fffbeb',
    color: '#d97706',
    iconColor: '#f59e0b'
  });
};

// Info notification
export const showInfo = (message: string, title: string = 'Info') => {
  return Toast.fire({
    icon: 'info',
    title: title,
    text: message,
    background: '#eff6ff',
    color: '#2563eb',
    iconColor: '#3b82f6'
  });
};

// Confirmation dialog
export const showConfirm = (
  message: string,
  title: string = 'Konfirmasi',
  confirmButtonText: string = 'Ya, Lanjutkan!',
  cancelButtonText: string = 'Batal'
) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    background: '#ffffff',
    customClass: {
      popup: 'rounded-lg',
      confirmButton: 'rounded-md px-4 py-2 font-medium',
      cancelButton: 'rounded-md px-4 py-2 font-medium'
    }
  });
};

// BMI Result notification with custom styling
export const showBMIResult = (bmi: number, category: string, recommendation: string) => {
  let iconColor = '#3b82f6';
  let backgroundColor = '#eff6ff';
  
  switch (category.toLowerCase()) {
    case 'underweight':
      iconColor = '#3b82f6';
      backgroundColor = '#eff6ff';
      break;
    case 'normal weight':
      iconColor = '#22c55e';
      backgroundColor = '#f0fdf4';
      break;
    case 'overweight':
      iconColor = '#f59e0b';
      backgroundColor = '#fffbeb';
      break;
    case 'obese':
      iconColor = '#ef4444';
      backgroundColor = '#fef2f2';
      break;
  }

  return Swal.fire({
    title: `BMI Anda: ${bmi}`,
    text: recommendation,
    icon: 'info',
    iconColor: iconColor,
    background: backgroundColor,
    confirmButtonColor: iconColor,
    confirmButtonText: 'Tutup',
    customClass: {
      popup: 'rounded-lg',
      title: 'text-xl font-bold',
      htmlContainer: 'text-sm text-gray-600',
      confirmButton: 'rounded-md px-6 py-2 font-medium'
    },
    footer: `<div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style="background-color: ${iconColor}20; color: ${iconColor};">${category}</div>`
  });
};

// Loading notification
export const showLoading = (message: string = 'Memproses...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Close any open SweetAlert
export const closeSwal = () => {
  return Swal.close();
};

// Custom themed SweetAlert for different modes
export const getThemedSwal = (isDark: boolean = false) => {
  return Swal.mixin({
    background: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#f9fafb' : '#111827',
    customClass: {
      popup: 'rounded-lg shadow-xl',
      title: 'text-lg font-semibold',
      htmlContainer: 'text-sm',
      confirmButton: 'rounded-md px-4 py-2 font-medium bg-blue-600 hover:bg-blue-700 text-white',
      cancelButton: 'rounded-md px-4 py-2 font-medium bg-gray-600 hover:bg-gray-700 text-white'
    }
  });
};