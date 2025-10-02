"use client";

import React from "react";

export const useModalPhone = () => {
    const [isOpenTelModal, setIsOpenTelModal] = React.useState(false);
    const openModalPhone  = () => setIsOpenTelModal(true);
    const closeModalPhone = () => setIsOpenTelModal(false);

    return { isOpenTelModal, openModalPhone, closeModalPhone };
};
