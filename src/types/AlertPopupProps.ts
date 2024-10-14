interface AlertPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  autoCloseTime?: number;
}

export type { AlertPopupProps };
