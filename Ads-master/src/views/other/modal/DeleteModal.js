import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteModal({ showDeleteModal, setShowDeleteModal, deleteHandler, name }) {

    const handleClose = () => setShowDeleteModal(false);
    const handleShow = () => setShowDeleteModal(true);

    return (
        <>
            <Modal show={showDeleteModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h5>{name}</h5>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center'>  Are you sure want to delete this record? </h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => { deleteHandler(); setShowDeleteModal(false) }}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DeleteModal