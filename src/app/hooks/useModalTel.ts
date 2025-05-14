"use client";

import React from "react";

export const useModalTel = () => {
    const [isOpenTelModal, setIsOpenTelModal] = React.useState(false);
    const openModalTel = () => setIsOpenTelModal(true);
    const closeModalTel = () => setIsOpenTelModal(false);

    return { isOpenTelModal, openModalTel, closeModalTel };
};
