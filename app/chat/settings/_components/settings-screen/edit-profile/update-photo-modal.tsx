import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

interface UpdatePhotoModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  avatarUploaded: boolean;
  onCancel: () => void;
  onRemove: () => void;
  onUpdate: () => void;
}

const UpdatePhotoModal: React.FC<UpdatePhotoModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  onCancel,
  onRemove,
  onUpdate,
  avatarUploaded,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-gray-200 w-80 p-0 gap-0">
        <AlertDialogHeader className="p-4">
          <AlertDialogTitle className="text-center text-lg">
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />

        <div className="flex flex-col text-sm border-t border-t-gray-100">
          <button
            className="p-3 border-b border-b-gray-100 text-dark-green font-semibold"
            onClick={onUpdate}
          >
            Upload photo
          </button>
          {avatarUploaded && (
            <button
              className="p-3 border-b border-b-gray-100 text-error font-semibold"
              onClick={onRemove}
            >
              Remove current photo
            </button>
          )}
          <button className="p-3" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdatePhotoModal;
