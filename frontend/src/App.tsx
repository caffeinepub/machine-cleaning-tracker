import { useState, useEffect, useRef } from 'react';
import { Dashboard } from './pages/Dashboard';
import { AddContactDetailsPage } from './pages/AddContactDetailsPage';
import { useInternetIdentity } from './hooks/useInternetIdentity';

const CONTACT_DETAILS_DONE_KEY = 'parttrack_contact_done';

function getContactDoneKey(principalId: string) {
    return `${CONTACT_DETAILS_DONE_KEY}_${principalId}`;
}

export default function App() {
    const { identity } = useInternetIdentity();
    const [showContactDetails, setShowContactDetails] = useState(false);
    const prevIdentityRef = useRef<typeof identity>(undefined);

    useEffect(() => {
        const prev = prevIdentityRef.current;
        const curr = identity;

        // Detect fresh login: identity just became available
        if (!prev && curr) {
            const principalId = curr.getPrincipal().toString();
            const alreadyDone = localStorage.getItem(getContactDoneKey(principalId));
            if (!alreadyDone) {
                setShowContactDetails(true);
            }
        }

        // Detect logout: reset state
        if (prev && !curr) {
            setShowContactDetails(false);
        }

        prevIdentityRef.current = curr;
    }, [identity]);

    const handleContactComplete = () => {
        if (identity) {
            const principalId = identity.getPrincipal().toString();
            localStorage.setItem(getContactDoneKey(principalId), '1');
        }
        setShowContactDetails(false);
    };

    if (showContactDetails && identity) {
        return (
            <AddContactDetailsPage
                onComplete={handleContactComplete}
            />
        );
    }

    return <Dashboard />;
}
