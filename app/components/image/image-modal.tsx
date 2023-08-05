import React from 'react';

export default function ImageModal({ url }: { url: string }) {
  const modalRef = React.useRef<HTMLDialogElement>(null);
  return (
    <React.Fragment>
      <div onClick={() => modalRef.current?.showModal()} className="avatar cursor-pointer">
        <div className="w-24 rounded">
          <img src={url} alt="modal-popup" />
        </div>
      </div>

      <dialog ref={modalRef} className="modal justify-center">
        <form method="dialog" className="w-full">
          <button className="btn btn-circle btn-neutral absolute right-2 top-2">x</button>
          <img src={url} alt="modal-popup" />
        </form>
      </dialog>
    </React.Fragment>
  );
}
