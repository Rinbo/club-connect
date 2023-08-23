import React, { useRef } from 'react';

type Props = {
  disabled?: boolean;
  message: string;
  onSubmit: () => void;
  title: string;
  children: React.ReactElement;
};

export default function ConfirmationModal({ disabled, message, onSubmit, title, children }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleSubmit = () => {
    onSubmit();
    modalRef.current?.close();
  };

  return (
    <div className={'cancel-animations'}>
      {React.cloneElement(children, { onClick: () => !disabled && modalRef.current?.showModal() })}
      <dialog id="modal-delete-image" ref={modalRef} className="cancel-animations modal">
        <div className="modal-box">
          <h3 className="mb-2 text-lg font-bold">{title}</h3>
          <div className={'mb-4'}>{message}</div>
          <button type="button" className={'btn'} onClick={() => modalRef.current?.close()}>
            Cancel
          </button>
          <button type={'submit'} onClick={handleSubmit} className={'btn btn-warning float-right'}>
            Delete
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
