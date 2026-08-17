import { Dialog, DialogContent } from '@mui/material';

function Modal({ open, onClose, children }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
export default Modal;