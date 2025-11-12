import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ConfirmModal({ showConfirmModal, setShowConfirmModal, confirmHandler, name, schema, count }) {

    const handleClose = () => setShowConfirmModal(false);
    const handleShow = () => setShowConfirmModal(true);
    return (
        <>
            <Modal show={showConfirmModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h5>{name}</h5>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center'>  Confirm {schema} the uploaded campaign list to the {count} selected rules? </h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => { confirmHandler(); setShowConfirmModal(false) }}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ConfirmModal