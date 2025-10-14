import React, { useState } from 'react';
import { BusinessProfile } from '../../../components/BusinessProfile/BusinessProfile';

const BusinessProfilePage = ({
    setIsOpen,
    isLoggedIn,
}: {
    setIsOpen: (isOpen: boolean) => void;
    isLoggedIn: boolean;
}) => {
    return (
        <BusinessProfile activeSection={'profile'} setIsOpen={setIsOpen} isLoggedIn={isLoggedIn} />

    );
};

export default BusinessProfilePage;