'use client'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';

const ProfileChange = () => {
    const [classname, setClassName] = useState('modal fade show')
    const [showModal, setShowModal] = useState(true);
    const handleClick = () => {
        setClassName('modal fade show')
    }
    return (<>
        <Modal size='xl' show={showModal} dialogClassName="modal-90w modal-centered" onHide={() => { setShowModal(false); }} >
            <Modal.Header closeButton>
                <Modal.Title>
                    프로필 변경
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ...
            </Modal.Body>
        </Modal>

    </>

    )
}
export default ProfileChange